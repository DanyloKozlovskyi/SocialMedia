import { create } from "zustand";
import { Blog } from "@entities/blog-post";

type UserAccountView = {
  posts: Blog[];
  scrollY: number;
  userId: string;
  logoKey: string | null;
  description: string;
  name: string;
  postsPage: number;
  postsHasMore: boolean;
};

type UserPostsStore = {
  stack: UserAccountView[];
  currentIndex: number;
  isLoading: boolean;

  pushView: (view: UserAccountView, scrollY?: number) => void;
  popView: () => void;
  currentView: () => UserAccountView | null;
  updateScrollY: (y: number) => void;
  setIsLoading: (loading: boolean) => void;

  appendPosts: (items: Blog[]) => void;
  incrementPostsPage: () => void;
  setPostsHasMore: (hasMore: boolean) => void;
};

export const useUserPostsStore = create<UserPostsStore>((set, get) => ({
  stack: [],
  currentIndex: -1,
  isLoading: false,

  pushView: (view, scrollY = 0) => {
    const { stack, currentIndex } = get();
    const top = stack[currentIndex];
    if (top && top.userId === view.userId) return;
    const newView: UserAccountView = { ...view, scrollY };
    const updated = [...stack.slice(0, currentIndex + 1), newView];
    set({ stack: updated, currentIndex: updated.length - 1 });
  },

  popView: () => {
    const { stack, currentIndex } = get();
    if (currentIndex <= 0) return;
    const updated = stack.slice(0, currentIndex);
    set({ stack: updated, currentIndex: updated.length - 1 });
  },

  currentView: () => {
    const { stack, currentIndex } = get();
    return stack[currentIndex] ?? null;
  },

  updateScrollY: (y) => {
    const { stack, currentIndex } = get();
    const view = stack[currentIndex];
    if (!view) return;
    const updatedView = { ...view, scrollY: y };
    const updated = [...stack];
    updated[currentIndex] = updatedView;
    set({ stack: updated });
  },

  setIsLoading: (isLoading) => set({ isLoading }),

  appendPosts: (items) => {
    const { stack, currentIndex } = get();
    const view = stack[currentIndex];
    const updatedView = { ...view, posts: [...view.posts, ...items] };
    const updated = [...stack];
    updated[currentIndex] = updatedView;
    set({ stack: updated });
  },

  incrementPostsPage: () => {
    const { stack, currentIndex } = get();
    const view = stack[currentIndex];
    const updatedView = { ...view, postsPage: view.postsPage + 1 };
    const updated = [...stack];
    updated[currentIndex] = updatedView;
    set({ stack: updated });
  },

  setPostsHasMore: (hasMore) => {
    const { stack, currentIndex } = get();
    const view = stack[currentIndex];
    const updatedView = { ...view, postsHasMore: hasMore };
    const updated = [...stack];
    updated[currentIndex] = updatedView;
    set({ stack: updated });
  },
}));
