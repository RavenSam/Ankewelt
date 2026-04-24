import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import db from "@/db/database"
import { chapter, chapterGroup, chapterVersion } from "@/db/schema"

function countWords(content: string) {
	return content.trim().split(/\s+/).length
}

export async function createChapter(input: {
	bookId: string
	groupId?: string | null
	title: string
	content?: string
	chapterNumber: number
}) {
	return db.transaction(async (tx) => {
		const chapterId = nanoid()
		const versionId = nanoid()

		const content = input.content ?? ""
		const wordCount = countWords(content)

		// 1. create chapter
		await tx.insert(chapter).values({
			id: chapterId,
			book_id: input.bookId,
			group_id: input.groupId ?? null,
			title: input.title,
			chapterNumber: input.chapterNumber,
			word_count: wordCount,
			status: "draft",
			currentVersionId: versionId,
		})

		// 2. create version 0
		await tx.insert(chapterVersion).values({
			id: versionId,
			chapter_id: chapterId,
			version_number: 0,
			title_snapshot: input.title,
			content,
			wordCount,
		})

		// 3. update group ordering (if grouped)
		if (input.groupId) {
			const group = await tx.query.chapterGroup.findFirst({
				where: eq(chapterGroup.id, input.groupId),
			})

			if (group) {
				await tx
					.update(chapterGroup)
					.set({
						chapters_order: [...group.chapters_order, chapterId],
					})
					.where(eq(chapterGroup.id, input.groupId))
			}
		}

		return chapterId
	})
}
