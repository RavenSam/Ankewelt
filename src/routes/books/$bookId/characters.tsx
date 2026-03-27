import { createFileRoute } from "@tanstack/react-router"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SectionHeader } from "../-components/section-header"

export const Route = createFileRoute("/books/$bookId/characters")({
	component: CharacterPage,
})

interface Character {
	id: string
	name: string
	role: string
	description: string
	tags: string[]
}

const characters: Character[] = [
	{
		id: "1",
		name: "Elara Vance",
		role: "Protagonist",
		description:
			"A brilliant but ostracized quantum engineer. After receiving a fragmented transmission from her mentor who disappeared 5 years ago, she...",
		tags: ["Engineer", "Determined"],
	},
	{
		id: "2",
		name: "Dr. Silas Kaelen",
		role: "Mentor",
		description:
			"The foremost expert on quantum gating theory. Disappeared during the controversial Genesis expedition. His fate is the central mystery of th...",
		tags: ["Missing", "Visionary"],
	},
	{
		id: "3",
		name: "MIRA",
		role: "Ship AI",
		description:
			"The experimental AI construct aboard Elara's stolen ship. Strict adherence to protocols often conflicts with Elara's impulsive decisions, but it i...",
		tags: ["Construct", "Logical"],
	},
]

function CharacterCard({ character }: { character: Character }) {
	const initials = character.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()

	return (
		<Card className="bg-card hover:shadow-md transition-shadow border-border/60">
			<CardContent className="p-6 space-y-4">
				<div className="flex items-center gap-4">
					<Avatar className={cn("h-12 w-12 border")}>
						<AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<h3 className="text-lg font-semibold tracking-tight leading-none mb-1">{character.name}</h3>
						<span className="text-xs text-muted-foreground font-medium">{character.role}</span>
					</div>
				</div>

				<p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{character.description}</p>

				<div className="flex gap-2 pt-2">
					{character.tags.map((tag) => (
						<Badge
							key={tag}
							variant="secondary"
							className="font-normal text-[11px] px-2.5 py-0.5 bg-muted/50 text-muted-foreground hover:bg-muted"
						>
							{tag}
						</Badge>
					))}
				</div>
			</CardContent>
		</Card>
	)
}

function CharacterPage() {
	return (
		<div className="space-y-6">
			<SectionHeader
				title="Characters"
				onSearchChange={() => {}}
				searchPlaceholder="Search Characters..."
				actionLabel="New Characters"
				onActionClick={() => {}}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{characters.map((char) => (
					<CharacterCard key={char.id} character={char} />
				))}
			</div>
		</div>
	)
}
