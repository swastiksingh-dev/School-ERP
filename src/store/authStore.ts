/* ─── authStore ───
 * Zustand store for authentication state (user, hydration, logout).
 * Persists user data to localStorage under the 'bbps-auth' key.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser } from '../types';

interface AuthState {
  user: AppUser | null;
  hydrated: boolean;
  setUser: (user: AppUser | null) => void;
  setHydrated: (v: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      setUser: (user) => set({ user }),
      setHydrated: (v) => set({ hydrated: v }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'bbps-auth',
      partialize: (s) => ({ user: s.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
