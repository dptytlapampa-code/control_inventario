<?php

Route::middleware(['auth:keycloak', 'role:superadmin'])->group(function () {
    Route::get('/tipos-institucion', [\App\Http\Controllers\TipoInstitucionController::class, 'index']);
    Route::post('/tipos-institucion', [\App\Http\Controllers\TipoInstitucionController::class, 'store']);
    Route::get('/tipos-institucion/{id}', [\App\Http\Controllers\TipoInstitucionController::class, 'show']);
    Route::put('/tipos-institucion/{id}', [\App\Http\Controllers\TipoInstitucionController::class, 'update']);
    Route::delete('/tipos-institucion/{id}', [\App\Http\Controllers\TipoInstitucionController::class, 'destroy']);
});

Route::middleware(['auth:keycloak', 'role:superadmin'])->group(function () {
    Route::get('/instituciones', [\App\Http\Controllers\InstitucionController::class, 'index']);
    Route::post('/instituciones', [\App\Http\Controllers\InstitucionController::class, 'store']);
    Route::get('/instituciones/{id}', [\App\Http\Controllers\InstitucionController::class, 'show']);
    Route::put('/instituciones/{id}', [\App\Http\Controllers\InstitucionController::class, 'update']);
    Route::delete('/instituciones/{id}', [\App\Http\Controllers\InstitucionController::class, 'destroy']);

    Route::get('/equipos/{equipoId}/adjuntos', [\App\Http\Controllers\EquipoAdjuntoController::class, 'index']);
    Route::post('/equipos/{equipoId}/adjuntos', [\App\Http\Controllers\EquipoAdjuntoController::class, 'store']);
    Route::get('/adjuntos/{id}/download', [\App\Http\Controllers\EquipoAdjuntoController::class, 'download']);
    Route::delete('/adjuntos/{id}', [\App\Http\Controllers\EquipoAdjuntoController::class, 'destroy']);

    Route::get('/equipos/{id}/historial', [\App\Http\Controllers\EquipoHistorialController::class, 'index']);
    Route::post('/equipos/{id}/historial', [\App\Http\Controllers\EquipoHistorialController::class, 'store']);
    Route::put('/historial/{id}', [\App\Http\Controllers\EquipoHistorialController::class, 'update']);
    Route::delete('/historial/{id}', [\App\Http\Controllers\EquipoHistorialController::class, 'destroy']);
});

Route::middleware(['auth:keycloak'])->group(function () {
    Route::get('/dashboard/kpis', [\App\Http\Controllers\DashboardController::class, 'kpis']);
    Route::get('/dashboard/equipos-por-tipo', [\App\Http\Controllers\DashboardController::class, 'equiposPorTipo']);
    Route::get('/dashboard/equipos-por-estado', [\App\Http\Controllers\DashboardController::class, 'equiposPorEstado']);
    Route::get('/dashboard/mantenimientos-por-mes', [\App\Http\Controllers\DashboardController::class, 'mantenimientosPorMes']);
    Route::get('/dashboard/equipos-por-hospital', [\App\Http\Controllers\DashboardController::class, 'equiposPorHospital']);
});

Route::prefix('superadmin')->middleware(['auth:api', 'role:superadmin'])->group(function () {
    Route::get('/usuarios', [\App\Http\Controllers\SuperAdmin\UsuarioPermisoController::class, 'index']);
    Route::get('/usuarios/{id}/permisos', [\App\Http\Controllers\SuperAdmin\UsuarioPermisoController::class, 'show']);
    Route::post('/usuarios/{id}/permisos', [\App\Http\Controllers\SuperAdmin\UsuarioPermisoController::class, 'store']);
    Route::delete('/permisos/{id}', [\App\Http\Controllers\SuperAdmin\UsuarioPermisoController::class, 'destroy']);

    Route::get('/encabezado-actas', [\App\Http\Controllers\SuperAdmin\EncabezadoActaController::class, 'index']);
    Route::post('/encabezado-actas', [\App\Http\Controllers\SuperAdmin\EncabezadoActaController::class, 'store']);
    Route::delete('/encabezado-actas', [\App\Http\Controllers\SuperAdmin\EncabezadoActaController::class, 'destroy']);
});

Route::prefix('actas')->middleware(['auth:api'])->group(function () {
    Route::post('/entrega/{equipoId}', [\App\Http\Controllers\ActasController::class, 'generarEntrega']);
    Route::post('/traslado/{equipoId}', [\App\Http\Controllers\ActasController::class, 'generarTraslado']);
    Route::post('/baja/{equipoId}', [\App\Http\Controllers\ActasController::class, 'generarBaja']);
    Route::post('/prestamo/{equipoId}', [\App\Http\Controllers\ActasController::class, 'generarPrestamo']);
    Route::get('/{id}/download', [\App\Http\Controllers\ActasController::class, 'download']);
});
