import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { Mail, MapPin, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { MOCK_LOCATIONS } from "@/lib/mockLocations"
import { MOCK_USERS } from "@/lib/mockUsers"

export const MentionNodeView = (props: NodeViewProps) => {
	const kind = props.node.attrs.kind as "character" | "location" | undefined

	if (kind === "location") {
		const location = MOCK_LOCATIONS.find((l) => l.id === props.node.attrs.id)

		if (!location) {
			return (
				<NodeViewWrapper className="inline-block">
				<span className="mention-chip">{props.node.attrs.label}</span>
			</NodeViewWrapper>
		)
	}

	return (
		<NodeViewWrapper className="inline-block">
			<HoverCard>
				<HoverCardTrigger asChild>
					<span className="mention-chip-location">{location.name}</span>
				</HoverCardTrigger>
					<HoverCardContent className="w-80 p-4" align="start">
						<div className="flex justify-between space-x-4">
							<div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
								<MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
							</div>
							<div className="space-y-1 flex-1">
								<div className="flex items-center gap-2">
									<h4 className="text-sm font-semibold">{location.name}</h4>
									<Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
										{location.type}
									</Badge>
								</div>
								<p className="text-sm text-muted-foreground pt-1">{location.description}</p>
							</div>
						</div>
					</HoverCardContent>
				</HoverCard>
			</NodeViewWrapper>
		)
	}

	const user = MOCK_USERS.find((u) => u.id === props.node.attrs.id)

	if (!user) {
		return (
			<NodeViewWrapper className="inline-block">
			<span className="mention-chip">{props.node.attrs.label}</span>
		</NodeViewWrapper>
	)
}

return (
	<NodeViewWrapper className="inline-block">
		<HoverCard>
			<HoverCardTrigger asChild>
				<span className="mention-chip">{user.username}</span>
				</HoverCardTrigger>
				<HoverCardContent className="w-80 p-4" align="start">
					<div className="flex justify-between space-x-4">
						<Avatar className="h-12 w-12">
							<AvatarFallback>{user.avatar}</AvatarFallback>
						</Avatar>
						<div className="space-y-1 flex-1">
							<h4 className="text-sm font-semibold">{user.name}</h4>
							<p className="text-sm text-muted-foreground">@{user.username}</p>
							<p className="text-sm pt-2">{user.bio}</p>
							<div className="flex items-center pt-4 space-x-2">
								<Button variant="outline" size="sm" className="h-8">
									<MessageSquare className="mr-2 h-4 w-4" />
									Message
								</Button>
								<Button variant="outline" size="sm" className="h-8">
									<Mail className="mr-2 h-4 w-4" />
									Email
								</Button>
							</div>
						</div>
					</div>
				</HoverCardContent>
			</HoverCard>
		</NodeViewWrapper>
	)
}
