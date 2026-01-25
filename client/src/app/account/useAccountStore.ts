import { create } from "zustand";
import { Blog } from "@entities/blog-post";

type AccountStore = {
  posts: Blog[];
  scrollY: number;
  page: number;
  hasMore: boolean;

  setPosts: (posts: Blog[]) => void;
  appendPosts: (posts: Blog[]) => void;
  setScrollY: (y: number) => void;
  setPage: (page: number) => void;
  incrementPage: () => void;
  setHasMore: (has: boolean) => void;

  userId: string;
  logoKey: string | null;
  description: string;
  name: string;

  setUserId: (id: string) => void;
  setLogoKey: (l: string | null) => void;
  setDescription: (d: string) => void;
  setName: (n: string) => void;
};

export const useAccountStore = create<AccountStore>((set) => ({
  posts: [],
  scrollY: 0,
  page: 1,
  hasMore: true,

  setPosts: (posts) => set({ posts }),
  appendPosts: (posts) =>
    set((state) => ({ posts: [...state.posts, ...posts] })),
  setScrollY: (y) => set({ scrollY: y }),
  setPage: (page) => set({ page }),
  incrementPage: () => set((s) => ({ page: s.page + 1 })),
  setHasMore: (has) => set({ hasMore: has }),

  userId: "",
  logoKey: null,
  description: "",
  name: "",

  setUserId: (id) => set({ userId: id }),
  setLogoKey: (l) => set({ logoKey: l }),
  setDescription: (d) => set({ description: d }),
  setName: (n) => set({ name: n }),
}));
