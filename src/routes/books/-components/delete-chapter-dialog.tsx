import { eq } from "drizzle-orm"
import { AlertTriangle, FileText, Loader2, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { deleteChapterVersions } from "@/actions/chapters-actions"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import db from "@/db/database"
import { chapter } from "@/db/schema"

interface ChapterVersion {
	id: string
	version_number: number
	title_snapshot: string
	wordCount: number
	created_at: string | null
}

interface DeleteChapterDialogProps {
	open: boolean
	chapterId: string | null
	onClose: () => void
	onDeleted: () => void
}

export function DeleteChapterDialog({ open, chapterId, onClose, onDeleted }: DeleteChapterDialogProps) {
	const [versions, setVersions] = useState<ChapterVersion[]>([])
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
	const [chapterTitle, setChapterTitle] = useState("")
	const [loading, setLoading] = useState(false)
	const [deleting, setDeleting] = useState(false)

	useEffect(() => {
		if (!open || !chapterId) return

		const id = chapterId
		let cancelled = false

		async function load() {
			setLoading(true)
			try {
				const ch = await db.query.chapter.findFirst({
					where: eq(chapter.id, id),
					with: { versions: true },
				})
				if (cancelled || !ch) return
				setChapterTitle(ch.title)
				const vs = [...ch.versions].sort((a, b) => b.version_number - a.version_number)
				setVersions(vs)
				setSelectedIds(new Set(vs.map((v) => v.id)))
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		load()
		return () => {
			cancelled = true
		}
	}, [open, chapterId])

	const allSelected = versions.length > 0 && selectedIds.size === versions.length
	const isDeletingAll = allSelected
	const selectedCount = selectedIds.size
	const noneSelected = selectedCount === 0

	const toggleAll = () => {
		if (allSelected) {
			setSelectedIds(new Set())
		} else {
			setSelectedIds(new Set(versions.map((v) => v.id)))
		}
	}

	const toggleVersion = (id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	const handleDelete = async () => {
		if (!chapterId || noneSelected) return
		setDeleting(true)
		try {
			await deleteChapterVersions(chapterId, [...selectedIds])
			onDeleted()
		} catch (e) {
			console.error("Failed to delete:", e)
		} finally {
			setDeleting(false)
			onClose()
		}
	}

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="max-w-lg gap-0 p-0 overflow-hidden">
				{/* ─── Header ─── */}
				<DialogHeader className="px-6 pt-6 pb-4">
					<DialogTitle className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
						<Trash2 className="h-5 w-5 text-destructive" />
						Delete Chapter
					</DialogTitle>
					<DialogDescription className="pt-1.5 leading-relaxed">
						{chapterTitle ? (
							<>
								You are about to delete versions from{" "}
								<span className="font-semibold text-foreground">"{chapterTitle}"</span>.
							</>
						) : (
							"Loading..."
						)}
					</DialogDescription>
				</DialogHeader>

				{/* ─── Warning ─── */}
				<div className="mx-6 mb-1 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
					<AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
					<div className="text-sm text-muted-foreground leading-relaxed">
						{isDeletingAll ? (
							<>
								All versions will be permanently deleted and the chapter will be{" "}
								<span className="font-medium text-destructive">removed entirely</span>. This action cannot be undone.
							</>
						) : (
							<>
								Selected versions will be permanently deleted. If you delete all versions, the chapter will also be
								removed.
							</>
						)}
					</div>
				</div>

				{/* ─── Version list ─── */}
				<div className="px-6 py-4">
					{loading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
						</div>
					) : versions.length === 0 ? (
						<div className="text-center py-8 text-sm text-muted-foreground">No versions found.</div>
					) : (
						<>
							{/* Select all toggle */}
							<button
								type="button"
								className="flex items-center gap-2.5 mb-3 cursor-pointer select-none group w-full text-left"
								onClick={toggleAll}
							>
								<Checkbox
									checked={allSelected}
									onCheckedChange={toggleAll}
									onClick={(e) => e.stopPropagation()}
									className="data-[state=checked]:border-destructive data-[state=checked]:bg-destructive!"
								/>
								<span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
									{allSelected ? "Deselect all" : "Select all"}
								</span>
								<span className="text-xs text-muted-foreground tabular-nums ml-auto">
									{selectedCount} of {versions.length}
								</span>
							</button>

							<Separator className="mb-3" />

							{/* Version items */}
							<div className="max-h-64 overflow-y-auto space-y-1 -mx-2 px-2">
								{versions.map((v) => {
									const isSelected = selectedIds.has(v.id)
									return (
										<button
											type="button"
											key={v.id}
											className={`
                          flex items-start gap-3 px-3 py-2.5 rounded-md cursor-pointer select-none
                          transition-colors border border-transparent
                          ${isSelected ? "bg-muted/50" : "hover:bg-muted/30"}
                        `}
											onClick={() => toggleVersion(v.id)}
										>
											<Checkbox
												checked={isSelected}
												onCheckedChange={() => toggleVersion(v.id)}
												onClick={(e) => e.stopPropagation()}
												className="mt-0.5 data-[state=checked]:border-destructive data-[state=checked]:bg-destructive!"
											/>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-0.5">
													<span className="text-sm font-medium text-foreground truncate">{v.title_snapshot}</span>
													<span className="text-[11px] text-muted-foreground font-mono tabular-nums shrink-0">
														v{v.version_number}
													</span>
												</div>
												<div className="flex items-center gap-3 text-xs text-muted-foreground">
													<span className="flex items-center gap-1">
														<FileText className="h-3 w-3" />
														{v.wordCount.toLocaleString()} words
													</span>
													<span>
														{v.created_at
															? new Date(v.created_at).toLocaleDateString("en-GB", {
																	day: "numeric",
																	month: "short",
																	year: "numeric",
																})
															: "—"}
													</span>
												</div>
											</div>
										</button>
									)
								})}
							</div>
						</>
					)}
				</div>

				{/* ─── Footer ─── */}
				<DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 flex-row justify-end gap-2.5">
					<DialogClose asChild>
						<Button variant="outline" disabled={deleting}>
							Cancel
						</Button>
					</DialogClose>
					<Button variant="destructive" onClick={handleDelete} disabled={noneSelected || loading || deleting}>
						{deleting ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Trash2 className="h-4 w-4 mr-1.5" />}
						{isDeletingAll ? "Delete Chapter" : `Delete ${selectedCount} Version${selectedCount === 1 ? "" : "s"}`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
