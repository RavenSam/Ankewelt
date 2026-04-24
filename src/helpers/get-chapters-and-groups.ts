import type { Book, Chapter, Group } from "types"

export type BookWithChapters = Book & {
	chapters: Chapter[]
	chapterGroups: Group[]
}

export function transformBookToDnd(bookData: BookWithChapters) {
	// ✅ Always fallback to empty arrays
	const chapters = bookData.chapters ?? []
	const chapterGroups = bookData.chapterGroups ?? []

	const chaptersById = new Map(chapters.map((c) => [c.id, c]))
	const groupsById = new Map(chapterGroups.map((g) => [g.id, g]))

	// Track used chapters to avoid duplicates
	const usedChapterIds = new Set<string>()

	// -----------------------------
	// 1️⃣ GROUPS
	// -----------------------------
	const orderedGroupIds = safeArray(bookData.chapters_groupes_order)

	const groups: ReturnType<typeof buildGroup>[] = []

	// Ordered groups
	for (const groupId of orderedGroupIds) {
		const group = groupsById.get(groupId)
		if (!group) continue

		groups.push(buildGroup(group, chaptersById, usedChapterIds))
	}

	// Missing groups (not in order array)
	for (const group of chapterGroups) {
		if (!orderedGroupIds.includes(group.id)) {
			groups.push(buildGroup(group, chaptersById, usedChapterIds))
		}
	}

	// -----------------------------
	// 2️⃣ UNGROUPED
	// -----------------------------
	const orderedUngroupedIds = safeArray(bookData.ungrouped_chapters_order)

	const ungrouped: Chapter[] = []

	// Ordered ungrouped
	for (const chId of orderedUngroupedIds) {
		const chapter = chaptersById.get(chId)
		if (!chapter) continue
		if (usedChapterIds.has(chId)) continue

		ungrouped.push(chapter)
		usedChapterIds.add(chId)
	}

	// Remaining ungrouped
	for (const chapter of chapters) {
		if (usedChapterIds.has(chapter.id)) continue

		if (!chapter.group_id || !groupsById.has(chapter.group_id)) {
			ungrouped.push(chapter)
			usedChapterIds.add(chapter.id)
		}
	}

	// -----------------------------
	// ✅ Final guarantee
	// -----------------------------
	return {
		groups,
		ungrouped,
	}
}

// ----------------------------------
// 🧩 GROUP BUILDER (robust)
// ----------------------------------
function buildGroup(group: Group, chaptersById: Map<string, Chapter>, usedChapterIds: Set<string>) {
	const orderedChapterIds = safeArray(group.chapters_order)

	const chapters: Chapter[] = []

	// Ordered chapters
	for (const chId of orderedChapterIds) {
		const chapter = chaptersById.get(chId)
		if (!chapter) continue
		if (usedChapterIds.has(chId)) continue

		chapters.push(chapter)
		usedChapterIds.add(chId)
	}

	// Missing chapters belonging to this group
	for (const chapter of chaptersById.values()) {
		if (usedChapterIds.has(chapter.id)) continue

		if (chapter.group_id === group.id) {
			chapters.push(chapter)
			usedChapterIds.add(chapter.id)
		}
	}

	return {
		...group,
		id: group.id,
		name: group.name,
		collapsed: Boolean(group.collapsed),
		chapters,
	}
}

// ----------------------------------
// 🛡️ Small utility
// ----------------------------------
function safeArray<T>(value: T[] | null | undefined): T[] {
	if (!Array.isArray(value)) return []
	return value.filter(Boolean)
}
