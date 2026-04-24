import {
	type DragEndEvent,
	type DragOverEvent,
	type DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useState } from "react"
import type { Chapter, Group } from "types"
import { saveChapterOrder } from "@/actions/save-chapter-order"

export type DndState = {
	groups: (Group & { chapters: Chapter[] })[]
	ungrouped: Chapter[]
}

export type ActiveItem =
	| { type: "chapter"; chapter: Chapter; containerId: string }
	| { type: "group"; group: Group & { chapters: Chapter[] } }
	| null

// ─── Container ID constants ───────────────────────────────────────────────────

export const UNGROUPED_CONTAINER_ID = "ungrouped" as const

// ─── Pure helper utilities ────────────────────────────────────────────────────

function findChapterContainer(state: DndState, chapterId: string): string {
	if (state.ungrouped.some((c) => c.id === chapterId)) return UNGROUPED_CONTAINER_ID

	const group = state.groups.find((g) => g.chapters.some((c) => c.id === chapterId))
	return group?.id ?? UNGROUPED_CONTAINER_ID
}

function resolveOverContainer(state: DndState, overId: string): string {
	if (overId === UNGROUPED_CONTAINER_ID) return UNGROUPED_CONTAINER_ID
	if (state.groups.some((g) => g.id === overId)) return overId
	return findChapterContainer(state, overId)
}

/** Pull a chapter out of whichever container currently holds it */
function removeChapter(state: DndState, chapterId: string, fromContainer: string): DndState {
	if (fromContainer === UNGROUPED_CONTAINER_ID) {
		return { ...state, ungrouped: state.ungrouped.filter((c) => c.id !== chapterId) }
	}
	return {
		...state,
		groups: state.groups.map((g) =>
			g.id === fromContainer ? { ...g, chapters: g.chapters.filter((c) => c.id !== chapterId) } : g,
		),
	}
}

function insertChapter(state: DndState, chapter: Chapter, toContainer: string, overItemId: string): DndState {
	const updatedChapter: Chapter = {
		...chapter,
		group_id: toContainer === UNGROUPED_CONTAINER_ID ? null : toContainer,
	}

	const insertInto = (list: Chapter[]): Chapter[] => {
		const overIndex = list.findIndex((c) => c.id === overItemId)
		if (overIndex === -1) return [...list, updatedChapter]
		return [...list.slice(0, overIndex), updatedChapter, ...list.slice(overIndex)]
	}

	if (toContainer === UNGROUPED_CONTAINER_ID) {
		return { ...state, ungrouped: insertInto(state.ungrouped) }
	}

	return {
		...state,
		groups: state.groups.map((g) => (g.id === toContainer ? { ...g, chapters: insertInto(g.chapters) } : g)),
	}
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDragAndDrop(initialState: DndState, bookId: string) {
	const [state, setState] = useState<DndState>(initialState)
	const [activeItem, setActiveItem] = useState<ActiveItem>(null)
	const isEmpty = state.groups.length === 0 && state.ungrouped.length === 0

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	// ── dragStart: capture what is being dragged ──────────────────────────────

	function onDragStart({ active }: DragStartEvent) {
		const type = active.data.current?.type as "chapter" | "group" | undefined

		if (type === "group") {
			const group = state.groups.find((g) => g.id === active.id)
			if (group) setActiveItem({ type: "group", group })
			return
		}

		// Default to chapter
		const chapterId = active.id as string
		const containerId = findChapterContainer(state, chapterId)
		const source =
			containerId === UNGROUPED_CONTAINER_ID
				? state.ungrouped
				: (state.groups.find((g) => g.id === containerId)?.chapters ?? [])
		const chapter = source.find((c) => c.id === chapterId)
		if (chapter) setActiveItem({ type: "chapter", chapter, containerId })
	}

	// ── dragOver: live cross-container chapter movement ───────────────────────

	function onDragOver({ active, over }: DragOverEvent) {
		if (!over || !activeItem || activeItem.type === "group") return

		const activeId = active.id as string
		const overId = over.id as string

		const activeContainer = findChapterContainer(state, activeId)
		const overContainer = resolveOverContainer(state, overId)

		// Same container → the SortableContext handles reordering live
		if (activeContainer === overContainer) return

		setState((prev) => {
			const prevActiveContainer = findChapterContainer(prev, activeId)
			const sourceList =
				prevActiveContainer === UNGROUPED_CONTAINER_ID
					? prev.ungrouped
					: (prev.groups.find((g) => g.id === prevActiveContainer)?.chapters ?? [])

			const chapter = sourceList.find((c) => c.id === activeId)
			if (!chapter) return prev

			let next = removeChapter(prev, activeId, prevActiveContainer)
			next = insertChapter(next, chapter, overContainer, overId)
			return next
		})
	}

	// ── dragEnd: finalise position ────────────────────────────────────────────

	function onDragEnd({ active, over }: DragEndEvent) {
		const snapshot = activeItem
		setActiveItem(null)

		if (!over) return

		const activeId = active.id as string
		const overId = over.id as string

		// ── Group reorder ────────────────────────────────────────────────────────
		if (snapshot?.type === "group") {
			if (activeId === overId) return
			const oldIndex = state.groups.findIndex((g) => g.id === activeId)
			const newIndex = state.groups.findIndex((g) => g.id === overId)
			if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return
			const next = { ...state, groups: arrayMove(state.groups, oldIndex, newIndex) }
			setState(next)
			saveChapterOrder(bookId, next).catch(console.error)
			return
		}

		const originalContainer = snapshot?.type === "chapter" ? snapshot.containerId : null
		const currentContainer = findChapterContainer(state, activeId)

		// Cross-container: position already correct in state — just persist.
		if (originalContainer !== currentContainer) {
			saveChapterOrder(bookId, state).catch(console.error)
			return
		}

		// Same-container reorder
		let next: DndState

		if (currentContainer === UNGROUPED_CONTAINER_ID) {
			const oldIndex = state.ungrouped.findIndex((c) => c.id === activeId)
			const newIndex = state.ungrouped.findIndex((c) => c.id === overId)
			if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return
			next = { ...state, ungrouped: arrayMove(state.ungrouped, oldIndex, newIndex) }
		} else {
			next = {
				...state,
				groups: state.groups.map((g) => {
					if (g.id !== currentContainer) return g
					const oldIndex = g.chapters.findIndex((c) => c.id === activeId)
					const newIndex = g.chapters.findIndex((c) => c.id === overId)
					if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return g
					return { ...g, chapters: arrayMove(g.chapters, oldIndex, newIndex) }
				}),
			}
		}

		setState(next)
		saveChapterOrder(bookId, next).catch(console.error)
	}

	// ── Toggle group collapsed ────────────────────────────────────────────────

	const toggleGroupCollapsed = (groupId: string) => {
		setState((prev) => ({
			...prev,
			groups: prev.groups.map((g) => (g.id === groupId ? { ...g, collapsed: !g.collapsed } : g)),
		}))
	}

	// ── Ungroup a chapter (move it to ungrouped, appended at the end) ─────────

	const ungroupChapter = (chapterId: string) => {
		setState((prev) => {
			const container = findChapterContainer(prev, chapterId)
			if (container === UNGROUPED_CONTAINER_ID) return prev

			const chapter = prev.groups.find((g) => g.id === container)?.chapters.find((c) => c.id === chapterId)
			if (!chapter) return prev

			const withoutChapter = removeChapter(prev, chapterId, container)
			const next = {
				...withoutChapter,
				ungrouped: [...withoutChapter.ungrouped, { ...chapter, group_id: null }],
			}
			saveChapterOrder(bookId, next).catch(console.error)
			return next
		})
	}

	return {
		state,
		setState,
		activeItem,
		sensors,
		onDragStart,
		onDragOver,
		onDragEnd,
		toggleGroupCollapsed,
		ungroupChapter,
		isEmpty,
	}
}
