import { create } from 'zustand';
import client from '../api/client';

interface User {
  id: number;
  phone: string;
  name: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (phone: string, password: string) => Promise<void>;
  register: (phone: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  login: async (phone, password) => {
    const res = await client.post('/auth/login', { phone, password });
    const { token, user } = res.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },

  register: async (phone, password, name) => {
    const res = await client.post('/auth/register', { phone, password, name });
    const { token, user } = res.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr) });
    }
  },
}));
