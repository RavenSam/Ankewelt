import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import db from "@/db/database"
import { book, chapter, chapterGroup, chapterVersion } from "@/db/schema"

function countWords(content: string) {
	return content.trim().split(/\s+/).filter(Boolean).length
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

// ─── Delete chapter versions (or entire chapter) ──────────────────────────────

export async function deleteChapterVersions(chapterId: string, versionIds: string[]) {
	return db.transaction(async (tx) => {
		const target = await tx.query.chapter.findFirst({
			where: eq(chapter.id, chapterId),
			with: { versions: true },
		})
		if (!target) throw new Error("Chapter not found")

		const allVersionIds = target.versions.map((v) => v.id)
		const isDeletingAll =
			allVersionIds.length > 0 && allVersionIds.every((id) => versionIds.includes(id))

		if (isDeletingAll) {
			// Remove from ordering
			if (target.group_id) {
				const group = await tx.query.chapterGroup.findFirst({
					where: eq(chapterGroup.id, target.group_id),
				})
				if (group) {
					const newOrder = group.chapters_order.filter((id) => id !== chapterId)
					await tx
						.update(chapterGroup)
						.set({ chapters_order: newOrder })
						.where(eq(chapterGroup.id, group.id))
				}
			} else {
				const parentBook = await tx.query.book.findFirst({
					where: eq(book.id, target.book_id),
				})
				if (parentBook) {
					const newOrder = parentBook.ungrouped_chapters_order.filter((id) => id !== chapterId)
					await tx
						.update(book)
						.set({ ungrouped_chapters_order: newOrder })
						.where(eq(book.id, parentBook.id))
				}
			}

			// Delete chapter (versions cascade)
			await tx.delete(chapter).where(eq(chapter.id, chapterId))
		} else {
			// Delete only selected versions
			for (const vId of versionIds) {
				await tx.delete(chapterVersion).where(eq(chapterVersion.id, vId))
			}

			// If current version was deleted, reassign
			if (target.currentVersionId && versionIds.includes(target.currentVersionId)) {
				const remaining = target.versions.filter((v) => !versionIds.includes(v.id))
				const newCurrentId = remaining.length > 0 ? remaining[remaining.length - 1].id : null
				await tx
					.update(chapter)
					.set({ currentVersionId: newCurrentId })
					.where(eq(chapter.id, chapterId))
			}
		}
	})
}

// ─── Rename a chapter group ───────────────────────────────────────────────────

export async function renameGroup(groupId: string, name: string) {
	return await db
		.update(chapterGroup)
		.set({ name, updated_at: new Date().toISOString() })
		.where(eq(chapterGroup.id, groupId))
		.returning()
		.then((res) => res[0])
}

// ─── Delete a chapter group ───────────────────────────────────────────────────

export async function deleteGroup(groupId: string) {
	return db.transaction(async (tx) => {
		const group = await tx.query.chapterGroup.findFirst({
			where: eq(chapterGroup.id, groupId),
		})
		if (!group) throw new Error("Group not found")

		const parentBook = await tx.query.book.findFirst({
			where: eq(book.id, group.book_id),
		})

		// Move group's chapters to ungrouped
		const chapterIds = group.chapters_order

		if (parentBook) {
			// Remove group from groups order
			const newGroupsOrder = parentBook.chapters_groupes_order.filter((id) => id !== groupId)
			// Append chapters to ungrouped
			const newUngroupedOrder = [...parentBook.ungrouped_chapters_order, ...chapterIds]

			await tx
				.update(book)
				.set({
					chapters_groupes_order: newGroupsOrder,
					ungrouped_chapters_order: newUngroupedOrder,
				})
				.where(eq(book.id, parentBook.id))
		}

		// Delete the group (FK sets chapters' group_id to null via onDelete: "set null")
		await tx.delete(chapterGroup).where(eq(chapterGroup.id, groupId))
	})
}

// ─── Move a chapter to a different group ──────────────────────────────────────

export async function moveChapterToGroup(chapterId: string, newGroupId: string | null) {
	return db.transaction(async (tx) => {
		const target = await tx.query.chapter.findFirst({
			where: eq(chapter.id, chapterId),
		})
		if (!target) throw new Error("Chapter not found")

		const oldGroupId = target.group_id

		// Remove from old container ordering
		if (oldGroupId) {
			const oldGroup = await tx.query.chapterGroup.findFirst({
				where: eq(chapterGroup.id, oldGroupId),
			})
			if (oldGroup) {
				const newOrder = oldGroup.chapters_order.filter((id) => id !== chapterId)
				await tx
					.update(chapterGroup)
					.set({ chapters_order: newOrder })
					.where(eq(chapterGroup.id, oldGroupId))
			}
		} else {
			const parentBook = await tx.query.book.findFirst({
				where: eq(book.id, target.book_id),
			})
			if (parentBook) {
				const newOrder = parentBook.ungrouped_chapters_order.filter((id) => id !== chapterId)
				await tx
					.update(book)
					.set({ ungrouped_chapters_order: newOrder })
					.where(eq(book.id, parentBook.id))
			}
		}

		// Add to new container ordering
		if (newGroupId) {
			const newGroup = await tx.query.chapterGroup.findFirst({
				where: eq(chapterGroup.id, newGroupId),
			})
			if (newGroup) {
				await tx
					.update(chapterGroup)
					.set({
						chapters_order: [...newGroup.chapters_order, chapterId],
					})
					.where(eq(chapterGroup.id, newGroupId))
			}
		} else {
			const parentBook = await tx.query.book.findFirst({
				where: eq(book.id, target.book_id),
			})
			if (parentBook) {
				await tx
					.update(book)
					.set({
						ungrouped_chapters_order: [...parentBook.ungrouped_chapters_order, chapterId],
					})
					.where(eq(book.id, parentBook.id))
			}
		}

		// Update chapter's group_id
		await tx
			.update(chapter)
			.set({ group_id: newGroupId })
			.where(eq(chapter.id, chapterId))
	})
}

// ─── Create a new group ───────────────────────────────────────────────────────

export async function createGroup(bookId: string, name: string) {
	return db.transaction(async (tx) => {
		const groupId = nanoid()

		await tx.insert(chapterGroup).values({
			id: groupId,
			book_id: bookId,
			name,
			collapsed: false,
			chapters_order: [],
		})

		const parentBook = await tx.query.book.findFirst({
			where: eq(book.id, bookId),
		})
		if (parentBook) {
			await tx
				.update(book)
				.set({
					chapters_groupes_order: [...parentBook.chapters_groupes_order, groupId],
				})
				.where(eq(book.id, bookId))
		}

		return groupId
	})
}

// ─── Create a group and move a chapter into it at once ────────────────────────

export async function createGroupAndMoveChapter(bookId: string, name: string, chapterId: string) {
	return db.transaction(async (tx) => {
		const target = await tx.query.chapter.findFirst({
			where: eq(chapter.id, chapterId),
		})
		if (!target) throw new Error("Chapter not found")

		const groupId = nanoid()

		// Create group
		await tx.insert(chapterGroup).values({
			id: groupId,
			book_id: bookId,
			name,
			collapsed: false,
			chapters_order: [chapterId],
		})

		// Remove chapter from old container
		const oldGroupId = target.group_id
		if (oldGroupId) {
			const oldGroup = await tx.query.chapterGroup.findFirst({
				where: eq(chapterGroup.id, oldGroupId),
			})
			if (oldGroup) {
				const newOrder = oldGroup.chapters_order.filter((id) => id !== chapterId)
				await tx
					.update(chapterGroup)
					.set({ chapters_order: newOrder })
					.where(eq(chapterGroup.id, oldGroupId))
			}
		} else {
			const parentBook = await tx.query.book.findFirst({
				where: eq(book.id, target.book_id),
			})
			if (parentBook) {
				const newOrder = parentBook.ungrouped_chapters_order.filter((id) => id !== chapterId)
				await tx
					.update(book)
					.set({ ungrouped_chapters_order: newOrder })
					.where(eq(book.id, parentBook.id))
			}
		}

		// Update chapter
		await tx
			.update(chapter)
			.set({ group_id: groupId })
			.where(eq(chapter.id, chapterId))

		// Add group to book's order
		const parentBook = await tx.query.book.findFirst({
			where: eq(book.id, bookId),
		})
		if (parentBook) {
			await tx
				.update(book)
				.set({
					chapters_groupes_order: [...parentBook.chapters_groupes_order, groupId],
				})
				.where(eq(book.id, bookId))
		}

		return groupId
	})
}
