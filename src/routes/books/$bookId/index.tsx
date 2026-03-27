import { createFileRoute } from "@tanstack/react-router"
import { Edit3, FileText, Plus } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const Route = createFileRoute("/books/$bookId/")({
	component: RouteComponent,
})

// --- Types ---
interface Chapter {
	id: number
	title: string
	wordCount: string
	status: "Draft" | "Revised" | "Published"
	updatedAt: string
}

interface Character {
	name: string
	role: string
	initials: string
}

// --- Mock Data ---
const recentChapters: Chapter[] = [
	{
		id: 24,
		title: "The Horizon Event",
		wordCount: "4,210 words",
		status: "Draft",
		updatedAt: "Today",
	},
	{
		id: 23,
		title: "Fracture",
		wordCount: "3,840 words",
		status: "Revised",
		updatedAt: "Yesterday",
	},
]

const characters: Character[] = [
	{
		name: "Elara Vance",
		role: "Protagonist · Quantum Engineer",
		initials: "EV",
	},
	{ name: "Dr. Kaelen", role: "Mentor · Missing", initials: "DK" },
]

function RouteComponent() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Left Column: Main Content */}
			<div className="lg:col-span-2 space-y-6">
				{/* Summary Card */}
				<Card className="bg-card shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">Summary</CardTitle>
						<Edit3 className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
					</CardHeader>
					<CardContent>
						<p className="text-sm leading-relaxed text-foreground/90">
							In the year 2142, humanity has expanded beyond the solar system using quantum gating. When a silent
							transmission is received from a supposedly dead sector, an estranged engineer named Elara Vance must piece
							together a fragmented map left by her missing mentor. The journey pushes her into the "Echo Void," a
							region of space where time dilates and past traumas manifest as physical anomalies.
						</p>
					</CardContent>
				</Card>

				{/* Recent Chapters */}
				<Card className="bg-card shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">Recent Chapters</CardTitle>
						<Button variant="link" size="sm" className="text-xs text-muted-foreground">
							View All (24)
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						{recentChapters.map((chapter) => (
							<div
								key={chapter.id}
								className="flex items-center justify-between p-3 border rounded-lg group hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-center gap-4">
									<div className="bg-muted p-2 rounded">
										<FileText className="w-4 h-4 text-muted-foreground" />
									</div>
									<div>
										<h4 className="text-sm font-medium">
											{chapter.id}. {chapter.title}
										</h4>
										<p className="text-xs text-muted-foreground">
											{chapter.wordCount} • {chapter.updatedAt}
										</p>
									</div>
								</div>
								<Badge variant={chapter.status === "Draft" ? "secondary" : "outline"} className="font-normal">
									{chapter.status}
								</Badge>
							</div>
						))}

						<button
							type="button"
							className="w-full py-3 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
						>
							<Plus className="w-4 h-4" /> Add New Chapter
						</button>
					</CardContent>
				</Card>

				{/* Heat-map Placeholder */}
				<div className="w-full h-48 border-2 border-dashed border-muted rounded-xl flex items-center justify-center bg-muted/20">
					<p className="text-muted-foreground text-sm italic">Plot Grid Heat-map Placeholder</p>
				</div>
			</div>

			{/* Right Column: Sidebar */}
			<div className="space-y-6">
				{/* Key Characters */}
				<Card className="bg-card shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">Key Characters</CardTitle>
						<Plus className="w-4 h-4 text-muted-foreground cursor-pointer" />
					</CardHeader>
					<CardContent className="space-y-4">
						{characters.map((char) => (
							<div key={char.name} className="flex items-center gap-3">
								<Avatar className="h-9 w-9 border bg-muted">
									<AvatarFallback className="text-xs font-semibold">{char.initials}</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="text-sm font-medium">{char.name}</span>
									<span className="text-[10px] text-muted-foreground uppercase">{char.role}</span>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Plot Outline */}
				<Card className="bg-card shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">Plot Outline</CardTitle>
						<Button variant="link" size="sm" className="text-xs text-muted-foreground">
							Full View
						</Button>
					</CardHeader>
					<CardContent className="space-y-6 relative before:absolute before:left-[1.65rem] before:top-8 before:bottom-8 before:w-px before:bg-border">
						<div className="flex gap-4 relative">
							<div className="w-5 h-5 rounded-full border-2 border-primary bg-background z-10 shrink-0 mt-1" />
							<div>
								<h4 className="text-sm font-medium">Inciting Incident</h4>
								<p className="text-xs text-muted-foreground">Signal received from Dr. Kaelen.</p>
							</div>
						</div>
						<div className="flex gap-4 relative">
							<div className="w-5 h-5 rounded-full border-2 border-muted bg-background z-10 shrink-0 mt-1" />
							<div>
								<h4 className="text-sm font-medium">Crossing Threshold</h4>
								<p className="text-xs text-muted-foreground">Elara steals the prototype ship.</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
