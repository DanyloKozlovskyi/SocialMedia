import { create } from "zustand";
import User from "@api/models/user";

type UserSearchStore = {
  users: User[];
  lastQuery: string;
  page: number;
  hasMore: boolean;
  scrollY: number;

  setUsers: (users: User[], query: string) => void;
  appendUsers: (users: User[]) => void;
  clearUsers: () => void;
  setLastQuery: (query: string) => void;
  setPage: (page: number) => void;
  setHasMore: (v: boolean) => void;
  setScrollY: (y: number) => void;
};

export const useUserSearchStore = create<UserSearchStore>((set) => ({
  users: [],
  lastQuery: "",
  page: 1,
  hasMore: true,
  scrollY: 0,

  setUsers: (users, query) => set({ users, lastQuery: query }),
  appendUsers: (users) =>
    set((state) => ({ users: [...state.users, ...users] })),
  clearUsers: () => set({ users: [], lastQuery: "", page: 1, hasMore: false }),
  setLastQuery: (query) => set({ lastQuery: query }),
  setPage: (page) => set({ page }),
  setHasMore: (v) => set({ hasMore: v }),
  setScrollY: (y) => set({ scrollY: y }),
}));
