import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type AuthState = {
  token: string | null
  role: string | null
  username: string | null
  isAuthenticated: boolean

  setToken: (token: string | null) => void
  login: (token: string, role?: string | null, username?: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      username: null,
      isAuthenticated: false,

      setToken: (token) =>
        set({
          token,
          isAuthenticated: !!token,
        }),

      login: (token, role = null, username = null) =>
        set({
          token,
          role,
          username,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          role: null,
          username: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "starpay-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        token: s.token,
        role: s.role,
        username: s.username,
        isAuthenticated: s.isAuthenticated,
      }),
      skipHydration: true,
      version: 1,
    }
  )
)
