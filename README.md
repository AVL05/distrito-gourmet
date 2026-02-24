<p align="center">
  <strong>D I S T R I T O &nbsp; G O U R M E T</strong><br/>
  <em>Fine Dining Management System</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Laravel-12-F53C32?logo=laravel&logoColor=white" alt="Laravel"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white" alt="SQLite"/>
</p>

---

## Descripción

**Distrito Gourmet** es una aplicación web _full-stack_ para la gestión integral de un restaurante de alta cocina. El proyecto implementa una arquitectura moderna desacoplada con un **frontend SPA** y una **API REST** independiente como backend.

### Funcionalidades Principales

| Módulo                         | Descripción                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| 🍽️ **Carta Digital**           | Menú interactivo con categorías (Entrantes, Principales, Postres, Bodega), imágenes y precios en tiempo real. |
| 🛒 **Carrito de Pedidos**      | Sistema de carrito persistente con gestión de cantidades y resumen de compra.                                 |
| 📅 **Reservas Online**         | Formulario de reservas con selección de fecha, hora y número de comensales.                                   |
| 👤 **Autenticación**           | Registro, inicio de sesión y gestión de perfil mediante Laravel Sanctum (tokens SPA).                         |
| ⚙️ **Panel de Administración** | Dashboard exclusivo para administradores con gestión CRUD de platos, usuarios, pedidos y reservas.            |
| 📸 **Subida de Imágenes**      | Upload de fotos para platos con validación de tipo y tamaño (máx. 2MB).                                       |

---

## Stack Tecnológico

### Frontend (`/frontend`)

- **React 19** — Librería de interfaz de usuario.
- **Vite 7** — Bundler ultrarrápido para desarrollo y producción.
- **Tailwind CSS 3** — Framework de utilidades CSS con paleta personalizada.
- **Zustand** — Estado global ligero (autenticación, carrito).
- **React Router 7** — Enrutamiento SPA.
- **Axios** — Cliente HTTP para la comunicación con la API.
- **SweetAlert2** — Alertas y confirmaciones con estilo.
- **Cinzel + Manrope** — Tipografías Google Fonts para la estética _fine dining_.

### Backend (`/backend`)

- **Laravel 12** — Framework PHP para la API REST.
- **Laravel Sanctum** — Autenticación basada en tokens para SPA.
- **Eloquent ORM** — Mapeo objeto-relacional con modelos y relaciones.
- **SQLite** — Base de datos embebida (configurable a MySQL/PostgreSQL).

---

## Estructura del Proyecto

```
distrito-gourmet1/
├── README.md
├── frontend/                    # Aplicación React + Vite
│   ├── public/                  # Assets estáticos (imágenes)
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── layout/          # Navbar, Footer
│   │   │   └── ReservationForm.jsx
│   │   ├── layouts/             # Layout principal (MainLayout)
│   │   ├── pages/               # Vistas de la aplicación
│   │   │   ├── HomeView.jsx
│   │   │   ├── MenuView.jsx
│   │   │   ├── CartView.jsx
│   │   │   ├── ReservationsView.jsx
│   │   │   ├── ContactView.jsx
│   │   │   ├── LoginView.jsx
│   │   │   ├── RegisterView.jsx
│   │   │   ├── DashboardView.jsx
│   │   │   ├── ProfileView.jsx
│   │   │   └── AdminView.jsx
│   │   ├── store/               # Zustand stores (auth, cart)
│   │   ├── App.jsx              # Router y rutas principales
│   │   ├── main.jsx             # Punto de entrada
│   │   └── index.css            # Estilos globales + Tailwind
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── backend/                     # API Laravel
    ├── app/
    │   ├── Http/Controllers/API/
    │   │   ├── AuthController.php
    │   │   ├── DishController.php
    │   │   ├── OrderController.php
    │   │   ├── ReservationController.php
    │   │   └── UserController.php
    │   └── Models/
    │       ├── User.php
    │       ├── Dish.php
    │       ├── MenuCategory.php
    │       ├── Wine.php
    │       ├── Order.php
    │       ├── OrderItem.php
    │       ├── Reservation.php
    │       ├── RestaurantTable.php
    │       └── Setting.php
    ├── database/migrations/
    ├── routes/api.php            # Definición de endpoints
    ├── .env.example
    └── composer.json
```

---

## Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

| Herramienta  | Versión mínima |
| ------------ | -------------- |
| **PHP**      | 8.2+           |
| **Composer** | 2.x            |
| **Node.js**  | 18+            |
| **npm**      | 9+             |

---

## Instalación y Puesta en Marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/AVL05/distrito-gourmet.git
cd distrito-gourmet
```

### 2. Configurar el Backend (Laravel)

```bash
# Acceder al directorio del backend
cd backend

# Instalar dependencias PHP
composer install

# Crear archivo de configuración del entorno
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Ejecutar migraciones y sembrar datos iniciales
php artisan migrate --seed

# Crear enlace simbólico para archivos públicos (imágenes de platos)
php artisan storage:link

# Iniciar el servidor de desarrollo (por defecto en http://127.0.0.1:8000)
php artisan serve
```

### 3. Configurar el Frontend (React + Vite)

Abre una **nueva terminal** y ejecuta:

```bash
# Acceder al directorio del frontend
cd frontend

# Instalar dependencias de Node.js
npm install

# Iniciar el servidor de desarrollo (por defecto en http://localhost:5173)
npm run dev
```

### 4. Acceder a la aplicación

Una vez que ambos servidores estén en ejecución:

| Servicio           | URL                                                    |
| ------------------ | ------------------------------------------------------ |
| **Frontend (Web)** | [http://localhost:5173](http://localhost:5173)         |
| **Backend (API)**  | [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api) |

---

## Endpoints de la API

### Públicos

| Método | Ruta            | Descripción                             |
| ------ | --------------- | --------------------------------------- |
| `POST` | `/api/register` | Registrar nuevo usuario                 |
| `POST` | `/api/login`    | Iniciar sesión                          |
| `GET`  | `/api/dishes`   | Obtener carta completa (platos y vinos) |

### Autenticados (requieren token Sanctum)

| Método | Ruta                | Descripción                      |
| ------ | ------------------- | -------------------------------- |
| `POST` | `/api/logout`       | Cerrar sesión                    |
| `GET`  | `/api/user`         | Obtener datos del usuario actual |
| `PUT`  | `/api/profile`      | Actualizar perfil propio         |
| `GET`  | `/api/reservations` | Mis reservas                     |
| `POST` | `/api/reservations` | Crear una reserva                |
| `POST` | `/api/orders`       | Realizar un pedido               |
| `GET`  | `/api/orders`       | Mis pedidos                      |

### Administración (requieren rol admin)

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

## Variables de Entorno

El archivo `backend/.env` debe contener, como mínimo:

```env
APP_KEY=              # Generada automáticamente con php artisan key:generate
DB_CONNECTION=sqlite  # o mysql, pgsql según tu configuración
```

El frontend se conecta a la API a través de Axios con la base URL configurada en `frontend/src/store/auth.js`.

---

## Scripts Disponibles

### Frontend

| Comando           | Descripción                                       |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con Hot Module Replacement |
| `npm run build`   | Compilación para producción en `/dist`            |
| `npm run preview` | Previsualizar build de producción                 |
| `npm run lint`    | Ejecutar ESLint                                   |

### Backend

| Comando                            | Descripción                                   |
| ---------------------------------- | --------------------------------------------- |
| `php artisan serve`                | Servidor de desarrollo PHP                    |
| `php artisan migrate`              | Ejecutar migraciones pendientes               |
| `php artisan migrate:fresh --seed` | Recrear la base de datos con datos de ejemplo |
| `php artisan storage:link`         | Enlace simbólico para archivos públicos       |

---

## Autor

**Alex Vicente Lopez**

---

<p align="center">
  <em>Desarrollado como Proyecto Intermodular — 2º DAW</em>
</p>
