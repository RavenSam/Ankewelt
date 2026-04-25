import { Highlighter, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { HIGHLIGHT_COLORS, type Highlight } from "@/lib/types"
import { cn } from "@/lib/utils"

interface HighlightsPanelProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	highlights: Highlight[]
	onSelect: (h: Highlight) => void
	onDelete: (h: Highlight) => void
	onChangeColor: (h: Highlight, color: string) => void
}

export function HighlightsPanel({
	open,
	onOpenChange,
	highlights,
	onSelect,
	onDelete,
	onChangeColor,
}: HighlightsPanelProps) {
	const grouped = highlights.reduce(
		(acc, h) => {
			if (!acc[h.color]) acc[h.color] = []
			acc[h.color].push(h)
			return acc
		},
		{} as Record<string, Highlight[]>,
	)

	const colors = Object.keys(grouped).sort()

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-100 sm:w-135">
				<SheetHeader>
					<SheetTitle className="flex items-center gap-2">
						<Highlighter className="w-5 h-5" />
						Highlights
					</SheetTitle>
				</SheetHeader>

				<ScrollArea className="h-[calc(100vh-100px)] mt-6 pr-4">
					{highlights.length === 0 ? (
						<div className="text-center text-muted-foreground mt-10">
							<Highlighter className="w-12 h-12 mx-auto mb-4 opacity-20" />
							<p>No highlights yet</p>
							<p className="text-xs mt-2">Select text and pick a color from the bubble menu.</p>
						</div>
					) : (
						<div className="space-y-8">
							{colors.map((color) => (
								<div key={color} className="space-y-3">
									<h3 className="text-sm font-semibold capitalize flex items-center gap-2">
										<span
											className={cn(
												"inline-block w-3 h-3 rounded-full",
												HIGHLIGHT_COLORS.find((c) => c.value === color)?.class ?? "bg-muted",
											)}
										/>
										{color}
										<span className="text-xs font-normal text-muted-foreground">({grouped[color].length})</span>
									</h3>
									<div className="space-y-2">
										{grouped[color].map((h) => (
											<div
												key={h.id}
												className="group p-3 rounded-md border bg-card hover:border-primary/40 transition-colors"
											>
												<button
													type="button"
													onClick={() => {
														onSelect(h)
														onOpenChange(false)
													}}
													className="text-left w-full"
												>
													<p className="text-sm italic leading-snug">"{h.text}"</p>
												</button>

												<div className="mt-3 pt-3 border-t flex items-center justify-between">
													<div className="flex items-center gap-1.5">
														{HIGHLIGHT_COLORS.map((c) => (
															<button
																type="button"
																key={c.value}
																onClick={() => onChangeColor(h, c.value)}
																className={cn(
																	"w-5 h-5 rounded-full transition-all hover:scale-110",
																	c.class,
																	h.color === c.value
																		? "ring-2 ring-offset-1 ring-offset-card ring-foreground/40"
																		: "opacity-70 hover:opacity-100",
																)}
																title={`Change to ${c.name}`}
															/>
														))}
													</div>
													<Button
														variant="ghost"
														size="sm"
														className="h-7 px-2 text-muted-foreground hover:text-destructive"
														onClick={() => onDelete(h)}
														title="Remove highlight"
													>
														<Trash2 className="w-3.5 h-3.5" />
													</Button>
												</div>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					)}
				</ScrollArea>
			</SheetContent>
		</Sheet>
	)
}
