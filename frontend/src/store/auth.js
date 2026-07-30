import api, { initializeCsrfProtection } from "@/services/api";
import { IS_PUBLIC_DEMO } from "@/config/demo";
import { demoAdminUser } from "@/data/demoAdmin";
import { create } from "zustand";

// Store de autenticación con Zustand: la sesión real vive en una cookie HttpOnly.
export const useAuthStore = create((set, get) => ({
  user: IS_PUBLIC_DEMO ? demoAdminUser : null,
  initialized: IS_PUBLIC_DEMO,
  loading: false,
  error: null,

  initialize: async () => {
    if (IS_PUBLIC_DEMO || get().initialized || get().loading) return;

    set({ loading: true });
    try {
      const response = await api.get("/user", { skipAuthRedirect: true });
      set({ user: response.data, initialized: true, loading: false });
    } catch {
      set({ user: null, initialized: true, loading: false });
    }
  },

  // Selectores para verificar el estado de autenticación y roles
  isAuthenticated: () => IS_PUBLIC_DEMO || !!get().user,
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
      await initializeCsrfProtection();
      const response = await api.post("/login", credentials);
      const { usuario: user } = response.data;

      set({ user, initialized: true, loading: false });
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
      await initializeCsrfProtection();
      const response = await api.post("/register", userData);
      const { usuario: user } = response.data;

      set({ user, initialized: true, loading: false });
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
      set({ user: demoAdminUser });
      return;
    }

    try {
      if (get().user) {
        await initializeCsrfProtection();
        await api.post("/logout");
      }
    } catch (e) {
      console.error("Error al cerrar sesion en el servidor", e);
    }

    set({ user: null, initialized: true });
  },
}));
