import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Chapter } from "types"
import { cn } from "@/lib/utils"
import { ChapterItem } from "./chapter-item"

interface UngroupedSectionProps {
	chapters: Chapter[]
}

export function UngroupedSection({ chapters }: UngroupedSectionProps) {
	const { setNodeRef, isOver } = useDroppable({ id: "ungrouped-section" })
	const chapterIds = chapters.map((c) => c.id)

	if (chapters.length === 0) return null

	return (
		<div
			ref={setNodeRef}
			className={cn(
				"rounded-lg border border-border bg-card overflow-hidden transition-colors",
				isOver && "border-primary/40",
			)}
		>
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
				{chapters.map((chapter) => (
					<ChapterItem key={chapter.id} chapter={chapter} />
				))}
			</SortableContext>
		</div>
	)
}
