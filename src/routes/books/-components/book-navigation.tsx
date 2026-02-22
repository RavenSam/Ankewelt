import { Link, useMatchRoute, useParams } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function BookNavigation() {
	const matchRoute = useMatchRoute()
	const { bookId } = useParams({ strict: false })

	const navItems = [
		{ name: "Overview", to: "/books/$bookId", params: { bookId }, exact: true },
		{ name: "Chapters", to: "/books/$bookId/chapters", params: { bookId } },
		{ name: "Characters", to: "/books/$bookId/characters", params: { bookId } },
		{ name: "Locations", to: "/books/$bookId/locations", params: { bookId } },
		{ name: "Plot", to: "/books/$bookId/plot", params: { bookId } },
	]

	return (
		<nav className="flex items-center gap-8 border-b border-border w-full relative">
			{navItems.map((item) => {
				const isActive = matchRoute({
					to: item.to,
					params: item.params,
					fuzzy: !item.exact, // allows nested routes to stay active
				})

				return (
					<Link
						key={item.name}
						to={item.to}
						params={item.params}
						preload="render"
						className={cn(
							"relative pb-3 text-sm font-medium transition-colors flex items-center gap-1.5 outline-none",
							isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
						)}
					>
						<span>{item.name}</span>

						{isActive && (
							<motion.div
								layoutId="activeUnderline"
								className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
								transition={{ type: "spring", stiffness: 380, damping: 30 }}
							/>
						)}
					</Link>
				)
			})}
		</nav>
	)
}
