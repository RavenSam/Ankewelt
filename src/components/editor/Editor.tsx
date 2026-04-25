import type { Editor as TiptapEditor } from "@tiptap/core"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Highlighter, MessageSquare, MessageSquareText, Settings } from "lucide-react"
import { nanoid } from "nanoid"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { MOCK_LOCATIONS } from "@/lib/mockLocations"
import { MOCK_USERS } from "@/lib/mockUsers"
import type { CommentThread, Highlight } from "@/lib/types"
import { useTheme } from "@/lib/useTheme"
import { cn } from "@/lib/utils"
import { BubbleMenu } from "./BubbleMenu"
import { CommentsPanel } from "./CommentsPanel"
import { CommentMark } from "./extensions/comment"
import { CustomHighlight } from "./extensions/highlight"
import { Mention } from "./extensions/mention"
import { SlashMenu } from "./extensions/slash-menu"
import { getSuggestionItems } from "./extensions/slash-menu/SlashMenuList"
import { HighlightsPanel } from "./HighlightsPanel"
import { StyleController } from "./StyleController"

const initialContent = `
  <h1>Lumina</h1>
  <p>A quiet place to write. Select text to see the bubble menu, or type <code>/</code> for block commands.</p>
  <p>You can <mark data-color="yellow" data-id="h-seed-1" class="highlight-yellow">highlight important thoughts</mark> or <span data-id="c1" class="comment-mark">leave comments</span> for yourself or others.</p>
  <p>And of course, you can mention people by typing <code>@</code> — like <span data-type="mention" data-id="1" data-label="elena">elena</span>.</p>
`

const initialComments: CommentThread[] = [
	{
		id: "c1",
		text: "leave comments",
		authorId: "2",
		content: "This is a great feature for collaboration.",
		createdAt: Date.now() - 1000 * 60 * 60 * 2,
		resolved: false,
		replies: [],
	},
]

interface CommentMarker {
	id: string
	top: number
}

function extractHighlights(editor: TiptapEditor): Highlight[] {
	const out: Highlight[] = []
	let current: Highlight | null = null

	editor.state.doc.descendants((node, pos) => {
		if (!node.isText) {
			if (current) {
				out.push(current)
				current = null
			}
			return true
		}
		const mark = node.marks.find((m) => m.type.name === "customHighlight")
		if (!mark) {
			if (current) {
				out.push(current)
				current = null
			}
			return true
		}
		const id: string = mark.attrs.id ?? `h-${pos}`
		const color: string = mark.attrs.color ?? "yellow"
		if (current && current.id === id && current.to === pos) {
			current.text += node.text ?? ""
			current.to = pos + node.nodeSize
		} else {
			if (current) out.push(current)
			current = {
				id,
				text: node.text ?? "",
				color,
				context: node.text ?? "",
				from: pos,
				to: pos + node.nodeSize,
			}
		}
		return true
	})

	if (current) out.push(current)
	return out
}

export function Editor() {
	const { theme, updateTheme } = useTheme()

	const [styleControllerOpen, setStyleControllerOpen] = useState(false)
	const [commentsPanelOpen, setCommentsPanelOpen] = useState(false)
	const [highlightsPanelOpen, setHighlightsPanelOpen] = useState(false)

	const [comments, setComments] = useState<CommentThread[]>(initialComments)
	const [highlights, setHighlights] = useState<Highlight[]>([])
	const [activeCommentId, setActiveCommentId] = useState<string | null>(null)
	const [commentMarkers, setCommentMarkers] = useState<CommentMarker[]>([])

	const containerRef = useRef<HTMLDivElement>(null)

	const openCommentFromEditor = useCallback((id: string) => {
		setActiveCommentId(id)
		setCommentsPanelOpen(true)
	}, [])

	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder: "Start writing…",
			}),
			Link.configure({
				openOnClick: false,
				autolink: true,
				HTMLAttributes: {
					rel: "noopener noreferrer",
					target: "_blank",
				},
			}),
			CustomHighlight,
			CommentMark,
			Mention.configure({
				suggestion: {
					items: ({ query }: { query: string }) => {
						const q = query.toLowerCase()
						const users = MOCK_USERS
							.filter(
								(u) =>
									u.username.toLowerCase().includes(q) || u.name.toLowerCase().includes(q),
							)
							.map((u) => ({ ...u, kind: "character" as const }))
						const locations = MOCK_LOCATIONS
							.filter((l) => l.name.toLowerCase().includes(q))
							.map((l) => ({ ...l, kind: "location" as const }))
						return [...users.slice(0, 3), ...locations.slice(0, 3)]
					},
				},
			}),
			SlashMenu.configure({
				suggestion: {
					items: getSuggestionItems,
				},
			}),
		],
		content: initialContent,
		editorProps: {
			handleClickOn: (_view, _pos, _node, _nodePos, event) => {
				const target = event.target as HTMLElement | null
				const commentEl = target?.closest("[data-id].comment-mark") as HTMLElement | null
				if (commentEl) {
					const id = commentEl.getAttribute("data-id")
					if (id) {
						openCommentFromEditor(id)
						return true
					}
				}
				return false
			},
		},
	})

	const recomputeMarkers = useCallback(() => {
		if (!editor || !containerRef.current) return

		setHighlights(extractHighlights(editor))

		const containerRect = containerRef.current.getBoundingClientRect()
		const seen = new Map<string, number>()
		editor.state.doc.descendants((node, pos) => {
			const commentMark = node.marks.find((m) => m.type.name === "comment")
			if (!commentMark) return true
			const id: string | undefined = commentMark.attrs.id
			if (!id || seen.has(id)) return true
			try {
				const coords = editor.view.coordsAtPos(pos)
				seen.set(id, coords.top - containerRect.top)
			} catch {
				// ignore
			}
			return true
		})

		const unresolved = new Set(comments.filter((c) => !c.resolved).map((c) => c.id))
		const markers: CommentMarker[] = []
		seen.forEach((top, id) => {
			if (unresolved.has(id)) markers.push({ id, top })
		})
		markers.sort((a, b) => a.top - b.top)
		setCommentMarkers(markers)
	}, [editor, comments])

	useEffect(() => {
		if (!editor) return
		recomputeMarkers()
		const handler = () => recomputeMarkers()
		editor.on("update", handler)
		editor.on("selectionUpdate", handler)
		editor.on("transaction", handler)
		window.addEventListener("resize", handler)
		return () => {
			editor.off("update", handler)
			editor.off("selectionUpdate", handler)
			editor.off("transaction", handler)
			window.removeEventListener("resize", handler)
		}
	}, [editor, recomputeMarkers])

	// biome-ignore lint/correctness/useExhaustiveDependencies: need the change
	useLayoutEffect(() => {
		recomputeMarkers()
	}, [theme.fontFamily, theme.fontSize, theme.colorPalette, recomputeMarkers])

	const handleAddComment = (text: string) => {
		if (!editor) return
		const id = nanoid()
		editor.chain().focus().setComment({ id }).run()

		const newComment: CommentThread = {
			id,
			text,
			authorId: MOCK_USERS[0].id,
			content: "New comment...",
			createdAt: Date.now(),
			resolved: false,
			replies: [],
		}

		setComments((prev) => [...prev, newComment])
		setActiveCommentId(id)
		setCommentsPanelOpen(true)
	}

	const handleResolveComment = (id: string) => {
		if (!editor) return
		editor.chain().focus().unsetComment(id).run()
		setComments((prev) => prev.map((c) => (c.id === id ? { ...c, resolved: true } : c)))
		if (activeCommentId === id) setActiveCommentId(null)
	}

	const handleCommentSelect = (id: string) => {
		if (!editor) return
		setActiveCommentId(id)
		let found = false
		editor.state.doc.descendants((node, pos) => {
			if (found) return false
			if (node.marks.some((m) => m.type.name === "comment" && m.attrs.id === id)) {
				editor
					.chain()
					.focus()
					.setTextSelection({ from: pos, to: pos + node.nodeSize })
					.run()
				try {
					const dom = editor.view.domAtPos(pos).node as HTMLElement | null
					;(dom as HTMLElement | null)?.scrollIntoView?.({
						behavior: "smooth",
						block: "center",
					})
				} catch {
					/* ignore */
				}
				found = true
				return false
			}
			return true
		})
	}

	const handleHighlightSelect = (h: Highlight) => {
		if (!editor) return
		editor.chain().focus().setTextSelection({ from: h.from, to: h.to }).run()
		try {
			const dom = editor.view.domAtPos(h.from).node as HTMLElement | null
			;(dom as HTMLElement | null)?.scrollIntoView?.({
				behavior: "smooth",
				block: "center",
			})
		} catch {
			/* ignore */
		}
	}

	const handleHighlightDelete = (h: Highlight) => {
		if (!editor) return
		editor.chain().setTextSelection({ from: h.from, to: h.to }).unsetHighlight().setTextSelection(h.from).run()
	}

	const handleHighlightChangeColor = (h: Highlight, color: string) => {
		if (!editor) return
		editor.chain().setTextSelection({ from: h.from, to: h.to }).setHighlight({ color, id: h.id }).run()
	}

	if (!editor) return null

	return (
		<div
			className="min-h-screen flex flex-col transition-colors duration-300"
			style={{
				fontFamily: theme.fontFamily,
				fontSize: `${theme.fontSize}px`,
			}}
		>
			<header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border/40">
				<div className="flex items-center gap-2" />
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setCommentsPanelOpen(true)}
						className="relative"
						title="Comments"
					>
						<MessageSquare className="w-4 h-4 opacity-70" />
						{comments.filter((c) => !c.resolved).length > 0 && (
							<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
						)}
					</Button>
					<Button variant="ghost" size="icon" onClick={() => setHighlightsPanelOpen(true)} title="Highlights">
						<Highlighter className="w-4 h-4 opacity-70" />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => setStyleControllerOpen(true)} title="Style">
						<Settings className="w-4 h-4 opacity-70" />
					</Button>
				</div>
			</header>

			<main className="flex-1 w-full max-w-3xl mx-auto p-8 sm:p-12 md:p-24 pb-32">
				<div ref={containerRef} className="relative">
					<EditorContent editor={editor} className="prose max-w-none focus:outline-none" />
					<div className="hidden md:block absolute top-0 -right-12 w-10 h-full pointer-events-none" aria-hidden="false">
						{commentMarkers.map((m) => (
							<button
								type="button"
								key={m.id}
								style={{ top: `${m.top - 4}px` }}
								onClick={() => {
									handleCommentSelect(m.id)
									setCommentsPanelOpen(true)
								}}
								className={cn(
									"pointer-events-auto absolute right-0 flex items-center justify-center w-8 h-8 rounded-full",
									"bg-background border shadow-sm transition-all hover:scale-110 hover:border-primary/60",
									activeCommentId === m.id && "border-primary bg-primary/5",
								)}
								title="Open comment"
							>
								<MessageSquareText className="w-4 h-4 text-muted-foreground" />
							</button>
						))}
					</div>
				</div>
				<BubbleMenu editor={editor} onAddComment={handleAddComment} />
			</main>

			<StyleController
				open={styleControllerOpen}
				onOpenChange={setStyleControllerOpen}
				theme={theme}
				onThemeChange={updateTheme}
			/>

			<CommentsPanel
				open={commentsPanelOpen}
				onOpenChange={(open) => {
					setCommentsPanelOpen(open)
					if (!open) setActiveCommentId(null)
				}}
				threads={comments}
				activeId={activeCommentId}
				onResolve={handleResolveComment}
				onSelect={handleCommentSelect}
			/>

			<HighlightsPanel
				open={highlightsPanelOpen}
				onOpenChange={setHighlightsPanelOpen}
				highlights={highlights}
				onSelect={handleHighlightSelect}
				onDelete={handleHighlightDelete}
				onChangeColor={handleHighlightChangeColor}
			/>
		</div>
	)
}
