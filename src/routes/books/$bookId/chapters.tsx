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
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router"
import { eq } from "drizzle-orm"
import { useCallback, useState } from "react"
import { createChapter, deleteGroup, renameGroup } from "@/actions/chapters-actions"
import { Button } from "@/components/ui/button"
import db from "@/db/database"
import { book } from "@/db/schema"
import { transformBookToDnd } from "@/helpers/get-chapters-and-groups"
import { useDragAndDrop } from "@/hooks/use-drag-and-drop"
import { GroupContainer, GroupContainerOverlay } from "../-components/chapter-group-container"
import { ChapterRow } from "../-components/chapter-item"
import { UngroupedSection } from "../-components/chapter-ungrouped-section"
import { DeleteChapterDialog } from "../-components/delete-chapter-dialog"
import { MoveChapterToGroupDialog } from "../-components/move-chapter-to-group-dialog"
import { SectionHeader } from "../-components/section-header"

export const Route = createFileRoute("/books/$bookId/chapters")({
	loader: async ({ params }) => {
		const bookData = await db.query.book.findFirst({
			where: eq(book.id, params.bookId),
			with: { chapters: true, chapterGroups: true },
		})
		if (!bookData) throw new Error("Book not found")
		return { bookData: transformBookToDnd(bookData), bookId: bookData.id }
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

function getNextChapterNumber(chapters: { chapterNumber: number }[]) {
	if (chapters.length === 0) return 1
	return Math.max(...chapters.map((c) => c.chapterNumber)) + 1
}

export function ChaptersPage() {
	const { bookData, bookId } = Route.useLoaderData()
	const [search, setSearch] = useState("")
	const [deleteChapterId, setDeleteChapterId] = useState<string | null>(null)
	const [moveGroupChapterId, setMoveGroupChapterId] = useState<string | null>(null)
	const [moveGroupCurrentGroupId, setMoveGroupCurrentGroupId] = useState<string | null>(null)
	const router = useRouter()

	const {
		state,
		activeItem,
		sensors,
		onDragStart,
		onDragOver,
		onDragEnd,
		toggleGroupCollapsed,
		ungroupChapter,
		isEmpty,
	} = useDragAndDrop(bookData, bookId)

	const groupIds = state.groups.map((g) => g.id)

	const isDraggingChapter = activeItem?.type === "chapter"
	const showUngrouped = state.ungrouped.length > 0 || isDraggingChapter

	const collisionDetection: CollisionDetection = useCallback((args) => {
		const pointerHits = pointerWithin(args)
		if (pointerHits.length > 0) return pointerHits
		return closestCenter(args)
	}, [])

	const navigate = useNavigate()

	const handleCreateChapter = async () => {
		const nextNumber = getNextChapterNumber([...state.ungrouped, ...state.groups.flatMap((g) => g.chapters)])

		const chapterId = await createChapter({
			bookId,
			title: "Untitled",
			content: "",
			chapterNumber: nextNumber,
		})

		router.invalidate()

		navigate({
			to: "/chapters/$chapterId",
			params: { chapterId },
		})
	}

	const handleOpenChapter = (chapterId: string) => {
		navigate({ to: "/chapters/$chapterId", params: { chapterId } })
	}

	const handleDeleteChapter = (chapterId: string) => {
		setDeleteChapterId(chapterId)
	}

	const handleMoveGroupChapter = (chapterId: string) => {
		// Find the chapter's current group_id
		const chapter =
			state.ungrouped.find((c) => c.id === chapterId) ??
			state.groups.flatMap((g) => g.chapters).find((c) => c.id === chapterId)
		setMoveGroupCurrentGroupId(chapter?.group_id ?? null)
		setMoveGroupChapterId(chapterId)
	}

	const handleRenameGroup = async (groupId: string) => {
		const group = state.groups.find((g) => g.id === groupId)
		if (!group) return

		const newName = window.prompt("Rename group", group.name)
		if (!newName || newName === group.name) return

		try {
			await renameGroup(groupId, newName)
			router.invalidate()
		} catch (e) {
			console.error("Failed to rename group:", e)
		}
	}

	const handleDeleteGroup = async (groupId: string) => {
		const group = state.groups.find((g) => g.id === groupId)
		if (!group) return

		const confirmed = window.confirm(`Delete group "${group.name}" and move its chapters to ungrouped?`)
		if (!confirmed) return

		try {
			await deleteGroup(groupId)
			router.invalidate()
		} catch (e) {
			console.error("Failed to delete group:", e)
		}
	}

	if (isEmpty) {
		return (
			<div className="flex flex-col items-center justify-center py-24 text-center">
				<div className="text-lg font-medium mb-2">No chapters yet</div>
				<div className="text-sm text-muted-foreground mb-6">Start writing by creating your first chapter.</div>

				<Button size="lg" onClick={handleCreateChapter} className="font-bold text-base">
					Create your first chapter
				</Button>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<div>
				<SectionHeader
					title="All Chapters"
					searchValue={search}
					onSearchChange={setSearch}
					searchPlaceholder="Search chapters..."
					actionLabel="New Chapter"
					onActionClick={handleCreateChapter}
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
								<GroupContainer
									key={group.id}
									group={group}
									onToggleCollapse={toggleGroupCollapsed}
									onOpenChapter={handleOpenChapter}
									onUngroupChapter={ungroupChapter}
									onDeleteChapter={handleDeleteChapter}
									onMoveGroupChapter={handleMoveGroupChapter}
									onRenameGroup={handleRenameGroup}
									onDeleteGroup={handleDeleteGroup}
								/>
							))}

							{!!(state.groups.length > 0) && <hr className="mt-10 mb-5" />}

							{showUngrouped && (
								<UngroupedSection
									chapters={state.ungrouped}
									isEmpty={state.ungrouped.length === 0}
									onOpenChapter={handleOpenChapter}
									onDeleteChapter={handleDeleteChapter}
									onMoveGroupChapter={handleMoveGroupChapter}
								/>
							)}
						</div>
					</SortableContext>

					<DragOverlay dropAnimation={dropAnimation}>
						{activeItem?.type === "chapter" && <ChapterRow chapter={activeItem.chapter} isOverlay />}
						{activeItem?.type === "group" && <GroupContainerOverlay group={activeItem.group} />}
					</DragOverlay>
				</DndContext>
			</div>

			<DeleteChapterDialog
				open={deleteChapterId !== null}
				chapterId={deleteChapterId}
				onClose={() => setDeleteChapterId(null)}
				onDeleted={() => {
					setDeleteChapterId(null)
					router.invalidate()
				}}
			/>

			<MoveChapterToGroupDialog
				open={moveGroupChapterId !== null}
				bookId={bookId}
				chapterId={moveGroupChapterId}
				currentGroupId={moveGroupCurrentGroupId}
				onClose={() => {
					setMoveGroupChapterId(null)
					setMoveGroupCurrentGroupId(null)
				}}
				onMoved={() => {
					setMoveGroupChapterId(null)
					setMoveGroupCurrentGroupId(null)
					router.invalidate()
				}}
			/>
		</div>
	)
}
