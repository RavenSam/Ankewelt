import { relations, sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import book from "./book"
import chapter from "./chapter"

const chapterGroup = sqliteTable("chapter_group", {
	id: text("id").primaryKey().unique(),
	book_id: text("book_id")
		.notNull()
		.references(() => book.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	collapsed: integer("collapsed", { mode: "boolean" }).notNull().default(false),
	chapters_order: text("chapters_order", { mode: "json" })
		.$type<string[]>()
		.notNull()
		.default(sql`'[]'`), // list of ids of the chapter for DnD
	created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const groupRelations = relations(chapterGroup, ({ one, many }) => ({
	book: one(book, {
		fields: [chapterGroup.book_id],
		references: [book.id],
	}),
	chapters: many(chapter),
}))

export default chapterGroup
