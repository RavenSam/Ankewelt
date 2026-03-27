import { BookOpen, CogIcon, ExternalLink, FileText, Layers, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

const image = "https://picsum.photos/200/300?random=1"
const bannerUrl = "https://picsum.photos/700/300?random=1"

export function BookHeader() {
	return (
		<section className="flex flex-col md:flex-row gap-8 items-start md:items-end w-full">
			<div className="absolute top-0 inset-x-0 h-80 overflow-hidden">
				{bannerUrl ? (
					<img src={bannerUrl} alt="Banner" className="w-full h-full object-cover animate-in fade-in duration-700" />
				) : (
					<div className="w-full h-full bg-muted/20" />
				)}

				<div className="absolute inset-0 bg-linear-to-b from-transparent to-background" />
			</div>

			<div className="relative z-1 w-[20%] min-w-45 aspect-10/16 bg-black rounded-md shadow-xl border border-border overflow-hidden mt-8">
				{image ? (
					<img src={image} alt="book cover" className="object-cover h-full w-full" />
				) : (
					<div className="flex flex-col items-center justify-center p-4 h-full">
						<span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Sci-Fi</span>
						<h2 className="text-xs text-center leading-tight">THE SILENT ECHOES</h2>
					</div>
				)}
			</div>

			<div className="relative z-1 w-full">
				<div className="flex-1 space-y-2 mb-4">
					<h1 className="text-4xl font-semibold tracking-tight">The Silent Echoes</h1>
					<p className="text-muted-foreground italic">A solitary journey through the fringes of the quantum void.</p>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
						<span className="flex items-center gap-1">
							<Layers className="w-4 h-4" /> Science Fiction
						</span>
						<span className="flex items-center gap-1">
							<FileText className="w-4 h-4" /> 84,210 words
						</span>
						<span className="flex items-center gap-1">
							<Settings className="w-4 h-4" /> Edited 2 hours ago
						</span>
					</div>

					<div className="flex gap-3">
						<Button variant="outline" size="icon-sm" className="">
							<ExternalLink className="w-4 h-4" />
						</Button>
						<Button variant="outline" size="icon-sm" className="">
							<CogIcon className="w-4 h-4" />
						</Button>
						<Button variant="outline" size="sm" className="gap-2">
							<BookOpen className="w-4 h-4" /> Continue Writing
						</Button>
					</div>
				</div>
			</div>
		</section>
	)
}
