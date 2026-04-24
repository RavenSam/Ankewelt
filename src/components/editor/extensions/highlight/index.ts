import { Mark } from '@tiptap/core';

export interface HighlightOptions {
  multicolor: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    highlight: {
      setHighlight: (attributes?: { color: string; id?: string }) => ReturnType;
      toggleHighlight: (attributes?: { color: string; id?: string }) => ReturnType;
      unsetHighlight: () => ReturnType;
    };
  }
}

export const CustomHighlight = Mark.create<HighlightOptions>({
  name: 'customHighlight',

  addOptions() {
    return {
      multicolor: true,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      color: {
        default: 'yellow',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-color') || 'yellow',
        renderHTML: (attributes: Record<string, any>) => {
          return {
            'data-color': attributes.color,
            class: `highlight-${attributes.color}`,
          };
        },
      },
      id: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-id'),
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.id) {
            return {};
          }
          return {
            'data-id': attributes.id,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'mark',
      },
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['mark', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setHighlight: attributes => ({ commands }) => {
        return commands.setMark(this.name, attributes);
      },
      toggleHighlight: attributes => ({ commands }) => {
        return commands.toggleMark(this.name, attributes);
      },
      unsetHighlight: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },
});
