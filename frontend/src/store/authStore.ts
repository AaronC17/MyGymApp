import { create } from 'zustand';
import { User, getUser, setUser, removeToken, setToken } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== 'undefined' ? getUser() : null,
  isAuthenticated: typeof window !== 'undefined' ? getUser() !== null : false,
  login: (token: string, user: User) => {
    setToken(token);
    setUser(user);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    removeToken();
    set({ user: null, isAuthenticated: false });
  },
  updateUser: (user: User) => {
    setUser(user);
    set({ user });
  },
}));

