<p align="center">
  <strong>D I S T R I T O &nbsp; G O U R M E T</strong><br/>
  <em>Sistema de Gestión para Restaurante de Alta Cocina</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Laravel-12-F53C32?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel"/>
  <img src="https://img.shields.io/badge/GSAP-3.14-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
</p>

---

## 📋 Descripción

**Distrito Gourmet** es una plataforma _full-stack_ premium diseñada para la gestión integral de un restaurante de alta cocina. Este proyecto ha sido desarrollado como el **Proyecto de Final de Curso** para el ciclo de **2º de Desarrollo de Aplicaciones Web (DAW)**.

La aplicación ofrece una experiencia de usuario fluida y sofisticada, combinando una estética editorial con una arquitectura técnica robusta y moderna.

---

## ✨ Funcionalidades Clave

| Módulo | Descripción |
| :--- | :--- |
| 🍽️ **Carta Digital Dinámica** | Menú interactivo categorizado con carga asíncrona y filtrado inteligente. |
| 🛒 **Experiencia de Compra** | Carrito de pedidos persistente con persistencia en `localStorage` vía Zustand. |
| 📅 **Gestión de Reservas** | Sistema de reservas en tiempo real con validación y confirmación inmediata. |
| 🔐 **Seguridad & Auth** | Autenticación segura mediante Laravel Sanctum con roles diferenciados (Admin/Cliente). |
| 🛠️ **Panel Administrativo** | Dashboard completo para el control de inventario, pedidos, reservas y usuarios. |
| 🎭 **Animaciones High-End** | Transiciones fluidas y micro-interacciones potenciadas por GSAP y ScrollTrigger. |

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** [React 19](https://react.dev/) + [Vite 7](https://vite.dev/)
- **Estilos:** [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Animaciones:** [GSAP](https://gsap.com/) (GreenSock Animation Platform)
- **Estado:** [Zustand](https://zustand.docs.pmnd.rs/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Tests:** [Vitest](https://vitest.dev/)

### Backend
- **Framework:** [Laravel 12](https://laravel.com/)
- **Auth:** [Laravel Sanctum](https://laravel.com/docs/12.x/sanctum)
- **Base de Datos:** [MySQL 8.0](https://www.mysql.com/)
- **Tests:** [PHPUnit](https://phpunit.de/)

### Infraestructura
- **Contenedores:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **Servidor Web:** [Nginx](https://www.nginx.com/) (Configuración optimizada para SPA y API)

---

## 🚀 Instalación y Despliegue

### Opción A: Con Docker (Recomendado)

Si tienes Docker instalado, puedes levantar todo el ecosistema (Frontend, Backend, DB, Nginx) con un solo comando:

```bash
docker-compose up -d --build
```

La aplicación estará disponible en:
- **Frontend (Web):** [http://localhost:8001](http://localhost:8001)
- **Backend (API):** [http://localhost:8001/api](http://localhost:8001/api)

### Opción B: Desarrollo Local (Manual)

#### 1. Requisitos
- PHP 8.2+
- Node.js 18+
- MySQL (o Laragon)
- Composer

#### 2. Configuración del Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configura tus credenciales de DB en el .env
php artisan migrate --seed
```

#### 3. Configuración del Frontend
```bash
cd frontend
npm install
```

#### 4. Ejecución
Desde la raíz del proyecto, utiliza el script unificado:
```bash
npm start
```

---

## 🧪 Testing

El proyecto incluye una suite de pruebas para garantizar la estabilidad de las funcionalidades críticas.

### Backend Tests (Laravel)
```bash
cd backend
php artisan test
```

### Frontend Tests (Vitest)
```bash
cd frontend
npm run test
```

---

## 📁 Estructura del Proyecto

```bash
distrito-gourmet/
├── backend/             # API REST Laravel 12
│   ├── app/             # Lógica de negocio (Controllers, Models, Middlewares)
│   ├── database/        # Migraciones y Seeders
│   └── tests/           # Pruebas unitarias y de integración
├── frontend/            # SPA React 19 + Vite
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/       # Vistas principales
│   │   ├── store/       # Gestión de estado (Zustand)
│   │   └── animations/  # Scripts de GSAP
│   └── tests/           # Component tests con Vitest
├── nginx/               # Configuraciones de servidor de producción
└── docker-compose.yml   # Orquestación de contenedores
```

---

## 🔑 Credenciales de Acceso (Seeder)

| Perfil | Email | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@distritogourmet.com` | `password` |
| **Cliente** | `cliente@distritogourmet.com` | `password` |

---

## 👨‍💻 Autor

**Alex Vicente Lopez**
*Estudiante de Desarrollo de Aplicaciones Web (DAW)*

---

## 📄 Licencia

Este proyecto ha sido desarrollado como **Proyecto de Final de Curso** para el Grado Superior en **Desarrollo de Aplicaciones Web (DAW)**.

<p align="center"><em>Distrito Gourmet © 2026</em></p>
