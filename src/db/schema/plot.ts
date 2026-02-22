import { relations, sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import book from "./book"

const plot = sqliteTable("plot", {
	id: text("id").primaryKey().unique(),

	book_id: text("book_id")
		.notNull()
		.references(() => book.id, { onDelete: "cascade" }),

	title: text("title").notNull(),
	description: text("description"),

	created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const plotRelations = relations(plot, ({ one }) => ({
	book: one(book, {
		fields: [plot.book_id],
		references: [book.id],
	}),
}))

export default plot
