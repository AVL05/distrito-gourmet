#!/bin/sh
set -eu

: "${APP_KEY:?APP_KEY must be configured in Render}"
sed -i "s/Listen 80/Listen ${PORT:-10000}/" /etc/apache2/ports.conf
sed -i "s/:80>/:${PORT:-10000}>/" /etc/apache2/sites-available/000-default.conf
php artisan config:cache
php artisan migrate --force
if [ "${INITIALIZE_DATABASE:-false}" = "true" ]; then
    php artisan restaurant:initialize
fi
exec apache2-foreground
