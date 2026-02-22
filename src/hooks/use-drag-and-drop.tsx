import type { DragEndEvent, DragOverEvent, DragStartEvent, UniqueIdentifier } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useCallback, useRef, useState } from "react"
import type { Chapter, ChaptersState } from "types"

export const initialState: ChaptersState = {
	groups: [
		{ id: "act3", name: "Act III: The Void", collapsed: false },
		{ id: "act2", name: "Act II: Rising Action", collapsed: true },
		{ id: "act1", name: "Act I: The Setup", collapsed: true },
	],
	chapters: [
		{
			id: "ch24",
			number: 24,
			title: "The Horizon Event",
			subtitle: "The ship crosses into Sector 4.",
			wordCount: 4210,
			status: "Draft",
			lastModified: "Today, 10:42 AM",
			groupId: "act3",
		},
		{
			id: "ch23",
			number: 23,
			title: "Fracture",
			subtitle: "Elara discovers MIRA's hidden logs.",
			wordCount: 3840,
			status: "Revised",
			lastModified: "Yesterday, 4:15 PM",
			groupId: "act3",
		},
		{
			id: "ch22",
			number: 22,
			title: "Ghost Signals",
			subtitle: "First encounter with an anomaly.",
			wordCount: 5102,
			status: "Revised",
			lastModified: "Oct 12, 2023",
			groupId: "act3",
		},
		{
			id: "ch21",
			number: 21,
			title: "Departure",
			subtitle: "Leaving the Citadel behind.",
			wordCount: 4890,
			status: "Final",
			lastModified: "Oct 10, 2023",
			groupId: "act3",
		},
		// Act II chapters
		{
			id: "ch20",
			number: 20,
			title: "The Council",
			subtitle: "A meeting of factions.",
			wordCount: 3200,
			status: "Final",
			lastModified: "Oct 5, 2023",
			groupId: "act2",
		},
		{
			id: "ch19",
			number: 19,
			title: "Shattered Glass",
			subtitle: "Elara confronts her past.",
			wordCount: 4100,
			status: "Final",
			lastModified: "Sep 28, 2023",
			groupId: "act2",
		},
		{
			id: "ch18",
			number: 18,
			title: "Undercurrent",
			subtitle: "Secrets beneath the surface.",
			wordCount: 3750,
			status: "Revised",
			lastModified: "Sep 20, 2023",
			groupId: "act2",
		},
		// Act I chapters
		{
			id: "ch1",
			number: 1,
			title: "Awakening",
			subtitle: "The story begins.",
			wordCount: 2900,
			status: "Final",
			lastModified: "Aug 1, 2023",
			groupId: "act1",
		},
		{
			id: "ch2",
			number: 2,
			title: "First Light",
			subtitle: "A new world revealed.",
			wordCount: 3100,
			status: "Final",
			lastModified: "Aug 5, 2023",
			groupId: "act1",
		},
		// Ungrouped chapter
		{
			id: "chExtra",
			number: 25,
			title: "Epilogue",
			subtitle: "An untethered ending.",
			wordCount: 1200,
			status: "Draft",
			lastModified: "Today, 9:00 AM",
			groupId: null,
		},
	],
	rootOrder: ["act3", "act2", "act1", "chExtra"],
}

// ─── helpers ────────────────────────────────────────────────────────────────

/** Returns the groupId for a chapter id, or null if it's a group/ungrouped */
function getChapterGroupId(id: UniqueIdentifier, chapters: Chapter[]): string | null | undefined {
	// undefined = id is not a chapter at all (it's a group header)
	const ch = chapters.find((c) => c.id === id)
	if (!ch) return undefined
	return ch.groupId
}

function isGroupId(id: UniqueIdentifier, state: ChaptersState): boolean {
	return state.groups.some((g) => g.id === id)
}

/**
 * Given what the drag is currently "over", resolve the target groupId
 * for a chapter being dragged.
 *   - over a group header  → that group's id
 *   - over a chapter       → that chapter's groupId
 *   - over "ungrouped" droppable → null
 *   - over nothing         → undefined (don't change)
 */
function resolveTargetGroupId(overId: UniqueIdentifier, state: ChaptersState): string | null | undefined {
	// Both the free-zone button and the existing ungrouped section map to null
	if (overId === "ungrouped" || overId === "ungrouped-section") return null
	if (isGroupId(overId, state)) return overId as string
	const ch = state.chapters.find((c) => c.id === overId)
	if (ch) return ch.groupId
	return undefined
}

// ─── hook ───────────────────────────────────────────────────────────────────

export function useChaptersDnd() {
	const [state, setState] = useState<ChaptersState>(initialState)
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

	// Always-current ref so callbacks never need state in their deps
	const stateRef = useRef<ChaptersState>(initialState)
	stateRef.current = state

	// Snapshot taken at drag-start, used to restore on cancel
	const originalStateRef = useRef<ChaptersState>(initialState)

	// Read from live state for the overlay rendering, but expose the
	// drag-start snapshot so the UI can check the chapter's ORIGINAL groupId
	// without being fooled by live mutations during the drag.
	const activeChapter = activeId ? (state.chapters.find((c) => c.id === activeId) ?? null) : null

	const activeChapterAtDragStart = activeId
		? (originalStateRef.current.chapters.find((c) => c.id === activeId) ?? null)
		: null

	// ── drag start ─────────────────────────────────────────────────────────────
	const handleDragStart = useCallback((event: DragStartEvent) => {
		setActiveId(event.active.id)
		originalStateRef.current = stateRef.current // snapshot latest state via ref
	}, []) // stable forever — reads state through ref, not closure

	// ── drag over — THIS is where we do the live reordering ───────────────────
	const handleDragOver = useCallback((event: DragOverEvent) => {
		const { active, over } = event
		if (!over || active.id === over.id) return

		const activeId = active.id
		const overId = over.id

		setState((prev) => {
			// ── Case 1: dragging a GROUP ────────────────────────────────────────
			if (isGroupId(activeId, prev)) {
				const oldIndex = prev.rootOrder.indexOf(activeId as string)
				const newIndex = prev.rootOrder.indexOf(overId as string)
				if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev
				return {
					...prev,
					rootOrder: arrayMove(prev.rootOrder, oldIndex, newIndex),
				}
			}

			// ── Case 2: dragging a CHAPTER ──────────────────────────────────────
			const activeGroupId = getChapterGroupId(activeId, prev.chapters)
			if (activeGroupId === undefined) return prev // active is not a chapter

			const targetGroupId = resolveTargetGroupId(overId, prev)
			if (targetGroupId === undefined) return prev // can't resolve target

			const sameGroup = activeGroupId === targetGroupId

			if (sameGroup) {
				// Reorder within same group (or ungrouped list)
				if (isGroupId(overId, prev)) return prev // over group header → skip

				const groupChapters = prev.chapters.filter((c) => c.groupId === activeGroupId).map((c) => c.id)

				const oldIndex = groupChapters.indexOf(activeId as string)
				const newIndex = groupChapters.indexOf(overId as string)
				if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev

				const reordered = arrayMove(groupChapters, oldIndex, newIndex)
				const others = prev.chapters.filter((c) => c.groupId !== activeGroupId)
				const reorderedChapters = reordered.map((id) => prev.chapters.find((c) => c.id === id)!)

				// Also reorder rootOrder if these are ungrouped chapters
				let newRootOrder = prev.rootOrder
				if (activeGroupId === null) {
					const ungroupedIds = prev.chapters.filter((c) => c.groupId === null).map((c) => c.id)
					const ri = ungroupedIds.indexOf(activeId as string)
					const ni = ungroupedIds.indexOf(overId as string)
					if (ri !== -1 && ni !== -1) {
						const reorderedUngrouped = arrayMove(ungroupedIds, ri, ni)
						const withoutUngrouped = prev.rootOrder.filter((id) => !ungroupedIds.includes(id as string))
						const firstUngroupedIdx = prev.rootOrder.findIndex((id) => ungroupedIds.includes(id as string))
						newRootOrder = [...withoutUngrouped]
						newRootOrder.splice(
							firstUngroupedIdx !== -1 ? firstUngroupedIdx : newRootOrder.length,
							0,
							...reorderedUngrouped,
						)
					}
				}

				return {
					...prev,
					chapters: [...others, ...reorderedChapters],
					rootOrder: newRootOrder,
				}
			} else {
				// Move chapter to a different group (or ungrouped)
				const updatedChapters: Chapter[] = prev.chapters.map((c) =>
					c.id === activeId ? { ...c, groupId: targetGroupId } : c,
				)

				// Rebuild rootOrder cleanly instead of patching incrementally.
				// Keep all group ids (in their current order) + only chapter ids
				// that are ungrouped AFTER this move. Avoids ghost ids accumulating.
				const groupIds = prev.groups.map((g) => g.id)
				const ungroupedAfterMove = updatedChapters.filter((c) => c.groupId === null).map((c) => c.id)

				const reconciledOrder = prev.rootOrder.filter((id) => {
					if (groupIds.includes(id as string)) return true
					return ungroupedAfterMove.includes(id as string)
				})

				// If chapter just became ungrouped and isn't in the list yet, append it
				const newRootOrder =
					targetGroupId === null && !reconciledOrder.includes(activeId as string)
						? [...reconciledOrder, activeId as string]
						: reconciledOrder

				return {
					...prev,
					chapters: updatedChapters,
					rootOrder: newRootOrder,
				}
			}
		})
	}, [])

	// ── drag end — just clear active; state is already correct ────────────────
	const handleDragEnd = useCallback((_event: DragEndEvent) => {
		setActiveId(null)
	}, [])

	// ── drag cancel — restore original state ──────────────────────────────────
	const handleDragCancel = useCallback(() => {
		setState(originalStateRef.current)
		setActiveId(null)
	}, [])

	// ── other actions ─────────────────────────────────────────────────────────
	const toggleGroupCollapsed = useCallback((groupId: string) => {
		setState((prev) => ({
			...prev,
			groups: prev.groups.map((g) => (g.id === groupId ? { ...g, collapsed: !g.collapsed } : g)),
		}))
	}, [])

	const addChapter = useCallback(() => {
		setState((prev) => {
			const newId = `ch_${Date.now()}`
			const newChapter: Chapter = {
				id: newId,
				number: prev.chapters.length + 1,
				title: "Untitled Chapter",
				wordCount: 0,
				status: "Draft",
				lastModified: "Just now",
				groupId: null,
			}
			return {
				...prev,
				chapters: [...prev.chapters, newChapter],
				rootOrder: [...prev.rootOrder, newId],
			}
		})
	}, [])

	const getChaptersForGroup = useCallback(
		(groupId: string | null) => state.chapters.filter((c) => c.groupId === groupId),
		[state.chapters],
	)

	const getWordCountForGroup = useCallback(
		(groupId: string) => state.chapters.filter((c) => c.groupId === groupId).reduce((sum, c) => sum + c.wordCount, 0),
		[state.chapters],
	)

	return {
		state,
		activeId,
		activeChapter,
		activeChapterAtDragStart,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
		handleDragCancel,
		toggleGroupCollapsed,
		addChapter,
		getChaptersForGroup,
		getWordCountForGroup,
	}
}
