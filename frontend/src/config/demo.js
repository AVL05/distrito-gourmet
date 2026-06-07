const rawApiUrl = import.meta.env.VITE_API_URL || "";

export const IS_PUBLIC_DEMO = import.meta.env.VITE_DEMO_MODE === "true";
export const HAS_CONFIGURED_API = rawApiUrl.trim().length > 0;
export const USE_STATIC_DEMO_DATA = IS_PUBLIC_DEMO && !HAS_CONFIGURED_API;
