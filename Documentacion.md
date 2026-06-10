# 📚 Documentación Técnica — Distrito Gourmet

> **Versión:** 1.0 · **Última actualización:** Mayo 2026
> Documentación de arquitectura, decisiones de diseño y guía de desarrollo del proyecto **Distrito Gourmet**.

---

## 📌 Descripción del Proyecto

**Distrito Gourmet** es una aplicación web _full-stack_ para la gestión integral de un restaurante de alta cocina. Su objetivo es ofrecer una experiencia completa tanto para clientes (carta digital, reservas de mesa, pedidos takeaway) como para el equipo de administración (gestión de inventario, pedidos y reservas en tiempo real).

**Contexto académico:** Proyecto de Final de Ciclo · 2º Grado Superior en Desarrollo de Aplicaciones Web (DAW).

### Objetivos principales

- Implementar una arquitectura desacoplada frontend/backend con API REST.
- Aplicar buenas prácticas de seguridad (autenticación stateless, validación en ambas capas).
- Lograr una experiencia de usuario premium mediante animaciones y diseño editorial.
- Garantizar la escalabilidad mediante contenedores Docker.

---

## 🏗️ Arquitectura del Sistema

### Patrón arquitectónico

El proyecto adopta una arquitectura **Cliente–Servidor desacoplada** organizada en tres capas:

```
┌─────────────────────────┐
│   Presentation Layer    │  React 19 SPA (Vite) — Puerto 5173 (dev) / 8001 (prod)
│   frontend/src/         │
└──────────┬──────────────┘
           │ REST API (JSON) · Bearer Token (Sanctum)
┌──────────▼──────────────┐
│   Application Layer     │  Laravel 12 API — Puerto 8000 (dev) / 8001/api (prod)
│   backend/app/          │
└──────────┬──────────────┘
           │ Eloquent ORM
┌──────────▼──────────────┐
│   Data Layer            │  MySQL 8.0 (Docker) / SQLite (desarrollo ligero)
│   backend/database/     │
└─────────────────────────┘
```

### Patrón Frontend: Component-Based Architecture

El frontend sigue una arquitectura de **componentes con responsabilidad única**, organizada por capas:

| Capa                | Directorio        | Responsabilidad                                 |
| :------------------ | :---------------- | :---------------------------------------------- |
| **Páginas (Views)** | `src/pages/`      | Composición de layout y lógica de ruta          |
| **Layouts**         | `src/layouts/`    | Estructura de página reutilizable (nav, footer) |
| **Componentes**     | `src/components/` | Elementos UI atómicos y reutilizables           |
| **Estado Global**   | `src/store/`      | Stores de Zustand (auth, carrito)               |
| **Servicios**       | `src/services/`   | Clientes HTTP con Axios                         |
| **Animaciones**     | `src/motion/`     | Configuraciones GSAP y wrappers animados        |
| **Recursos**        | `src/assets/`     | Imágenes, fuentes y archivos estáticos          |

### Patrón Backend: MVC + API Controllers

Laravel sigue el patrón **MVC** adaptado para APIs REST:

- **Models** (`app/Models/`): Modelos Eloquent con relaciones y validaciones.
- **Controllers** (`app/Http/Controllers/API/`): Controladores REST por recurso.
- **Routes** (`routes/api.php`): Definición de endpoints protegidos y públicos.
- **Middleware**: Sanctum para autenticación + middleware de roles.

---

## 📁 Estructura de Carpetas Detallada

### Raíz del monorepo

```
distrito-gourmet/
├── backend/             # Aplicación Laravel 12
├── frontend/            # Aplicación React 19 + Vite
├── frontend/nginx.conf  # Configuración Nginx del contenedor frontend
├── scripts/             # Scripts de arranque del monorepo
│   └── dev.js           # Script Node.js que lanza frontend y backend en paralelo
├── docker-compose.yml   # Orquestación de servicios Docker
├── package.json         # Scripts raíz (start, install:all)
├── README.md            # Documentación general del proyecto
└── Documentacion.md     # Este archivo — documentación técnica
```

### Frontend (`frontend/src/`)

```
src/
├── assets/
│   └── images/          # Imágenes y recursos visuales
├── components/
│   ├── layout/          # Header, Footer, ScrollToTop, etc.
│   ├── ui/              # Botones, inputs, cards genéricas
│   └── domain/          # Componentes específicos (MenuCard, ReservaForm, etc.)
├── layouts/
│   └── MainLayout.jsx   # Layout base: Outlet con Nav y Footer
├── motion/
│   └── AdvancedComponents.jsx  # Componentes con GSAP / Framer Motion
├── pages/
│   ├── HomeView.jsx      # Landing page principal
│   ├── MenuView.jsx      # Carta digital completa
│   ├── ReservationsView.jsx  # Formulario y gestión de reservas
│   ├── CartView.jsx      # Carrito y checkout
│   ├── DashboardView.jsx # Panel del cliente (historial, perfil rápido)
│   ├── AdminView.jsx     # Panel de administración completo
│   ├── ProfileView.jsx   # Gestión de perfil de usuario
│   ├── LoginView.jsx     # Autenticación
│   ├── RegisterView.jsx  # Registro de cuenta
│   └── ContactView.jsx   # Formulario de contacto
├── services/
│   └── (clientes Axios por recurso: authService, pedidoService, etc.)
├── store/
│   ├── auth.js           # Estado global de autenticación (Zustand)
│   └── cart.js           # Estado global del carrito (Zustand + localStorage)
├── App.jsx               # Configuración de rutas (React Router v7)
├── index.css             # Estilos globales + variables CSS + Tailwind directives
└── main.jsx              # Punto de entrada — StrictMode + BrowserRouter
```

### Backend (`backend/`)

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── API/
│   │   │       ├── AuthController.php       # Login, registro, logout
│   │   │       ├── PlatoController.php      # CRUD de platos
│   │   │       ├── VinoController.php       # Listado de vinos
│   │   │       ├── BebidaController.php     # Listado de bebidas
│   │   │       ├── MenuDegustacionController.php  # Menús degustación
│   │   │       ├── PedidoController.php     # Pedidos (index, store, all, updateStatus, destroy)
│   │   │       ├── ReservaController.php    # Reservas
│   │   │       └── UsuarioController.php    # Gestión de usuarios (admin)
│   │   └── Middleware/
│   └── Models/
│       ├── User.php (→ usuarios)
│       ├── Plato.php
│       ├── Vino.php
│       ├── Bebida.php
│       ├── MenuDegustacion.php
│       ├── Pedido.php
│       ├── DetallePedido.php
│       └── Reserva.php
├── database/
│   ├── migrations/      # Migraciones ordenadas cronológicamente
│   └── seeders/         # Datos de prueba (Admin, Cliente, Carta completa)
├── routes/
│   ├── api.php          # Rutas REST (públicas y protegidas con Sanctum)
│   └── web.php
└── tests/
    ├── Unit/            # Tests unitarios de modelos y lógica de negocio
    └── Feature/         # Tests de integración de endpoints HTTP
```

---

## ⚙️ Instalación y Configuración

### Requisitos previos

| Herramienta | Versión mínima | Notas                                      |
| :---------- | :------------: | :----------------------------------------- |
| PHP         |      8.2+      | Extensiones: mbstring, pdo, pdo_mysql, pdo_sqlite, xml, zip |
| Composer    |      2.x       | Gestor de dependencias PHP                 |
| Node.js     |      20+       | Recomendado Node.js 22 LTS                 |
| npm         |       9+       | Incluido con Node.js                       |
| MySQL       |      8.0+      | O Docker para no instalarlo localmente     |
| Git         |      2.x       | Para clonar el repositorio                 |

### Variables de entorno

#### Backend (`backend/.env`)

```env
APP_NAME="Distrito Gourmet"
APP_ENV=local
APP_KEY=                          # Se genera con: php artisan key:generate
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=distrito_gourmet
DB_USERNAME=root
DB_PASSWORD=tu_password

SESSION_DRIVER=database
```

#### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_DEMO_MODE=false
```

> Deja `VITE_API_URL` vacío cuando frontend y backend compartan dominio mediante Nginx/Docker y se use `/api` relativo.

---

## 🚀 Scripts Disponibles

### Raíz del monorepo (`package.json`)

```bash
npm start              # Arranca frontend (Vite) y backend (Laravel) en paralelo
npm run install:all    # Instala dependencias de backend (Composer) y frontend (npm)
```

### Frontend (`frontend/package.json`)

```bash
npm run dev       # Servidor de desarrollo Vite (HMR, puerto 5173)
npm run build     # Build de producción → genera frontend/dist/
npm run preview   # Previsualiza el build de producción localmente
npm run lint      # Análisis estático con ESLint
```

### Backend (`backend/`)

```bash
php artisan serve              # Servidor de desarrollo Laravel (puerto 8000)
php artisan migrate            # Ejecuta las migraciones pendientes
php artisan migrate:fresh --seed   # Reinicia la BD y ejecuta todos los seeders
php artisan test               # Ejecuta la suite de PHPUnit (requiere pdo_sqlite)
php artisan make:controller API/NombreController --api  # Crear nuevo controller REST
php artisan route:list         # Lista todos los endpoints registrados
```

---

## 🔌 API REST — Referencia de Endpoints

Todos los endpoints están bajo el prefijo `/api/`. La autenticación se realiza mediante **Bearer Token** en la cabecera `Authorization`.

### Autenticación (`/api/`)

```
POST   /api/register           → Registro de usuario (público)
POST   /api/login              → Login — devuelve { token, usuario } (público)
POST   /api/logout             → Logout — invalida el token (auth)
GET    /api/user               → Datos del usuario autenticado (auth)
```

### Carta y Catálogo (todos públicos)

```
GET    /api/dishes             → Carta completa: platos, vinos, bebidas y menús degustación
```

### Pedidos

```
GET    /api/orders              → Historial del usuario autenticado (auth)
POST   /api/orders              → Crear pedido takeaway (auth)
GET    /api/admin/orders        → Todos los pedidos (admin)
PATCH  /api/admin/orders/{id}   → Cambiar estado: Pendiente→Preparando→Listo→Entregado (admin)
DELETE /api/admin/orders/{id}   → Eliminar pedido (admin)
```

**Payload para `POST /api/orders`:**

```json
{
  "metodo_pago": "card",
  "hora_recogida": "14:30",
  "fecha_recogida": "2026-06-10",
  "articulos": [
    {
      "db_id": 3,
      "tipo_item": "plato",
      "nombre": "Carrillera Ibérica",
      "cantidad": 2
    },
    {
      "db_id": 1,
      "tipo_item": "vino",
      "nombre": "Ribera del Duero Reserva",
      "cantidad": 1
    }
  ]
}
```

**Métodos de pago válidos:** `card` · `cash` · `paypal`
> El backend calcula precios y totales desde el catálogo; no confía en `precio` ni `total` enviados por cliente.

**Estados del pedido (ENUM):** `Pendiente` · `Preparando` · `Listo` · `Entregado` · `Cancelado`

### Reservas

```
GET    /api/reservations              → Reservas del usuario autenticado (auth)
POST   /api/reservations              → Crear reserva (auth)
GET    /api/admin/reservations        → Todas las reservas (admin)
PATCH  /api/admin/reservations/{id}   → Actualizar estado (admin)
DELETE /api/admin/reservations/{id}   → Eliminar reserva (admin)
```

**Estados de reserva:** `Pendiente` · `Confirmada` · `Cancelada`
**Reglas:** máximo 8 comensales por reserva y aforo de 44 comensales por turno.

### Usuarios (Admin)

```
GET    /api/admin/users        → Listado de usuarios (admin)
PUT    /api/admin/users/{id}   → Actualizar usuario (admin)
DELETE /api/admin/users/{id}   → Eliminar usuario (admin)
```

---

## 🗄️ Modelo de Base de Datos

### Tablas y Entidades

| Tabla                     | Descripción                                                             |
| :------------------------ | :---------------------------------------------------------------------- |
| `usuarios`                | Usuarios del sistema (roles: Administrador, Cliente, Staff)             |
| `platos`                  | Platos del menú con precio, categoría, alérgenos y flags de visibilidad |
| `categorias_menu`         | Clasificación de platos (Entrantes, Principales, Postres, etc.)         |
| `vinos`                   | Catálogo de vinos con tipo, región, uva y precios copa/botella          |
| `bebidas`                 | Bebidas adicionales (agua, refrescos, cócteles, café)                   |
| `menus_degustacion`       | Menús de varios pasos con precio y duración estimada                    |
| `platos_menu_degustacion` | Relación N:M entre menús y platos (con número de paso)                  |
| `maridajes_plato_vino`    | Maridajes plato–vino con nivel de recomendación                         |
| `reservas`                | Reservas de mesa con fecha, hora, comensales y estado                   |
| `pedidos`                 | Cabecera de pedido; el flujo público actual crea pedidos Takeaway        |
| `detalles_pedido`         | Líneas de pedido con referencia al ítem y precio unitario               |
| `personal_access_tokens`  | Tokens Sanctum para autenticación stateless                             |

### Diagrama de relaciones clave

```
usuarios (1) ─────────────────< pedidos (N)
                                   │
                              detalles_pedido
                                ├── platos
                                ├── vinos
                                ├── bebidas
                                └── menus_degustacion

usuarios (1) ─────────────────< reservas (N)

platos (N) >──────────────────< menus_degustacion (N)
            platos_menu_degustacion

platos (N) >──────────────────< vinos (N)
            maridajes_plato_vino
              (nivel: Buena / Muy buena / Perfecta)

platos ──── categorias_menu
```

---

## 🔐 Seguridad y Autenticación

### Laravel Sanctum — Flujo de autenticación

```
1. POST /api/login  { email, password }
        │
        ▼
2. Laravel valida credenciales → crea PersonalAccessToken
        │
        ▼
3. Respuesta: { token: "1|xxxx...", usuario: { id, nombre, rol } }
        │
        ▼
4. Frontend guarda token en Zustand store (auth.js)
        │
        ▼
5. Peticiones posteriores:
   Header: Authorization: Bearer 1|xxxx...
        │
        ▼
6. Middleware auth:sanctum valida el token en cada request
```

### Protección de Rutas en el Frontend

```jsx
// ProtectedRoute en App.jsx
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin()) return <Navigate to="/" replace />;

  return children;
};
```

### Validación de datos

- **Frontend:** Validación en formularios antes de enviar a la API.
- **Backend:** Validación con `$request->validate()` en todos los controladores.
- **Ejemplo en PedidoController:**
  ```php
  $request->validate([
      'metodo_pago' => ['required', Rule::in(['card', 'cash', 'paypal'])],
      'hora_recogida' => ['nullable', Rule::in([...])],
      'fecha_recogida' => ['nullable', 'date'],
      'articulos'   => 'required|array|min:1',
      'articulos.*.tipo_item' => 'required|in:plato,vino,bebida,menu_degustacion',
      'articulos.*.cantidad'  => 'required|integer|min:1',
  ]);
  ```

---

## 🔄 Flujo de la Aplicación

### Flujo de Pedido (Takeaway)

```
Usuario navega /menu
    │
    ▼
Añade ítems al carrito (Zustand store → localStorage)
    │
    ▼
Accede a /cart
    │
    ▼
Selecciona hora/fecha de recogida y método de pago
    │
    ▼
POST /api/orders → Laravel valida catálogo, calcula importes y crea Pedido + DetallesPedido en transacción DB
    │
    ▼
Respuesta 201 → SweetAlert2 muestra confirmación
    │
    ▼
Carrito se vacía → redirect a /dashboard
```

### Flujo de Reserva

```
Usuario navega /reservations
    │
    ▼
Selecciona: fecha · hora · comensales · preferencias
    │
    ▼
POST /api/reservations → Laravel crea Reserva con código único
    │
    ▼
Estado inicial: "Confirmada" si el turno tiene aforo; "Pendiente" si supera 44 comensales
    │
    ▼
Admin gestiona desde /admin → PATCH /api/admin/reservations/{id}
    │
    ▼
Estado cambia entre: "Pendiente", "Confirmada" o "Cancelada"
```

---

## 🎨 Sistema de Diseño y UI

### Paleta de colores

| Variable CSS         | Valor              | Uso                                       |
| :------------------- | :----------------- | :---------------------------------------- |
| `--color-primary`    | `#c8a96e` (dorado) | Acento principal, botones CTA, highlights |
| `--color-bg-body`    | `#0a0a0a`          | Fondo principal (modo oscuro)             |
| `--color-bg-surface` | `#141414`          | Tarjetas y superficies elevadas           |
| `--color-text-base`  | `#f5f0e8`          | Texto principal                           |
| `--color-text-muted` | `#6b6b6b`          | Texto secundario y placeholders           |

### Tipografía

- **Display / Headlines:** Fuente serif de alto contraste (estética editorial).
- **Body / UI:** Fuente sans-serif limpia (legibilidad en datos y formularios).
- Ambas importadas desde Google Fonts en `index.css`.

### Animaciones (GSAP)

Las animaciones se centralizan en `src/motion/`:

- **ScrollTrigger:** Reveal de secciones al hacer scroll.
- **Page Transitions:** Animaciones de entrada/salida entre rutas.
- **Micro-interacciones:** Hover effects en tarjetas de menú y botones.
- **Stagger animations:** Aparición escalonada de listas de platos.

### Lazy Loading de vistas

Todas las vistas (páginas) se cargan con `React.lazy()` + `Suspense` para reducir el bundle inicial:

```jsx
const MenuView = lazy(() => import("./pages/MenuView"));

<Suspense fallback={<PageLoader />}>
  <Routes> ... </Routes>
</Suspense>;
```

---

## 🧪 Testing

### Backend — PHPUnit

```bash
cd backend
php artisan test                     # Ejecuta toda la suite
php artisan test --filter=PfcClosure # Tests feature de cierre PFC
```

**Tipos de tests implementados:**

- **Feature Tests** (`tests/Feature/`): autenticación, rate limit, reservas, pedidos y permisos admin.

> La suite usa SQLite en memoria, por lo que el PHP local debe tener `pdo_sqlite` habilitado.

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

---

## 📦 Build y Despliegue

### Opción A — Docker (Producción)

```bash
docker-compose up -d --build
```

El `docker-compose.yml` orquesta:

- **`frontend`**: Build de Vite servido por Nginx.
- **`backend`**: Laravel servido en el contenedor backend.
- **`db`**: MySQL 8.0 con volumen persistente.

### Opción B — Despliegue Manual

**Frontend (Vercel / Netlify / CDN):**

```bash
cd frontend
npm run build
# Subir frontend/dist/ a tu plataforma de hosting estático
```

**Backend (Render / Railway / VPS con PHP):**

```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan migrate --force
```

### Variables de entorno en producción

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

DB_CONNECTION=mysql
DB_HOST=host-produccion
DB_DATABASE=distrito_gourmet_prod
DB_USERNAME=usuario_prod
DB_PASSWORD=contraseña_segura

```

---

## ⚠️ Buenas Prácticas y Convenciones

### Código JavaScript / React

- Usar `async/await` para todas las operaciones asíncronas.
- Preferir componentes funcionales con hooks sobre componentes de clase.
- Un componente = una responsabilidad (principio de responsabilidad única).
- Nombrar componentes en **PascalCase** y funciones/variables en **camelCase**.
- Centralizar las llamadas HTTP en la carpeta `services/` (nunca en componentes directamente).

### Código PHP / Laravel

- Los controladores solo deben orquestar: delegar lógica a modelos o servicios.
- Usar transacciones DB (`DB::transaction()`) en operaciones con múltiples escrituras.
- Validar siempre con `$request->validate()` antes de procesar datos.
- Usar las relaciones Eloquent (`with()`, `load()`) para evitar el problema N+1.
- Nombramiento de métodos: `index`, `store`, `show`, `update`, `destroy` (convención REST).

### Control de versiones (Git)

- Commits descriptivos en español siguiendo el formato: `tipo: descripción breve`.
- Tipos comunes: `feat`, `fix`, `refactor`, `docs`, `style`, `test`.
- Ejemplo: `feat: añadir selector de menú degustación en reservas`.

### Seguridad

- Nunca commitear archivos `.env` (están en `.gitignore`).
- Rotar el `APP_KEY` en producción.
- Sanitizar y validar todas las entradas tanto en frontend como en backend.
- Usar HTTPS en producción (configurar certificado SSL en Nginx).

---

## 🐛 Solución de Problemas Comunes

| Problema                       | Causa probable                                                | Solución                                                         |
| :----------------------------- | :------------------------------------------------------------ | :--------------------------------------------------------------- |
| `/api/dishes` devuelve 404     | Vite está sin proxy al backend en desarrollo separado          | Definir `VITE_API_URL=http://127.0.0.1:8000` o usar `npm start`  |
| `401 Unauthorized`             | Token expirado o no enviado en la cabecera                    | Revisar el store de auth y el interceptor de Axios               |
| `500 Error` en migraciones     | Credenciales de BD incorrectas en `.env`                      | Verificar `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` |
| Estilos Tailwind no se aplican | `tailwind.config.js` no incluye la ruta del archivo           | Añadir la ruta en `content: ['./src/**/*.{js,jsx}']`             |
| Animaciones GSAP no funcionan  | GSAP no está instalado o el elemento no existe en el DOM      | Verificar instalación y usar `useEffect` con `gsap.context()`    |
| Build de frontend falla        | Dependencias o variables de entorno incorrectas               | Ejecutar `npm install` y revisar `frontend/.env.example`         |
| `php artisan test` falla SQLite | Falta la extensión `pdo_sqlite` en PHP                         | Activar `pdo_sqlite` o ejecutar la suite en CI                   |

---

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la **MIT License**.
Consulta el archivo [`LICENSE`](./LICENSE) en la raíz del repositorio.

---

<p align="center">
  <sub><em>Documentación técnica de Distrito Gourmet © 2026 · Alex Vicente Lopez · DAW</em></sub>
</p>
