import { create } from "zustand";
import Blog from "@api/models/blog";

type PostSearchStore = {
  posts: Blog[];
  lastQuery: string;
  page: number;
  hasMore: boolean;
  scrollY: number;

  setPosts: (posts: Blog[], query: string) => void;
  appendPosts: (posts: Blog[]) => void;
  clearPosts: () => void;
  setLastQuery: (query: string) => void;
  setPage: (page: number) => void;
  setHasMore: (v: boolean) => void;
  setScrollY: (y: number) => void;
};

export const usePostSearchStore = create<PostSearchStore>((set) => ({
  posts: [],
  lastQuery: "",
  page: 1,
  hasMore: true,
  scrollY: 0,

  setPosts: (posts, query) => set({ posts, lastQuery: query }),
  appendPosts: (posts) => set(state => ({ posts: [...state.posts, ...posts] })),
  clearPosts: () => set({ posts: [], lastQuery: "", page: 1, hasMore: false }),
  setLastQuery: (query) => set({ lastQuery: query }),
  setPage: (page) => set({ page }),
  setHasMore: (v) => set({ hasMore: v }),
  setScrollY: (y) => set({ scrollY: y }),
}));
