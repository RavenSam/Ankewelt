import { eq, type InferInsertModel, type InferSelectModel } from "drizzle-orm"
import db from "@/db/database"
import { book } from "@/db/schema"

export type Book = InferSelectModel<typeof book>
export type NewBook = InferInsertModel<typeof book>

export async function createBook(data: NewBook) {
	return await db
		.insert(book)
		.values({
			...data,
			updated_at: new Date().toISOString(),
		})
		.returning()
		.then((res) => res[0])
}

export async function getBookById(id: string) {
	return await db.query.book.findFirst({
		where: eq(book.id, id),
	})
}

export async function getBooksByUser(userId: string) {
	return await db.query.book.findMany({
		where: eq(book.user_id, userId),
	})
}

export async function updateBook(id: string, data: Partial<NewBook>) {
	return await db
		.update(book)
		.set({
			...data,
			updated_at: new Date().toISOString(),
		})
		.where(eq(book.id, id))
		.returning()
		.then((res) => res[0])
}

export async function deleteBook(id: string) {
	return await db
		.delete(book)
		.where(eq(book.id, id))
		.returning()
		.then((res) => res[0])
}
