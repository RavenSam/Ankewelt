import { createFileRoute, redirect } from "@tanstack/react-router"
import { getCurrentUser } from "@/helpers/get-current-user"

export const Route = createFileRoute("/")({
	loader: async () => {
		const currentUser = await getCurrentUser()

		if (currentUser) {
			throw redirect({ to: "/dashboard" })
		}

		return {}
	},
	component: HomePage,
})

function HomePage() {
	// const { currentUser } = Route.useLoaderData()

	// React.useEffect(() => {
	// 	async function runSeeder() {
	// 		try {
	// 			await seed()
	// 			console.log("Database seeded successfully")
	// 		} catch (error) {
	// 			console.error("Error seeding database:", error)
	// 		}
	// 	}
	// 	runSeeder()
	// }, []

	return (
		<div className="flex items-center justify-center flex-col">
			<h1 className="text-4xl">On Boarding</h1>
		</div>
	)
}
