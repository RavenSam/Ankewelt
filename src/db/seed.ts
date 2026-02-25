import { eq } from "drizzle-orm"
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
				ungroupedChapters: [
					{
						title: "Prologue: The Last Broadcast",
						chapterNumber: 0,
						status: "final",
						word_count: 640,
						versions: [
							{
								version_number: 1,
								title_snapshot: "Prologue: The Last Broadcast",
								content:
									"The final transmission from Earth was not a farewell. It was a weather report. Automated, indifferent, looping — a bureaucratic ghost haunting the void long after the civilization that sent it had ceased to exist.",
								wordCount: 640,
							},
						],
					},
					{
						title: "Interlude: Renn's Log",
						chapterNumber: 99,
						status: "draft",
						word_count: 520,
						versions: [
							{
								version_number: 1,
								title_snapshot: "Interlude: Renn's Log",
								content:
									"Personal log, day 413. The signal is still there. I've run every diagnostic I know. The equipment is fine. The signal is real. I haven't told Yael yet.",
								wordCount: 520,
							},
						],
					},
					{
						title: "Epilogue [PLACEHOLDER]",
						chapterNumber: 100,
						status: "draft",
						word_count: 0,
						versions: [
							{
								version_number: 1,
								title_snapshot: "Epilogue [PLACEHOLDER]",
								content: "",
								wordCount: 0,
							},
						],
					},
				],
				chapterGroups: [
					{
						name: "Part One: Departure",
						chapters: [
							{
								title: "Into the Dark",
								chapterNumber: 1,
								status: "final",
								word_count: 2105,
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
								word_count: 1650,
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
							{
								title: "The Weight of Command",
								chapterNumber: 3,
								status: "revised",
								word_count: 1890,
								versions: [
									{
										version_number: 1,
										title_snapshot: "The Weight of Command",
										content:
											"Admiral Lorne called the first officers' meeting on day two. Yael sat across from him at the long steel table and said nothing while he outlined the chain of command. She had heard it before. She disagreed with it then, too.",
										wordCount: 1890,
									},
								],
							},
						],
					},
					{
						name: "Part Two: The Anomaly",
						chapters: [
							{
								title: "Signal in the Static",
								chapterNumber: 4,
								status: "draft",
								word_count: 980,
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
							{
								title: "Course Deviation",
								chapterNumber: 5,
								status: "draft",
								word_count: 1120,
								versions: [
									{
										version_number: 1,
										title_snapshot: "Course Deviation",
										content:
											"Yael ordered the course correction at 0300, ship time. She did not wake Admiral Lorne. By the time he discovered what she had done, the Meridian was already locked onto the signal's origin point.",
										wordCount: 1120,
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
				ungroupedChapters: [
					{
						title: "Preface: A Knight's Oath",
						chapterNumber: 0,
						status: "final",
						word_count: 410,
						versions: [
							{
								version_number: 1,
								title_snapshot: "Preface: A Knight's Oath",
								content:
									"I swear to protect the innocent, uphold the crown, and obey the order of the blade. Aldric had spoken those words at seventeen. He had believed every one of them.",
								wordCount: 410,
							},
						],
					},
					{
						title: "Interlude: Seraphel's Decree",
						chapterNumber: 98,
						status: "draft",
						word_count: 730,
						versions: [
							{
								version_number: 1,
								title_snapshot: "Interlude: Seraphel's Decree",
								content:
									"The High Sorcerer signed the warrant without looking up from her desk. 'Find the girl,' she said to the shadow in the corner. 'Find what she carries. Burn everything else.'",
								wordCount: 730,
							},
						],
					},
				],
				chapterGroups: [
					{
						name: "Book One: The Fall",
						chapters: [
							{
								title: "The Dishonored",
								chapterNumber: 1,
								status: "final",
								word_count: 2300,
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
								word_count: 1750,
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
							{
								title: "The Thief in the Alley",
								chapterNumber: 3,
								status: "draft",
								word_count: 1540,
								versions: [
									{
										version_number: 1,
										title_snapshot: "The Thief in the Alley",
										content:
											"She was maybe fifteen, maybe younger, and she had her hand in his coin purse before he had even turned the corner. He caught her wrist. She did not flinch. That was the first thing he noticed about Pip.",
										wordCount: 1540,
									},
								],
							},
						],
					},
					{
						name: "Book Two: The City of Glass",
						chapters: [
							{
								title: "Gates of Vethara",
								chapterNumber: 4,
								status: "draft",
								word_count: 1320,
								versions: [
									{
										version_number: 1,
										title_snapshot: "Gates of Vethara",
										content:
											"The city swallowed them whole. Aldric kept his hood up and his hand near his sword. Pip kept talking — about the towers, the market stalls, the strange purple smoke drifting from the sorcerers' quarter. She had never seen anything like it. He had. He had burned part of it once.",
										wordCount: 1320,
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

			// Pre-generate all IDs upfront so order arrays can be set at insert time
			const groupIds = bookData.chapterGroups.map(() => crypto.randomUUID())
			const ungroupedIds = bookData.ungroupedChapters.map(() => crypto.randomUUID())

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
					ungrouped_chapters_order: ungroupedIds,
					chapters_groupes_order: groupIds,
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

			// Insert ungrouped chapters (no group_id)
			for (let ui = 0; ui < bookData.ungroupedChapters.length; ui++) {
				const chapterData = bookData.ungroupedChapters[ui]
				const chapterId = ungroupedIds[ui]

				const [insertedChapter] = await db
					.insert(schema.chapter)
					.values({
						id: chapterId,
						book_id: insertedBook.id,
						group_id: null,
						title: chapterData.title,
						chapterNumber: chapterData.chapterNumber,
						status: chapterData.status,
						word_count: chapterData.word_count,
					})
					.returning()

				console.log(`    Inserted ungrouped chapter: "${insertedChapter.title}"`)

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

				if (latestVersionId) {
					await db
						.update(schema.chapter)
						.set({ currentVersionId: latestVersionId })
						.where(eq(schema.chapter.id, insertedChapter.id))
				}
			}

			// Insert chapter groups and their chapters
			for (let gi = 0; gi < bookData.chapterGroups.length; gi++) {
				const groupData = bookData.chapterGroups[gi]
				const groupId = groupIds[gi]

				// Pre-generate chapter IDs so we can build chapters_order upfront
				const chapterIds = groupData.chapters.map(() => crypto.randomUUID())

				const [insertedGroup] = await db
					.insert(schema.chapterGroup)
					.values({
						id: groupId,
						book_id: insertedBook.id,
						name: groupData.name,
						chapters_order: chapterIds,
					})
					.returning()

				for (let ci = 0; ci < groupData.chapters.length; ci++) {
					const chapterData = groupData.chapters[ci]
					const chapterId = chapterIds[ci]

					const [insertedChapter] = await db
						.insert(schema.chapter)
						.values({
							id: chapterId,
							book_id: insertedBook.id,
							group_id: insertedGroup.id,
							title: chapterData.title,
							chapterNumber: chapterData.chapterNumber,
							status: chapterData.status,
							word_count: chapterData.word_count,
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
