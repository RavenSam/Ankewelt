import { relations, sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import book from "./book"

const character = sqliteTable("character", {
	id: text("id").primaryKey().unique(),

	book_id: text("book_id")
		.notNull()
		.references(() => book.id, { onDelete: "cascade" }),

	name: text("name").notNull(),
	role: text("role"), // Protagonist, Antagonist, etc.
	description: text("description"),

	created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const characterRelations = relations(character, ({ one }) => ({
	book: one(book, {
		fields: [character.book_id],
		references: [book.id],
	}),
}))

export default character
