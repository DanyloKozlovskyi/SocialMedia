import { create } from "zustand";
import { Blog } from "@entities/blog-post";

type PostStore = {
  posts: Blog[];
  scrollY: number;
  setPosts: (posts: Blog[]) => void;
  setScrollY: (y: number) => void;
  clearPosts: () => void;
  page: number;
  setPage: (page: number) => void;
  incrementPage: () => void;
};

export const useHomeStore = create<PostStore>((set) => ({
  posts: [],
  scrollY: 0,
  page: 1,
  setPosts: (posts) => set({ posts }),
  setScrollY: (y) => set({ scrollY: y }),
  clearPosts: () => set({ posts: [] }),
  setPage: (page) => set({ page }),
  incrementPage: () => set((state) => ({ page: state.page + 1 })),
}));
