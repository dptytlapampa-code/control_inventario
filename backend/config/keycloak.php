<?php

return [
    'auth_server_url' => rtrim(env('KEYCLOAK_AUTH_SERVER_URL', 'http://keycloak:8080'), '/'),
    'realm' => env('KEYCLOAK_REALM', 'master'),
    'client_id' => env('KEYCLOAK_CLIENT_ID', 'control-inventario'),
    'client_secret' => env('KEYCLOAK_CLIENT_SECRET'),
];
