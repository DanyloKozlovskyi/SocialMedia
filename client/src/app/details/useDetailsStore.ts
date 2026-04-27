import { create } from "zustand";
import { Blog } from "@entities/blog-post";

interface PostView {
  post: Blog | null;
  scrollY: number;
  parents: Blog[];
  comments: Blog[];
  commentsPage: number;
  commentsHasMore: boolean;
}

interface DetailsStore {
  stack: PostView[];
  currentIndex: number;

  isLoadingPost: boolean;
  isLoadingComments: boolean;

  pushView: (post: Blog | null, comments: Blog[], parents: Blog[]) => void;
  popView: () => void;
  updateScrollY: (y: number) => void;

  // comments pagination actions for current view
  appendComments: (items: Blog[]) => void;
  incrementCommentsPage: () => void;
  setCommentsHasMore: (v: boolean) => void;
  setIsLoadingComments: (v: boolean) => void;

  setIsLoadingPost: (v: boolean) => void;
}

export const useDetailsStore = create<DetailsStore>((set, get) => ({
  stack: [],
  currentIndex: -1,
  isLoadingPost: false,
  isLoadingComments: false,

  pushView: (post, comments, parents) => {
    const { stack, currentIndex } = get();
    if (stack[currentIndex]?.post?.id === post?.id) return;
    const newView: PostView = {
      post,
      scrollY: 0,
      parents,
      comments,
      commentsPage: 1,
      commentsHasMore: true,
    };
    const newStack = [...stack.slice(0, currentIndex + 1), newView];
    set({ stack: newStack, currentIndex: newStack.length - 1 });
  },

  popView: () => {
    const { stack, currentIndex } = get();
    if (currentIndex < 0) return;
    const newStack = stack.slice(0, currentIndex);
    set({ stack: newStack, currentIndex: newStack.length - 1 });
  },

  updateScrollY: (y) => {
    const { stack, currentIndex } = get();
    if (currentIndex < 0) return;
    const view = stack[currentIndex];
    const updated = { ...view, scrollY: y };
    const newStack = [...stack];
    newStack[currentIndex] = updated;
    set({ stack: newStack });
  },

  appendComments: (items) => {
    const { stack, currentIndex } = get();
    const view = stack[currentIndex];
    const updated = { ...view, comments: [...view.comments, ...items] };
    const newStack = [...stack];
    newStack[currentIndex] = updated;
    set({ stack: newStack });
  },
  incrementCommentsPage: () => {
    const { stack, currentIndex } = get();
    const view = stack[currentIndex];
    const updated = { ...view, commentsPage: view.commentsPage + 1 };
    const newStack = [...stack];
    newStack[currentIndex] = updated;
    set({ stack: newStack });
  },
  setCommentsHasMore: (v) => {
    const { stack, currentIndex } = get();
    const view = stack[currentIndex];
    const updated = { ...view, commentsHasMore: v };
    const newStack = [...stack];
    newStack[currentIndex] = updated;
    set({ stack: newStack });
  },
  setIsLoadingComments: (v) => set({ isLoadingComments: v }),

  setIsLoadingPost: (v) => set({ isLoadingPost: v }),
}));
