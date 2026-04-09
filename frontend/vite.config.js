/* eslint-env node */
/* global process */
import react from "@vitejs/plugin-react";



import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.VITE_API_URL || 'http://localhost:8000';

  return {
    server: {
      host: '0.0.0.0',
      port: 5173,
      // Proxy /api/* → Laravel backend (runs server-side, no CORS/Private Network Access in browser)
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

