<?php

Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::middleware(['auth:keycloak', 'role:superadmin', 'capture.ip'])->group(function () {
    Route::get('/tipos-institucion', [\App\Http\Controllers\TipoInstitucionController::class, 'index']);
    Route::post('/tipos-institucion', [\App\Http\Controllers\TipoInstitucionController::class, 'store']);
    Route::get('/tipos-institucion/{id}', [\App\Http\Controllers\TipoInstitucionController::class, 'show']);
    Route::put('/tipos-institucion/{id}', [\App\Http\Controllers\TipoInstitucionController::class, 'update']);
    Route::delete('/tipos-institucion/{id}', [\App\Http\Controllers\TipoInstitucionController::class, 'destroy']);
});

Route::middleware(['auth:keycloak', 'role:superadmin', 'capture.ip'])->group(function () {
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

Route::middleware(['auth:keycloak', 'capture.ip'])->group(function () {
    Route::get('/dashboard/kpis', [\App\Http\Controllers\DashboardController::class, 'kpis']);
    Route::get('/dashboard/equipos-por-tipo', [\App\Http\Controllers\DashboardController::class, 'equiposPorTipo']);
    Route::get('/dashboard/equipos-por-estado', [\App\Http\Controllers\DashboardController::class, 'equiposPorEstado']);
    Route::get('/dashboard/mantenimientos-por-mes', [\App\Http\Controllers\DashboardController::class, 'mantenimientosPorMes']);
    Route::get('/dashboard/equipos-por-hospital', [\App\Http\Controllers\DashboardController::class, 'equiposPorHospital']);
});

Route::prefix('export')->middleware(['auth:keycloak', 'role:admin|superadmin', 'capture.ip'])->group(function () {
    Route::get('/equipos', [\App\Http\Controllers\ExportacionesController::class, 'exportEquipos']);
    Route::get('/mantenimientos', [\App\Http\Controllers\ExportacionesController::class, 'exportMantenimientos']);
    Route::get('/historial', [\App\Http\Controllers\ExportacionesController::class, 'exportHistorial']);
    Route::get('/actas', [\App\Http\Controllers\ExportacionesController::class, 'exportActas']);
    Route::get('/usuarios', [\App\Http\Controllers\ExportacionesController::class, 'exportUsuarios']);
    Route::get('/auditoria', [\App\Http\Controllers\ExportacionesController::class, 'exportAuditoria']);
    Route::get('/oficinas', [\App\Http\Controllers\ExportacionesController::class, 'exportOficinas']);
    Route::get('/servicios', [\App\Http\Controllers\ExportacionesController::class, 'exportServicios']);
    Route::get('/hospitales', [\App\Http\Controllers\ExportacionesController::class, 'exportHospitales']);
    Route::get('/tipos-equipos', [\App\Http\Controllers\ExportacionesController::class, 'exportTiposEquipos']);
});

Route::prefix('superadmin')->middleware(['auth:keycloak', 'role:superadmin', 'capture.ip'])->group(function () {
    Route::get('/usuarios', [\App\Http\Controllers\SuperAdmin\UsuarioPermisoController::class, 'index']);
    Route::get('/usuarios/{id}/permisos', [\App\Http\Controllers\SuperAdmin\UsuarioPermisoController::class, 'show']);
    Route::post('/usuarios/{id}/permisos', [\App\Http\Controllers\SuperAdmin\UsuarioPermisoController::class, 'store']);
    Route::delete('/permisos/{id}', [\App\Http\Controllers\SuperAdmin\UsuarioPermisoController::class, 'destroy']);

    Route::get('/encabezado-actas', [\App\Http\Controllers\SuperAdmin\EncabezadoActaController::class, 'index']);
    Route::post('/encabezado-actas', [\App\Http\Controllers\SuperAdmin\EncabezadoActaController::class, 'store']);
    Route::delete('/encabezado-actas', [\App\Http\Controllers\SuperAdmin\EncabezadoActaController::class, 'destroy']);
});

Route::middleware(['auth:keycloak', 'capture.ip'])->group(function () {
    Route::get('/buscador-global', [\App\Http\Controllers\BuscadorGlobalController::class, '__invoke']);
    Route::apiResource('equipos', \App\Http\Controllers\EquiposController::class);
    Route::apiResource('mantenimientos', \App\Http\Controllers\MantenimientosController::class);
    Route::apiResource('actas', \App\Http\Controllers\ActasController::class);
});

Route::prefix('auditoria')->middleware(['auth:keycloak', 'role:admin|superadmin', 'capture.ip'])->group(function () {
    Route::get('/', [\App\Http\Controllers\AuditoriaController::class, 'index']);
    Route::get('/export/pdf', function () {
        return response()->json([
            'message' => 'Exportaciones de auditoría no están habilitadas en esta fase.'
        ], 501);
    });
    Route::get('/export/excel', function () {
        return response()->json([
            'message' => 'Exportaciones de auditoría no están habilitadas en esta fase.'
        ], 501);
    });
});
