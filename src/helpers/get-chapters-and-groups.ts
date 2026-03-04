import type { Book, Chapter, Group } from "types"

export type BookWithChapters = Book & {
	chapters: Chapter[]
	chapterGroups: Group[]
}

export function transformBookToDnd(bookData: BookWithChapters) {
	const chaptersById = new Map(bookData.chapters.map((c) => [c.id, c]))

	const groupsById = new Map(bookData.chapterGroups.map((g) => [g.id, g]))

	// 1️⃣ Sort Groups According To Book Order
	const groups = []

	const orderedGroupIds = bookData.chapters_groupes_order ?? []

	for (const groupId of orderedGroupIds) {
		const group = groupsById.get(groupId)
		if (!group) continue

		groups.push(buildGroup(group, chaptersById))
	}

	// Append any groups missing from order array
	for (const group of bookData.chapterGroups) {
		if (!orderedGroupIds.includes(group.id)) {
			groups.push(buildGroup(group, chaptersById))
		}
	}

	// 2️⃣ Sort Ungrouped Chapters According To Book Order
	const ungrouped = []

	const orderedUngroupedIds = bookData.ungrouped_chapters_order ?? []

	for (const chId of orderedUngroupedIds) {
		const chapter = chaptersById.get(chId)
		if (chapter) ungrouped.push(chapter)
	}

	// Append missing ungrouped chapters
	for (const chapter of bookData.chapters) {
		if (chapter.group_id === null && !orderedUngroupedIds.includes(chapter.id)) {
			ungrouped.push(chapter)
		}
	}

	return {
		groups,
		ungrouped,
	}
}

function buildGroup(group: Group, chaptersById: Map<string, Chapter>) {
	const chapters = []

	const orderedChapterIds = group.chapters_order ?? []

	for (const chId of orderedChapterIds) {
		const chapter = chaptersById.get(chId)
		if (chapter) chapters.push(chapter)
	}

	// Append missing chapters that belong to this group
	for (const chapter of chaptersById.values()) {
		if (chapter.group_id === group.id && !orderedChapterIds.includes(chapter.id)) {
			chapters.push(chapter)
		}
	}

	return {
		...group,
		id: group.id,
		name: group.name,
		collapsed: group.collapsed,
		chapters,
	}
}
