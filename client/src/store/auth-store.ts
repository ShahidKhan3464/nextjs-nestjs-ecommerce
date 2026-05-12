import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/modules/auth/types";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User) => void;
  setAccessToken: (accessToken: string) => void;
  setSession: (user: User, accessToken: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setSession: (user, accessToken) => set({ user, accessToken }),
      clearSession: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}
