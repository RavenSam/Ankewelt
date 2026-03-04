import { relations, sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import book from "./book"
import session from "./session"

const user = sqliteTable("user", {
	id: integer("id").primaryKey().unique(),
	name: text("name"),
	email: text("email").unique(),
	age: integer("age").default(18),
	city: text("city").default("NULL"),

	created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const userRelations = relations(user, ({ many }) => ({
	books: many(book),
	sessions: many(session),
}))

export default user
