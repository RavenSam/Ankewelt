import { Mark, mergeAttributes } from '@tiptap/core';

export interface CommentOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    comment: {
      setComment: (attributes: { id: string }) => ReturnType;
      unsetComment: (id: string) => ReturnType;
    };
  }
}

export const CommentMark = Mark.create<CommentOptions>({
  name: 'comment',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'comment-mark',
      },
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          if (!attributes.id) return {};
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
        tag: 'span[data-id]',
        getAttrs: (node) => {
          if (typeof node === 'string') return false;
          if ((node as HTMLElement).classList.contains('comment-mark')) {
            return null;
          }
          return false;
        }
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setComment: attributes => ({ commands }) => {
        return commands.setMark(this.name, attributes);
      },
      unsetComment: id => ({ tr, dispatch }) => {
        const { doc } = tr;
        let hasChanged = false;
        
        doc.descendants((node, pos) => {
          const marks = node.marks;
          const commentMark = marks.find(mark => mark.type.name === this.name && mark.attrs.id === id);
          
          if (commentMark) {
            tr.removeMark(pos, pos + node.nodeSize, commentMark);
            hasChanged = true;
          }
        });
        
        if (hasChanged && dispatch) {
          dispatch(tr);
          return true;
        }
        
        return false;
      },
    };
  },
});
