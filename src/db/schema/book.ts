import { relations, sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import chapter from "./chapter"
import chapterGroup from "./chapter-group"
import character from "./character"
import location from "./location"
import plot from "./plot"
import user from "./user"

const book = sqliteTable("book", {
	id: text("id").primaryKey().unique(),
	user_id: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	title: text("title").notNull(),
	description: text("description"),

	genre: text("genre"), // Sci-Fi, Fantasy...
	status: text("status").default("active"),
	// active | completed | archived

	coverUrl: text("cover_url"),
	bannerUrl: text("banner_url"),

	is_public: integer("is_public", { mode: "boolean" }).default(false).notNull(),

	word_count: integer("word_count").default(0).notNull(),
	goal_words: integer("goal_words").default(100000),

	created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const bookRelations = relations(book, ({ one, many }) => ({
	author: one(user, {
		fields: [book.user_id],
		references: [user.id],
	}),
	characters: many(character),
	chapters: many(chapter),
	chapterGroups: many(chapterGroup),
	locations: many(location),
	plots: many(plot),
}))

export default book
