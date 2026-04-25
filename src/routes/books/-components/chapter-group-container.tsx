import { useDroppable } from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChevronDown, ChevronRight, GripVertical, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { Chapter, Group } from "types"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ChapterItem } from "./chapter-item"

interface GroupContainerProps {
	group: Group & { chapters: Chapter[] }
	onToggleCollapse?: (id: string) => void
	onUngroupChapter?: (chapterId: string) => void
	onOpenChapter?: (chapterId: string) => void
	onDeleteChapter?: (chapterId: string) => void
	onMoveGroupChapter?: (chapterId: string) => void
	onRenameGroup?: (groupId: string) => void
	onDeleteGroup?: (groupId: string) => void
}

export function GroupContainer({
	group,
	onToggleCollapse,
	onUngroupChapter,
	onOpenChapter,
	onDeleteChapter,
	onMoveGroupChapter,
	onRenameGroup,
	onDeleteGroup,
}: GroupContainerProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: group.id,
		data: { type: "group" },
		animateLayoutChanges: () => false,
	})

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	}

	const chapterIds = group.chapters.map((c) => c.id)

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"rounded-lg border border-border bg-card overflow-hidden",
				isDragging && "opacity-50 shadow-lg ring-2 ring-primary/40",
			)}
		>
			<div
				className={cn(
					"flex items-center gap-2 px-4 py-3 bg-muted/40 transition-colors select-none",
					group.collapsed ? "" : "border-b border-border",
				)}
			>
				<button
					type="button"
					className="cursor-grab active:cursor-grabbing p-0.5 rounded text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors touch-none shrink-0"
					aria-label="Drag group to reorder"
					{...attributes}
					{...listeners}
				>
					<GripVertical className="h-4 w-4" />
				</button>

				<button
					type="button"
					onClick={() => onToggleCollapse?.(group.id)}
					className="flex items-center gap-2 flex-1 min-w-0 text-left"
				>
					{group.collapsed ? (
						<ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
					) : (
						<ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
					)}
					<span className="text-sm font-semibold text-foreground truncate">{group.name}</span>
				</button>

				<div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
					<span>
						{group.chapters.length} {group.chapters.length === 1 ? "Chapter" : "Chapters"}
					</span>
					<span>·</span>
					<span>{group.chapters.reduce((sum, c) => sum + c.word_count, 0)} words</span>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 ml-1 shrink-0"
							onClick={(e) => e.stopPropagation()}
						>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{onRenameGroup && (
							<DropdownMenuItem onClick={() => onRenameGroup(group.id)}>
								<Pencil className="h-4 w-4 mr-2 text-muted-foreground" />
								Rename
							</DropdownMenuItem>
						)}
						{onDeleteGroup && (
							<DropdownMenuItem
								onClick={() => onDeleteGroup(group.id)}
								className="text-destructive focus:text-destructive"
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Delete Group
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{!group.collapsed && (
				<ChapterDropZone
					groupId={group.id}
					chapterIds={chapterIds}
					chapters={group.chapters}
					onOpenChapter={onOpenChapter}
					onUngroupChapter={onUngroupChapter}
					onDeleteChapter={onDeleteChapter}
					onMoveGroupChapter={onMoveGroupChapter}
				/>
			)}
		</div>
	)
}

interface ChapterDropZoneProps {
	groupId: string
	chapterIds: string[]
	chapters: Chapter[]
	onOpenChapter?: (chapterId: string) => void
	onUngroupChapter?: (chapterId: string) => void
	onDeleteChapter?: (chapterId: string) => void
	onMoveGroupChapter?: (chapterId: string) => void
}

function ChapterDropZone({
	groupId,
	chapterIds,
	chapters,
	onOpenChapter,
	onUngroupChapter,
	onDeleteChapter,
	onMoveGroupChapter,
}: ChapterDropZoneProps) {
	const { setNodeRef, isOver } = useDroppable({ id: groupId })

	return (
		<div ref={setNodeRef}>
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
							isOver && "bg-primary/5",
						)}
					>
						Drop chapters here
					</div>
				) : (
					chapters.map((chapter) => (
						<ChapterItem
							key={chapter.id}
							chapter={chapter}
							onOpen={onOpenChapter ? () => onOpenChapter(chapter.id) : undefined}
							onUngroup={onUngroupChapter ? () => onUngroupChapter(chapter.id) : undefined}
							onDelete={onDeleteChapter ? () => onDeleteChapter(chapter.id) : undefined}
							onMoveGroup={
								onMoveGroupChapter ? () => onMoveGroupChapter(chapter.id) : undefined
							}
						/>
					))
				)}
			</SortableContext>
		</div>
	)
}

// ─── Overlay variant (rendered inside <DragOverlay>) ─────────────────────────
interface GroupContainerOverlayProps {
	group: Group & { chapters: Chapter[] }
}

export function GroupContainerOverlay({ group }: GroupContainerOverlayProps) {
	if (!group.collapsed) return <GroupContainer group={group} />

	return (
		<div className="rounded-lg border border-border bg-card overflow-hidden shadow-xl ring-2 ring-primary/40 cursor-grabbing">
			<div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border select-none">
				<GripVertical className="h-4 w-4 text-muted-foreground/60 shrink-0" />
				<ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
				<span className="text-sm font-semibold text-foreground truncate">{group.name}</span>
				<div className="flex items-center gap-3 ml-auto shrink-0 text-xs text-muted-foreground">
					<span>
						{group.chapters.length} {group.chapters.length === 1 ? "Chapter" : "Chapters"}
					</span>
					<span>·</span>
					<span>{group.chapters.reduce((sum, c) => sum + c.word_count, 0)} words</span>
				</div>
			</div>
		</div>
	)
}
