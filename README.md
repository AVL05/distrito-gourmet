<p align="center">
  <img src="https://img.shields.io/badge/-%20DISTRITO%20GOURMET%20-1a1a1a?style=for-the-badge&labelColor=1a1a1a&color=c8a96e" alt="Distrito Gourmet" height="40"/>
</p>

<p align="center">
  <strong>Plataforma Full-Stack para Restaurante de Alta Cocina</strong><br/>
  <em>Proyecto de Final de Ciclo · 2º DAW · 2025–2026</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19"/>
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 7"/>
  <img src="https://img.shields.io/badge/Laravel-12-F53C32?style=flat-square&logo=laravel&logoColor=white" alt="Laravel 12"/>
  <img src="https://img.shields.io/badge/GSAP-3.14-88CE02?style=flat-square&logo=greensock&logoColor=white" alt="GSAP"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License MIT"/>
</p>

---

## 📖 Descripción

**Distrito Gourmet** es una plataforma _full-stack_ premium diseñada para la gestión integral de un restaurante de alta cocina. El proyecto combina una **estética editorial sofisticada** con una arquitectura técnica moderna, desacoplada y escalable.

El sistema ofrece dos experiencias diferenciadas: la **experiencia de cliente** (carta digital interactiva, pedidos takeaway, reservas de mesa y maridajes) y el **panel de administración** (control total sobre inventario, pedidos, reservas y usuarios en tiempo real).

> Desarrollado como **Proyecto de Final de Ciclo** del Grado Superior en **Desarrollo de Aplicaciones Web (DAW)**.

---

## ✨ Funcionalidades

<table>
  <thead>
    <tr>
      <th>Módulo</th>
      <th>Descripción</th>
      <th>Tecnología</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>🍽️ <strong>Carta Digital</strong></td>
      <td>Menú interactivo categorizado con filtrado inteligente y carga asíncrona por categorías (Entrantes, Platos Principales, Postres, Bebidas, Vinos, Menús Degustación).</td>
      <td>React, Axios, Zustand</td>
    </tr>
    <tr>
      <td>🛒 <strong>Pedidos Takeaway</strong></td>
      <td>Carrito de compra persistente en <code>localStorage</code>, desglose de impuestos (IVA 10%), selección de hora y fecha de recogida, y múltiples métodos de pago.</td>
      <td>Zustand, Laravel API</td>
    </tr>
    <tr>
      <td>📅 <strong>Reservas de Mesa</strong></td>
      <td>Sistema de reservas con selección de fecha, hora, número de comensales, menú degustación opcional y peticiones especiales. Validación en tiempo real.</td>
      <td>React, Laravel Sanctum</td>
    </tr>
    <tr>
      <td>🔐 <strong>Autenticación</strong></td>
      <td>Registro, login y gestión de sesión mediante <strong>Laravel Sanctum</strong> (tokens de API). Roles diferenciados: <em>Admin</em> y <em>Cliente</em>. Rutas protegidas en el SPA.</td>
      <td>Sanctum, Zustand auth store</td>
    </tr>
    <tr>
      <td>🛠️ <strong>Panel Admin</strong></td>
      <td>Dashboard completo con gestión de pedidos (cambio de estado ENUM), reservas, inventario de platos/vinos/bebidas, usuarios y métricas clave.</td>
      <td>React, Charts, API REST</td>
    </tr>
    <tr>
      <td>🍷 <strong>Maridajes</strong></td>
      <td>Sistema de recomendaciones plato–vino con nivel de recomendación (Buena / Muy buena / Perfecta) y notas de sommelier.</td>
      <td>Eloquent ORM, MySQL</td>
    </tr>
    <tr>
      <td>🎭 <strong>Animaciones Premium</strong></td>
      <td>Transiciones de página fluidas, micro-interacciones y efectos de scroll con <strong>GSAP + ScrollTrigger</strong>. Lazy loading de vistas para rendimiento óptimo.</td>
      <td>GSAP, Framer Motion, React Suspense</td>
    </tr>
  </tbody>
</table>

---

## 🏗️ Arquitectura

El proyecto sigue una arquitectura **monorepo desacoplada** con frontend y backend completamente independientes que se comunican mediante una API REST.

```
┌─────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                 │
│         React 19 SPA · Vite · Tailwind CSS          │
│   ┌──────────┐  ┌───────────┐  ┌─────────────────┐  │
│   │  Zustand │  │React Router│  │ GSAP Animations │  │
│   │auth/cart │  │   v7 SPA  │  │  ScrollTrigger  │  │
│   └──────────┘  └───────────┘  └─────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │ HTTP / Axios (JSON)
                     │ Bearer Token (Sanctum)
┌────────────────────▼────────────────────────────────┐
│                  NGINX (Proxy)                       │
│    /api/*  →  Laravel   |   /*  →  React SPA        │
└──────────────┬──────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────┐
│              BACKEND — Laravel 12 API REST           │
│  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │  Sanctum Auth    │  │   Controllers API:        │  │
│  │  Token-based     │  │   Auth · Platos · Vinos  │  │
│  └──────────────────┘  │   Pedidos · Reservas     │  │
│                         │   Bebidas · Menus · Users│  │
│  ┌──────────────────┐   └──────────────────────────┘  │
│  │  Eloquent ORM    │                                 │
│  └────────┬─────────┘                                 │
└───────────┼─────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────┐
│              MySQL 8.0 — Base de Datos               │
│  usuarios · platos · vinos · bebidas · reservas      │
│  pedidos · detalles_pedido · menus_degustacion       │
│  categorias_menu · maridajes_plato_vino              │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

### Frontend

| Tecnología                                      | Versión | Uso                                       |
| :---------------------------------------------- | :-----: | :---------------------------------------- |
| [React](https://react.dev/)                     |   19    | Framework principal de UI                 |
| [Vite](https://vite.dev/)                       |    7    | Bundler y servidor de desarrollo          |
| [Tailwind CSS](https://tailwindcss.com/)        |   3.4   | Sistema de estilos utility-first          |
| [GSAP](https://gsap.com/)                       |  3.14   | Animaciones premium y ScrollTrigger       |
| [Framer Motion](https://www.framer.com/motion/) |    —    | Transiciones declarativas de componentes  |
| [Zustand](https://zustand.docs.pmnd.rs/)        |    —    | Gestión de estado global (auth + carrito) |
| [React Router](https://reactrouter.com/)        |    7    | Enrutamiento SPA con rutas protegidas     |
| [Axios](https://axios-http.com/)                |    —    | Cliente HTTP para consumo de API          |
| [SweetAlert2](https://sweetalert2.github.io/)   |    —    | Modales y notificaciones                  |
| [Vitest](https://vitest.dev/)                   |    —    | Testing de componentes                    |

### Backend

| Tecnología                                          | Versión | Uso                                  |
| :-------------------------------------------------- | :-----: | :----------------------------------- |
| [Laravel](https://laravel.com/)                     |   12    | Framework PHP · MVC · API REST       |
| [Laravel Sanctum](https://laravel.com/docs/sanctum) |    —    | Autenticación stateless con tokens   |
| [Eloquent ORM](https://laravel.com/docs/eloquent)   |    —    | Modelado y consultas a base de datos |
| [MySQL](https://www.mysql.com/)                     |   8.0   | Base de datos relacional principal   |
| [PHPUnit](https://phpunit.de/)                      |    —    | Testing unitario y de integración    |

### Infraestructura

| Tecnología                                                                             | Uso                                             |
| :------------------------------------------------------------------------------------- | :---------------------------------------------- |
| [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) | Contenedores para frontend, backend, DB y proxy |
| [Nginx](https://www.nginx.com/)                                                        | Servidor web y reverse proxy para SPA + API     |

---

## 📁 Estructura del Proyecto

```
distrito-gourmet/
├── backend/                     # API REST — Laravel 12
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── API/         # Controladores REST
│   │   │   │       ├── AuthController.php
│   │   │   │       ├── PedidoController.php
│   │   │   │       ├── ReservaController.php
│   │   │   │       ├── PlatoController.php
│   │   │   │       ├── VinoController.php
│   │   │   │       ├── BebidaController.php
│   │   │   │       ├── MenuDegustacionController.php
│   │   │   │       └── UsuarioController.php
│   │   │   └── Middleware/
│   │   └── Models/              # Modelos Eloquent
│   ├── database/
│   │   ├── migrations/          # Esquema de base de datos
│   │   └── seeders/             # Datos de prueba y producción
│   ├── routes/
│   │   └── api.php              # Definición de endpoints REST
│   └── tests/                   # PHPUnit — Tests unitarios e integración
│
├── frontend/                    # SPA — React 19 + Vite
│   └── src/
│       ├── assets/              # Imágenes, fuentes y recursos estáticos
│       ├── components/          # Componentes reutilizables
│       ├── layouts/             # Estructura base de las páginas
│       ├── motion/              # Configuraciones GSAP y componentes animados
│       ├── pages/               # Vistas principales de la aplicación
│       │   ├── HomeView.jsx
│       │   ├── MenuView.jsx
│       │   ├── ReservationsView.jsx
│       │   ├── CartView.jsx
│       │   ├── DashboardView.jsx
│       │   ├── AdminView.jsx
│       │   ├── ProfileView.jsx
│       │   ├── LoginView.jsx
│       │   ├── RegisterView.jsx
│       │   └── ContactView.jsx
│       ├── services/            # Clientes HTTP (Axios)
│       ├── store/               # Estado global con Zustand
│       │   ├── auth.js          # Store de autenticación
│       │   └── cart.js          # Store del carrito
│       ├── App.jsx              # Enrutador principal + rutas protegidas
│       └── main.jsx             # Punto de entrada
│
├── nginx/                       # Configuración de servidor de producción
├── scripts/                     # Scripts de desarrollo (arranque unificado)
├── docker-compose.yml           # Orquestación de contenedores
└── package.json                 # Scripts raíz del monorepo
```

---

## 🚀 Instalación y Puesta en Marcha

### ✅ Opción A — Docker (Recomendado)

Levanta todo el ecosistema (Frontend, Backend, MySQL, Nginx) con un único comando:

```bash
git clone https://github.com/tu-usuario/distrito-gourmet.git
cd distrito-gourmet
docker-compose up -d --build
```

Una vez iniciado, la aplicación estará disponible en:

| Servicio          | URL                                                    |
| :---------------- | :----------------------------------------------------- |
| 🌐 Aplicación Web | [http://localhost:8001](http://localhost:8001)         |
| 🔌 API REST       | [http://localhost:8001/api](http://localhost:8001/api) |

---

### 🛠️ Opción B — Desarrollo Local (Manual)

#### Requisitos previos

| Herramienta | Versión mínima |
| :---------- | :------------: |
| PHP         |      8.2+      |
| Composer    |      2.x       |
| Node.js     |      18+       |
| npm         |       9+       |
| MySQL       |      8.0+      |

#### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/distrito-gourmet.git
cd distrito-gourmet
```

#### 2. Configurar el Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edita `backend/.env` con tus credenciales de base de datos:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=distrito_gourmet
DB_USERNAME=root
DB_PASSWORD=tu_password

SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

Ejecuta las migraciones y los seeders:

```bash
php artisan migrate --seed
```

#### 3. Instalar todas las dependencias

Desde la raíz del proyecto:

```bash
npm run install:all
```

#### 4. Arrancar el entorno de desarrollo

```bash
npm start
```

Este comando inicia el servidor Laravel y el servidor de desarrollo de Vite simultáneamente.

---

## 🔌 API Endpoints

La API sigue convenciones REST estándar. Todos los endpoints están prefijados con `/api/`.

### Autenticación

| Método | Endpoint        | Descripción                       | Auth |
| :----: | :-------------- | :-------------------------------- | :--: |
| `POST` | `/api/register` | Registro de nuevo usuario         |  ❌  |
| `POST` | `/api/login`    | Login — devuelve token Sanctum    |  ❌  |
| `POST` | `/api/logout`   | Cierre de sesión (invalida token) |  ✅  |
| `GET`  | `/api/user`     | Datos del usuario autenticado     |  ✅  |

### Carta y Catálogo

| Método | Endpoint                 | Descripción                    | Auth |
| :----: | :----------------------- | :----------------------------- | :--: |
| `GET`  | `/api/platos`            | Listado completo de platos     |  ❌  |
| `GET`  | `/api/vinos`             | Listado de vinos con maridajes |  ❌  |
| `GET`  | `/api/bebidas`           | Listado de bebidas             |  ❌  |
| `GET`  | `/api/menus-degustacion` | Menús degustación disponibles  |  ❌  |

### Pedidos

|  Método  | Endpoint                   | Descripción                      |   Auth   |
| :------: | :------------------------- | :------------------------------- | :------: |
|  `GET`   | `/api/pedidos`             | Historial de pedidos del usuario |    ✅    |
|  `POST`  | `/api/pedidos`             | Crear nuevo pedido (takeaway)    |    ✅    |
|  `GET`   | `/api/pedidos/all`         | Todos los pedidos _(admin)_      | ✅ Admin |
| `PATCH`  | `/api/pedidos/{id}/status` | Actualizar estado del pedido     | ✅ Admin |
| `DELETE` | `/api/pedidos/{id}`        | Eliminar pedido                  | ✅ Admin |

### Reservas

|  Método  | Endpoint             | Descripción                      |   Auth   |
| :------: | :------------------- | :------------------------------- | :------: |
|  `GET`   | `/api/reservas`      | Reservas del usuario autenticado |    ✅    |
|  `POST`  | `/api/reservas`      | Crear nueva reserva              |    ✅    |
|  `GET`   | `/api/reservas/all`  | Todas las reservas _(admin)_     | ✅ Admin |
| `PATCH`  | `/api/reservas/{id}` | Actualizar estado de reserva     | ✅ Admin |
| `DELETE` | `/api/reservas/{id}` | Cancelar/eliminar reserva        |    ✅    |

---

## 🗄️ Modelo de Base de Datos

El esquema relacional implementado en MySQL:

```
usuarios
  └─< reservas (usuario_id)
  └─< pedidos  (usuario_id)
        └─< detalles_pedido (pedido_id)
              ├─ platos        (plato_id)
              ├─ vinos         (vino_id)
              ├─ bebidas       (bebida_id)
              └─ menus_degustacion (menu_degustacion_id)

platos
  └── categorias_menu (categoria_menu_id)
  └─< platos_menu_degustacion >─┐
  └─< maridajes_plato_vino      │
        └── vinos (vino_id)     │

menus_degustacion ──────────────┘
```

---

## 🧪 Testing

### Backend (PHPUnit + Laravel)

```bash
cd backend
php artisan test
```

### Frontend (Vitest)

```bash
cd frontend
npm run test
```

---

## 🔑 Credenciales de Demostración

> ⚠️ Estas credenciales son generadas por el seeder y son **solo para entorno de desarrollo**.

| Rol               | Email                         | Contraseña |
| :---------------- | :---------------------------- | :--------- |
| **Administrador** | `admin@distritogourmet.com`   | `password` |
| **Cliente**       | `cliente@distritogourmet.com` | `password` |

---

## 🗺️ Rutas del Frontend

| Ruta            | Vista                   |     Acceso     |
| :-------------- | :---------------------- | :------------: |
| `/`             | Home                    |    Público     |
| `/menu`         | Carta Digital           |    Público     |
| `/reservations` | Reservas                |    Público     |
| `/cart`         | Carrito / Pedido        |    Público     |
| `/contact`      | Contacto                |    Público     |
| `/login`        | Inicio de sesión        |    Público     |
| `/register`     | Registro                |    Público     |
| `/dashboard`    | Panel de usuario        | 🔒 Autenticado |
| `/profile`      | Perfil                  | 🔒 Autenticado |
| `/admin`        | Panel de administración |    🔒 Admin    |

---

## 👨‍💻 Autor

**Alex Vicente Lopez**
_Estudiante de 2º Desarrollo de Aplicaciones Web (DAW)_

[![GitHub](https://img.shields.io/badge/GitHub-@alexvicentelopez-181717?style=flat-square&logo=github)](https://github.com/tu-usuario)

---

## 📄 Licencia

Este proyecto está publicado bajo la licencia **MIT**. Consulta el archivo [`LICENSE`](./LICENSE) para más detalles.

<p align="center">
  <sub><em>Distrito Gourmet © 2026 · Proyecto de Final de Ciclo · DAW</em></sub>
</p>
