import { create } from "zustand";
import type { User, AuthResponse } from "../types/auth.type";
import { setTokens, clearTokens, getTokens } from "@/shared/api/interceptors";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  setAuth: (response: AuthResponse) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: !!getTokens()?.access,

  setAuth: (response) => {
    setTokens({ access: response.access, refresh: response.refresh });
    set({ user: response.user, isAuthenticated: true });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false });
  },
}));
