import type { Editor } from "@tiptap/core"
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus"
import { motion } from "framer-motion"
import {
	Bold,
	ExternalLink,
	Highlighter,
	Italic,
	Link as LinkIcon,
	MessageSquare,
	Strikethrough,
	X,
} from "lucide-react"
import { nanoid } from "nanoid"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HIGHLIGHT_COLORS } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EditorBubbleMenuProps {
	editor: Editor
	onAddComment?: (text: string) => void
}

function isValidUrl(value: string): boolean {
	try {
		const candidate = value.match(/^https?:\/\//i) ? value : `https://${value}`
		new URL(candidate)
		return true
	} catch {
		return false
	}
}

function normalizeUrl(value: string): string {
	return value.match(/^https?:\/\//i) ? value : `https://${value}`
}

export const BubbleMenu = ({ editor, onAddComment }: EditorBubbleMenuProps) => {
	const [highlightOpen, setHighlightOpen] = useState(false)
	const [linkOpen, setLinkOpen] = useState(false)
	const [linkValue, setLinkValue] = useState("")

	useEffect(() => {
		if (linkOpen) {
			const previousUrl = editor.getAttributes("link").href ?? ""
			setLinkValue(previousUrl)
		}
	}, [linkOpen, editor])

	if (!editor) return null

	const applyLink = () => {
		const trimmed = linkValue.trim()
		if (trimmed === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run()
		} else if (isValidUrl(trimmed)) {
			editor
				.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: normalizeUrl(trimmed) })
				.run()
		} else {
			return
		}
		setLinkOpen(false)
	}

	const removeLink = () => {
		editor.chain().focus().extendMarkRange("link").unsetLink().run()
		setLinkValue("")
		setLinkOpen(false)
	}

	return (
		<TiptapBubbleMenu editor={editor}>
			<motion.div
				initial={{ opacity: 0, y: 5 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 5 }}
				className="flex items-center bg-popover/50 backdrop-blur-md text-popover-foreground border shadow-md rounded-md p-1 space-x-1"
			>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={cn(
						"p-1.5 rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors",
						editor.isActive("bold") && "bg-primary text-primary-foreground",
					)}
					title="Bold"
				>
					<Bold className="w-4 h-4" />
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={cn(
						"p-1.5 rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors",
						editor.isActive("italic") && "bg-primary text-primary-foreground",
					)}
					title="Italic"
				>
					<Italic className="w-4 h-4" />
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleStrike().run()}
					className={cn(
						"p-1.5 rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors",
						editor.isActive("strike") && "bg-primary text-primary-foreground",
					)}
					title="Strikethrough"
				>
					<Strikethrough className="w-4 h-4" />
				</button>

				<div className="w-px h-4 bg-border mx-1" />

				<Popover open={linkOpen} onOpenChange={setLinkOpen}>
					<PopoverTrigger asChild>
						<button
							type="button"
							className={cn(
								"p-1.5 rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors",
								editor.isActive("link") && "bg-primary text-primary-foreground",
							)}
							title="Link"
						>
							<LinkIcon className="w-4 h-4" />
						</button>
					</PopoverTrigger>
					<PopoverContent className="w-80 p-3" align="center" sideOffset={10}>
						<div className="space-y-2">
							<label htmlFor="link" className="text-xs font-medium text-muted-foreground">
								Link URL
							</label>
							<div className="flex items-center gap-2">
								<Input
									name="link"
									autoFocus
									value={linkValue}
									onChange={(e) => setLinkValue(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault()
											applyLink()
										}
										if (e.key === "Escape") {
											e.preventDefault()
											setLinkOpen(false)
										}
									}}
									placeholder="https://example.com"
									className="h-8 text-sm"
								/>
								<Button
									size="sm"
									className="h-8 px-3"
									onClick={applyLink}
									disabled={linkValue.trim() !== "" && !isValidUrl(linkValue.trim())}
								>
									Apply
								</Button>
							</div>
							{editor.isActive("link") && (
								<div className="flex items-center justify-between pt-1">
									<a
										href={editor.getAttributes("link").href}
										target="_blank"
										rel="noreferrer"
										className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
									>
										<ExternalLink className="w-3 h-3" />
										Open
									</a>
									<Button
										variant="ghost"
										size="sm"
										className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
										onClick={removeLink}
									>
										<X className="w-3 h-3 mr-1" />
										Remove
									</Button>
								</div>
							)}
						</div>
					</PopoverContent>
				</Popover>

				<Popover open={highlightOpen} onOpenChange={setHighlightOpen}>
					<PopoverTrigger asChild>
						<button
							type="button"
							className={cn(
								"p-1.5 rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors",
								editor.isActive("customHighlight") && "bg-primary text-primary-foreground",
							)}
							title="Highlight"
						>
							<Highlighter className="w-4 h-4" />
						</button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-2" align="center" sideOffset={10}>
						<div className="flex gap-2">
							{HIGHLIGHT_COLORS.map((color) => (
								<button
									type="button"
									key={color.value}
									onClick={() => {
										const existingId = editor.getAttributes("customHighlight").id
										editor
											.chain()
											.focus()
											.setHighlight({
												color: color.value,
												id: existingId ?? nanoid(),
											})
											.run()
										setHighlightOpen(false)
									}}
									className={cn(
										"w-6 h-6 rounded-full ring-offset-2 ring-offset-popover transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary",
										color.class,
										editor.isActive("customHighlight", {
											color: color.value,
										}) && "ring-2 ring-primary",
									)}
									title={color.name}
								/>
							))}
							<button
								type="button"
								onClick={() => {
									editor.chain().focus().unsetHighlight().run()
									setHighlightOpen(false)
								}}
								className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-primary transition-colors"
								title="Remove highlight"
							>
								<X className="w-3 h-3 text-destructive" />
							</button>
						</div>
					</PopoverContent>
				</Popover>

				{onAddComment && (
					<button
						type="button"
						onClick={() => {
							const { from, to } = editor.state.selection
							const text = editor.state.doc.textBetween(from, to, " ")
							if (text.trim() === "") return
							onAddComment(text)
						}}
						className={cn("p-1.5 rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors")}
						title="Add comment"
					>
						<MessageSquare className="w-4 h-4" />
					</button>
				)}
			</motion.div>
		</TiptapBubbleMenu>
	)
}
