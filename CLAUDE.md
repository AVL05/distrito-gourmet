# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Instalar todas las dependencias
npm run install:all

# Levantar entorno completo (Laravel + Vite en paralelo)
npm start

# Solo frontend
cd frontend && npm run dev
cd frontend && npm run build
cd frontend && npm run lint

# Solo backend
cd backend && php artisan serve
cd backend && php artisan test
cd backend && php artisan test --filter=NombreDelTest   # test individual
cd backend && php artisan migrate --seed
cd backend && php artisan route:list --path=api
```

## Architecture

Headless SPA + REST API. Frontend and backend are fully decoupled and communicate exclusively via `/api` prefix.

### Frontend (`frontend/src/`)

- **Framework**: React 19 + Vite 7, routing via React Router DOM
- **State**: Zustand (`store/auth.js`, `store/cart.js`) — persists token/user in `localStorage`
- **Styling**: Tailwind CSS with a custom design system (colors: `primary`, `bg-body`, `bg-surface`, `text-main`, `text-muted`; fonts: `font-heading` = Playfair Display, `font-body` = Inter)
- **Animations**: GSAP + `@gsap/react` (`useGSAP` hook). Reusable animation primitives live in `src/motion/`. Smooth scroll via Lenis (`src/components/layout/SmoothScroll.jsx`)
- **All pages** are lazy-loaded via `React.lazy` + `Suspense` with a `PageLoader` spinner
- **`src/config/demo.js`**: Controls demo mode via `VITE_DEMO_MODE` env var. When active, write operations are blocked at the Axios interceptor level and static data is served from `src/data/`
- **API client**: `src/services/api.js` — Axios instance. Base URL from `VITE_API_URL`; 401 responses auto-redirect to `/login`

### Backend (`backend/`)

- **Framework**: Laravel 12, PHP 8.2+
- **Auth**: Laravel Sanctum (Bearer token). Three middleware tiers: public, `auth:sanctum`, `staff`, `admin`
- **Structure**: `app/Http/Controllers/API/` → controllers; `app/Models/` → Eloquent models; `app/Services/` → business logic; `app/Notifications/` → email notifications
- **Routes**: All API routes in `routes/api.php`. Public routes have `throttle:auth` on write endpoints

### Key architectural constraints

- Never hardcode `localhost`, LAN IPs, or ports in source — use `.env` variables only
- Frontend calls always use `/api` prefix (proxied in dev via Vite config, routed directly in Docker)
- Demo mode (`IS_PUBLIC_DEMO`) short-circuits auth and mutating API calls — check this flag before adding new write operations
- `prefers-reduced-motion` is respected globally in `index.css` — GSAP animations must account for this
