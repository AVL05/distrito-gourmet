import api from '@/services/api';
import { create } from 'zustand';

const savedToken = localStorage.getItem('token');
if (savedToken) {
  api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
}

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: savedToken || null,
  loading: false,
  error: null,

  isAuthenticated: () => !!get().token,
  isAdmin: () => get().user?.role === 'admin',

  login: async credentials => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/login', credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      set({ token, user, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.response?.data?.email?.[0] || 'Error al iniciar sesion',
        loading: false,
      });
      return false;
    }
  },

  register: async userData => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/register', userData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      set({ token, user, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al registrarse',
        loading: false,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      if (get().token) {
        await api.post('/logout');
      }
    } catch (e) {
      console.error('Error al cerrar sesion en el servidor', e);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common.Authorization;
    set({ user: null, token: null });
  },
}));
