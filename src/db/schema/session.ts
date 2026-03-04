import { relations, sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import user from "./user"

const session = sqliteTable("session", {
	id: integer("id").primaryKey({ autoIncrement: true }),

	user_id: integer("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	token: text("token").notNull().unique(),

	created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.user_id],
		references: [user.id],
	}),
}))

export default session
