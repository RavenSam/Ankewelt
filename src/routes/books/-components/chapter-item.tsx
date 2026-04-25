import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { BookOpen, FolderMinus, FolderPlus, GripVertical, MoreHorizontal, Trash2 } from "lucide-react"
import type { Chapter } from "types"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// ─── Status badge helper ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string | null }) {
	const label = status ?? "draft"
	return (
		<span
			className={cn(
				"inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
				label === "published" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
				label === "draft" && "bg-muted text-muted-foreground",
				label === "review" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
			)}
		>
			{label}
		</span>
	)
}

// ─── Shared row content ───────────────────────────────────────────────────────

interface ChapterRowProps {
	chapter: Chapter
	dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>
	isDragging?: boolean
	isOverlay?: boolean
	onOpen?: () => void
	onUngroup?: () => void
	onDelete?: () => void
	onMoveGroup?: () => void
}

export function ChapterRow({
	chapter,
	dragHandleProps,
	isDragging,
	isOverlay,
	onOpen,
	onUngroup,
	onDelete,
	onMoveGroup,
}: ChapterRowProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0",
				"hover:bg-muted/30 transition-colors",
				isDragging && "opacity-50",
				isOverlay && "bg-card shadow-accent backdrop-blur-sm ring-2 ring-primary/40 rounded-lg",
			)}
		>
			<button
				type="button"
				className={cn(
					"cursor-grab active:cursor-grabbing p-0.5 rounded text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors touch-none shrink-0",
					isOverlay && "cursor-grabbing",
				)}
				aria-label="Drag chapter to reorder"
				{...dragHandleProps}
			>
				<GripVertical className="h-4 w-4" />
			</button>

			{onOpen && !isOverlay ? (
				<button
					type="button"
					onClick={onOpen}
					className="flex-1 min-w-0 flex items-center gap-2 text-left cursor-pointer"
				>
					<span className="text-xs text-muted-foreground shrink-0 tabular-nums w-6 text-right">
						{chapter.chapterNumber}
					</span>
					<span className="text-sm font-medium text-foreground truncate">{chapter.title}</span>
				</button>
			) : (
				<div className="flex-1 min-w-0 flex items-center gap-2">
					<span className="text-xs text-muted-foreground shrink-0 tabular-nums w-6 text-right">
						{chapter.chapterNumber}
					</span>
					<span className="text-sm font-medium text-foreground truncate">{chapter.title}</span>
				</div>
			)}

			<div className="w-32 shrink-0 hidden sm:block text-sm text-muted-foreground tabular-nums">
				{chapter.word_count.toLocaleString()}
			</div>

			<div className="w-24 shrink-0 hidden md:flex">
				<StatusBadge status={chapter.status} />
			</div>

			<div className="w-40 shrink-0 hidden lg:block text-sm text-muted-foreground">
				{chapter.updated_at
					? new Date(chapter.updated_at).toLocaleDateString("en-GB", {
							day: "numeric",
							month: "short",
							year: "numeric",
						})
					: "—"}
			</div>

			<div className="w-16 shrink-0 flex justify-end">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-7 w-7">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{onOpen && (
							<DropdownMenuItem onClick={onOpen}>
								<BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
								Open
							</DropdownMenuItem>
						)}
						{onMoveGroup && (
							<DropdownMenuItem onClick={onMoveGroup}>
								{chapter.group_id ? (
									<FolderPlus className="h-4 w-4 mr-2 text-muted-foreground" />
								) : (
									<FolderPlus className="h-4 w-4 mr-2 text-muted-foreground" />
								)}
								{chapter.group_id ? "Change Group" : "Add to Group"}
							</DropdownMenuItem>
						)}
						{onUngroup && (
							<DropdownMenuItem onClick={onUngroup}>
								<FolderMinus className="h-4 w-4 mr-2 text-muted-foreground" />
								Ungroup
							</DropdownMenuItem>
						)}
						{onDelete && (
							<DropdownMenuItem
								onClick={onDelete}
								className="text-destructive focus:text-destructive"
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Delete
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	)
}

// ─── Sortable chapter item (used in live lists) ───────────────────────────────

interface ChapterItemProps {
	chapter: Chapter
	onOpen?: () => void
	onUngroup?: () => void
	onDelete?: () => void
	onMoveGroup?: () => void
}

export function ChapterItem({ chapter, onOpen, onUngroup, onDelete, onMoveGroup }: ChapterItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: chapter.id,
		data: { type: "chapter" },
		animateLayoutChanges: () => false,
	})

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	}

	return (
		<div ref={setNodeRef} style={style}>
			<ChapterRow
				chapter={chapter}
				dragHandleProps={{ ...attributes, ...listeners }}
				isDragging={isDragging}
				onOpen={onOpen}
				onUngroup={onUngroup}
				onDelete={onDelete}
				onMoveGroup={onMoveGroup}
			/>
		</div>
	)
}
