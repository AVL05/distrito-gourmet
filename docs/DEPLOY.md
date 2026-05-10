# Guía de Despliegue e Instalación — Distrito Gourmet 🚀

Esta guía detalla los pasos necesarios para poner en marcha el proyecto tanto en entornos de desarrollo local como en producción utilizando Docker.

---

## 🛠️ Requisitos Previos

- **Docker** y **Docker Compose** instalados.
- **Git** para la clonación del repositorio.
- Puertos libres: `80` (Frontend), `8000` (Backend) y `3306` (Base de datos).

---

## 🐳 Despliegue con Docker (Recomendado)

El proyecto está totalmente contenerizado, lo que facilita enormemente su despliegue sin necesidad de instalar PHP, Node.js o MySQL localmente.

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/distrito-gourmet.git
cd distrito-gourmet
```

### 2. Configuración de Entorno
Crea los archivos `.env` base si no existen:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Levantar los contenedores
```bash
docker-compose up -d --build
```

### 4. Inicialización del Sistema
Una vez los contenedores estén corriendo, ejecuta las migraciones y el seeder para tener datos reales de prueba:
```bash
docker exec -it distrito-backend php artisan migrate --seed
```

---

## 💻 Desarrollo Local (Sin Docker)

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
3. Inicia el entorno de desarrollo: `npm run dev`.

---

## 🏗️ Despliegue en Producción (Homelab)

Para el entorno de producción en un servidor Ubuntu, se utiliza el script de gestión incluido:

1. **Permisos:** `chmod +x scripts/manage.sh`
2. **Arranque:** `./scripts/manage.sh start`
3. **Auto-Update:** El script `scripts/auto_update.sh` debe configurarse en el `crontab` del sistema para sincronizar con GitHub automáticamente:
   ```bash
   */5 * * * * /path/to/distrito-gourmet/scripts/auto_update.sh >> /var/log/distrito_update.log 2>&1
   ```

---

## 📁 Archivos de Configuración Clave

- **`docker-compose.yml`:** Define la orquestación de los 3 servicios principales.
- **`backend/Dockerfile`:** Configuración de la imagen PHP 8.2 con las extensiones necesarias.
- **`frontend/Dockerfile`:** Construcción de la App React y servicio mediante Nginx.
- **`frontend/nginx.conf`:** Configuración del servidor web para manejar las rutas de la SPA y el Proxy Inverso hacia la API.
