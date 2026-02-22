import { eq } from "drizzle-orm"
import { reset } from "drizzle-seed"
import * as schema from "@/db/schema"
import db from "./database"

const users = [
	{
		name: "Eleanor Voss",
		email: "eleanor.voss@example.com",
		age: 34,
		city: "Portland",
		books: [
			{
				title: "The Shattered Meridian",
				description: "A sweeping sci-fi epic about humanity's last colony ship navigating a dying galaxy.",
				genre: "Sci-Fi",
				status: "active",
				word_count: 62400,
				goal_words: 100000,
				is_public: true,
				chapterGroups: [
					{
						name: "Part One: Departure",
						position: 0,
						chapters: [
							{
								title: "Into the Dark",
								chapterNumber: 1,
								status: "final",
								position: 0,
								root_position: 0,
								versions: [
									{
										version_number: 1,
										title_snapshot: "Into the Dark",
										content:
											"The colony ship Meridian shuddered as it broke free from the last gravitational pull of Earth's sun. Commander Yael Dros stood at the observation deck, watching the pale dot of humanity's origin shrink into the endless black.",
										wordCount: 1820,
									},
									{
										version_number: 2,
										title_snapshot: "Into the Dark",
										content:
											"The colony ship Meridian shuddered as it broke free from the last gravitational pull of Earth's sun. Commander Yael Dros stood at the observation deck, watching the pale dot of humanity's origin shrink into the endless black. She did not cry. There was nothing left back there worth crying for.",
										wordCount: 2105,
									},
								],
							},
							{
								title: "Fifty Thousand Souls",
								chapterNumber: 2,
								status: "revised",
								position: 1,
								root_position: 1,
								versions: [
									{
										version_number: 1,
										title_snapshot: "Fifty Thousand Souls",
										content:
											"Fifty thousand colonists slept in cryo-pods stacked twenty decks deep. Yael walked the rows during her night cycle, listening to the hum of the life-support systems keeping them all alive.",
										wordCount: 1650,
									},
								],
							},
						],
					},
					{
						name: "Part Two: The Anomaly",
						position: 1,
						chapters: [
							{
								title: "Signal in the Static",
								chapterNumber: 3,
								status: "draft",
								position: 0,
								root_position: 2,
								versions: [
									{
										version_number: 1,
										title_snapshot: "Signal in the Static",
										content:
											"Chief Engineer Renn picked up the signal on day four hundred and twelve. It wasn't random noise. It repeated in a pattern no natural phenomenon could produce.",
										wordCount: 980,
									},
								],
							},
						],
					},
				],
				characters: [
					{
						name: "Commander Yael Dros",
						role: "Protagonist",
						description:
							"Stoic and brilliant, Yael carries the weight of fifty thousand lives with quiet resolve. Haunted by the war that made Earth uninhabitable.",
					},
					{
						name: "Chief Engineer Renn Okuda",
						role: "Supporting",
						description:
							"Yael's closest ally. Optimistic to a fault, Renn believes every problem has an engineering solution.",
					},
					{
						name: "Admiral Cassius Lorne",
						role: "Antagonist",
						description:
							"The political overseer of the mission. Prioritizes order and control over transparency, clashing with Yael at every turn.",
					},
				],
				locations: [
					{
						name: "The Meridian",
						description:
							"A 3km-long colony vessel. Home to fifty thousand sleeping colonists and a crew of two hundred. Every corridor smells faintly of recycled air and machine oil.",
					},
					{
						name: "The Observation Deck",
						description:
							"A glass-domed chamber at the ship's nose. The only place aboard where the stars are visible with the naked eye.",
					},
					{
						name: "The Cryo-Vaults",
						description:
							"Twenty decks of suspended colonists. Dim blue lighting, constant low hum, the occasional beep of a vital monitor.",
					},
				],
				plots: [
					{
						title: "The Mysterious Signal",
						description:
							"A repeating alien signal is detected ahead of the ship's path. The crew must decide whether to investigate or reroute — a decision that will define the mission.",
					},
					{
						title: "Political Tensions Aboard",
						description:
							"Admiral Lorne moves to strip Yael of command after she defies orders to investigate the signal. Yael must build a coalition among the crew to survive.",
					},
				],
			},
			{
				title: "Crown of Ash",
				description:
					"A dark fantasy novel following a disgraced knight seeking redemption in a kingdom ruled by sorcerers.",
				genre: "Fantasy",
				status: "active",
				word_count: 38900,
				goal_words: 120000,
				is_public: false,
				chapterGroups: [
					{
						name: "Book One: The Fall",
						position: 0,
						chapters: [
							{
								title: "The Dishonored",
								chapterNumber: 1,
								status: "final",
								position: 0,
								root_position: 0,
								versions: [
									{
										version_number: 1,
										title_snapshot: "The Dishonored",
										content:
											"They stripped Aldric of his armor in the rain. Piece by piece, the silver plate that had taken him ten years to earn was unbuckled, unstrapped, and dropped into the mud at his feet.",
										wordCount: 2300,
									},
								],
							},
							{
								title: "The Road to Vethara",
								chapterNumber: 2,
								status: "draft",
								position: 1,
								root_position: 1,
								versions: [
									{
										version_number: 1,
										title_snapshot: "The Road to Vethara",
										content:
											"Aldric traveled light. A dull sword, a worn cloak, and enough coin for three days. The capital of the sorcerer-kings rose on the horizon like a wound that refused to heal.",
										wordCount: 1750,
									},
								],
							},
						],
					},
				],
				characters: [
					{
						name: "Aldric of Dunmore",
						role: "Protagonist",
						description:
							"A former Knight-Captain stripped of rank after refusing a massacre order. Gruff, guilt-ridden, and dangerously skilled with a blade.",
					},
					{
						name: "Seraphel the Pale",
						role: "Antagonist",
						description:
							"The High Sorcerer of Vethara. Cold, calculating, and utterly convinced of her own righteousness.",
					},
					{
						name: "Pip",
						role: "Supporting",
						description: "A teenage thief who latches onto Aldric for protection. Far more resourceful than she looks.",
					},
				],
				locations: [
					{
						name: "Vethara",
						description:
							"The capital city, built atop the ruins of the old kingdom. Towers of black glass rise above streets that never fully dry.",
					},
					{
						name: "The Dunmore Fields",
						description:
							"The site of the massacre Aldric refused to carry out. A haunted stretch of farmland that appears in his nightmares.",
					},
				],
				plots: [
					{
						title: "Aldric's Redemption Arc",
						description:
							"Aldric seeks to expose the corrupt order that dishonored him — but redemption may require him to become something darker than the knight he once was.",
					},
					{
						title: "Pip's Secret",
						description:
							"Pip is not just a thief. She carries something the sorcerer-kings would kill to reclaim, and she has no idea what it is.",
					},
				],
			},
		],
	},
]

export default async function seed() {
	await db.delete(schema.chapterVersion)
	await db.delete(schema.chapter)
	await db.delete(schema.chapterGroup)
	await db.delete(schema.character)
	await db.delete(schema.location)
	await db.delete(schema.plot)
	await db.delete(schema.book)
	await db.delete(schema.user)

	for (const userData of users) {
		const [insertedUser] = await db
			.insert(schema.user)
			.values({
				name: userData.name,
				email: userData.email,
				age: userData.age,
				city: userData.city,
			})
			.returning()

		console.log(`Inserted user: ${insertedUser.name} with ID: ${insertedUser.id}`)

		for (const bookData of userData.books) {
			const bookId = crypto.randomUUID()

			const [insertedBook] = await db
				.insert(schema.book)
				.values({
					id: bookId,
					user_id: insertedUser.id,
					title: bookData.title,
					description: bookData.description,
					genre: bookData.genre,
					status: bookData.status,
					word_count: bookData.word_count,
					goal_words: bookData.goal_words,
					is_public: bookData.is_public,
				})
				.returning()

			console.log(`  Inserted book: "${insertedBook.title}"`)

			// Insert characters
			for (const characterData of bookData.characters) {
				await db.insert(schema.character).values({
					id: crypto.randomUUID(),
					book_id: insertedBook.id,
					name: characterData.name,
					role: characterData.role,
					description: characterData.description,
				})
			}

			// Insert locations
			for (const locationData of bookData.locations) {
				await db.insert(schema.location).values({
					id: crypto.randomUUID(),
					book_id: insertedBook.id,
					name: locationData.name,
					description: locationData.description,
				})
			}

			// Insert plots
			for (const plotData of bookData.plots) {
				await db.insert(schema.plot).values({
					id: crypto.randomUUID(),
					book_id: insertedBook.id,
					title: plotData.title,
					description: plotData.description,
				})
			}

			// Insert chapter groups and their chapters
			for (const groupData of bookData.chapterGroups) {
				const groupId = crypto.randomUUID()

				const [insertedGroup] = await db
					.insert(schema.chapterGroup)
					.values({
						id: groupId,
						book_id: insertedBook.id,
						name: groupData.name,
						position: groupData.position,
					})
					.returning()

				for (const chapterData of groupData.chapters) {
					const chapterId = crypto.randomUUID()

					const [insertedChapter] = await db
						.insert(schema.chapter)
						.values({
							id: chapterId,
							book_id: insertedBook.id,
							group_id: insertedGroup.id,
							title: chapterData.title,
							chapterNumber: chapterData.chapterNumber,
							status: chapterData.status,
							position: chapterData.position,
							root_position: chapterData.root_position,
						})
						.returning()

					console.log(`    Inserted chapter: "${insertedChapter.title}"`)

					let latestVersionId: string | null = null

					for (const versionData of chapterData.versions) {
						const versionId = crypto.randomUUID()

						await db.insert(schema.chapterVersion).values({
							id: versionId,
							chapter_id: insertedChapter.id,
							version_number: versionData.version_number,
							title_snapshot: versionData.title_snapshot,
							content: versionData.content,
							wordCount: versionData.wordCount,
						})

						latestVersionId = versionId
					}

					// Point chapter to its latest version
					if (latestVersionId) {
						await db
							.update(schema.chapter)
							.set({ currentVersionId: latestVersionId })
							.where(eq(schema.chapter.id, insertedChapter.id))
					}
				}
			}
		}
	}

	console.log("✅ Seed complete.")
}
