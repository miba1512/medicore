import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,

      login: (token, user) => set({ token, user, role: user.role }),
      logout: () => set({ token: null, user: null, role: null }),
    }),
    { name: 'medicore-auth' }
  )
)
