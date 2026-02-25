import { createFileRoute, redirect } from "@tanstack/react-router"
import db from "@/db/database"

export const Route = createFileRoute("/")({
	loader: async () => {
		const users = await db.query.user.findMany()

		if (users.length > 0) {
			throw redirect({ to: "/dashboard" })
		}

		return { users }
	},
	component: HomePage,
})

function HomePage() {
	const { users } = Route.useLoaderData()

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
	// }, [])

	return (
		<div className="flex items-center justify-center flex-col">
			<p className="text-muted font-semibold">{users.length} users found</p>
			<h1 className="text-4xl">On Boarding</h1>
		</div>
	)
}
