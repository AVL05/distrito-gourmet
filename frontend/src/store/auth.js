import axios from 'axios';
import { create } from 'zustand';

// Configuración base de axios para conectar con la API de Laravel
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
axios.defaults.headers.common['Accept'] = 'application/json';

// Recuperar token guardado en localStorage para mantener la sesión
const savedToken = localStorage.getItem('token');
if (savedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

// Store de autenticación usando Zustand
export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: savedToken || null,
  loading: false,
  error: null,

  // Verificar si el usuario está logueado
  isAuthenticated: () => !!get().token,

  // Verificar si el usuario es administrador
  isAdmin: () => get().user?.role === 'admin',

  // Iniciar sesión con email y contraseña
  login: async credentials => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/login', credentials);
      const { token, user } = response.data;

      // Guardar token y usuario en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ token, user, loading: false });
      return true;
    } catch (err) {
      // Manejar errores de login
      set({
        error: err.response?.data?.message || err.response?.data?.email?.[0] || 'Error al iniciar sesión',
        loading: false,
      });
      return false;
    }
  },

  // Registrar nuevo usuario
  register: async userData => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/register', userData);
      const { token, user } = response.data;

      // Guardar token y usuario en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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

  // Cerrar sesión
  logout: async () => {
    try {
      if (get().token) {
        await axios.post('/logout');
      }
    } catch (e) {
      console.error('Error al cerrar sesión en el servidor', e);
    }
    // Limpiar datos locales
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, token: null });
  },
}));
