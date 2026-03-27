import { createFileRoute } from "@tanstack/react-router"
import { Building2, Orbit, Rocket } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "../-components/section-header"

export const Route = createFileRoute("/books/$bookId/locations")({
	component: LocationPage,
})

interface Location {
	name: string
	description: string
	icon: React.ElementType
}

const locations: Location[] = [
	{
		name: "The Citadel",
		description: "Earth's central space hub. Heavily militarized and strictly regulated.",
		icon: Building2,
	},
	{
		name: "Echo Void",
		description: "An uncharted sector where the laws of quantum physics break down.",
		icon: Orbit,
	},
	{
		name: "The Aethon",
		description: "Elara's stolen prototype ship, equipped with experimental warp tech.",
		icon: Rocket,
	},
]

function LocationPage() {
	const [images] = useState(() => locations.map(() => `https://picsum.photos/600/300?random=${Math.random()}`))

	return (
		<div className="space-y-6">
			<SectionHeader
				title="Locations"
				onSearchChange={() => {}}
				searchPlaceholder="Search location..."
				actionLabel="New Location"
				onActionClick={() => {}}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{locations.map((loc, index) => (
					<Card key={loc.name} className="relative overflow-hidden bg-card border-border/50 shadow-sm pt-0">
						<div className="relative h-32 w-full overflow-hidden">
							<img src={images[index]} alt={loc.name} className="w-full h-full object-cover" />

							<div className="absolute inset-0 bg-linear-to-b from-transparent to-card" />
						</div>

						<CardContent className="p-5 space-y-3 -mt-16 relative z-10">
							<div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shadow border border-muted-foreground/20">
								<loc.icon className="w-5 h-5 text-muted-foreground" />
							</div>

							<div>
								<h3 className="text-sm font-semibold">{loc.name}</h3>
								<p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{loc.description}</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}
