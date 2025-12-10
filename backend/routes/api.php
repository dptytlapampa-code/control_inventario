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

Route::prefix('superadmin')->middleware(['auth:api', 'role:superadmin'])->group(function () {
    Route::get('/usuarios', [\App\Http\Controllers\SuperAdmin\UsuarioPermisoController::class, 'index']);
    Route::get('/usuarios/{id}/permisos', [\App\Http\Controllers\SuperAdmin\UsuarioPermisoController::class, 'show']);
    Route::post('/usuarios/{id}/permisos', [\App\Http\Controllers\SuperAdmin\UsuarioPermisoController::class, 'store']);
    Route::delete('/permisos/{id}', [\App\Http\Controllers\SuperAdmin\UsuarioPermisoController::class, 'destroy']);
});
