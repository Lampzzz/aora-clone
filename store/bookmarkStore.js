import { create } from "zustand";

import { useAuthStore } from "./authStore";
import { getAllBookmarkPosts, toggleBookmark } from "@/firebase/firestore";

export const useBookmarkStore = create((set, get) => ({
  bookmarks: [],
  isLoading: false,
  refreshing: false,

  setLoading: (loading) => set({ isLoading: loading }),
  setRefreshing: (refreshing) => set({ refreshing }),

  handleError: (error) => {
    console.error("Error:", error);
  },

  fetchBookmarks: async () => {
    const { currentUser } = useAuthStore.getState();
    if (!currentUser) return;

    get().setLoading(true);

    try {
      const bookmarks = await getAllBookmarkPosts(currentUser.id);
      set({ bookmarks });
    } catch (error) {
      get().handleError(error);
    } finally {
      get().setLoading(false);
    }
  },

  togglePostBookmark: async (postId) => {
    const { currentUser } = useAuthStore.getState();
    if (!currentUser) return;

    try {
      const message = await toggleBookmark(currentUser.id, postId);
      await get().fetchBookmarks();
      return message;
    } catch (error) {
      get().handleError(error);
    }
  },

  refetch: async () => {
    get().setRefreshing(true);
    await get().fetchBookmarks();
    get().setRefreshing(false);
  },
}));
