<p align="center">
  <strong>D I S T R I T O &nbsp; G O U R M E T</strong><br/>
  <em>Sistema de Gestión para Restaurante de Alta Cocina</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Laravel-12-F53C32?logo=laravel&logoColor=white" alt="Laravel"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL"/>
</p>

---

## 📋 Descripción

**Distrito Gourmet** es una aplicación web _full-stack_ para la gestión integral de un restaurante de alta cocina, desarrollada como **Proyecto de Final de Curso de 2º DAW** (Desarrollo de Aplicaciones Web).

El proyecto implementa una arquitectura moderna desacoplada:

- **Frontend SPA** (Single Page Application) construido con React + Vite.
- **API REST** independiente desarrollada con Laravel 12.
- **Base de datos MySQL** gestionada a través de Laragon para un entorno local robusto.

---

## ✨ Funcionalidades

| Módulo                         | Descripción                                                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| 🍽️ **Carta Digital**           | Menú interactivo con categorías (Entrantes, Principales, Postres, Bodega) y precios en tiempo real desde la API. |
| 🛒 **Carrito de Pedidos**      | Sistema de carrito persistente con gestión de cantidades y resumen de compra.                                    |
| 📅 **Reservas Online**         | Formulario de reservas con selección de fecha, hora, número de comensales y observaciones.                       |
| 👤 **Autenticación**           | Registro, inicio de sesión y gestión de perfil mediante Laravel Sanctum (tokens SPA).                            |
| ⚙️ **Panel de Administración** | Dashboard exclusivo para administradores con gestión CRUD de platos, usuarios, pedidos y reservas.               |
| 🎨 **Diseño Premium**          | Interfaz inspirada en webs de alta cocina con animaciones, transiciones y diseño responsive (móvil, tablet, PC). |

---

## 🛠️ Stack Tecnológico

### Frontend (`/frontend`)

| Tecnología                                               | Versión | Uso                                      |
| -------------------------------------------------------- | ------- | ---------------------------------------- |
| [React](https://react.dev)                               | 19.2    | Librería de interfaz de usuario          |
| [Vite](https://vite.dev)                                 | 7.3     | Bundler y servidor de desarrollo         |
| [Tailwind CSS](https://tailwindcss.com)                  | 3.4     | Framework de utilidades CSS              |
| [Zustand](https://zustand.docs.pmnd.rs)                  | 5.0     | Gestión de estado global (auth, carrito) |
| [React Router](https://reactrouter.com)                  | 7.13    | Enrutamiento SPA                         |
| [Axios](https://axios-http.com)                          | 1.13    | Cliente HTTP para la API                 |
| [Framer Motion](https://www.framer.com/motion)           | 12.x    | Animaciones y transiciones               |
| [SweetAlert2](https://sweetalert2.github.io)             | 11.x    | Alertas y confirmaciones                 |
| [React Icons](https://react-icons.github.io/react-icons) | 5.5     | Iconografía                              |

### Backend (`/backend`)

| Tecnología                                          | Versión | Uso                            |
| --------------------------------------------------- | ------- | ------------------------------ |
| [Laravel](https://laravel.com)                      | 12.x    | Framework PHP para la API REST |
| [Laravel Sanctum](https://laravel.com/docs/sanctum) | 4.x     | Autenticación por tokens SPA   |
| [Eloquent ORM](https://laravel.com/docs/eloquent)   | —       | Mapeo objeto-relacional        |
| [MySQL](https://www.mysql.com)                      | 8.x     | Sistema base de datos relacional |

### Tipografías (Google Fonts)

- **Cormorant Garamond** — Fuente de encabezados (estilo editorial de lujo).
- **Inter** — Fuente de cuerpo (legibilidad y modernidad).

---

## 📁 Estructura del Proyecto

```
distrito-gourmet/
├── .gitignore
├── LICENSE
├── README.md                    # Este archivo
├── package.json                 # Script raíz (npm start)
├── scripts/
│   └── dev.js                   # Lanza backend + frontend simultáneamente
│
├── frontend/                    # ── APLICACIÓN REACT + VITE ──
│   ├── index.html               # HTML base (SEO meta tags)
│   ├── package.json
│   ├── tailwind.config.js       # Paleta de colores personalizada
│   ├── postcss.config.js
│   ├── vite.config.js           # Proxy API → localhost:8000
│   ├── eslint.config.js
│   └── src/
│       ├── main.jsx             # Punto de entrada React
│       ├── App.jsx              # Router principal y rutas
│       ├── index.css            # Estilos globales + Tailwind base
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx   # Navegación con menú overlay
│       │   │   └── Footer.jsx   # Pie de página
│       │   ├── animations/
│       │   │   ├── Preloader.jsx      # Pantalla de carga inicial
│       │   │   ├── AnimatedPage.jsx   # Transición entre páginas
│       │   │   └── AnimatedSection.jsx # Animación al hacer scroll
│       │   └── ReservationForm.jsx    # Formulario de reservas
│       ├── layouts/
│       │   └── MainLayout.jsx   # Layout (Navbar + contenido + Footer)
│       ├── pages/
│       │   ├── HomeView.jsx     # Página de inicio
│       │   ├── MenuView.jsx     # Carta digital (consume API)
│       │   ├── CartView.jsx     # Carrito de pedidos
│       │   ├── ReservationsView.jsx  # Reservas del usuario
│       │   ├── ContactView.jsx  # Contacto y ubicación
│       │   ├── LoginView.jsx    # Inicio de sesión
│       │   ├── RegisterView.jsx # Registro de cuenta
│       │   ├── DashboardView.jsx # Panel del usuario
│       │   ├── ProfileView.jsx  # Edición de perfil
│       │   └── AdminView.jsx    # Panel de administración
│       └── store/
│           ├── auth.js          # Estado de autenticación (Zustand)
│           └── cart.js          # Estado del carrito (Zustand)
│
└── backend/                     # ── API REST LARAVEL ──
    ├── artisan
    ├── composer.json
    ├── composer.lock
    ├── .env.example
    ├── app/
    │   ├── Http/Controllers/API/
    │   │   ├── AuthController.php        # Login, registro, logout
    │   │   ├── DishController.php        # CRUD de platos
    │   │   ├── OrderController.php       # Gestión de pedidos
    │   │   ├── ReservationController.php # Gestión de reservas
    │   │   └── UserController.php        # Gestión de usuarios
    │   ├── Models/
    │   │   ├── User.php
    │   │   ├── Dish.php
    │   │   ├── MenuCategory.php
    │   │   ├── Order.php
    │   │   ├── OrderItem.php
    │   │   └── Reservation.php
    │   └── Providers/
    │       └── AppServiceProvider.php
    ├── config/                  # Configuración de Laravel
    ├── database/
    │   ├── migrations/          # Esquema de la BD
    │   └── seeders/
    │       └── DatabaseSeeder.php  # Datos de ejemplo
    ├── public/
    │   └── index.php            # Entry point PHP
    └── routes/
        ├── api.php              # Endpoints de la API
        └── web.php
```

---

## 📦 Requisitos Previos

| Herramienta  | Versión mínima | Descarga                                   |
| ------------ | -------------- | ------------------------------------------ |
| **PHP**      | 8.2+           | [php.net](https://www.php.net/downloads)   |
| **Composer** | 2.x            | [getcomposer.org](https://getcomposer.org) |
| **Node.js**  | 18+            | [nodejs.org](https://nodejs.org)           |
| **npm**      | 9+             | Incluido con Node.js                       |

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/AVL05/distrito-gourmet.git
cd distrito-gourmet
```

### 2. Configurar el Backend (Laravel)

```bash
cd backend

# Instalar dependencias PHP
composer install

# Crear el archivo de configuración del entorno
cp .env.example .env

# Generar la clave de encriptación de la aplicación
php artisan key:generate

# Ejecutar las migraciones y poblar la BD con datos de ejemplo
php artisan migrate --seed

# Volver al directorio raíz
cd ..
```

### 3. Configurar el Frontend (React + Vite)

```bash
cd frontend

# Instalar las dependencias de Node.js
npm install

# Volver al directorio raíz
cd ..
```

### 4. Ejecutar el proyecto

Desde la **raíz del proyecto**, este único comando lanza ambos servidores:

```bash
npm start
```

> Esto ejecuta `scripts/dev.js`, que inicia el servidor Laravel (API) y el servidor Vite (frontend) en paralelo con logs profesionales en la consola.

### 5. Acceder a la aplicación

| Servicio           | URL                                                    |
| ------------------ | ------------------------------------------------------ |
| **Frontend (Web)** | [http://localhost:5173](http://localhost:5173)         |
| **Backend (API)**  | [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api) |

### 🔑 Credenciales de prueba

Estos usuarios se crean automáticamente al ejecutar `php artisan migrate --seed`:

| Rol         | Email                         | Contraseña |
| ----------- | ----------------------------- | ---------- |
| **Admin**   | `admin@distritogourmet.com`   | `password` |
| **Cliente** | `cliente@distritogourmet.com` | `password` |

---

## 🔌 Endpoints de la API

### Públicos (sin autenticación)

| Método | Ruta            | Descripción                                  |
| ------ | --------------- | -------------------------------------------- |
| `POST` | `/api/register` | Registrar nuevo usuario                      |
| `POST` | `/api/login`    | Iniciar sesión (devuelve token)              |
| `GET`  | `/api/dishes`   | Obtener carta completa (platos y categorías) |

### Autenticados (requieren token Sanctum en header `Authorization: Bearer {token}`)

| Método | Ruta                | Descripción                      |
| ------ | ------------------- | -------------------------------- |
| `POST` | `/api/logout`       | Cerrar sesión (revoca token)     |
| `GET`  | `/api/user`         | Obtener datos del usuario actual |
| `PUT`  | `/api/profile`      | Actualizar perfil propio         |
| `GET`  | `/api/reservations` | Listar mis reservas              |
| `POST` | `/api/reservations` | Crear una reserva                |
| `POST` | `/api/orders`       | Realizar un pedido               |
| `GET`  | `/api/orders`       | Listar mis pedidos               |

### Administración (requieren rol `admin`)

| Método   | Ruta                           | Descripción               |
| -------- | ------------------------------ | ------------------------- |
| `POST`   | `/api/admin/dishes`            | Crear plato               |
| `PUT`    | `/api/admin/dishes/{id}`       | Actualizar plato          |
| `DELETE` | `/api/admin/dishes/{id}`       | Eliminar plato            |
| `GET`    | `/api/admin/reservations`      | Todas las reservas        |
| `PATCH`  | `/api/admin/reservations/{id}` | Cambiar estado de reserva |
| `GET`    | `/api/admin/orders`            | Todos los pedidos         |
| `PATCH`  | `/api/admin/orders/{id}`       | Cambiar estado de pedido  |
| `GET`    | `/api/admin/users`             | Listar todos los usuarios |
| `PUT`    | `/api/admin/users/{id}`        | Editar usuario            |
| `DELETE` | `/api/admin/users/{id}`        | Eliminar usuario          |

---

## ⚙️ Variables de Entorno

El archivo `backend/.env` se crea copiando `.env.example`. Las variables clave:

```env
APP_KEY=               # Se genera automáticamente con: php artisan key:generate
DB_CONNECTION=mysql    # Conexión principal a MySQL
DB_PORT=3306           # Puerto por defecto de Laragon
DB_USERNAME=root       # Usuario por defecto de Laragon
DB_PASSWORD=           # Contraseña en blanco por defecto
SANCTUM_STATEFUL_DOMAINS=localhost:5173   # Dominio del frontend para auth
```

La URL base de la API se configura en `frontend/vite.config.js` como proxy al puerto 8000.

---

## 📜 Scripts Disponibles

### Raíz del proyecto

| Comando               | Descripción                                     |
| --------------------- | ----------------------------------------------- |
| `npm start`           | Lanza backend + frontend simultáneamente        |
| `npm run install:all` | Instala todas las dependencias (composer + npm) |

### Frontend (`cd frontend`)

| Comando           | Descripción                                             |
| ----------------- | ------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con HMR (Hot Module Replacement) |
| `npm run build`   | Compilar para producción (genera carpeta `dist/`)       |
| `npm run preview` | Previsualizar el build de producción                    |
| `npm run lint`    | Ejecutar ESLint para verificar calidad de código        |

### Backend (`cd backend`)

| Comando                            | Descripción                                   |
| ---------------------------------- | --------------------------------------------- |
| `php artisan serve`                | Iniciar servidor de desarrollo PHP            |
| `php artisan migrate`              | Ejecutar migraciones pendientes               |
| `php artisan migrate:fresh --seed` | Recrear la BD desde cero con datos de ejemplo |
| `php artisan tinker`               | Consola interactiva para probar consultas     |

---

## 🎨 Paleta de Colores

Definida en `frontend/tailwind.config.js`:

| Token           | Color           | Hex       | Uso                               |
| --------------- | --------------- | --------- | --------------------------------- |
| `primary`       | 🟡 Dorado       | `#A68A56` | Acentos, botones, enlaces activos |
| `primary-hover` | 🟤 Bronce       | `#8D7344` | Estado hover del dorado           |
| `bg-body`       | ⬜ Crema        | `#FCFBF8` | Fondo general de la aplicación    |
| `bg-surface`    | ⬜ Blanco       | `#FFFFFF` | Tarjetas, modales, paneles        |
| `text-main`     | 🟢 Verde oscuro | `#224032` | Texto principal, encabezados      |
| `text-muted`    | 🔘 Gris         | `#6D726D` | Texto secundario, etiquetas       |

---

## 👨‍💻 Autor

**Alex Vicente Lopez** — Estudiante de 2º DAW

---

## 📄 Licencia

Este proyecto ha sido desarrollado como **Proyecto de Final de Curso** del ciclo formativo de Grado Superior en **Desarrollo de Aplicaciones Web (DAW)**.

<p align="center">
  <em>Distrito Gourmet © 2025 — Proyecto Intermodular 2º DAW</em>
</p>
