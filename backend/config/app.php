<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Nombre de la Aplicación
    |--------------------------------------------------------------------------
    |
    | Este valor es el nombre de la aplicación, utilizado por el framework cuando
    | se necesita mostrar el nombre en notificaciones o elementos de la interfaz.
    |
    */

    'name' => env('APP_NAME', 'Laravel'),

    /*
    |--------------------------------------------------------------------------
    | Entorno de la Aplicación
    |--------------------------------------------------------------------------
    |
    | Este valor determina el "entorno" en el que se ejecuta la aplicación, lo que
    | influye en la configuración de diversos servicios. Configurable en el archivo .env.
    |
    */

    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Modo Depuración de la Aplicación
    |--------------------------------------------------------------------------
    |
    | Cuando la aplicación está en modo depuración, se mostrarán mensajes de error
    | detallados. Si se desactiva, se mostrará una página de error genérica.
    |
    */

    'debug' => (bool) env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | URL de la Aplicación
    |--------------------------------------------------------------------------
    |
    | Esta URL es utilizada por la consola para generar URLs correctamente cuando se
    | utiliza la herramienta Artisan. Debe apuntar a la raíz de la aplicación.
    |
    */

    'url' => env('APP_URL', 'http://localhost'),

    /*
    |--------------------------------------------------------------------------
    | Zona Horaria de la Aplicación
    |--------------------------------------------------------------------------
    |
    | Aquí se puede especificar la zona horaria por defecto para la aplicación, la
    | cual será utilizada por las funciones de fecha y hora de PHP.
    |
    */

    'timezone' => 'Europe/Madrid',

    /*
    |--------------------------------------------------------------------------
    | Configuración de Localización
    |--------------------------------------------------------------------------
    |
    | Determina el idioma por defecto que será utilizado por los métodos de
    | traducción y localización de Laravel.
    |
    */

    'locale' => env('APP_LOCALE', 'en'),

    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    'faker_locale' => env('APP_FAKER_LOCALE', 'en_US'),

    /*
    |--------------------------------------------------------------------------
    | Clave de Encriptación
    |--------------------------------------------------------------------------
    |
    | Esta clave es utilizada por los servicios de encriptación de Laravel y debe
    | ser una cadena aleatoria de 32 caracteres para garantizar la seguridad.
    |
    */

    'cipher' => 'AES-256-CBC',

    'key' => env('APP_KEY'),

    'previous_keys' => [
        ...array_filter(
            explode(',', (string) env('APP_PREVIOUS_KEYS', ''))
        ),
    ],

    /*
    |--------------------------------------------------------------------------
    | Maintenance Mode Driver
    |--------------------------------------------------------------------------
    |
    | These configuration options determine the driver used to determine and
    | manage Laravel's "maintenance mode" status. The "cache" driver will
    | allow maintenance mode to be controlled across multiple machines.
    |
    | Supported drivers: "file", "cache"
    |
    */

    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

];
