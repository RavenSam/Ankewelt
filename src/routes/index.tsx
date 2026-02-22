import { createFileRoute } from "@tanstack/react-router"
import { AlertCircle, CheckCircle2, Heart, Info, Mail, Search, Shield, Sparkles, Terminal, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"
import { ThemePanel } from "@/components/theme/theme-panel"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import seed from "@/db/seed"

export const Route = createFileRoute("/")({
	component: () => <HomePage />,
})

function HomePage() {
	const { theme } = useTheme()
	const [mounted, setMounted] = React.useState(false)

	React.useEffect(() => {
		setMounted(true)
	}, [])

	// React.useEffect(() => {
	// 	async function runSeeder() {
	// 		try {
	// 			await seed()
	// 			console.log("Database seeded successfully")
	// 		} catch (error) {
	// 			console.error("Error seeding database:", error)
	// 		}
	// 	}
	// 	runSeeder()
	// }, [])

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
				<div className="container flex h-14 items-center justify-between px-4 md:px-6">
					<div className="flex items-center gap-2">
						<Sparkles className="h-6 w-6 text-primary" />
						<span className="font-semibold text-lg">Theme Showcase</span>
					</div>
					<div className="flex items-center gap-4">
						<Badge variant="secondary">
							{mounted ? (theme?.charAt(0).toUpperCase() ?? "") + (theme?.slice(1) ?? "") : "Light"} Theme
						</Badge>
						<ThemePanel />
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container px-4 md:px-6 py-8">
				{/* Hero Section */}
				<section className="flex flex-col items-center text-center py-12 space-y-4">
					<Badge variant="outline" className="px-4 py-1">
						<Zap className="h-3 w-3 mr-1" />
						React + TanStack Router + shadcn/ui
					</Badge>
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight">Theme Switching System</h1>
					<p className="text-muted-foreground text-lg max-w-2xl">
						Explore five beautiful themes and customize your primary color. Click the settings button in the header to
						customize your experience.
					</p>
					<div className="flex gap-3 mt-4">
						<Button size="lg">Get Started</Button>
						<Button size="lg" variant="outline">
							Learn More
						</Button>
					</div>
				</section>

				{/* Buttons Showcase */}
				<section className="space-y-6">
					<div>
						<h2 className="text-2xl font-semibold mb-2">Buttons</h2>
						<p className="text-muted-foreground mb-6">
							Various button styles that adapt to your theme and primary color choice.
						</p>
					</div>
					<Card>
						<CardHeader>
							<CardTitle>Button Variants</CardTitle>
							<CardDescription>All button variants styled with the current theme and primary color.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-3">
								<Button>Primary</Button>
								<Button variant="secondary">Secondary</Button>
								<Button variant="outline">Outline</Button>
								<Button variant="ghost">Ghost</Button>
								<Button variant="link">Link</Button>
								<Button variant="destructive">Destructive</Button>
							</div>
						</CardContent>
					</Card>
				</section>

				{/* Cards & Inputs */}
				<section className="grid gap-6 md:grid-cols-2">
					{/* Input Fields */}
					<Card>
						<CardHeader>
							<CardTitle>Input Fields</CardTitle>
							<CardDescription>Form inputs styled with the current theme.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input id="email" type="email" placeholder="Enter your email" className="pl-10" />
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="search">Search</Label>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input id="search" type="search" placeholder="Search anything..." className="pl-10" />
								</div>
							</div>
							<Button className="w-full">Submit</Button>
						</CardContent>
					</Card>

					{/* Progress & Switches */}
					<Card>
						<CardHeader>
							<CardTitle>Interactive Elements</CardTitle>
							<CardDescription>Progress bars, switches, and other interactive components.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Progress</span>
									<span className="text-muted-foreground">66%</span>
								</div>
								<Progress value={66} />
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="notifications">Notifications</Label>
								<Switch id="notifications" defaultChecked />
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="dark-mode">Auto-save</Label>
								<Switch id="dark-mode" />
							</div>
							<div className="flex gap-2 flex-wrap">
								<Badge>Default</Badge>
								<Badge variant="secondary">Secondary</Badge>
								<Badge variant="outline">Outline</Badge>
								<Badge variant="destructive">Destructive</Badge>
							</div>
						</CardContent>
					</Card>
				</section>

				{/* Alerts */}
				<section className="space-y-6">
					<div>
						<h2 className="text-2xl font-semibold mb-2">Alerts</h2>
						<p className="text-muted-foreground mb-6">Alert components in different states.</p>
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						<Alert>
							<Terminal className="h-4 w-4" />
							<AlertTitle>Heads up!</AlertTitle>
							<AlertDescription>You can change the theme using the settings button in the header.</AlertDescription>
						</Alert>
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>This is an error alert showing destructive styling.</AlertDescription>
						</Alert>
						<Alert className="border-green-500/50 bg-green-500/10 [&>svg]:text-green-500">
							<CheckCircle2 className="h-4 w-4" />
							<AlertTitle>Success!</AlertTitle>
							<AlertDescription>Your changes have been saved successfully.</AlertDescription>
						</Alert>
						<Alert className="border-blue-500/50 bg-blue-500/10 [&>svg]:text-blue-500">
							<Info className="h-4 w-4" />
							<AlertTitle>Information</AlertTitle>
							<AlertDescription>Here&apos;s some useful information for you.</AlertDescription>
						</Alert>
					</div>
				</section>

				{/* Feature Cards */}
				<section className="space-y-6">
					<div>
						<h2 className="text-2xl font-semibold mb-2">Features</h2>
						<p className="text-muted-foreground mb-6">Key features of this theme switching system.</p>
					</div>
					<div className="grid gap-4 md:grid-cols-3">
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
									<Sparkles className="h-5 w-5 text-primary" />
								</div>
								<CardTitle>5 Beautiful Themes</CardTitle>
								<CardDescription>Choose from System, Light, Dark, Midnight, and Forest themes.</CardDescription>
							</CardHeader>
						</Card>
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
									<Shield className="h-5 w-5 text-primary" />
								</div>
								<CardTitle>Persistent Settings</CardTitle>
								<CardDescription>Your theme and color preferences are saved in localStorage.</CardDescription>
							</CardHeader>
						</Card>
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
									<Heart className="h-5 w-5 text-primary" />
								</div>
								<CardTitle>Custom Primary Color</CardTitle>
								<CardDescription>Pick any color as your primary/accent color across all themes.</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</section>

				{/* Theme Previews */}
				<section className="space-y-6">
					<div>
						<h2 className="text-2xl font-semibold mb-2">Available Themes</h2>
						<p className="text-muted-foreground mb-6">A quick look at all available themes in this system.</p>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
						{[
							{
								name: "System",
								desc: "Follows system",
								bg: "bg-gradient-to-r from-white to-neutral-900",
								text: "text-neutral-900",
							},
							{
								name: "Light",
								desc: "Clean and bright",
								bg: "bg-white",
								text: "text-neutral-900",
							},
							{
								name: "Dark",
								desc: "Classic dark mode",
								bg: "bg-neutral-900",
								text: "text-neutral-100",
							},
							{
								name: "Midnight",
								desc: "Blue/purple tones",
								bg: "bg-[#1a1630]",
								text: "text-purple-100",
							},
							{
								name: "Forest",
								desc: "Green nature tones",
								bg: "bg-[#1a2e1f]",
								text: "text-emerald-100",
							},
						].map((t) => (
							<Card key={t.name} className="overflow-hidden">
								<div className={`${t.bg} ${t.text} p-4`}>
									<div className="font-semibold">{t.name}</div>
									<div className="text-sm opacity-70">{t.desc}</div>
								</div>
								<CardFooter className="p-3">
									<span className="text-sm text-muted-foreground">
										{mounted && theme === t.name.toLowerCase() ? "Current" : "Available"}
									</span>
								</CardFooter>
							</Card>
						))}
					</div>
				</section>

				{/* Footer */}
				<footer className="mt-16 pt-8 border-t text-center">
					<p className="text-sm text-muted-foreground">
						Built with React, TanStack Router, Tailwind CSS, and shadcn/ui
					</p>
					<p className="text-sm text-muted-foreground mt-1">
						Click the settings icon in the header to customize your theme
					</p>
				</footer>
			</main>
		</div>
	)
}
