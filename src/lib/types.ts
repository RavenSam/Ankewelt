export type CommentThread = {
  id: string;
  text: string;
  authorId: string;
  content: string;
  createdAt: number;
  resolved: boolean;
  replies: CommentReply[];
};

export type CommentReply = {
  id: string;
  authorId: string;
  content: string;
  createdAt: number;
};

export type Highlight = {
  id: string;
  text: string;
  color: string;
  context: string;
  from: number;
  to: number;
};

export const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: 'yellow', class: 'bg-yellow-300' },
  { name: 'Green', value: 'green', class: 'bg-green-300' },
  { name: 'Blue', value: 'blue', class: 'bg-blue-300' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-300' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-300' },
] as const;

export type EditorTheme = {
  fontFamily: string;
  fontSize: number;
  colorPalette: 'paper' | 'cream' | 'ink' | 'midnight';
};
