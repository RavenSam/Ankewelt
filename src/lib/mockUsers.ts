export type User = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
};

export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Elena Rostova",
    username: "elena",
    avatar: "ER",
    bio: "Senior Editor & Word Weaver. Loves a good em-dash.",
  },
  {
    id: "2",
    name: "Marcus Chen",
    username: "marcus",
    avatar: "MC",
    bio: "Tech Writer. Focused on the whitespace.",
  },
  {
    id: "3",
    name: "Aisha Patel",
    username: "aisha",
    avatar: "AP",
    bio: "Creative Director. Dreaming in serif fonts.",
  },
  {
    id: "4",
    name: "Julian Ford",
    username: "julian",
    avatar: "JF",
    bio: "Novelist. Powered by espresso and anxiety.",
  },
  {
    id: "5",
    name: "Sarah Jenkins",
    username: "sarah",
    avatar: "SJ",
    bio: "Content Strategist. Keeping it brief.",
  },
  {
    id: "6",
    name: "David Kim",
    username: "david",
    avatar: "DK",
    bio: "Copywriter. Seeking the perfect verb.",
  },
];
