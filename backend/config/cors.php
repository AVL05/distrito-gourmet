<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Configuración de Intercambio de Recursos de Origen Cruzado (CORS)
    |--------------------------------------------------------------------------
    |
    | Aquí se pueden configurar los ajustes para el intercambio de recursos de
    | origen cruzado o "CORS". Esto determina qué operaciones de origen cruzado
    | pueden ejecutarse en los navegadores web.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
