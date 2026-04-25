import { formatDistanceToNow } from "date-fns"
import { Check, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { MOCK_USERS } from "@/lib/mockUsers"
import type { CommentThread } from "@/lib/types"

interface CommentsPanelProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	threads: CommentThread[]
	activeId?: string | null
	onResolve: (id: string) => void
	onSelect: (id: string) => void
}

export function CommentsPanel({ open, onOpenChange, threads, activeId, onResolve, onSelect }: CommentsPanelProps) {
	const unresolvedThreads = threads.filter((t) => !t.resolved)

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-100 sm:w-135">
				<SheetHeader>
					<SheetTitle className="flex items-center gap-2">
						<MessageSquare className="w-5 h-5" />
						Comments
					</SheetTitle>
				</SheetHeader>

				<ScrollArea className="h-[calc(100vh-100px)] mt-6 pr-4">
					{unresolvedThreads.length === 0 ? (
						<div className="text-center text-muted-foreground mt-10">
							<MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
							<p>No open comments</p>
						</div>
					) : (
						<div className="space-y-6">
							{unresolvedThreads.map((thread) => {
								const user = MOCK_USERS.find((u) => u.id === thread.authorId)
								if (!user) return null

								const isActive = activeId === thread.id
								return (
									<button
										type="button"
										key={thread.id}
										data-active={isActive ? "true" : undefined}
										className={
											"p-4 rounded-lg border bg-card transition-colors cursor-pointer group " +
											(isActive ? "border-primary ring-1 ring-primary/30 bg-primary/3" : "hover:border-primary/50")
										}
										onClick={() => onSelect(thread.id)}
									>
										<div className="flex justify-between items-start mb-3">
											<div className="flex items-center gap-2">
												<Avatar className="w-8 h-8">
													<AvatarFallback>{user.avatar}</AvatarFallback>
												</Avatar>
												<div>
													<p className="text-sm font-medium">{user.name}</p>
													<p className="text-xs text-muted-foreground">
														{formatDistanceToNow(thread.createdAt, {
															addSuffix: true,
														})}
													</p>
												</div>
											</div>
											<Button
												variant="ghost"
												size="icon"
												className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-primary"
												onClick={(e) => {
													e.stopPropagation()
													onResolve(thread.id)
												}}
												title="Resolve"
											>
												<Check className="w-4 h-4" />
											</Button>
										</div>

										<div className="pl-10 space-y-2">
											<div className="text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-3 py-1">
												"{thread.text}"
											</div>
											<p className="text-sm">{thread.content}</p>
										</div>
									</button>
								)
							})}
						</div>
					)}
				</ScrollArea>
			</SheetContent>
		</Sheet>
	)
}
