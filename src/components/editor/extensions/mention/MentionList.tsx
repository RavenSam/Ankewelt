import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { User } from "@/lib/mockUsers"
import { cn } from "@/lib/utils"

interface MentionListProps {
	items: User[]
	command: (props: { id: string; label: string }) => void
}

export const MentionList = forwardRef((props: MentionListProps, ref) => {
	const [selectedIndex, setSelectedIndex] = useState(0)

	const selectItem = (index: number) => {
		const item = props.items[index]
		if (item) {
			props.command({ id: item.id, label: item.username })
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
			<div className="bg-popover text-popover-foreground border shadow-md rounded-md p-3 min-w-[240px] text-sm text-muted-foreground">
				No people found
			</div>
		)
	}

	return (
		<div className="bg-popover text-popover-foreground border shadow-md rounded-md p-1 min-w-[240px] flex flex-col gap-0.5">
			{props.items.map((user, index) => (
				<button
					type="button"
					key={user.id}
					onClick={() => selectItem(index)}
					className={cn(
						"flex items-center gap-2 px-2 py-1.5 rounded-sm text-left w-full transition-colors",
						index === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
					)}
				>
					<Avatar className="h-6 w-6">
						<AvatarFallback className="text-[10px]">{user.avatar}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col leading-tight">
						<span className="text-sm font-medium">{user.name}</span>
						<span className="text-xs text-muted-foreground">@{user.username}</span>
					</div>
				</button>
			))}
		</div>
	)
})

MentionList.displayName = "MentionList"
