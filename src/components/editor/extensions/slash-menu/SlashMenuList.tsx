import type { Editor, Range } from "@tiptap/core"
import { Code, Heading1, Heading2, Heading3, List, ListOrdered, Minus, Quote } from "lucide-react"
import type React from "react"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { cn } from "@/lib/utils"

export interface CommandItemProps {
	title: string
	icon: React.ReactNode
	command: ({ editor, range }: { editor: Editor; range: Range }) => void
}

export const getSuggestionItems = ({ query }: { query: string }) => {
	return [
		{
			title: "Heading 1",
			icon: <Heading1 className="w-4 h-4" />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run()
			},
		},
		{
			title: "Heading 2",
			icon: <Heading2 className="w-4 h-4" />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run()
			},
		},
		{
			title: "Heading 3",
			icon: <Heading3 className="w-4 h-4" />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run()
			},
		},
		{
			title: "Bullet List",
			icon: <List className="w-4 h-4" />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor.chain().focus().deleteRange(range).toggleBulletList().run()
			},
		},
		{
			title: "Numbered List",
			icon: <ListOrdered className="w-4 h-4" />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor.chain().focus().deleteRange(range).toggleOrderedList().run()
			},
		},
		{
			title: "Quote",
			icon: <Quote className="w-4 h-4" />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor.chain().focus().deleteRange(range).toggleBlockquote().run()
			},
		},
		{
			title: "Code Block",
			icon: <Code className="w-4 h-4" />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
			},
		},
		{
			title: "Divider",
			icon: <Minus className="w-4 h-4" />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor.chain().focus().deleteRange(range).setHorizontalRule().run()
			},
		},
	].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
}

export interface SlashMenuListProps {
	items: CommandItemProps[]
	command: (item: CommandItemProps) => void
}

export interface SlashMenuListRef {
	onKeyDown: (args: { event: KeyboardEvent }) => boolean
}

export const SlashMenuList = forwardRef<SlashMenuListRef, SlashMenuListProps>((props, ref) => {
	const [selectedIndex, setSelectedIndex] = useState(0)

	const selectItem = (index: number) => {
		const item = props.items[index]

		if (item) {
			props.command(item)
		}
	}

	const upHandler = () => {
		setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
	}

	const downHandler = () => {
		setSelectedIndex((selectedIndex + 1) % props.items.length)
	}

	const enterHandler = () => {
		selectItem(selectedIndex)
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: need the change
	useEffect(() => setSelectedIndex(0), [props.items])

	useImperativeHandle(ref, () => ({
		onKeyDown: ({ event }: { event: KeyboardEvent }) => {
			if (event.key === "ArrowUp") {
				upHandler()
				return true
			}

			if (event.key === "ArrowDown") {
				downHandler()
				return true
			}

			if (event.key === "Enter") {
				enterHandler()
				return true
			}

			return false
		},
	}))

	if (props.items.length === 0) {
		return null
	}

	return (
		<div className="bg-popover/60 backdrop-blur-xl text-popover-foreground border shadow-md rounded-md p-1 min-w-50 flex flex-col gap-1">
			{props.items.map((item: CommandItemProps, index: number) => (
				<button
					type="button"
					key={item.title}
					onClick={() => selectItem(index)}
					className={cn(
						"flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm text-left w-full transition-colors",
						index === selectedIndex ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
					)}
				>
					{item.icon}
					{item.title}
				</button>
			))}
		</div>
	)
})

SlashMenuList.displayName = "SlashMenuList"
