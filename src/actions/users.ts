import { invoke } from "@tauri-apps/api/core"
import db from "@/db/database"
import { session, user } from "@/db/schema"

export const createUser = async ({ username }: { username: string }) => {
	const token = await invoke<string>("generate_session_token")

	const [newUser] = await db.insert(user).values({ name: username }).returning()

	await db.insert(session).values({ user_id: newUser.id, token })
}
