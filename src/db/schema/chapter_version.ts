import { relations, sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import chapter from "./chapter"

const chapterVersion = sqliteTable("chapter_version", {
	id: text("id").primaryKey().unique(),

	chapter_id: text("chapter_id")
		.notNull()
		.references(() => chapter.id, { onDelete: "cascade" }),

	version_number: integer("version_number").notNull(),

	title_snapshot: text("title_snapshot").notNull(),
	// in case title changes later

	content: text("content").notNull(),

	wordCount: integer("word_count").notNull(),

	created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const chapterRelations = relations(chapterVersion, ({ one }) => ({
	chapter: one(chapter, {
		fields: [chapterVersion.chapter_id],
		references: [chapter.id],
	}),
}))

export default chapterVersion
