import { desc, eq } from "drizzle-orm"
import db from "@/db/database"
import * as schema from "@/db/schema"

export async function getNavbarData(userId: string) {
	const booksData = await db.query.book.findMany({
		where: eq(schema.book.user_id, userId),
		with: {
			chapters: {
				orderBy: [desc(schema.chapter.updated_at)],
			},
			characters: {
				orderBy: [desc(schema.character.updated_at)],
			},
			locations: {
				orderBy: [desc(schema.location.updated_at)],
			},
		},
	})

	// Build the dynamic Book items
	const dynamicBooks = booksData.map((book) => ({
		label: book.title,
		href: `/books/${book.id}`,
		icon: "BookText",
		items: [
			{
				label: "Chapters",
				href: `/books/${book.id}/chapters`,
				icon: "FilesIcon",
				items: book.chapters.map((chap) => ({
					label: chap.title,
					href: `/chapters/${chap.id}`,
					icon: "FileTextIcon",
				})),
			},
			{
				label: "Characters",
				href: `/books/${book.id}/characters`,
				icon: "UsersIcon",
				items: book.characters.map((chap) => ({
					label: chap.name,
					href: `/characters/${chap.id}`,
					icon: "UserIcon",
				})),
			},
			{
				label: "Locations",
				href: `/books/${book.id}/locations`,
				icon: "CompassIcon",
				items: book.locations.map((chap) => ({
					label: chap.name,
					href: `/locations/${chap.id}`,
					icon: "MapPinIcon",
				})),
			},
			{
				label: "Plots",
				href: `/books/${book.id}/plot`,
				icon: "WaypointsIcon",
			},
			{
				label: "Settings",
				href: `/books/${book.id}/settings`,
				icon: "CogIcon",
			},
		],
	}))

	// Construct final NavItem structure
	const navItems = [
		{
			label: "Dashboard",
			href: "/dashboard",
			icon: "LayoutDashboard",
		},
		{
			label: "Books",
			href: "/books",
			icon: "LibraryBig",
			items: dynamicBooks,
		},
	]

	return navItems
}
