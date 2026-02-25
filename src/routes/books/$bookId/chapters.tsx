import type { CollisionDetection } from "@dnd-kit/core"
import {
	closestCenter,
	DndContext,
	DragOverlay,
	defaultDropAnimationSideEffects,
	MeasuringStrategy,
	pointerWithin,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { createFileRoute } from "@tanstack/react-router"
import { eq } from "drizzle-orm"
import { useCallback, useState } from "react"
import db from "@/db/database"
import { book } from "@/db/schema"
import { transformBookToDnd } from "@/helpers/get-chapters-and-groups"
import { useDragAndDrop } from "@/hooks/use-drag-and-drop"
import { GroupContainer, GroupContainerOverlay } from "../-components/chapter-group-container"
import { ChapterRow } from "../-components/chapter-item"
import { UngroupedSection } from "../-components/chapter-ungrouped-section"
import { SectionHeader } from "../-components/section-header"

export const Route = createFileRoute("/books/$bookId/chapters")({
	loader: async ({ params }) => {
		const bookData = await db.query.book.findFirst({
			where: eq(book.id, params.bookId),
			with: { chapters: true, chapterGroups: true },
		})
		if (!bookData) throw new Error("Book not found")
		return { bookData: transformBookToDnd(bookData) }
	},
	component: ChaptersPage,
})

const measuringConfig = {
	droppable: { strategy: MeasuringStrategy.Always },
}

const dropAnimation = {
	sideEffects: defaultDropAnimationSideEffects({
		styles: { active: { opacity: "0.4" } },
	}),
}

export function ChaptersPage() {
	const { bookData } = Route.useLoaderData()
	const [search, setSearch] = useState("")

	const { state, activeItem, sensors, onDragStart, onDragOver, onDragEnd, toggleGroupCollapsed } = useDragAndDrop(
		bookData,
		bookData.groups[0].book_id,
	)

	const groupIds = state.groups.map((g) => g.id)

	const isDraggingChapter = activeItem?.type === "chapter"
	const showUngrouped = state.ungrouped.length > 0 || isDraggingChapter

	const collisionDetection: CollisionDetection = useCallback((args) => {
		const pointerHits = pointerWithin(args)
		if (pointerHits.length > 0) return pointerHits
		return closestCenter(args)
	}, [])

	console.log({ bookData })

	return (
		<div className="min-h-screen bg-background">
			<div>
				<SectionHeader
					title="All Chapters"
					searchValue={search}
					onSearchChange={setSearch}
					searchPlaceholder="Search chapters..."
					actionLabel="New Chapter"
					onActionClick={() => {}}
				/>

				<DndContext
					sensors={sensors}
					collisionDetection={collisionDetection}
					measuring={measuringConfig}
					onDragStart={onDragStart}
					onDragOver={onDragOver}
					onDragEnd={onDragEnd}
				>
					<SortableContext items={groupIds} strategy={verticalListSortingStrategy}>
						<div className="space-y-3">
							{state.groups.map((group) => (
								<GroupContainer key={group.id} group={group} onToggleCollapse={toggleGroupCollapsed} />
							))}

							{showUngrouped && <UngroupedSection chapters={state.ungrouped} isEmpty={state.ungrouped.length === 0} />}
						</div>
					</SortableContext>

					<DragOverlay dropAnimation={dropAnimation}>
						{activeItem?.type === "chapter" && <ChapterRow chapter={activeItem.chapter} isOverlay />}
						{activeItem?.type === "group" && <GroupContainerOverlay group={activeItem.group} />}
					</DragOverlay>
				</DndContext>
			</div>
		</div>
	)
}
