import { createFileRoute } from "@tanstack/react-router"
import { Editor } from "@/components/editor/Editor"

export const Route = createFileRoute("/chapters/$chapterId")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<Editor />
		</div>
	)
}
