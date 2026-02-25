import type { book, chapter, chapterGroup } from "@/db/schema"

export type NavItemType = {
	label: string
	href: string
	icon: string
	items?: NavItemType[]
}

export type NavBookType = {
	id: string
	title: string
	chapters_order: string
	chapters: {
		id: string
		title: string
	}[]
	characters: {
		id: string
		name: string
	}[]
	locations: {
		id: string
		name: string
	}[]
	plots: {
		id: string
		name: string
	}[]
}

export type Chapter = typeof chapter.$inferSelect

export type Group = typeof chapterGroup.$inferSelect

export type Book = typeof book.$inferSelect

export interface ChaptersState {
	groups: Group[]
	chapters: Chapter[]
	rootOrder: string[]
}
