import { createRootRoute, Outlet } from "@tanstack/react-router"
import { AppSidebar } from "@/components/nav/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const Route = createRootRoute({
	loader: () => {
		if (typeof document === "undefined") {
			return { sidebarOpen: true }
		}

		const match = document.cookie.split("; ").find((row) => row.startsWith("sidebar_state="))

		if (!match) {
			return { sidebarOpen: true }
		}

		const value = match.split("=")[1]
		return { sidebarOpen: value === "true" }
	},

	component: RootLayout,
})

function RootLayout() {
	const { sidebarOpen } = Route.useLoaderData()

	return (
		<SidebarProvider defaultOpen={sidebarOpen}>
			<AppSidebar variant="inset" />
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
