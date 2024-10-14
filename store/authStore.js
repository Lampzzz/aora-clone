import { create } from "zustand";

import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "@firebase/auth";
import { getUserData } from "@/firebase/firestore";

export const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  isLoading: false,
  currentUser: null,

  fetchUserData: async (uid) => {
    try {
      const userData = await getUserData(uid);
      set({ currentUser: userData });
    } catch (error) {
      set({ currentUser: null });
      throw new Error(error);
    }
  },

  initializeAuthListener: () => {
    set({ isLoading: true });

    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        await get().fetchUserData(userAuth.uid);
        set({ isAuthenticated: true });
      } else {
        set({ isAuthenticated: false, currentUser: null });
      }

      set({ isLoading: false });
    });

    return unsubscribe;
  },
}));
