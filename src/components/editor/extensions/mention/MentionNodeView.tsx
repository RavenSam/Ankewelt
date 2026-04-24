import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { Mail, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { MOCK_USERS } from "@/lib/mockUsers"

export const MentionNodeView = (props: NodeViewProps) => {
	const user = MOCK_USERS.find((u) => u.id === props.node.attrs.id)

	if (!user) {
		return (
			<NodeViewWrapper className="inline-block">
				<span className="mention-chip">@{props.node.attrs.label}</span>
			</NodeViewWrapper>
		)
	}

	return (
		<NodeViewWrapper className="inline-block">
			<HoverCard>
				<HoverCardTrigger asChild>
					<span className="mention-chip">@{user.username}</span>
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
