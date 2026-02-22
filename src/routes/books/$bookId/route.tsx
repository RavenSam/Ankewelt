import { createFileRoute, Outlet } from "@tanstack/react-router"
import { BookHeader } from "../-components/book-header"
import { BookNavigation } from "../-components/book-navigation"

export const Route = createFileRoute("/books/$bookId")({
	component: BookLayout,
})

function BookLayout() {
	return (
		<div className="min-h-screen bg-background text-foreground p-6 lg:p-12">
			<div className=" mx-auto space-y-8">
				<BookHeader />

				<BookNavigation />

				<div>
					<Outlet />
				</div>
			</div>
		</div>
	)
}
