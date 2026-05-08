<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Valores por Defecto de Autenticación
    |--------------------------------------------------------------------------
    |
    | Define el "guard" de autenticación por defecto y el "broker" para el
    | restablecimiento de contraseñas.
    |
    */

    'defaults' => [
        'guard' => env('AUTH_GUARD', 'web'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Guards de Autenticación
    |--------------------------------------------------------------------------
    |
    | Define los mecanismos de autenticación disponibles. Por defecto se utiliza
    | almacenamiento de sesión con el proveedor de usuarios Eloquent.
    |
    */

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Proveedores de Usuario
    |--------------------------------------------------------------------------
    |
    | Define cómo se recuperan los usuarios de la base de datos u otro sistema.
    | Habitualmente se utiliza Eloquent.
    |
    */

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_MODEL', App\Models\Usuario::class),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Restablecimiento de Contraseñas
    |--------------------------------------------------------------------------
    |
    | Configuración del comportamiento del restablecimiento de contraseñas,
    | incluyendo la tabla de tokens y el tiempo de expiración.
    |
    */

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'tokens_recuperacion_password'),
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Confirmation Timeout
    |--------------------------------------------------------------------------
    |
    | Here you may define the number of seconds before a password confirmation
    | window expires and users are asked to re-enter their password via the
    | confirmation screen. By default, the timeout lasts for three hours.
    |
    */

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

];
