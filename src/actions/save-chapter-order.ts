import { eq } from "drizzle-orm"
import db from "@/db/database"
import { book, chapter, chapterGroup } from "@/db/schema"
import type { DndState } from "@/hooks/use-drag-and-drop"

export async function saveChapterOrder(bookId: string, state: DndState): Promise<void> {
	// Flatten all chapters with their resolved group_id so we can batch-update
	// in one pass — avoids needing to diff against previous state.
	const allChapters: { id: string; group_id: string | null }[] = [
		...state.ungrouped.map((c) => ({ id: c.id, group_id: null })),
		...state.groups.flatMap((g) => g.chapters.map((c) => ({ id: c.id, group_id: g.id }))),
	]

	await db.transaction(async (tx) => {
		// ── 1 & 2. Book-level ordering ──────────────────────────────────────────
		await tx
			.update(book)
			.set({
				ungrouped_chapters_order: state.ungrouped.map((c) => c.id),
				chapters_groupes_order: state.groups.map((g) => g.id),
			})
			.where(eq(book.id, bookId))

		// ── 3. Per-group chapter ordering ───────────────────────────────────────
		for (const group of state.groups) {
			await tx
				.update(chapterGroup)
				.set({ chapters_order: group.chapters.map((c) => c.id) })
				.where(eq(chapterGroup.id, group.id))
		}

		// ── 4. Chapter group_id (cross-container moves) ─────────────────────────
		for (const { id, group_id } of allChapters) {
			await tx.update(chapter).set({ group_id }).where(eq(chapter.id, id))
		}
	})
}
