import { create } from "zustand";
import { useAuthStore } from "./authStore";
import {
  deletePost,
  editPost,
  getAllPosts,
  getAllUserPosts,
  getPost,
  newPost,
} from "@/firebase/firestore";

export const usePostStore = create((set, get) => ({
  posts: [],
  userPosts: [],
  post: {},
  isLoading: false,
  refreshing: false,

  setLoading: (loading) => set({ isLoading: loading }),

  handleError: (error) => {
    console.error("Error:", error);
    Alert.alert("Error", error.message || "Something went wrong");
    set({ post: null });
  },

  fetchPosts: async () => {
    get().setLoading(true);
    try {
      const posts = await getAllPosts();
      set({ posts });
    } catch (error) {
      get().handleError(error);
    } finally {
      get().setLoading(false);
    }
  },

  fetchPost: async (postId) => {
    get().setLoading(true);
    try {
      const post = await getPost(postId);
      set({ post });
    } catch (error) {
      get().handleError(error);
    } finally {
      get().setLoading(false);
    }
  },

  fetchUserPosts: async () => {
    const { currentUser } = useAuthStore.getState();
    if (!currentUser) return;

    get().setLoading(true);
    try {
      const userPosts = await getAllUserPosts(currentUser.id);
      set({ userPosts });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      get().setLoading(false);
    }
  },

  refetch: async (isUserPosts = false) => {
    set({ refreshing: true });
    if (isUserPosts) {
      await get().fetchUserPosts();
    } else {
      await get().fetchPosts();
    }
    set({ refreshing: false });
  },

  addPost: async (data) => {
    const { currentUser } = useAuthStore.getState();
    if (!currentUser) return;

    try {
      await newPost(currentUser.id, data.title, data.video, data.thumbnail);
      await get().fetchUserPosts();
    } catch (error) {
      console.error("Error:", error);
    }
  },

  updatePost: async (postId, data) => {
    try {
      await editPost(postId, data);
      await get().refetch();
    } catch (error) {
      console.error("Error:", error);
    }
  },

  removePost: async (postId) => {
    try {
      await deletePost(postId);
      await get().refetch();
    } catch (error) {
      console.error("Error:", error);
    }
  },
}));
