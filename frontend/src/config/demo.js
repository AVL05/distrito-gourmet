const rawApiUrl = import.meta.env?.VITE_API_URL || "";

// El proyecto completo utiliza siempre la API y la sesión real.
export const IS_PUBLIC_DEMO = false;
export const HAS_CONFIGURED_API = rawApiUrl.trim().length > 0;
export const USE_STATIC_DEMO_DATA = false;
