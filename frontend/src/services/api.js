import axios from "axios";

// Configuración de la URL base de la API desde las variables de entorno
const rawApiUrl = import.meta.env.VITE_API_URL || "";
export const API_URL = rawApiUrl.replace(/\/+$/, "");

// Instancia de Axios preconfigurada para el backend
const api = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : "/api",
  headers: {
    Accept: "application/json",
  },
});

// Incluir automáticamente el token de autenticación en cada petición si existe en localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export default api;
