# Manual de Despliegue — Distrito Gourmet

> Guía para poner en marcha el proyecto en local o en un servidor de producción.

---

## Requisitos Previos

| Herramienta | Versión mínima |
|---|---|
| PHP | 8.2+ |
| Composer | 2.x |
| Node.js | 18+ |
| MySQL | 8.0+ |
| Git | 2.x |

---

## Instalación en Local (Desarrollo)

### 1. Clonar el repositorio
```bash
git clone https://github.com/AVL05/distrito-gourmet.git
cd distrito-gourmet
```

### 2. Instalar todas las dependencias (un solo comando)
```bash
npm run install:all
```
> Este script instala las dependencias de Composer (backend) y npm (frontend) de forma automática.

### 3. Configurar el backend
Crea el archivo de entorno a partir del ejemplo:
```bash
cd backend
cp .env.example .env
php artisan key:generate
```

Edita `backend/.env` con los datos de tu base de datos MySQL:
```env
DB_DATABASE=distrito_gourmet
DB_USERNAME=root
DB_PASSWORD=tu_password
```

### 4. Preparar la base de datos
```bash
# Desde la carpeta backend/
php artisan migrate
php artisan db:seed --class=DistritoGourmetSeeder
```
> El seeder crea el catálogo completo de platos, vinos, bebidas, menús degustación y los usuarios de prueba.

### 5. Configurar el frontend
```bash
cd ../frontend
cp .env.example .env
```
El archivo `.env` del frontend solo necesita la URL de la API:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 6. Arrancar el proyecto
Desde la raíz del monorepo:
```bash
npm start
```
> Este comando lanza el servidor de Laravel (puerto 8000) y Vite (puerto 5173) en paralelo.

### Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| **Administrador** | admin@distritogourmet.com | password |
| **Cliente VIP** | vip@distritogourmet.com | password |
| **Cliente** | alex@example.com | password |

---

## Despliegue en Producción — Docker

El proyecto está completamente dockerizado. Solo necesitas tener **Docker** y **Docker Compose** instalados.

### 1. Configurar las variables de producción
Edita `backend/.env` con los valores de producción:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

DB_HOST=db
DB_DATABASE=distrito_gourmet
DB_USERNAME=usuario
DB_PASSWORD=contraseña_segura

SANCTUM_STATEFUL_DOMAINS=tu-dominio.com
FRONTEND_URL=https://tu-dominio.com
```

### 2. Levantar los contenedores
```bash
docker-compose up -d --build
```
Esto levanta automáticamente:
- **`frontend`** — Build de Vite servido por Nginx
- **`backend`** — Laravel con PHP-FPM
- **`db`** — MySQL 8.0 con volumen persistente
- **`nginx`** — Proxy inverso en el puerto `8001`

La aplicación estará disponible en: `http://localhost:8001`

### 3. Ejecutar migraciones y seeders en producción
```bash
docker-compose exec backend php artisan migrate --force
docker-compose exec backend php artisan db:seed --class=DistritoGourmetSeeder
```

---

## Despliegue Manual (Sin Docker)

### Frontend — Vercel / Netlify
```bash
cd frontend
npm run build
# Sube la carpeta frontend/dist/ a tu plataforma de hosting estático
```

### Backend — Render / Railway / VPS
```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan migrate --force
```

---

## Comandos útiles

```bash
# Reiniciar la base de datos completamente
php artisan migrate:fresh --seed

# Ver todos los endpoints registrados
php artisan route:list

# Limpiar caché de configuración
php artisan config:clear
php artisan cache:clear
```
