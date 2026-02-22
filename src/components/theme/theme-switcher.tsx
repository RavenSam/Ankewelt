import { Check } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"
import { cn } from "@/lib/utils"
import { themeColors, themes } from "./theme-provider"

interface ThemeSwitcherProps {
	className?: string
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = React.useState(false)

	React.useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return (
			<div className={cn("grid grid-cols-2 gap-3", className)}>
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
				))}
			</div>
		)
	}

	return (
		<div className={cn("grid grid-cols-2 gap-3", className)}>
			{/* System theme spans full width */}
			{themes.slice(0, 1).map((t) => {
				const isSelected = theme === t.value
				return (
					<button
						type="button"
						key={t.value}
						onClick={() => setTheme(t.value)}
						className={cn(
							"relative flex flex-col items-start gap-2 p-3 rounded-lg border-2 transition-all col-span-2",
							"hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
							isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
						)}
					>
						{/* Mini preview */}
						<div className="flex items-center gap-2 w-full">
							<div className={cn("w-8 h-8 rounded-md flex items-center justify-center", themeColors[t.value].bg)}>
								<div className={cn("w-4 h-4 rounded-full", themeColors[t.value].accent)} />
							</div>
							<div className="flex-1">
								<div className="font-medium text-sm">{t.label}</div>
							</div>
							{isSelected && (
								<div className="absolute top-2 right-2">
									<Check className="h-4 w-4 text-primary" />
								</div>
							)}
						</div>
					</button>
				)
			})}

			{themes.slice(1).map((t) => {
				const isSelected = theme === t.value
				return (
					<button
						type="button"
						key={t.value}
						onClick={() => setTheme(t.value)}
						className={cn(
							"relative flex flex-col items-start gap-2 p-3 rounded-lg border-2 transition-all",
							"hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
							isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
						)}
					>
						{/* Mini preview */}
						<div className="flex items-center gap-2 w-full">
							<div className={cn("w-8 h-8 rounded-md flex items-center justify-center", themeColors[t.value].bg)}>
								<div className={cn("w-4 h-4 rounded-full", themeColors[t.value].accent)} />
							</div>
							<div className="flex-1">
								<div className="font-medium text-sm">{t.label}</div>
							</div>
						</div>
						{isSelected && (
							<div className="absolute top-2 right-2">
								<Check className="h-4 w-4 text-primary" />
							</div>
						)}
					</button>
				)
			})}
		</div>
	)
}
