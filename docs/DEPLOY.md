# Guía de Despliegue e Instalación — Distrito Gourmet 🚀

<p align="center">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white">
  <img alt="PHP" src="https://img.shields.io/badge/PHP-8.2-777BB4?logo=php&logoColor=white">
  <img alt="Node" src="https://img.shields.io/badge/Node-LTS-339933?logo=node.js&logoColor=white">
</p>

Esta guía detalla los pasos necesarios para poner en marcha el proyecto tanto en entornos de desarrollo local como en producción utilizando Docker.

## Frontend publicado en Vercel

Dominio de producción: https://distrito-gourmet.aleviclop.dev. URL de Vercel: https://distrito-gourmet.vercel.app (12 de octubre de 2026).

El subdominio está asociado al proyecto y el DNS está verificado. En Cloudflare tiene un CNAME `distrito-gourmet` hacia `3898b1ed8220916b.vercel-dns-017.com`, sin proxy. Vercel gestiona el certificado HTTPS.

Proyecto `aleviclop/distrito-gourmet`, conectado a `AVL05/distrito-gourmet`, con `main` como rama de producción. El primer despliegue se publicó desde los archivos locales con `vercel deploy --prod`; los siguientes pushes pueden generar despliegues desde GitHub. `.vercelignore` excluye el backend, archivos de entorno y dependencias locales.

Vercel tiene `VITE_API_URL=https://distrito-gourmet-api.aleviclop.dev` en producción y CSP permite únicamente ese origen adicional para la API. Este despliegue no activa datos de demostración.

## Render y Supabase

Estado al 12 de octubre de 2026: servicio gratuito `distrito-gourmet-api-avl05` creado en Render, con dominio `distrito-gourmet-api.aleviclop.dev` verificado y certificado emitido. Cloudflare usa un CNAME hacia `distrito-gourmet-api-avl05.onrender.com`, sin proxy. El contenedor compila y arranca; la API de carta y calendario devuelve HTTP 200. El rechazo inicial de credenciales dejó de reproducirse al reintentar. Se añaden migraciones para `sessions`, `cache` y `cache_locks`, necesarias con los drivers de base de datos; la verificación del login en producción queda pendiente de ese despliegue.

El proyecto dedicado de Supabase es `distrito-gourmet` (`jobtbxxtkpipkkiqrogi`, Europa), con Data API desactivada y esquema `distrito_gourmet` creado. La conexión usa el pooler de sesión `aws-0-eu-west-1.pooler.supabase.com:5432` y usuario `postgres.jobtbxxtkpipkkiqrogi`; la contraseña se configura exclusivamente en Render.

El backend se prepara para un Web Service Docker gratuito en Render: rama `main`, directorio raíz `backend`, Dockerfile `Dockerfile.render` y comprobación de salud `/up`. El contenedor usa Apache, PHP 8.4 y PDO PostgreSQL; al iniciar ejecuta las migraciones pendientes. Con `INITIALIZE_DATABASE=true`, ejecuta `restaurant:initialize`: solo carga el catálogo y las cuentas iniciales si todas las tablas del restaurante están vacías, bajo bloqueo y transacción. Un reinicio conserva cualquier dato existente. Nunca ejecutar el seeder destructivo directamente sobre una base con datos.

Las cuentas iniciales de prueba mantienen `password` según la configuración solicitada para este proyecto. Sustituir sus contraseñas antes de usar datos reales o abrir la administración a usuarios de producción.

Crear un proyecto gratuito dedicado en Supabase, en Europa, con Data API desactivada. Usar su pooler de **sesión**, puerto 5432, y contraseña propia. Para aislar las tablas, ejecutar una vez `CREATE SCHEMA distrito_gourmet;` con el propietario de la base.

Configurar en Render, sin subir secretos al repositorio:

- `APP_ENV=production`, `APP_DEBUG=false`, `APP_KEY` estable generado con Laravel y `LOG_CHANNEL=stderr`.
- `DB_CONNECTION=pgsql`, `DB_HOST`, `DB_USERNAME` y `DB_PASSWORD` del pooler; `DB_PORT=5432`, `DB_DATABASE=postgres`, `DB_SCHEMA=distrito_gourmet`, `DB_SSLMODE=require`.
- `APP_URL` con la URL HTTPS del backend; `FRONTEND_URL` y `CORS_ALLOWED_ORIGINS` con el origen HTTPS del frontend; `SANCTUM_STATEFUL_DOMAINS` con su host sin protocolo.
- `SESSION_DRIVER=database`, `SESSION_SECURE_COOKIE=true`, `SESSION_HTTP_ONLY=true`, `SESSION_SAME_SITE=lax`; `SESSION_DOMAIN` debe compartir el dominio principal de frontend y backend.
- `CACHE_STORE=database`. En el plan gratuito, usar `QUEUE_CONNECTION=sync` salvo que exista un worker operativo; configurar SMTP antes de exigir envío real de correo.

El backend necesita un subdominio del mismo dominio principal que la SPA para Sanctum. Configurar `VITE_API_URL` en Vercel y permitir únicamente ese origen en `connect-src` de CSP. Verificar catálogo, cookies CSRF, login, reservas y pedidos antes de considerar el despliegue completo.

Render gratuito puede detenerse por inactividad; Supabase gratuito tiene límites de almacenamiento y actividad. Las sesiones permanecen en PostgreSQL aunque Render reinicie. No usar el almacenamiento local del contenedor para datos persistentes.

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

**Solo en una base nueva de pruebas:** el seeder trunca las tablas y carga tres cuentas con contraseña `password`. No ejecutarlo sobre datos que deban conservarse ni usar esas cuentas en una exposición pública con permisos administrativos. En producción, aplicar `php artisan migrate --force` sin `--seed` y preparar el catálogo y las cuentas de forma controlada.

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

La aplicación utiliza siempre Laravel y sesiones reales; `VITE_DEMO_MODE` ya no activa una demostración. No se sustituye una API caída por datos estáticos. Vercel publica únicamente el frontend: requiere alojar Laravel y MySQL por separado y configurar su acceso. La configuración actual de CSP admite conexiones al mismo origen; un backend en otro origen necesita una política que permita expresamente ese origen y configurar CORS/Sanctum. No dejar `VITE_API_URL` vacío en un alojamiento sin proxy para `/api` y `/sanctum`.

> 🔒 Nunca subas archivos `.env` reales al repositorio. Mantén `backend/.env.example` y `frontend/.env.example` como plantillas sin credenciales sensibles.

---

## 💻 Desarrollo local (sin Docker)

`pnpm start` crea una SQLite temporal fuera del repositorio, ejecuta migraciones y carga el catálogo y las tres cuentas iniciales. Arranca Laravel y Vite automáticamente. Cada arranque empieza de cero; Ctrl+C detiene los servicios y elimina la base temporal. No modifica `.env` ni la base MySQL configurada. Si se termina el proceso a la fuerza, puede quedar una carpeta temporal, pero el siguiente arranque crea otra base nueva. Requiere PHP con PDO SQLite y las dependencias instaladas.

Los correos locales se escriben en el log y las colas se ejecutan de forma síncrona. Para desarrollo con persistencia, arrancar Laravel y Vite por separado con su configuración habitual. El despliegue sigue utilizando MySQL; esta SQLite es únicamente para `pnpm start`.

El arranque unificado utiliza `/api` y `/sanctum` en el mismo origen que la web. `VITE_PROXY_TARGET` conecta el proxy de Vite con Laravel; `VITE_API_URL` permanece vacío para que la cookie CSRF sea accesible desde localhost o la dirección de red utilizada para abrir la web.

Si prefieres trabajar directamente sobre tu sistema operativo:

### Backend (Laravel)

1. Entra en `/backend`.
2. Ejecuta `composer install`.
3. Configura tu base de datos en el `.env`.
4. Ejecuta `php artisan key:generate` y `php artisan migrate --seed`.
5. Inicia el servidor: `php artisan serve`.

### Frontend (React)

1. Entra en `/frontend`.
2. Ejecuta `pnpm install`.
3. Configura `VITE_API_URL` en `frontend/.env` si el backend está en otro origen.
4. Inicia el entorno de desarrollo: `pnpm run dev`.

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
pnpm --dir frontend run lint
pnpm --dir frontend run build
cd backend && php artisan test
cd backend && php artisan route:list --path=api
```

**Smoke test manual:**

- Carta pública carga platos, vinos, bebidas y menús degustación.
- Login, perfil y dashboard funcionan con usuario cliente.
- Reserva válida queda confirmada o pendiente según aforo del servicio.
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


## Calendario y avisos por correo

Antes de activar esta versión, ejecutar `php artisan migrate --force` en el entorno previsto. Las nuevas migraciones crean el bloqueo estable del aforo y las tablas `jobs`/`failed_jobs`; no modifican reservas ni pedidos existentes. No usar `migrate:fresh` en datos reales.

`backend/config/restaurant.php` define capacidad, horizonte de reserva y servicios semanales. `RESTAURANT_CLOSED_DATES` permite cierres puntuales, por ejemplo `2026-12-25,2027-01-01`. Tras cambiar configuración en producción, regenerar `php artisan config:cache`. La web consulta esos datos mediante `/api/service-calendar`.

Los avisos usan las variables Laravel `MAIL_*`. `MAIL_MAILER=log` solo escribe en el log y no entrega correos. Para entrega real, configurar un transporte SMTP válido y comprobarlo con un destinatario de prueba autorizado.

Con `QUEUE_CONNECTION=database`, mantener un worker supervisado:

```bash
php artisan queue:work --tries=3 --timeout=60
```

Reiniciar workers después de desplegar (`php artisan queue:restart`) y revisar `php artisan queue:failed` si hay fallos. La operación de negocio queda guardada aunque no se pueda encolar el aviso; el fallo se registra para diagnóstico. El estado en la cuenta es la fuente de verdad.

En desarrollo local deben existir `storage/framework/sessions`, `storage/framework/views` y `storage/framework/cache/data`, con permisos de escritura. El Dockerfile ya prepara los directorios de Laravel.

Pagos: los pedidos nuevos se pagan en el local. No hay pasarela ni confirmación de cobro online.
