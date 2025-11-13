<?php

return [

    // Nombre del realm de Keycloak
    'realm' => env('KEYCLOAK_REALM', 'control-inventario'),

    // URL base del servidor Keycloak (contenedor)
    'auth_server_url' => env('KEYCLOAK_URL', 'http://keycloak:8080'),

    // ID del cliente usado por la API Laravel
    'client_id' => env('KEYCLOAK_CLIENT_ID', 'backend-api'),

    // Secreto del cliente (solo para flujos confidenciales)
    'client_secret' => env('KEYCLOAK_CLIENT_SECRET', 'backend-secret-key'),

    // Algoritmo de firma usado por Keycloak
    'algorithm' => 'RS256',

    // Tiempo extra permitido por desincronización (segundos)
    'leeway' => 0,

    // Configuración de rutas para proteger API
    'routes' => [
        'login' => '/auth/login',
        'logout' => '/auth/logout',
        'callback' => '/auth/callback',
    ],
];
