import type { NavItemType } from "types"
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { Accordion } from "../ui/accordion"
import { LinkItem } from "./link-item"

export const navItems: NavItemType[] = [
	{
		label: "Dashboard",
		href: "/dashboard",
		icon: "LayoutDashboard",
	},
	{
		label: "Books",
		href: "/books",
		icon: "LibraryBig",
		items: [
			{
				label: "The Devil's Whisper in the Dark",
				href: "/books/devils-whisper",
				icon: "BookText",
				items: [
					{
						label: "Chapters",
						href: "/books/devils-whisper/chapters",
						icon: "FilesIcon",
						items: [
							{
								label: "Chapter 01 - Kushina",
								href: "/books/devils-whisper/chapters/ch-1",
								icon: "FileTextIcon",
							},
							{
								label: "Chapter 02 - Kushina",
								href: "/books/devils-whisper/chapters/ch-2",
								icon: "FileTextIcon",
							},
							{
								label: "Chapter 03 - Kushina",
								href: "/books/devils-whisper/chapters/ch-3",
								icon: "FileTextIcon",
							},
							{
								label: "Chapter 04 - Kushina",
								href: "/books/devils-whisper/chapters/ch-4",
								icon: "FileTextIcon",
							},
							{
								label: "Chapter 05 - Four Winds",
								href: "/books/devils-whisper/chapters/ch-5",
								icon: "FileTextIcon",
							},
						],
					},
					{
						label: "Characters",
						href: "/books/devils-whisper/characters",
						icon: "UsersIcon",
					},
					{
						label: "Locations",
						href: "/books/devils-whisper/locations",
						icon: "MapPinIcon",
					},
					{
						label: "Plots",
						href: "/books/devils-whisper/plots",
						icon: "WaypointsIcon",
					},
					{
						label: "Settings",
						href: "/books/devils-whisper/settings",
						icon: "CogIcon",
					},
				],
			},
			{
				label: "Invincible (Saiyan SI)",
				href: "/books/invincible-saiyan-si",
				icon: "BookText",
			},
			{
				label: "One Piece fanfic",
				href: "/books/one-piece-fanfic",
				icon: "BookText",
			},
		],
	},
]

export function NavMain() {
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2"></SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					<Accordion type="multiple">
						{navItems.map((item) => (
							<LinkItem key={item.label} item={item} />
						))}
					</Accordion>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
