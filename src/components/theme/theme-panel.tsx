import { Brush, Palette, PaletteIcon } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorPicker } from "./color-picker"
import { ThemeSwitcher } from "./theme-switcher"

interface SettingsPanelProps {
	className?: string
}

export function ThemePanel({ className }: SettingsPanelProps) {
	const [open, setOpen] = React.useState(false)
	const { theme } = useTheme()
	const [mounted, setMounted] = React.useState(false)

	React.useEffect(() => {
		setMounted(true)
	}, [])

	const currentTheme = mounted ? (theme?.charAt(0).toUpperCase() ?? "") + (theme?.slice(1) ?? "") : "Light"

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon" className={className}>
					<PaletteIcon className="h-5 w-5" />
					<span className="sr-only">Open settings</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-125">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<PaletteIcon className="h-5 w-5" />
						Theme Settings
					</DialogTitle>
					<DialogDescription>Customize your experience by changing the theme and primary color.</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue="theme" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="theme" className="flex items-center gap-2">
							<Palette className="h-4 w-4" />
							Theme
						</TabsTrigger>
						<TabsTrigger value="color" className="flex items-center gap-2">
							<Brush className="h-4 w-4" />
							Primary Color
						</TabsTrigger>
					</TabsList>

					<TabsContent value="theme" className="mt-4 space-y-4">
						<div className="space-y-2">
							<p className="text-sm font-medium">Current: {currentTheme}</p>
							<ThemeSwitcher />
						</div>
					</TabsContent>

					<TabsContent value="color" className="mt-4">
						<ColorPicker />
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}
