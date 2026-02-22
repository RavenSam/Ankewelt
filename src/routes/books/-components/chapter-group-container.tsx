import { useDroppable } from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChevronDown, ChevronRight, GripVertical, MoreHorizontal } from "lucide-react"
import type { Chapter, Group } from "types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChapterItem } from "./chapter-item"

interface GroupContainerProps {
	group: Group
	chapters: Chapter[]
	wordCount: number
	onToggleCollapse: (id: string) => void
	isDraggingChapter: boolean
}

export function GroupContainer({
	group,
	chapters,
	wordCount,
	onToggleCollapse,
	isDraggingChapter,
}: GroupContainerProps) {
	// useSortable handles group-level dragging (reordering groups)
	const {
		attributes,
		listeners,
		setNodeRef: setSortableRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: group.id,
		// Disable sorting behaviour when a chapter is being dragged —
		// we don't want the group to move when a chapter flies over it
		disabled: isDraggingChapter,
	})

	// Separate droppable on the body so chapters can be dropped into this group.
	// We use a distinct id `${group.id}__drop` to avoid id conflicts with useSortable.
	const { setNodeRef: setBodyDropRef, isOver: isBodyOver } = useDroppable({
		id: `${group.id}__drop`,
		disabled: !isDraggingChapter,
	})

	const style = {
		// Use Translate (not Transform) to avoid scale/skew glitches
		transform: CSS.Translate.toString(transform),
		transition,
	}

	const chapterIds = chapters.map((c) => c.id)

	return (
		<div
			ref={setSortableRef}
			style={style}
			className={cn("rounded-lg border border-border bg-card overflow-hidden", isDragging && "opacity-40 shadow-lg")}
		>
			{/* ── Group header ─────────────────────────────────────────────── */}
			<div
				className={cn(
					"flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border transition-colors select-none",
					isBodyOver && group.collapsed && "bg-primary/5 border-primary/30",
				)}
			>
				{/* Drag handle — only active when dragging groups */}
				<button
					{...attributes}
					{...listeners}
					className="cursor-grab active:cursor-grabbing p-0.5 rounded text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors touch-none shrink-0"
					aria-label="Drag group to reorder"
				>
					<GripVertical className="h-4 w-4" />
				</button>

				{/* Collapse toggle */}
				<button
					type="button"
					onClick={() => onToggleCollapse(group.id)}
					className="flex items-center gap-2 flex-1 min-w-0 text-left"
				>
					{group.collapsed ? (
						<ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
					) : (
						<ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
					)}
					<span className="text-sm font-semibold text-foreground truncate">{group.name}</span>
				</button>

				{/* Stats */}
				<div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
					<span>
						{chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"}
					</span>
					<span>·</span>
					<span>{wordCount.toLocaleString()} words</span>
				</div>

				<Button variant="ghost" size="icon" className="h-7 w-7 ml-1 shrink-0">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</div>

			{/* ── Collapsed drop hint ──────────────────────────────────────── */}
			{group.collapsed && isDraggingChapter && (
				<div
					ref={setBodyDropRef}
					className={cn(
						"flex items-center justify-center text-xs text-muted-foreground transition-all overflow-hidden",
						isBodyOver ? "h-10 bg-primary/8 text-primary border-t border-primary/20" : "h-0",
					)}
				>
					{isBodyOver && `Drop to add to "${group.name}"`}
				</div>
			)}

			{/* ── Chapter list ─────────────────────────────────────────────── */}
			{!group.collapsed && (
				<div ref={setBodyDropRef}>
					{/* Column headers */}
					<div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/20">
						<div className="w-5 shrink-0" />
						<div className="flex-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">Chapter</div>
						<div className="w-32 shrink-0 hidden sm:block text-xs font-medium text-muted-foreground uppercase tracking-wider">
							Word Count
						</div>
						<div className="w-24 shrink-0 hidden md:block text-xs font-medium text-muted-foreground uppercase tracking-wider">
							Status
						</div>
						<div className="w-40 shrink-0 hidden lg:block text-xs font-medium text-muted-foreground uppercase tracking-wider">
							Last Modified
						</div>
						<div className="w-16 shrink-0 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
							Actions
						</div>
					</div>

					<SortableContext items={chapterIds} strategy={verticalListSortingStrategy}>
						{chapters.length === 0 ? (
							<div
								className={cn(
									"px-4 py-8 text-center text-sm text-muted-foreground transition-colors",
									isBodyOver && "bg-primary/5",
								)}
							>
								Drop chapters here
							</div>
						) : (
							chapters.map((chapter) => <ChapterItem key={chapter.id} chapter={chapter} />)
						)}
					</SortableContext>
				</div>
			)}
		</div>
	)
}
