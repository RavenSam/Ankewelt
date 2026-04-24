import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import type { EditorTheme } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StyleControllerProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	theme: EditorTheme
	onThemeChange: (theme: Partial<EditorTheme>) => void
}

const FONTS = [
	{ name: "Inter (Sans)", value: "var(--app-font-sans)" },
	{ name: "Lora (Serif)", value: "var(--app-font-serif)" },
	{ name: "JetBrains Mono", value: "var(--app-font-mono)" },
	{ name: "Playfair Display", value: "'Playfair Display', serif" },
]

const PALETTES = [
	{ id: "paper", name: "Paper", className: "bg-[#faf9f6] border-[#e6e4dd]" },
	{ id: "cream", name: "Cream", className: "bg-[#fffdd0] border-[#eeddcc]" },
	{ id: "ink", name: "Ink", className: "bg-[#1a1b1e] border-[#2c2d30]" },
	{
		id: "midnight",
		name: "Midnight",
		className: "bg-[#0f172a] border-[#1e293b]",
	},
]

export function StyleController({ open, onOpenChange, theme, onThemeChange }: StyleControllerProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-[400px] sm:w-[540px]">
				<SheetHeader>
					<SheetTitle>Editor Style</SheetTitle>
					<SheetDescription>Customize your writing environment.</SheetDescription>
				</SheetHeader>

				<div className="py-6 space-y-8">
					<div className="space-y-4">
						<Label>Typography</Label>
						<Select value={theme.fontFamily} onValueChange={(val) => onThemeChange({ fontFamily: val })}>
							<SelectTrigger>
								<SelectValue placeholder="Select a font" />
							</SelectTrigger>
							<SelectContent>
								{FONTS.map((font) => (
									<SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
										{font.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<Label>Font Size</Label>
							<span className="text-sm text-muted-foreground">{theme.fontSize}px</span>
						</div>
						<Slider
							min={14}
							max={24}
							step={1}
							value={[theme.fontSize]}
							onValueChange={(vals) => onThemeChange({ fontSize: vals[0] })}
						/>
					</div>

					<div className="space-y-4">
						<Label>Color Palette</Label>
						<div className="grid grid-cols-2 gap-4">
							{PALETTES.map((palette) => (
								<button
									type="button"
									key={palette.id}
									onClick={() =>
										onThemeChange({
											colorPalette: palette.id as EditorTheme["colorPalette"],
										})
									}
									className={cn(
										"flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
										palette.className,
										theme.colorPalette === palette.id ? "ring-2 ring-primary ring-offset-2" : "hover:scale-105",
									)}
								>
									<span
										className={cn(
											"text-sm font-medium",
											palette.id === "ink" || palette.id === "midnight" ? "text-white" : "text-black",
										)}
									>
										{palette.name}
									</span>
									{theme.colorPalette === palette.id && (
										<Check
											className={cn(
												"w-4 h-4",
												palette.id === "ink" || palette.id === "midnight" ? "text-white" : "text-black",
											)}
										/>
									)}
								</button>
							))}
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
