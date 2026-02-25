import { createFileRoute } from "@tanstack/react-router"
import {
	BookCopyIcon,
	CrosshairIcon,
	FileText,
	FlameIcon,
	Pencil,
	PencilLine,
	PenIcon,
	Plus,
	PlusCircle,
} from "lucide-react"
import React from "react"
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HeatmapCalendar } from "@/components/ui/heatmap-calendar"
import { Progress } from "@/components/ui/progress"

export const Route = createFileRoute("/dashboard")({
	component: Dashboard,
})

function Dashboard() {
	return (
		<div className="min-h-screen p-8 pt-14">
			<header className="flex justify-between items-start mb-14">
				<div>
					<p className="text-muted-foreground text-sm mb-1">Tuesday, October 24</p>
					<h1 className="text-3xl font-semibold">Good morning, E. Weaver</h1>
				</div>
				<div className="flex gap-3">
					<Button className="gap-2 font-semibold" size={"lg"}>
						<Plus size={18} /> New Book
					</Button>
				</div>
			</header>

			{/* Top Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
				<StatCard icon={FileText} title="TOTAL WORDS" value="142,850" change="+4,200 this week" />
				<StatCard icon={BookCopyIcon} title="ACTIVE BOOKS" value="3" change="1 completed project" />
				<StatCard icon={FlameIcon} title="CURRENT STREAK" value="12 Days" change="Best streak: 24 days" />
				<StatCard icon={CrosshairIcon} title="AVG. DAILY" value="1,840" change="Words per session" />
			</div>

			<div className="grid grid-cols-12 gap-4 mb-8">
				{/* Left Column */}
				<div className="col-span-8 space-y-4">
					<section>
						<div className="flex justify-between items-center mb-4">
							<h2 className="font-semibold">Jump Back In</h2>
							<Button variant="link" className="text-muted-foreground text-sm">
								View All
							</Button>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-4">
								<ProjectCard title="The Silent Echoes" genre="Sci-Fi" words="84,210" progress={84} color="bg-black" />
								<ProjectCard title="Project Nebula" genre="Fantasy" words="12,400" progress={15} color="bg-slate-200" />
							</div>

							<DailyTarget current={1320} target={2000} />
						</div>
					</section>

					<RecentUpdates />
				</div>

				{/* Right Column / Sidebar */}
				<div className="col-span-4 space-y-6">
					<QuickNote />
				</div>
			</div>

			<WritingActivity />
		</div>
	)
}

const updates = [
	{
		id: 1,
		title: "Ch 24. The Horizon Event",
		project: "The Silent Echoes",
		time: "Updated 2 hours ago",
		words: "+850 words",
	},
	{
		id: 2,
		title: "Prologue: The Awakening",
		project: "Project Nebula",
		time: "Updated yesterday",
		words: "+1,240 words",
	},
	{
		id: 3,
		title: "Prologue: The Awakening",
		project: "Project Nebula",
		time: "Updated yesterday",
		words: "+1,240 words",
	},
	{
		id: 4,
		title: "Prologue: The Awakening",
		project: "Project Nebula",
		time: "Updated yesterday",
		words: "+1,240 words",
	},
]

const RecentUpdates = () => (
	<Card className="border-none shadow-sm">
		<CardHeader className="flex flex-row items-center justify-between pb-4">
			<CardTitle className="text-sm font-semibold">Recent Updates</CardTitle>
		</CardHeader>
		<CardContent className="space-y-3">
			{updates.map((update, i) => (
				<div key={update.id} className="flex items-center justify-between group cursor-pointer pb-4">
					<div className="flex gap-4 items-center">
						<p className="size-10 font-extrabold flex items-center justify-center bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-background transition-colors">
							{i + 1}
						</p>
						<div>
							<h4 className="text-sm font-semibold leading-tight">{update.title}</h4>
							<p className="text-[11px] text-muted-foreground">
								{update.project} <span className="mx-1">•</span> {update.time}
							</p>
						</div>
					</div>
					<Badge className="bg-emerald-50 text-emerald-600 border-none shadow-none font-medium hover:bg-emerald-100">
						{update.words}
					</Badge>
				</div>
			))}
		</CardContent>
	</Card>
)

const StatCard = (props: { title: string; value: string; change: string; icon: any }) => (
	<Card className="border border-transparent shadow-sm hover:border-primary transition-all duration-300">
		<CardContent className="">
			<div className="flex items-center mb-2">
				<props.icon className="size-5 text-muted-foreground mr-2" />
				<p className="text-xs font-light text-muted-foreground tracking-widest">{props.title}</p>
			</div>
			<h3 className="text-3xl font-bold mb-1">{props.value}</h3>
			<p className="text-xs text-muted-foreground">
				<span className={props.change.startsWith("+") ? "text-green-500" : ""}>{props.change.split(" ")[0]}</span>
				{props.change.substring(props.change.indexOf(" "))}
			</p>
		</CardContent>
	</Card>
)

const ProjectCard = ({ title, genre, words, progress, color }: any) => (
	<Card className="border-none shadow-sm overflow-hidden group cursor-pointer">
		<CardContent className="flex h-32">
			<div className={`w-24 ${color} flex items-center rounded-md justify-center p-4 relative overflow-hidden`}>
				<div className="absolute opacity-0 group-hover:opacity-100 inset-0 flex items-center justify-center bg-black/50">
					<PenIcon className="size-5 text-white" />
				</div>
				<span
					className={`text-[10px] font-bold text-center leading-tight ${color === "bg-black" ? "text-white" : "text-muted-foreground"}`}
				>
					{title.toUpperCase()}
				</span>
			</div>
			<div className="flex-1 p-4 flex flex-col justify-between">
				<div>
					<h4 className="font-bold text-sm">{title}</h4>
					<p className="text-xs text-muted-foreground">
						{genre} · {words} wds
					</p>
				</div>
				<div>
					<div className="flex justify-between text-[10px] font-bold mb-1 uppercase text-muted-foreground">
						<span>Draft Progress</span>
						<span>{progress}%</span>
					</div>
					<Progress value={progress} className="h-1.5" />
				</div>
			</div>
		</CardContent>
	</Card>
)

const DailyTarget = ({ current, target }: { current: number; target: number }) => {
	const percentage = (current / target) * 100
	return (
		<Card className="border-none shadow-sm text-center py-6">
			<CardHeader className="pb-2">
				<div className="flex justify-between items-center">
					<CardTitle className="text-sm font-semibold">Daily Target</CardTitle>
					<span className="text-slate-300">...</span>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col items-center">
				<AnimatedCircularProgressBar
					value={percentage}
					gaugePrimaryColor="var(--primary)"
					gaugeSecondaryColor=""
					className="size-32"
				/>
				<p className="text-xs text-muted-foreground my-3 px-4">
					You're doing great! Just {target - current} words left to hit today's goal.
				</p>
				<Button className="w-full variant-outline gap-2 border-slate-200" variant="outline">
					<Pencil size={14} /> Start Writing
				</Button>
			</CardContent>
		</Card>
	)
}

const QuickNote = () => (
	<Card className="border-none shadow-sm relative group h-full">
		<CardHeader className="">
			<div className="flex justify-between items-center">
				<CardTitle className="text-sm font-semibold text-slate-700">Quick Note</CardTitle>
				<PlusCircle size={16} className="text-slate-300 hover:text-muted-foreground cursor-pointer" />
			</div>
		</CardHeader>
		<CardContent className="max-h-125 overflow-auto">
			<div className="bg-amber-50/50 border border-amber-100/50 rounded-lg p-5 relative">
				<blockquote className="italic text-slate-700 text-sm leading-relaxed font-serif mb-4">
					"The void wasn't empty; it was full of the things we chose to leave behind."
				</blockquote>
				<div className="flex justify-between items-center">
					<span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Idea for Chapter 25</span>
					<PencilLine size={12} className="text-amber-300" />
				</div>
			</div>
		</CardContent>
	</Card>
)

function makeData(days = 365) {
	return Array.from({ length: days }).map((_, i) => {
		const d = new Date()
		d.setDate(d.getDate() - i)
		return {
			date: d.toISOString().slice(0, 10), // "YYYY-MM-DD"
			value: i % 7 === 0 ? 0 : i % 13,
		}
	})
}

const WritingActivity = () => {
	const data = React.useMemo(() => makeData(365), [])

	return (
		<HeatmapCalendar
			title="Activity"
			data={data}
			weekStartsOn={1}
			legend={{ placement: "bottom", className: "ml-auto" }}
		/>
	)
}
