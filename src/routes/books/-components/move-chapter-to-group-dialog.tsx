import { eq } from "drizzle-orm"
import { ArrowRight, Check, Layers, Loader2, Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { createGroup, moveChapterToGroup } from "@/actions/chapters-actions"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import db from "@/db/database"
import { book } from "@/db/schema"

interface GroupItem {
	id: string
	name: string
}

type Selection = { type: "group"; id: string } | { type: "ungroup" } | null

interface MoveChapterToGroupDialogProps {
	open: boolean
	bookId: string | null
	chapterId: string | null
	currentGroupId: string | null
	onClose: () => void
	onMoved: () => void
}

export function MoveChapterToGroupDialog({
	open,
	bookId,
	chapterId,
	currentGroupId,
	onClose,
	onMoved,
}: MoveChapterToGroupDialogProps) {
	const [groups, setGroups] = useState<GroupItem[]>([])
	const [loading, setLoading] = useState(false)
	const [saving, setSaving] = useState(false)
	const [selection, setSelection] = useState<Selection>(null)
	const [showCreate, setShowCreate] = useState(false)
	const [newGroupName, setNewGroupName] = useState("")
	const [creatingGroup, setCreatingGroup] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (!open || !bookId) return

		const bid = bookId
		let cancelled = false

		async function load() {
			setLoading(true)
			try {
				const b = await db.query.book.findFirst({
					where: eq(book.id, bid),
					with: { chapterGroups: true },
				})
				if (cancelled || !b) return
				setGroups(b.chapterGroups.map((g) => ({ id: g.id, name: g.name })))
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		load()

		// Reset on open
		setSelection(null)
		setShowCreate(false)
		setNewGroupName("")

		return () => {
			cancelled = true
		}
	}, [open, bookId])

	// Focus input when "Create new group" is expanded
	useEffect(() => {
		if (showCreate) inputRef.current?.focus()
	}, [showCreate])

	const handleSelectGroup = (groupId: string) => {
		if (groupId === currentGroupId) return
		setSelection({ type: "group", id: groupId })
	}

	const handleSelectUngroup = () => {
		setSelection({ type: "ungroup" })
	}

	const handleCreateGroup = async () => {
		if (!bookId || !newGroupName.trim()) return
		setCreatingGroup(true)
		try {
			const groupId = await createGroup(bookId, newGroupName.trim())
			setGroups((prev) => [...prev, { id: groupId, name: newGroupName.trim() }])
			setSelection({ type: "group", id: groupId })
			setShowCreate(false)
			setNewGroupName("")
		} catch (e) {
			console.error("Failed to create group:", e)
		} finally {
			setCreatingGroup(false)
		}
	}

	const handleDone = async () => {
		if (!selection || !chapterId) return
		setSaving(true)
		try {
			if (selection.type === "ungroup") {
				await moveChapterToGroup(chapterId, null)
			} else {
				await moveChapterToGroup(chapterId, selection.id)
			}
			onMoved()
		} catch (e) {
			console.error("Failed to move chapter:", e)
		} finally {
			setSaving(false)
			onClose()
		}
	}

	const currentGroupName = groups.find((g) => g.id === currentGroupId)?.name ?? null

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="max-w-md gap-0 p-0 overflow-hidden">
				{/* ── Header ── */}
				<DialogHeader className="px-5 pt-5 pb-0">
					<DialogTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
						<Layers className="h-4 w-4 text-muted-foreground" />
						{currentGroupId ? "Move to Group" : "Add to Group"}
					</DialogTitle>
					{currentGroupName ? (
						<DialogDescription className="pt-1 text-[13px] leading-snug">
							Currently in{" "}
							<span className="font-medium text-foreground">{currentGroupName}</span>.
							Pick a destination below.
						</DialogDescription>
					) : (
						<DialogDescription className="pt-1 text-[13px] leading-snug">
							Pick a group or create a new one.
						</DialogDescription>
					)}
				</DialogHeader>

				{/* ── Create new group ── */}
				<div className="px-5 pt-4 pb-1">
					{showCreate ? (
						<div className="flex gap-2">
							<Input
								ref={inputRef}
								placeholder="Group name..."
								value={newGroupName}
								onChange={(e) => setNewGroupName(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") handleCreateGroup()
									if (e.key === "Escape") {
										setShowCreate(false)
										setNewGroupName("")
									}
								}}
								disabled={creatingGroup}
								className="h-9 text-sm"
							/>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setShowCreate(false)
									setNewGroupName("")
								}}
								disabled={creatingGroup}
								className="h-9 shrink-0"
							>
								Cancel
							</Button>
							<Button
								size="sm"
								onClick={handleCreateGroup}
								disabled={!newGroupName.trim() || creatingGroup}
								className="h-9 shrink-0"
							>
								{creatingGroup ? (
									<Loader2 className="h-3.5 w-3.5 animate-spin" />
								) : (
									"Create"
								)}
							</Button>
						</div>
					) : (
						<button
							type="button"
							onClick={() => setShowCreate(true)}
							className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                text-muted-foreground hover:text-foreground hover:bg-muted/30
                transition-colors border border-dashed border-border"
						>
							<Plus className="h-4 w-4" />
							Create new group
						</button>
					)}
				</div>

				{/* ── Group list ── */}
				<div className="px-5 py-3">
					{loading ? (
						<div className="flex items-center justify-center py-10">
							<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
						</div>
					) : groups.length === 0 && !currentGroupId ? (
						<div className="text-center py-8 text-sm text-muted-foreground">
							<Layers className="h-6 w-6 mx-auto mb-2 opacity-30" />
							No groups yet
						</div>
					) : (
								<div className="max-h-52 overflow-y-auto -mx-2 px-2 space-y-0.5">
									{groups.map((g) => {
										const isCurrent = g.id === currentGroupId
										const isSelected =
											selection?.type === "group" && selection.id === g.id
										return (
											<button
												key={g.id}
												type="button"
												disabled={isCurrent || saving}
												onClick={() => handleSelectGroup(g.id)}
												className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left
                          transition-all duration-150 border
                          ${isCurrent
														? "bg-muted/30 border-border text-muted-foreground cursor-default"
														: isSelected
															? "border-primary/40 bg-primary/5 text-foreground"
															: "border-transparent hover:border-border hover:bg-muted/20"
													}
                        `}
											>
												<span
													className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
                          ${isCurrent
															? "border-primary bg-primary"
															: isSelected
																? "border-primary bg-primary"
																: "border-muted-foreground/30"
														}`}
												>
													{(isCurrent || isSelected) && (
														<Check className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={3} />
													)}
												</span>
												<span className="text-sm flex-1 truncate font-medium">{g.name}</span>
												{isCurrent && (
													<span className="text-[10px] text-muted-foreground/60 shrink-0">
														current
													</span>
												)}
											</button>
										)
									})}

									{/* Ungroup option */}
									{currentGroupId && (
										<button
											type="button"
											disabled={saving}
											onClick={handleSelectUngroup}
											className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left
                        transition-all duration-150 border mt-1
                        ${selection?.type === "ungroup"
													? "border-primary/40 bg-primary/5 text-foreground"
													: "border-transparent hover:border-border hover:bg-muted/20 text-muted-foreground"
												}
                      `}
										>
											<ArrowRight className="h-3.5 w-3.5 shrink-0 -rotate-90" />
											<span className="text-sm flex-1">Remove from group (ungroup)</span>
											{selection?.type === "ungroup" && (
												<Check className="h-4 w-4 text-primary shrink-0" strokeWidth={2.5} />
											)}
										</button>
									)}
								</div>
							)}
				</div>

				{/* ── Footer ── */}
				<DialogFooter className="px-5 py-3 border-t border-border bg-muted/30 flex-row gap-2.5">
					<DialogClose asChild>
						<Button variant="outline" size="sm" disabled={saving}>
							Cancel
						</Button>
					</DialogClose>
					<Button
						size="sm"
						onClick={handleDone}
						disabled={!selection || saving}
					>
						{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
						Done
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
