import { Link, useLocation } from "@tanstack/react-router"
import {
	BookText,
	CogIcon,
	CompassIcon,
	FilesIcon,
	FileTextIcon,
	FolderKanban,
	GitCommitVerticalIcon,
	KanbanSquare,
	LayoutDashboard,
	LibraryBig,
	type LucideIcon,
	MapPinIcon,
	StickyNote,
	UserIcon,
	UsersIcon,
	WaypointsIcon,
} from "lucide-react"
import type { NavItemType } from "@/../types"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

const Icons = {
	BookText,
	FileTextIcon,
	FilesIcon,
	FolderKanban,
	LayoutDashboard,
	LibraryBig,
	MapPinIcon,
	StickyNote,
	UsersIcon,
	UserIcon,
	KanbanSquare,
	CogIcon,
	WaypointsIcon,
	CompassIcon,
	GitCommitVerticalIcon,
}

export const LinkItem = ({ item }: { item: NavItemType }) => {
	const LinkIcon = (Icons as Record<string, LucideIcon>)[item.icon]
	const pathname = useLocation().pathname

	return (
		<AccordionItem value={item.label + item.href} className="border-none">
			<div
				className={cn(
					"relative flex items-center group text-sm rounded-md text-muted-foreground hover:text-primary font-medium",
					!!item.items?.length && "pr-8",
					pathname === item.href && "text-primary bg-primary/10",
				)}
			>
				<Link to={item.href} className="flex items-center w-full p-2">
					{LinkIcon && <LinkIcon className="w-5 h-5 mr-2 shrink-0" />}
					<span className="truncate">{item.label}</span>
				</Link>

				{!!item.items?.length && <AccordionTrigger className="absolute inset-y-0 right-0 p-2 shrink-0" />}
			</div>

			{!!item.items?.length && (
				<AccordionContent className="ml-6">
					{item.items.map((subItem) => (
						<LinkItem key={subItem.label} item={subItem} />
					))}
				</AccordionContent>
			)}
		</AccordionItem>
	)
}
