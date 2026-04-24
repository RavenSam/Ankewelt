import { useNavigate } from "@tanstack/react-router"
import { nanoid } from "nanoid"
import { useState } from "react"
import { toast } from "sonner"
import { createBook } from "@/actions/book-actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getCurrentUser } from "@/helpers/get-current-user"

const GENRES = ["Sci-Fi", "Fantasy", "Romance", "Thriller", "Horror", "Mystery", "Historical"]

const COLORS = ["#0f172a", "#1e293b", "#334155", "#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899", "#f97316"]

export function CreateBookDialog({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate()

	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const [form, setForm] = useState({
		title: "",
		description: "",
		genre: "",
		color: COLORS[0],
	})

	async function handleCreate() {
		if (!form.title.trim()) return

		try {
			setLoading(true)

			const currentUser = await getCurrentUser()

			if (!currentUser) {
				console.log("Failed book creation: No user")
				return
			}

			const newBook = await createBook({
				id: nanoid(),
				user_id: currentUser.id,
				title: form.title,
				description: form.description || null,
				genre: form.genre || null,
				coverUrl: form.color,
			})

			toast.success("Book created")

			// reset
			setForm({
				title: "",
				description: "",
				genre: "",
				color: COLORS[0],
			})

			setOpen(false)

			navigate({
				to: "/books/$bookId",
				params: { bookId: newBook.id },
			})
		} catch {
			toast.error("Failed to create book")
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Create a new book</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-2">
					<Input
						autoFocus
						placeholder="Book title"
						value={form.title}
						onChange={(e) => setForm({ ...form, title: e.target.value })}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleCreate()
						}}
					/>

					<Select value={form.genre} onValueChange={(value) => setForm({ ...form, genre: value })}>
						<SelectTrigger>
							<SelectValue placeholder="Select genre (optional)" />
						</SelectTrigger>
						<SelectContent>
							{GENRES.map((g) => (
								<SelectItem key={g} value={g}>
									{g}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Textarea
						placeholder="Short description (optional)"
						value={form.description}
						onChange={(e) =>
							setForm({
								...form,
								description: e.target.value,
							})
						}
					/>
				</div>

				<DialogFooter className="gap-2">
					<Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
						Cancel
					</Button>
					<Button onClick={handleCreate} disabled={!form.title.trim() || loading}>
						{loading ? "Creating..." : "Create"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
