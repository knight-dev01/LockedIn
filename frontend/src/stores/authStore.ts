import { create } from "zustand";
import { User } from "@/lib/types";
import { authAPI } from "@/lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("lockedin_token") : null,
  isLoading: true,

  setAuth: (user, token) => {
    localStorage.setItem("lockedin_token", token);
    set({ user, token, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem("lockedin_token");
    set({ user: null, token: null, isLoading: false });
  },

  loadUser: async () => {
    const token = localStorage.getItem("lockedin_token");
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const res = await authAPI.me();
      set({ user: res.data, token, isLoading: false });
    } catch {
      localStorage.removeItem("lockedin_token");
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
