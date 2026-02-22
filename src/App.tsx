import { useEffect } from "react"
import db from "@/db/database"
import seed from "@/db/seed"

function App() {
	async function _runUserQuery() {
		const user = await db.query.user.findFirst({
			with: {
				posts: {
					with: {
						comments: true,
					},
				},
			},
		})
		return JSON.stringify(user, null, 2)
	}

	async function _runPostQuery() {
		const posts = await db.query.post.findMany({
			with: { author: true },
		})
		return JSON.stringify(posts, null, 2)
	}

	useEffect(() => {
		async function runSeeder() {
			try {
				await seed()
				console.log("Database seeded successfully")
			} catch (error) {
				console.error("Error seeding database:", error)
			}
		}
		runSeeder()
	}, [])

	return (
		<main className="container">
			<h1 className="text-6xl text-red-500">Welcome to Tauri + React + Drizzle</h1>
		</main>
	)
}

export default App
