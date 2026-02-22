import { Check, RotateCcw } from "lucide-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PresetColor {
	name: string
	value: string
	color: string
}

const presetColors: PresetColor[] = [
	{ name: "Slate", value: "slate", color: "#64748b" },
	{ name: "Red", value: "red", color: "#ef4444" },
	{ name: "Orange", value: "orange", color: "#f97316" },
	{ name: "Amber", value: "amber", color: "#f59e0b" },
	{ name: "Yellow", value: "yellow", color: "#eab308" },
	{ name: "Lime", value: "lime", color: "#84cc16" },
	{ name: "Green", value: "green", color: "#22c55e" },
	{ name: "Emerald", value: "emerald", color: "#10b981" },
	{ name: "Teal", value: "teal", color: "#14b8a6" },
	{ name: "Cyan", value: "cyan", color: "#06b6d4" },
	{ name: "Sky", value: "sky", color: "#0ea5e9" },
	{ name: "Blue", value: "blue", color: "#3b82f6" },
	{ name: "Indigo", value: "indigo", color: "#6366f1" },
	{ name: "Violet", value: "violet", color: "#8b5cf6" },
	{ name: "Purple", value: "purple", color: "#a855f7" },
	{ name: "Fuchsia", value: "fuchsia", color: "#d946ef" },
	{ name: "Pink", value: "pink", color: "#ec4899" },
	{ name: "Rose", value: "rose", color: "#f43f5e" },
]

const PRIMARY_COLOR_STORAGE_KEY = "primary-color"

interface ColorPickerProps {
	className?: string
}

// Helper function to convert hex to OKLCH
function hexToOklch(hex: string): string {
	const rgb = hexToRgb(hex)
	if (!rgb) return "oklch(0.5 0.15 250)"

	const oklab = srgbToOklab(rgb.r, rgb.g, rgb.b)
	const oklch = oklabToOklch(oklab)

	return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)})`
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result
		? {
				r: parseInt(result[1], 16) / 255,
				g: parseInt(result[2], 16) / 255,
				b: parseInt(result[3], 16) / 255,
			}
		: null
}

function srgbToOklab(r: number, g: number, b: number) {
	// Convert sRGB to linear RGB
	const lr = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92
	const lg = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92
	const lb = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92

	// Convert to OKLab
	const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
	const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
	const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

	const l_ = Math.cbrt(l)
	const m_ = Math.cbrt(m)
	const s_ = Math.cbrt(s)

	return {
		L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
		a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
		b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
	}
}

function oklabToOklch(oklab: { L: number; a: number; b: number }) {
	const c = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b)
	let h = Math.atan2(oklab.b, oklab.a) * (180 / Math.PI)
	if (h < 0) h += 360

	return {
		l: oklab.L,
		c: c,
		h: h,
	}
}

function getLuminance(hex: string): number {
	const rgb = hexToRgb(hex)
	if (!rgb) return 0.5

	const oklab = srgbToOklab(rgb.r, rgb.g, rgb.b)
	return oklab.L
}

function applyPrimaryColorToDOM(color: string) {
	const root = document.documentElement

	// Convert hex to OKLCH
	const oklch = hexToOklch(color)

	// Set the primary color
	root.style.setProperty("--primary", oklch)

	// Set a contrasting foreground color (white or dark based on luminance)
	const luminance = getLuminance(color)
	const foreground = luminance > 0.5 ? "oklch(0.15 0 0)" : "oklch(0.98 0 0)"
	root.style.setProperty("--primary-foreground", foreground)

	// Set ring color with the primary hue
	root.style.setProperty(
		"--ring",
		oklch.replace(/oklch\(([^)]+)\)/, (_, values) => {
			const parts = values.trim().split(/\s+/)
			return `oklch(0.6 ${parts[1]} ${parts[2]})`
		}),
	)
}

export function ColorPicker({ className }: ColorPickerProps) {
	const [selectedColor, setSelectedColor] = React.useState<string>("")
	const [customColor, setCustomColor] = React.useState<string>("#3b82f6")
	const [mounted, setMounted] = React.useState(false)

	React.useEffect(() => {
		setMounted(true)
		const stored = localStorage.getItem(PRIMARY_COLOR_STORAGE_KEY)
		if (stored) {
			setSelectedColor(stored)
			applyPrimaryColorToDOM(stored)
		}
	}, [])

	const handleColorSelect = React.useCallback((color: string) => {
		setSelectedColor(color)
		applyPrimaryColorToDOM(color)
		localStorage.setItem(PRIMARY_COLOR_STORAGE_KEY, color)
	}, [])

	const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const color = e.target.value
		setCustomColor(color)
		handleColorSelect(color)
	}

	const resetToDefault = () => {
		setSelectedColor("")
		localStorage.removeItem(PRIMARY_COLOR_STORAGE_KEY)
		document.documentElement.style.removeProperty("--primary")
		document.documentElement.style.removeProperty("--primary-foreground")
		document.documentElement.style.removeProperty("--ring")
	}

	if (!mounted) {
		return (
			<div className={cn("space-y-4", className)}>
				<div className="grid grid-cols-6 gap-2">
					{presetColors.map((c) => (
						<div key={c.name} className="w-8 h-8 rounded-full bg-muted animate-pulse" />
					))}
				</div>
			</div>
		)
	}

	return (
		<div className={cn("space-y-4", className)}>
			<div className="space-y-2">
				<p className="text-sm font-medium">Preset Colors</p>
				<div className="grid grid-cols-6 gap-2">
					{presetColors.map((preset) => (
						<button
							type="button"
							key={preset.value}
							onClick={() => handleColorSelect(preset.color)}
							className={cn(
								"relative w-8 h-8 rounded-full border-2 transition-all",
								"hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
								selectedColor === preset.color
									? "border-foreground ring-2 ring-primary ring-offset-2"
									: "border-transparent",
							)}
							style={{ backgroundColor: preset.color }}
							title={preset.name}
						>
							{selectedColor === preset.color && (
								<Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
							)}
						</button>
					))}
				</div>
			</div>

			<div className="space-y-2">
				<p className="text-sm font-medium">Custom Color</p>
				<div className="flex items-center gap-3">
					<input
						type="color"
						value={customColor}
						onChange={handleCustomColorChange}
						className="w-12 h-10 rounded-md border border-input cursor-pointer"
					/>
					<input
						type="text"
						value={customColor}
						onChange={(e) => {
							setCustomColor(e.target.value)
							if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
								handleColorSelect(e.target.value)
							}
						}}
						className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background"
						placeholder="#3b82f6"
					/>
				</div>
			</div>

			{selectedColor && (
				<Button variant="outline" size="sm" onClick={resetToDefault} className="w-full">
					<RotateCcw className="h-4 w-4 mr-2" />
					Reset to Theme Default
				</Button>
			)}
		</div>
	)
}
