import { desc, eq } from "drizzle-orm"
import db from "@/db/database"
import { session, user } from "@/db/schema"

export async function getCurrentUser() {
	const currentSession = await db.select().from(session).orderBy(desc(session.id)).limit(1)

	if (!currentSession.length) return null

	const currentUser = await db.select().from(user).where(eq(user.id, currentSession[0].user_id)).limit(1)

	return currentUser[0] ?? null
}
