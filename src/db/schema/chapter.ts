import { relations, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core"
import book from "./book"
import chapterVersion from "./chapter_version"
import chapterGroup from "./chapter-group"

const chapter = sqliteTable("chapter", {
	id: text("id").primaryKey().unique(),

	book_id: text("book_id")
		.notNull()
		.references(() => book.id, { onDelete: "cascade" }),

	group_id: text("group_id").references(() => chapterGroup.id, {
		onDelete: "set null", // ungrouped when group is deleted
	}),

	title: text("title").notNull(),
	chapterNumber: integer("chapter_number").notNull(), // REMOVE THI SHIT
	word_count: integer("word_count").notNull(),

	status: text("status").default("draft"),

	currentVersionId: text("current_version_id"),

	created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const chapterRelations = relations(chapter, ({ one, many }) => ({
	book: one(book, {
		fields: [chapter.book_id],
		references: [book.id],
	}),
	group: one(chapterGroup, {
		fields: [chapter.group_id],
		references: [chapterGroup.id],
	}),
	versions: many(chapterVersion),
}))

export const chapterVersionIdx = index("chapter_version_idx").on(chapterVersion.chapter_id)

export const chapterVersionUnique = uniqueIndex("chapter_version_unique").on(
	chapterVersion.chapter_id,
	chapterVersion.version_number,
)

export default chapter
