import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Chapter } from "types"
import { UNGROUPED_CONTAINER_ID } from "@/hooks/use-drag-and-drop"
import { cn } from "@/lib/utils"
import { ChapterItem } from "./chapter-item"

interface UngroupedSectionProps {
	chapters: Chapter[]
	isEmpty?: boolean
	onOpenChapter?: (chapterId: string) => void
	onDeleteChapter?: (chapterId: string) => void
	onMoveGroupChapter?: (chapterId: string) => void
}

export function UngroupedSection({
	chapters,
	isEmpty = false,
	onOpenChapter,
	onDeleteChapter,
	onMoveGroupChapter,
}: UngroupedSectionProps) {
	const chapterIds = chapters.map((c) => c.id)

	const { setNodeRef, isOver } = useDroppable({ id: UNGROUPED_CONTAINER_ID })

	return (
		<div
			ref={setNodeRef}
			className={cn(
				"rounded-lg border border-border bg-card overflow-hidden transition-colors",
				isOver && "ring-2 ring-primary/30",
			)}
		>
			{isEmpty ? (
				<div
					className={cn(
						"px-4 py-8 text-center text-sm text-muted-foreground transition-colors",
						isOver && "bg-primary/5 text-primary",
					)}
				>
					Drop here to ungroup
				</div>
			) : (
				<>
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
						<div>
							{chapters.map((chapter) => (
								<ChapterItem
									key={chapter.id}
									chapter={chapter}
									onOpen={onOpenChapter ? () => onOpenChapter(chapter.id) : undefined}
									onDelete={
										onDeleteChapter ? () => onDeleteChapter(chapter.id) : undefined
									}
									onMoveGroup={
										onMoveGroupChapter
											? () => onMoveGroupChapter(chapter.id)
											: undefined
									}
								/>
							))}
						</div>
					</SortableContext>
				</>
			)}
		</div>
	)
}
