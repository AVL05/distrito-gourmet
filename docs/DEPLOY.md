# Guía de Despliegue e Instalación — Distrito Gourmet 🚀

<p align="center">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white">
  <img alt="PHP" src="https://img.shields.io/badge/PHP-8.2-777BB4?logo=php&logoColor=white">
  <img alt="Node" src="https://img.shields.io/badge/Node-LTS-339933?logo=node.js&logoColor=white">
</p>

Esta guía detalla los pasos necesarios para poner en marcha el proyecto tanto en entornos de desarrollo local como en producción utilizando Docker.

---

## 📑 Índice

- [Requisitos previos](#-requisitos-previos)
- [Despliegue con Docker (recomendado)](#-despliegue-con-docker-recomendado)
- [Variables de entorno](#-variables-de-entorno)
- [Desarrollo local (sin Docker)](#-desarrollo-local-sin-docker)
- [Despliegue en producción (Homelab)](#-despliegue-en-producción-homelab)
- [Comandos útiles](#-comandos-útiles)
- [Resolución de problemas](#-resolución-de-problemas)
- [Checklist de cierre](#-checklist-de-cierre)
- [Archivos de configuración clave](#-archivos-de-configuración-clave)

---

## 🛠️ Requisitos previos

- **Docker** y **Docker Compose** instalados.
- **Git** para la clonación del repositorio.
- Puertos libres: `80` (Frontend), `8000` (Backend) y `3306` (Base de datos).

---

## 🐳 Despliegue con Docker (recomendado)

El proyecto está totalmente contenerizado, lo que facilita enormemente su despliegue sin necesidad de instalar PHP, Node.js o MySQL localmente.

### 1. Clonar el repositorio

```bash
git clone https://github.com/AVL05/distrito-gourmet.git
cd distrito-gourmet
```

### 2. Configuración de entorno

Crea los archivos `.env` base si no existen:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Revisa la sección [Variables de entorno](#-variables-de-entorno) para ajustar los valores clave antes de levantar el entorno.

### 3. Levantar los contenedores

```bash
docker-compose up -d --build
```

### 4. Inicialización del sistema

Una vez los contenedores estén corriendo, ejecuta las migraciones y el seeder para tener datos reales de prueba:

```bash
docker exec -it distrito-backend php artisan migrate --seed
```

### 5. Verificación

```bash
docker-compose ps
curl -I http://localhost
```

Si todo ha ido bien, deberías ver los tres servicios en estado `Up` y una respuesta `200 OK` en el frontend.

---

## 🔧 Variables de entorno

### `backend/.env`

| Variable | Descripción | Ejemplo |
|---|---|---|
| `APP_URL` | URL pública del backend | `http://localhost:8000` |
| `APP_DEBUG` | Modo debug (`false` en producción) | `false` |
| `DB_CONNECTION` | Driver de base de datos | `mysql` |
| `DB_HOST` | Host del servicio de base de datos | `db` (nombre del servicio en `docker-compose.yml`) |
| `DB_PORT` | Puerto de la base de datos | `3306` |
| `DB_DATABASE` | Nombre de la base de datos | `distrito_gourmet` |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciales de acceso a MySQL | — |

### `frontend/.env`

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | Origen del backend Laravel. Vacío si frontend y API comparten dominio vía Nginx/Docker; con Vite separado, indicar el origen del backend. | `http://localhost:8000` |
| `VITE_DEMO_MODE` | Activa la demo pública sin escrituras reales cuando no hay API configurada | `true` / `false` |

> 🔒 Nunca subas archivos `.env` reales al repositorio. Mantén `backend/.env.example` y `frontend/.env.example` como plantillas sin credenciales sensibles.

---

## 💻 Desarrollo local (sin Docker)

Si prefieres trabajar directamente sobre tu sistema operativo:

### Backend (Laravel)

1. Entra en `/backend`.
2. Ejecuta `composer install`.
3. Configura tu base de datos en el `.env`.
4. Ejecuta `php artisan key:generate` y `php artisan migrate --seed`.
5. Inicia el servidor: `php artisan serve`.

### Frontend (React)

1. Entra en `/frontend`.
2. Ejecuta `npm install`.
3. Configura `VITE_API_URL` en `frontend/.env` si el backend está en otro origen.
4. Inicia el entorno de desarrollo: `npm run dev`.

---

## 🏗️ Despliegue en producción (Homelab)

Para el entorno de producción en un servidor Ubuntu, se utiliza el script de gestión incluido:

1. **Permisos:**
   ```bash
   chmod +x scripts/manage.sh
   ```
2. **Arranque:**
   ```bash
   ./scripts/manage.sh start
   ```
3. **Auto-update:** el script `scripts/auto_update.sh` debe configurarse en el `crontab` del sistema para sincronizar con GitHub automáticamente:
   ```bash
   */5 * * * * /path/to/distrito-gourmet/scripts/auto_update.sh >> /var/log/distrito_update.log 2>&1
   ```

> 💡 Recomendación de producción: sirve el frontend y la API bajo HTTPS (por ejemplo con un proxy como Nginx/Traefik + Let's Encrypt) y fija `APP_DEBUG=false` para no exponer trazas de error.

---

## 🧰 Comandos útiles

| Acción | Comando |
|---|---|
| Ver logs en tiempo real | `docker-compose logs -f` |
| Ver logs de un servicio concreto | `docker-compose logs -f backend` |
| Reiniciar un servicio | `docker-compose restart backend` |
| Reconstruir un solo servicio | `docker-compose up -d --build backend` |
| Entrar al contenedor del backend | `docker exec -it distrito-backend bash` |
| Detener todo el entorno | `docker-compose down` |
| Detener y borrar volúmenes (⚠️ borra datos) | `docker-compose down -v` |

---

## 🩺 Resolución de problemas

| Síntoma | Posible causa | Solución |
|---|---|---|
| `docker-compose up` falla por puerto ocupado | Otro proceso usando `80`, `8000` o `3306` | Libera el puerto o cambia el mapeo en `docker-compose.yml` |
| Frontend no conecta con la API | `VITE_API_URL` mal configurada | Revisa `frontend/.env` y reconstruye el contenedor del frontend |
| Error de conexión a base de datos | El backend arrancó antes de que MySQL esté listo | Reinicia el servicio backend: `docker-compose restart backend` |
| `php artisan migrate --seed` falla | Variables `DB_*` incorrectas en `backend/.env` | Verifica que coincidan con el servicio `db` definido en `docker-compose.yml` |
| Cambios en el código no se reflejan | Imagen cacheada | Reconstruye con `docker-compose up -d --build` |

---

## ✅ Checklist de cierre

Antes de entregar o desplegar:

```bash
npm --prefix frontend run lint
npm --prefix frontend run build
cd backend && php artisan test
cd backend && php artisan route:list --path=api
```

**Smoke test manual:**

- Carta pública carga platos, vinos, bebidas y menús degustación.
- Login, perfil y dashboard funcionan con usuario cliente.
- Reserva válida queda confirmada o pendiente según aforo del turno.
- Pedido takeaway calcula total desde catálogo y aparece en dashboard.
- Panel admin lista y actualiza reservas, pedidos, carta y usuarios.

---

## 📁 Archivos de configuración clave

| Archivo | Propósito |
|---|---|
| `docker-compose.yml` | Define la orquestación de los 3 servicios principales |
| `backend/Dockerfile` | Configuración de la imagen PHP 8.2 con las extensiones necesarias |
| `frontend/Dockerfile` | Construcción de la app React y servicio mediante Nginx |
| `frontend/nginx.conf` | Configuración del servidor web para manejar las rutas de la SPA y el proxy inverso hacia la API |
