import { type Editor, mergeAttributes, Node, type Range } from "@tiptap/core"
import { type EditorState, PluginKey } from "@tiptap/pm/state"
import { ReactNodeViewRenderer, ReactRenderer } from "@tiptap/react"
import Suggestion from "@tiptap/suggestion"
import tippy, { type GetReferenceClientRect, type Instance as TippyInstance } from "tippy.js"
import { MentionList } from "./MentionList"
import { MentionNodeView } from "./MentionNodeView"

export const MentionPluginKey = new PluginKey("mention")

export const Mention = Node.create({
	name: "mention",

	addOptions() {
		return {
			HTMLAttributes: {},
			renderLabel({ node }: { options: any; node: any }) {
				return node.attrs.label ?? node.attrs.id ?? ""
			},
			suggestion: {
				char: "@",
				pluginKey: MentionPluginKey,
				command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
					editor
						.chain()
						.focus()
						.insertContentAt(range, [
							{
								type: this.name,
								attrs: props,
							},
							{
								type: "text",
								text: " ",
							},
						])
						.run()
				},
				allow: ({ state, range }: { state: EditorState; range: Range }) => {
					const $from = state.doc.resolve(range.from)
					const type = state.schema.nodes[this.name]
					const allow = !!$from.parent.type.contentMatch.matchType(type)
					return allow
				},
				render: () => {
					let component: ReactRenderer
					let popup: TippyInstance[] | undefined

					return {
						onStart: (props: any) => {
							component = new ReactRenderer(MentionList, {
								props,
								editor: props.editor,
							})

							if (!props.clientRect) return

							popup = tippy("body", {
								getReferenceClientRect: props.clientRect as GetReferenceClientRect,
								appendTo: () => document.body,
								content: component.element,
								showOnCreate: true,
								interactive: true,
								trigger: "manual",
								placement: "bottom-start",
							})
						},
						onUpdate(props: any) {
							component.updateProps(props)
							if (!props.clientRect || !popup) return
							popup[0].setProps({
								getReferenceClientRect: props.clientRect as GetReferenceClientRect,
							})
						},
						onKeyDown(props: any) {
							if (props.event.key === "Escape") {
								popup?.[0].hide()
								return true
							}
							return (component.ref as any)?.onKeyDown(props)
						},
						onExit() {
							popup?.[0].destroy()
							component.destroy()
						},
					}
				},
			},
		}
	},

	group: "inline",

	inline: true,

	selectable: false,

	atom: true,

	addAttributes() {
		return {
			id: {
				default: null,
				parseHTML: (element) => element.getAttribute("data-id"),
				renderHTML: (attributes) => {
					if (!attributes.id) return {}
					return { "data-id": attributes.id }
				},
			},
			label: {
				default: null,
				parseHTML: (element) => element.getAttribute("data-label"),
				renderHTML: (attributes) => {
					if (!attributes.label) return {}
					return { "data-label": attributes.label }
				},
			},
			kind: {
				default: "character",
				parseHTML: (element) => element.getAttribute("data-kind"),
				renderHTML: (attributes) => {
					if (!attributes.kind) return {}
					return { "data-kind": attributes.kind }
				},
			},
		}
	},

	parseHTML() {
		return [
			{
				tag: `span[data-type="${this.name}"]`,
			},
		]
	},

	renderHTML({ node, HTMLAttributes }) {
		return [
			"span",
			mergeAttributes({ "data-type": this.name }, this.options.HTMLAttributes, HTMLAttributes),
			this.options.renderLabel({
				options: this.options,
				node,
			}),
		]
	},

	renderText({ node }) {
		return this.options.renderLabel({
			options: this.options,
			node,
		})
	},

	addKeyboardShortcuts() {
		return {
			Backspace: () =>
				this.editor.commands.command(({ tr, state }) => {
					let isMention = false
					const { selection } = state
					const { empty, anchor } = selection

					if (!empty) return false

					state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
						if (node.type.name === this.name) {
							isMention = true
							tr.insertText("", pos, pos + node.nodeSize)
							return false
						}
						return true
					})

					return isMention
				}),
		}
	},

	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion,
			}),
		]
	},

	addNodeView() {
		return ReactNodeViewRenderer(MentionNodeView)
	},
})
