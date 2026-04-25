import { MapPin } from "lucide-react"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Location } from "@/lib/mockLocations"
import type { User } from "@/lib/mockUsers"
import { cn } from "@/lib/utils"

type MentionItem = (User & { kind: "character" }) | (Location & { kind: "location" })

interface MentionListProps {
	items: MentionItem[]
	command: (props: { id: string; label: string; kind: "character" | "location" }) => void
}

export const MentionList = forwardRef((props: MentionListProps, ref) => {
	const [selectedIndex, setSelectedIndex] = useState(0)

	const selectItem = (index: number) => {
		const item = props.items[index]
		if (!item) return
		if (item.kind === "character") {
			props.command({ id: item.id, label: item.username, kind: "character" })
		} else {
			props.command({ id: item.id, label: item.name, kind: "location" })
		}
	}

	const upHandler = () => {
		if (props.items.length === 0) return
		setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
	}

	const downHandler = () => {
		if (props.items.length === 0) return
		setSelectedIndex((selectedIndex + 1) % props.items.length)
	}

	const enterHandler = () => {
		selectItem(selectedIndex)
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: need the changes
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
		return (
			<div className="bg-popover border shadow-md rounded-md p-3 min-w-60 text-sm text-muted-foreground">
				No matches found
			</div>
		)
	}

	const sectionBreakIndex = props.items.findIndex((item) => item.kind === "location")

	const renderItem = (item: MentionItem, index: number) => (
		<button
			type="button"
			key={item.id}
			onClick={() => selectItem(index)}
			className={cn(
				"flex items-center gap-2 px-2 py-1.5 rounded-sm text-left w-full transition-colors",
				index === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
			)}
		>
			{item.kind === "character" ? (
				<Avatar className="h-6 w-6">
					<AvatarFallback className="text-[10px]">{item.avatar}</AvatarFallback>
				</Avatar>
			) : (
				<div className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
					<MapPin className="h-3.5 w-3.5" />
				</div>
			)}
			<div className="flex flex-col leading-tight">
				<span className="text-sm font-medium">{item.name}</span>
				<span className="text-xs text-muted-foreground">
					{item.kind === "character" ? `@${item.username}` : item.type}
				</span>
			</div>
		</button>
	)

	return (
		<div className="bg-popover text-popover-foreground border shadow-md rounded-md p-1 min-w-60 flex flex-col gap-0.5">
			{sectionBreakIndex > 0 && sectionBreakIndex < props.items.length ? (
				<>
					{props.items.slice(0, sectionBreakIndex).map((item, index) => renderItem(item, index))}
					<div className="flex items-center gap-2 px-3 py-1">
						<div className="h-px flex-1 bg-border" />
					</div>
					{props.items.slice(sectionBreakIndex).map((item, i) => renderItem(item, sectionBreakIndex + i))}
				</>
			) : (
				props.items.map((item, index) => renderItem(item, index))
			)}
		</div>
	)
})

MentionList.displayName = "MentionList"
