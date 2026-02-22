import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, MoreHorizontal } from "lucide-react"
import type { Chapter, ChapterStatus } from "types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChapterItemProps {
	chapter: Chapter
	isOverlay?: boolean
}

const statusConfig: Record<ChapterStatus, { label: string; className: string }> = {
	Draft: {
		label: "Draft",
		className: "bg-muted text-muted-foreground border border-border",
	},
	Revised: {
		label: "Revised",
		className: "bg-green-500/10 text-green-600 border border-green-500/30 dark:text-green-400",
	},
	Final: {
		label: "Final",
		className: "bg-primary/10 text-primary border border-primary/30",
	},
	Outline: {
		label: "Outline",
		className: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/30 dark:text-yellow-400",
	},
}

interface StatusBadgeProps {
	status: ChapterStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
	const config = statusConfig[status]
	return (
		<span className={cn("inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium", config.className)}>
			{config.label}
		</span>
	)
}

export function ChapterItem({ chapter, isOverlay }: ChapterItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: chapter.id })

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	}

	// Ghost placeholder while item is being dragged
	if (isDragging && !isOverlay) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 bg-muted/20 rounded"
			>
				<div className="w-5 shrink-0" />
				<div className="flex-1 h-4 rounded bg-muted/60" />
				<div className="w-32 h-4 rounded bg-muted/40 hidden sm:block" />
				<div className="w-24 h-4 rounded bg-muted/40 hidden md:block" />
				<div className="w-40 h-4 rounded bg-muted/40 hidden lg:block" />
				<div className="w-16 shrink-0" />
			</div>
		)
	}

	if (isOverlay) {
		return (
			<div className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-lg shadow-xl cursor-grabbing ring-2 ring-primary/20">
				<GripVertical className="h-4 w-4 text-muted-foreground/60 shrink-0" />
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium text-foreground truncate">
						{chapter.number}. {chapter.title}
					</p>
					{chapter.subtitle && <p className="text-xs text-muted-foreground truncate mt-0.5">{chapter.subtitle}</p>}
				</div>
				<span className="text-sm text-muted-foreground shrink-0 hidden sm:block">
					{chapter.wordCount.toLocaleString()} words
				</span>
				<div className="hidden md:block">
					<StatusBadge status={chapter.status} />
				</div>
			</div>
		)
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="group flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 bg-card hover:bg-muted/30 transition-colors"
		>
			{/* Drag handle */}
			<button
				{...attributes}
				{...listeners}
				className={cn(
					"cursor-grab active:cursor-grabbing p-0.5 rounded shrink-0 touch-none",
					"text-muted-foreground/20 hover:text-muted-foreground/60",
					"opacity-0 group-hover:opacity-100 transition-opacity",
				)}
				aria-label="Drag to reorder"
			>
				<GripVertical className="h-4 w-4" />
			</button>

			{/* Chapter info */}
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium text-foreground">
					{chapter.number}. {chapter.title}
				</p>
				{chapter.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{chapter.subtitle}</p>}
			</div>

			{/* Word count */}
			<div className="w-32 shrink-0 hidden sm:block">
				<span className="text-sm text-muted-foreground">{chapter.wordCount.toLocaleString()} words</span>
			</div>

			{/* Status */}
			<div className="w-24 shrink-0 hidden md:block">
				<StatusBadge status={chapter.status} />
			</div>

			{/* Last modified */}
			<div className="w-40 shrink-0 hidden lg:block">
				<span className="text-sm text-muted-foreground">{chapter.lastModified}</span>
			</div>

			{/* Actions */}
			<div className="w-16 shrink-0 flex justify-end">
				<Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</div>
		</div>
	)
}
