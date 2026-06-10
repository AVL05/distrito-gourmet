/* global process */
import react from "@vitejs/plugin-react";

import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendTarget = env.VITE_API_URL?.trim();

  return {
    server: {
      host: "0.0.0.0",
      port: 5173,
      ...(backendTarget
        ? {
            // Proxy /api/* hacia el backend configurado por entorno.
            proxy: {
              "/api": {
                target: backendTarget,
                changeOrigin: true,
                secure: false,
              },
            },
          }
        : {}),
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            motion: ["gsap", "@gsap/react", "lenis"],
            alerts: ["sweetalert2"],
          },
        },
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.js",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
