import type { NavItemType } from "types"
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { Accordion } from "../ui/accordion"
import { LinkItem } from "./link-item"

interface NavMainProps {
	navItems: NavItemType[]
}

export function NavMain({ navItems }: NavMainProps) {
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
