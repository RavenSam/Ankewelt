import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ListHeaderProps {
	title: string

	searchValue?: string
	onSearchChange?: (value: string) => void
	searchPlaceholder?: string

	actionLabel?: string
	onActionClick?: () => void

	className?: string
}

export function SectionHeader({
	title,
	searchValue,
	onSearchChange,
	searchPlaceholder = "Search...",
	actionLabel,
	onActionClick,
	className,
}: ListHeaderProps) {
	const showSearch = typeof onSearchChange === "function"
	const showButton = typeof onActionClick === "function"

	return (
		<div className={`flex items-center justify-between mb-6 ${className ?? ""}`}>
			<h1 className="text-xl font-semibold text-foreground">{title}</h1>

			<div className="flex items-center gap-3">
				{showSearch && (
					<div className="relative">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
						<Input
							placeholder={searchPlaceholder}
							value={searchValue}
							onChange={(e) => onSearchChange?.(e.target.value)}
							className="pl-9 h-10.5 w-56 bg-muted/40 border-border text-sm"
						/>
					</div>
				)}

				{showButton && (
					<Button size="lg" onClick={onActionClick} className="gap-1.5 font-bold">
						<Plus className="h-4 w-4" />
						{actionLabel}
					</Button>
				)}
			</div>
		</div>
	)
}
