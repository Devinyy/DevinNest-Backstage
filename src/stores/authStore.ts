import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    username: string;
    avatar?: string;
    id?: string;
  } | null;
  login: (userInfo: { username: string; avatar?: string; id?: string }, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      login: (userInfo, token) => set({ isAuthenticated: true, user: userInfo, token }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }), 
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);
