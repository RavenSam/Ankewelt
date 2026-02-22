import { relations, sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import book from "./book"

const location = sqliteTable("location", {
	id: text("id").primaryKey().unique(),

	book_id: text("book_id")
		.notNull()
		.references(() => book.id, { onDelete: "cascade" }),

	name: text("name").notNull(),
	description: text("description"),

	created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const locationRelations = relations(location, ({ one }) => ({
	book: one(book, {
		fields: [location.book_id],
		references: [book.id],
	}),
}))

export default location
