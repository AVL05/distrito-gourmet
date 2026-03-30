# 📌 Nombre del Proyecto
**Distrito Gourmet** es una aplicación web full-stack para la gestión integral de un restaurante de alta cocina.  
Objetivo: ofrecer una experiencia completa para clientes y administración, integrando carta digital, reservas y pedidos desde un frontend SPA y una API REST.  
Contexto: proyecto académico con enfoque en arquitectura moderna y separación clara entre frontend y backend.

# 🏗️ Arquitectura del Proyecto
El proyecto se organiza en dos aplicaciones desacopladas:
- **Frontend SPA** en React + Vite, responsable de la interfaz, navegación y experiencia de usuario.
- **Backend API REST** en Laravel, responsable de la lógica de negocio, autenticación y acceso a datos.

Separación de responsabilidades (frontend):
- **Componentes** reutilizables en `frontend/src/components/`.
- **Páginas/Vistas** en `frontend/src/pages/` para cada ruta principal.
- **Layouts** en `frontend/src/layouts/` para composición estructural.
- **Estado global** en `frontend/src/store/` con Zustand (auth, carrito, etc.).
- **Animaciones y motion** en `frontend/src/motion/`.
- **Datos/servicios** en `frontend/src/data/` (carpeta reservada para fuentes de datos o servicios).

Patrón de arquitectura utilizado:
- **Frontend**: arquitectura basada en componentes con rutas SPA (React Router).
- **Backend**: Laravel MVC para controladores, modelos y rutas.

# 📁 Estructura de Carpetas
Árbol principal del proyecto:
```
distrito-gourmet/
├── backend/
├── frontend/
├── scripts/
├── package.json
├── README.md
└── Documentacion.md
```

Carpetas y archivos relevantes:
- `backend/` — API REST con Laravel.
- `frontend/` — aplicación React + Vite.
- `scripts/` — scripts de desarrollo (por ejemplo, arranque conjunto).
- `package.json` — scripts raíz del monorepo.
- `README.md` — documentación general.

Detalle de `frontend/src/`:
```
frontend/src/
├── assets/
├── components/
├── data/
├── layouts/
├── motion/
├── pages/
├── store/
├── App.jsx
├── index.css
└── main.jsx
```

Detalle de `backend/` (Laravel):
```
backend/
├── app/
├── config/
├── database/
├── public/
├── routes/
└── composer.json
```

# ⚙️ Instalación y Configuración
Requisitos previos:
- Node.js `>= 18`
- npm `>= 9`
- PHP `>= 8.2`
- Composer `>= 2`

Instalación de dependencias (raíz):
```bash
npm run install:all
```

Variables de entorno:
- Backend: crear `backend/.env` a partir de `backend/.env.example`.
- Frontend: configurar variables en `frontend/.env` si se requieren (placeholders).

Ejemplo de variables típicas (placeholders):
```env
APP_KEY=<<GENERADO_POR_LARAVEL>>
DB_CONNECTION=sqlite
SANCTUM_STATEFUL_DOMAINS=localhost:5173
VITE_API_BASE_URL=<<URL_API_BASE>>
```

# 🚀 Scripts Disponibles
Scripts en la raíz (`package.json`):
- `npm start` — inicia frontend y backend simultáneamente usando `scripts/dev.js`.
- `npm run install:all` — instala dependencias de backend y frontend.

Scripts en `frontend/package.json`:
- `npm run dev` — servidor de desarrollo con Vite.
- `npm run build` — build de producción (genera `frontend/dist/`).
- `npm run preview` — previsualización del build.
- `npm run lint` — análisis con ESLint.

Scripts en `backend/composer.json`:
- `composer run dev` — arranque de servidor, cola, logs y Vite en paralelo.
- `composer run test` — ejecuta pruebas con `php artisan test`.
- `composer run setup` — instalación y configuración base (Laravel + build).

# 🧩 Tecnologías Utilizadas
Frontend:
- React
- Vite
- Tailwind CSS
- React Router
- Zustand
- Axios
- Framer Motion
- SweetAlert2
- React Icons

Backend:
- Laravel
- Laravel Sanctum
- Eloquent ORM
- SQLite
- PHPUnit (tests)

# 🔄 Flujo de la Aplicación
Navegación:
- SPA con rutas gestionadas por React Router en `frontend/src/App.jsx`.

Gestión de estado:
- Estado global mediante Zustand en `frontend/src/store/`.
- Estado local en componentes con hooks de React.

Consumo de APIs:
- Cliente HTTP centralizado con Axios (ubicación sugerida: `frontend/src/data/` o `frontend/src/services/` si se crea).
- Autenticación mediante tokens emitidos por Laravel Sanctum.

# 📡 Comunicación con API
Cómo se hacen las peticiones:
- Se recomienda centralizar en servicios Axios para mantener consistencia.
- Configurar `baseURL` con `VITE_API_BASE_URL` o proxy en Vite.

Manejo de errores:
- Capturar errores en capa de servicios y mapear a mensajes de UI.
- Usar interceptores de Axios para errores comunes (401, 403, 500).

Estructura de servicios (propuesta):
```
frontend/src/
└── services/
    ├── httpClient.js
    ├── authService.js
    └── ordersService.js
```
Nota: si no existe aún, esta estructura se sugiere como práctica recomendada.

# 🎨 Estilos y UI
Sistema de estilos:
- Tailwind CSS con configuración en `frontend/tailwind.config.js`.
- Estilos globales en `frontend/src/index.css`.

Organización de componentes visuales:
- Componentes base en `frontend/src/components/`.
- Layouts en `frontend/src/layouts/`.
- Páginas en `frontend/src/pages/`.

# 🧪 Testing (si aplica)
Backend:
```bash
cd backend
composer run test
```

Frontend:
- No hay scripts de test definidos en `frontend/package.json` actualmente.
- Placeholder recomendado: Vitest o Jest según necesidades del equipo.

# 📦 Build y Despliegue
Build de frontend:
```bash
cd frontend
npm run build
```

Despliegue:
- Frontend: servir `frontend/dist/` desde CDN o servidor estático.
- Backend: desplegar Laravel en servidor con PHP-FPM y configurar `.env`.
- Base de datos: ajustar `DB_CONNECTION` según entorno (SQLite/MySQL/pgsql).
- Variables de entorno: definir `APP_KEY`, `APP_ENV`, `APP_URL`, `DB_*` y `VITE_API_BASE_URL`.

# ⚠️ Buenas Prácticas
Convenciones de código:
- Usar `async/await` en operaciones asíncronas.
- Mantener nombres descriptivos y coherentes.
- Evitar duplicación de lógica entre páginas.

Organización del proyecto:
- Componentes pequeños y reutilizables.
- Separar UI, lógica y servicios HTTP.
- Mantener rutas de API centralizadas.

Recomendaciones:
- Validar formularios en frontend y backend.
- Añadir pruebas unitarias y de integración en módulos críticos.
- Documentar endpoints y contratos de API.

# 📄 Licencia
Ver el archivo `LICENSE` en la raíz del proyecto.
