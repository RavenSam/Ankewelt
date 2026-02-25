import { createRootRoute, Outlet } from "@tanstack/react-router"
import type { NavItemType } from "types"
import { AppSidebar } from "@/components/nav/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getNavbarData } from "@/helpers/get-navbar-data"

export const Route = createRootRoute({
	loader: async () => {
		if (typeof document === "undefined") {
			return { sidebarOpen: true }
		}

		const match = document.cookie.split("; ").find((row) => row.startsWith("sidebar_state="))

		if (!match) {
			return { sidebarOpen: true }
		}

		const userId = "1"
		const navItems: NavItemType[] = await getNavbarData(userId)

		const value = match.split("=")[1]
		return { sidebarOpen: value === "true", navItems }
	},

	component: RootLayout,
})

function RootLayout() {
	const { sidebarOpen, navItems } = Route.useLoaderData()

	return (
		<SidebarProvider defaultOpen={sidebarOpen}>
			<AppSidebar variant="inset" navItems={navItems || []} />

			<SidebarInset className="overflow-hidden">
				<div className="flex flex-1 flex-col">
					<div className="max-w-7xl mx-auto w-full">
						<Outlet />
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
