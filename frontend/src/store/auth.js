import api from "@/services/api";
import { IS_PUBLIC_DEMO } from "@/config/demo";
import { demoAdminUser } from "@/data/demoAdmin";
import { create } from "zustand";

// Recuperar el token guardado en el almacenamiento local al iniciar la aplicación
const savedToken = IS_PUBLIC_DEMO ? "demo-admin-token" : localStorage.getItem("token");
if (savedToken) {
  // Configurar el encabezado de autorización global para todas las peticiones a la API
  api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
}

// Store de autenticación con Zustand: controla usuario, token y operaciones de sesión
export const useAuthStore = create((set, get) => ({
  // Carga inicial del usuario desde localStorage con manejo de errores
  user: (() => {
    if (IS_PUBLIC_DEMO) {
      return demoAdminUser;
    }

    try {
      const savedUser = localStorage.getItem("user");
      return savedUser && savedUser !== "undefined"
        ? JSON.parse(savedUser)
        : null;
    } catch {
      return null;
    }
  })(),
  token: savedToken || null,
  loading: false,
  error: null,

  // Selectores para verificar el estado de autenticación y roles
  isAuthenticated: () => IS_PUBLIC_DEMO || !!get().token,
  isAdmin: () =>
    IS_PUBLIC_DEMO || ["Administrador", "admin"].includes(get().user?.rol),

  // Iniciar sesión y persistir datos en localStorage
  login: async (credentials) => {
    if (IS_PUBLIC_DEMO) {
      set({
        error: "La autenticación está desactivada en la demo pública.",
      });
      return false;
    }

    set({ loading: true, error: null });
    try {
      const response = await api.post("/login", credentials);
      const { token, usuario: user } = response.data;

      // Persistir datos de sesión
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      set({ token, user, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat()[0]
          : err.response?.data?.message || "Error al iniciar sesión",
        loading: false,
      });
      return false;
    }
  },

  // Registrar nuevo usuario
  register: async (userData) => {
    if (IS_PUBLIC_DEMO) {
      set({
        error: "El registro está desactivado en la demo pública.",
      });
      return false;
    }

    set({ loading: true, error: null });
    try {
      const response = await api.post("/register", userData);
      const { token, usuario: user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      set({ token, user, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat()[0]
          : err.response?.data?.message || "Error al registrarse",
        loading: false,
      });
      return false;
    }
  },

  // Cerrar sesión y limpiar datos locales
  logout: async () => {
    if (IS_PUBLIC_DEMO) {
      set({ user: demoAdminUser, token: "demo-admin-token" });
      return;
    }

    try {
      if (get().token && !IS_PUBLIC_DEMO) {
        await api.post("/logout");
      }
    } catch (e) {
      console.error("Error al cerrar sesion en el servidor", e);
    }

    // Limpiar almacenamiento local y estado global
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common.Authorization;
    set({ user: null, token: null });
  },
}));
