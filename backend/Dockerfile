# Dockerfile para Laravel 12 - Distrito Gourmet
# Basado en PHP 8.2 FPM con Nginx

FROM php:8.2-fpm-alpine

# Instalar dependencias del sistema y extensiones de PHP necesarias
RUN apk add --no-cache \
    nginx \
    wget \
    git \
    unzip \
    libxml2-dev \
    libpng-dev \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    postgresql-dev \
    && docker-php-ext-install \
    pdo_mysql \
    pdo_pgsql \
    mbstring \
    xml \
    gd \
    zip \
    intl \
    opcache

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar directorio de trabajo
WORKDIR /var/www/html

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias de Composer (optimizado para producción)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Configurar permisos para Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Copiar configuración de Nginx personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto que usará Render (por defecto 80 o el puerto definido en $PORT)
EXPOSE 80

# Script de inicio para migraciones y servicios
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
