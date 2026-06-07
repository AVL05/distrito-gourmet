import axios from "axios";
import { HAS_CONFIGURED_API, IS_PUBLIC_DEMO } from "@/config/demo";

// Configuración de la URL base de la API desde las variables de entorno
const rawApiUrl = import.meta.env.VITE_API_URL || "";
export const API_URL = rawApiUrl.replace(/\/+$/, "");
export { HAS_CONFIGURED_API };

// Instancia de Axios preconfigurada para el backend
const api = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : "/api",
  headers: {
    Accept: "application/json",
  },
});

// Incluir automáticamente el token de autenticación en cada petición si existe en localStorage
api.interceptors.request.use((config) => {
  if (IS_PUBLIC_DEMO && ["post", "put", "patch", "delete"].includes(config.method)) {
    return Promise.reject({
      response: {
        data: {
          mensaje: "Los cambios están desactivados en la demo pública.",
          message: "Los cambios están desactivados en la demo pública.",
        },
      },
    });
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!IS_PUBLIC_DEMO && error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common.Authorization;

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
