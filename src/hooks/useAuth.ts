/* ─── useAuth ───
 * Hook that wraps the Zustand auth store, exposing user, isAuthenticated,
 * isLoading, logout, and setUser for easy consumption by components.
 */

import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const logout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);
  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: !hydrated,
    logout,
    setUser,
  };
}
