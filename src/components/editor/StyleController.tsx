import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import type { EditorTheme } from "@/lib/types"

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

export function StyleController({ open, onOpenChange, theme, onThemeChange }: StyleControllerProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-100 sm:w-135">
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
				</div>
			</SheetContent>
		</Sheet>
	)
}
