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

export type ChapterStatus = "Draft" | "Revised" | "Final" | "Outline"

export interface Chapter {
	id: string
	number: number
	title: string
	subtitle?: string
	wordCount: number
	status: ChapterStatus
	lastModified: string
	groupId: string | null // null = ungrouped
}

export interface Group {
	id: string
	name: string
	collapsed: boolean
}

export interface ChaptersState {
	groups: Group[]
	chapters: Chapter[]
	rootOrder: string[]
}
