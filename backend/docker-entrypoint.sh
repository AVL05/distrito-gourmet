#!/bin/sh
set -e

# Asegurarse que el .env existe (si no, usar el de ejemplo por si acaso)
# Nota: En Render, las variables reales vendrán del panel "Environment"
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Optimizar Laravel para Producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ejecutar migraciones con --force (obligatorio en producción)
#php artisan migrate --force

# Iniciar PHP-FPM en segundo plano
php-fpm -D

# Iniciar Nginx en primer plano (para mantener vivo el contenedor)
nginx -g "daemon off;"
