import { type Editor, Extension, type Range } from "@tiptap/core"
import { ReactRenderer } from "@tiptap/react"
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion"
import tippy, { type GetReferenceClientRect } from "tippy.js"
import { SlashMenuList } from "./SlashMenuList"

export const SlashMenu = Extension.create({
	name: "slashMenu",

	addOptions() {
		return {
			suggestion: {
				char: "/",
				command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
					props.command({ editor, range })
				},
			} as Partial<SuggestionOptions>,
		}
	},

	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion,
				render: () => {
					let component: ReactRenderer
					let popup: any

					return {
						onStart: (props) => {
							component = new ReactRenderer(SlashMenuList, {
								props,
								editor: props.editor,
							})

							if (!props.clientRect) {
								return
							}

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
						onUpdate(props) {
							component.updateProps(props)

							if (!props.clientRect) {
								return
							}

							popup[0].setProps({
								getReferenceClientRect: props.clientRect as GetReferenceClientRect,
							})
						},
						onKeyDown(props) {
							if (props.event.key === "Escape") {
								popup[0].hide()
								return true
							}

							return (component.ref as any)?.onKeyDown(props)
						},
						onExit() {
							popup[0].destroy()
							component.destroy()
						},
					}
				},
			}),
		]
	},
})
