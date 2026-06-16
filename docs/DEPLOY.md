# Guia de despliegue e instalacion - Distrito Gourmet

Esta guia cubre la instalacion del proyecto en desarrollo local, ejecucion con Docker Compose y criterios minimos antes de entregar o desplegar.

## Requisitos

### Comunes

- Git.
- Node.js y npm.
- Acceso al repositorio.

### Desarrollo sin Docker

- PHP 8.2 o superior.
- Composer.
- MySQL compatible con la configuracion de Laravel.

### Docker

- Docker.
- Docker Compose.
- Puertos disponibles por defecto:
  - `80` para frontend.
  - `8000` para backend.
  - `3306` para MySQL.

## Variables de entorno

El proyecto separa configuracion por aplicacion:

| Archivo | Uso |
| --- | --- |
| `backend/.env` | Configuracion Laravel, base de datos, logs, mail y servicios externos |
| `frontend/.env` | Configuracion Vite, origen de API y modo demo |

Crear archivos iniciales:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Variables relevantes:

| Variable | Ubicacion | Descripcion |
| --- | --- | --- |
| `APP_ENV` | `backend/.env` | `local` en desarrollo, `production` en despliegue |
| `APP_DEBUG` | `backend/.env` | Debe ser `false` en produccion |
| `APP_KEY` | `backend/.env` | Clave de aplicacion Laravel |
| `DB_HOST` | `backend/.env` | Host de MySQL; en Docker es `db` |
| `DB_DATABASE` | `backend/.env` | Nombre de base de datos |
| `DB_USERNAME` | `backend/.env` | Usuario de base de datos |
| `DB_PASSWORD` | `backend/.env` | Contrasena de base de datos |
| `VITE_API_URL` | `frontend/.env` | Origen del backend cuando no se usan rutas relativas |
| `VITE_DEMO_MODE` | `frontend/.env` | Activa/desactiva comportamiento de demo |

No hardcodear origenes, IPs LAN ni `localhost` en codigo fuente. Ajustar esos valores en `.env`.

## Ejecucion con Docker Compose

Docker Compose levanta tres servicios: MySQL, backend Laravel y frontend servido por Nginx.

```bash
git clone https://github.com/AVL05/distrito-gourmet.git
cd distrito-gourmet

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker-compose up -d --build
```

Inicializar base de datos:

```bash
docker exec -it distrito-backend php artisan migrate --seed
```

Comandos utiles:

```bash
docker-compose ps
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
docker-compose down
```

Si se necesita reiniciar desde cero la base de datos Docker, hacerlo de forma consciente porque el volumen `db_data` contiene los datos persistidos.

## Desarrollo local sin Docker

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Revisa `backend/.env` antes de migrar para confirmar credenciales MySQL y host.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Si el backend esta en otro origen, configurar `VITE_API_URL` con el origen completo del servidor Laravel, por ejemplo `http://127.0.0.1:8000`. No incluir `/api` en la variable.

### Orquestacion desde raiz

Desde la raiz del repositorio:

```bash
npm run install:all
npm start
```

El script `scripts/dev.js` levanta Laravel y Vite, comprueba puertos y pasa `VITE_API_URL` al frontend en desarrollo.

## Despliegue en produccion

Checklist recomendado:

1. Configurar `APP_ENV=production`.
2. Configurar `APP_DEBUG=false`.
3. Definir `APP_KEY` valida.
4. Usar credenciales de base de datos robustas.
5. Revisar que `VITE_API_URL` sea coherente con el dominio final o quede vacio si se usa proxy relativo `/api`.
6. Ejecutar migraciones de forma controlada.
7. Validar que Nginx enruta correctamente la SPA y las llamadas `/api`.

Comandos Laravel habituales en produccion:

```bash
cd backend
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Si se despliega con Docker, ejecutar los comandos dentro del contenedor `distrito-backend`.

## Homelab y scripts de mantenimiento

El repositorio incluye scripts en `scripts/` para facilitar tareas de entorno. Antes de usarlos en servidor:

```bash
chmod +x scripts/manage.sh
chmod +x scripts/auto_update.sh
```

Ejemplo de arranque:

```bash
./scripts/manage.sh start
```

Ejemplo de actualizacion automatica mediante cron:

```bash
*/5 * * * * /path/to/distrito-gourmet/scripts/auto_update.sh >> /var/log/distrito_update.log 2>&1
```

Recomendacion: activar auto-update solo si el flujo de ramas, backups y migraciones esta controlado. En produccion real, es preferible desplegar versiones etiquetadas o ramas estables.

## Validacion previa a entrega

```bash
npm --prefix frontend run lint
npm --prefix frontend run build
cd backend && php artisan test
cd backend && php artisan route:list --path=api
```

Smoke test funcional:

1. Abrir frontend y cargar la carta publica.
2. Registrar o iniciar sesion con usuario de prueba.
3. Crear una reserva valida.
4. Crear un pedido takeaway.
5. Comprobar historial de usuario.
6. Entrar como administrador.
7. Cambiar estados de reserva y pedido.
8. Crear, editar y eliminar un elemento de carta en entorno no productivo.

## Problemas frecuentes

| Sintoma | Posible causa | Accion |
| --- | --- | --- |
| Frontend no conecta con API | `VITE_API_URL` incorrecto o proxy no configurado | Revisar `frontend/.env` y llamadas bajo `/api` |
| Laravel no conecta con MySQL | `DB_HOST`, credenciales o contenedor `db` no disponible | Revisar `backend/.env` y `docker-compose ps` |
| Error de clave Laravel | `APP_KEY` vacia | Ejecutar `php artisan key:generate` |
| Puerto ocupado | Otro servicio usa `80`, `8000` o `3306` | Cambiar puertos o detener servicio conflictivo |
| Build frontend falla | Dependencias no instaladas o variables ausentes | Ejecutar `npm install` en `frontend/` y revisar `.env` |

## Archivos clave

| Archivo | Proposito |
| --- | --- |
| `docker-compose.yml` | Orquesta `db`, `backend` y `frontend` |
| `backend/Dockerfile` | Imagen PHP/Laravel |
| `frontend/Dockerfile` | Build y servicio Nginx del frontend |
| `frontend/nginx.conf` | Configuracion de SPA y proxy hacia API |
| `scripts/dev.js` | Entorno local coordinado |
| `backend/.env.example` | Plantilla de configuracion Laravel |
| `frontend/.env.example` | Plantilla de configuracion Vite |
