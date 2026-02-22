import {
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	pointerWithin,
	rectIntersection,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { createFileRoute } from "@tanstack/react-router"
import { Unlink } from "lucide-react"
import { useCallback, useState } from "react"
import { useChaptersDnd } from "@/hooks/use-drag-and-drop"
import { cn } from "@/lib/utils"
import { GroupContainer } from "../-components/chapter-group-container"
import { ChapterItem } from "../-components/chapter-item"
import { UngroupedSection } from "../-components/chapter-ungrouped-section"
import { SectionHeader } from "../-components/section-header"

export const Route = createFileRoute("/books/$bookId/chapters")({
	component: ChaptersPage,
})

/**
 * Custom collision detection:
 * 1. If pointer is within the "ungrouped" free-zone, that wins unconditionally.
 *    This prevents group droppables from swallowing the drop when the user
 *    deliberately aims at the free zone at the bottom.
 * 2. Otherwise prefer pointer-within (good for containers).
 * 3. Fall back to rect intersection.
 */
function customCollisionDetection(args: Parameters<typeof pointerWithin>[0]) {
	// Check ungrouped first — give it priority over everything
	const ungroupedCollision = args.droppableContainers.filter((c) => c.id === "ungrouped")
	if (ungroupedCollision.length > 0) {
		const pointerInUngrouped = pointerWithin({
			...args,
			droppableContainers: ungroupedCollision,
		})
		if (pointerInUngrouped.length > 0) return pointerInUngrouped
	}

	// Then normal pointer-within for everything else
	const pointerCollisions = pointerWithin(args)
	if (pointerCollisions.length > 0) return pointerCollisions

	return rectIntersection(args)
}

function FreeZoneDropTarget({ isActive }: { isActive: boolean }) {
	const { setNodeRef, isOver } = useDroppable({
		id: "ungrouped",
	})

	return (
		<div
			ref={setNodeRef}
			className={cn(
				"rounded-lg border-2 border-dashed transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium overflow-hidden",
				isActive
					? isOver
						? "border-primary bg-primary/8 text-primary h-16 opacity-100"
						: "border-border text-muted-foreground h-16 opacity-100"
					: "border-transparent h-0 opacity-0 pointer-events-none",
			)}
		>
			{isActive && (
				<>
					<Unlink className="h-4 w-4 shrink-0" />
					Drop here to ungroup
				</>
			)}
		</div>
	)
}

export function ChaptersPage() {
	const {
		state,
		activeId,
		activeChapter,
		activeChapterAtDragStart,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
		handleDragCancel,
		toggleGroupCollapsed,
		addChapter,
		getChaptersForGroup,
		getWordCountForGroup,
	} = useChaptersDnd()

	const [search, setSearch] = useState("")

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	const filterChapters = useCallback(
		(chapters: ReturnType<typeof getChaptersForGroup>) => {
			if (!search.trim()) return chapters
			const q = search.toLowerCase()
			return chapters.filter((c) => c.title.toLowerCase().includes(q) || c.subtitle?.toLowerCase().includes(q))
		},
		[search],
	)

	const ungroupedChapters = filterChapters(getChaptersForGroup(null))

	const isDraggingChapter = activeId !== null && !state.groups.some((g) => g.id === activeId)

	// Use the drag-start snapshot to decide if the free zone should show.
	// activeChapter.groupId changes live as the chapter moves between containers,
	// so checking it would make the zone disappear mid-drag.
	const activeIsGrouped =
		isDraggingChapter && activeChapterAtDragStart !== null && activeChapterAtDragStart.groupId !== null

	return (
		<div className="min-h-screen bg-background">
			<div className="">
				{/* ── Header ───────────────────────────────────────────────── */}
				<SectionHeader
					title="All Chapters"
					searchValue={search}
					onSearchChange={setSearch}
					searchPlaceholder="Search chapters..."
					actionLabel="New Chapter"
					onActionClick={addChapter}
				/>

				{/* ── DnD Context ──────────────────────────────────────────── */}
				<DndContext
					sensors={sensors}
					collisionDetection={customCollisionDetection}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
					onDragCancel={handleDragCancel}
				>
					<SortableContext items={state.rootOrder} strategy={verticalListSortingStrategy}>
						<div className="space-y-3">
							{state.rootOrder.map((itemId) => {
								const group = state.groups.find((g) => g.id === itemId)
								if (!group) return null

								const chapters = filterChapters(getChaptersForGroup(group.id))
								const wordCount = getWordCountForGroup(group.id)
								return (
									<GroupContainer
										key={group.id}
										group={group}
										chapters={chapters}
										wordCount={wordCount}
										onToggleCollapse={toggleGroupCollapsed}
										isDraggingChapter={isDraggingChapter}
									/>
								)
							})}

							{/* Existing ungrouped chapters */}
							{ungroupedChapters.length > 0 && <UngroupedSection chapters={ungroupedChapters} />}

							{/* Free-zone drop target — slides in when dragging a grouped chapter */}
							<FreeZoneDropTarget isActive={activeIsGrouped} />
						</div>
					</SortableContext>

					<DragOverlay
						dropAnimation={{
							duration: 200,
							easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
						}}
					>
						{activeChapter ? <ChapterItem chapter={activeChapter} isOverlay /> : null}
					</DragOverlay>
				</DndContext>

				{state.chapters.length === 0 && (
					<div className="text-center py-16 text-muted-foreground">
						<p className="text-sm">No chapters yet. Click "New Chapter" to get started.</p>
					</div>
				)}
			</div>
		</div>
	)
}
