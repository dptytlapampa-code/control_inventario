<?php

use App\Http\Controllers\Pos\ArcaController;
use App\Http\Controllers\Pos\CajaController;
use App\Http\Controllers\Pos\VentaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\TipoInstitucionController;
use App\Http\Controllers\InstitucionController;

Route::middleware(['auth:keycloak', 'role:superadmin'])->group(function () {
    Route::get('/tipos-institucion', [TipoInstitucionController::class, 'index']);
    Route::post('/tipos-institucion', [TipoInstitucionController::class, 'store']);
    Route::get('/tipos-institucion/{id}', [TipoInstitucionController::class, 'show']);
    Route::put('/tipos-institucion/{id}', [TipoInstitucionController::class, 'update']);
    Route::delete('/tipos-institucion/{id}', [TipoInstitucionController::class, 'destroy']);
});

Route::middleware(['auth:keycloak', 'role:superadmin'])->group(function () {
    Route::get('/instituciones', [InstitucionController::class, 'index']);
    Route::post('/instituciones', [InstitucionController::class, 'store']);
    Route::get('/instituciones/{id}', [InstitucionController::class, 'show']);
    Route::put('/instituciones/{id}', [InstitucionController::class, 'update']);
    Route::delete('/instituciones/{id}', [InstitucionController::class, 'destroy']);
});

Route::middleware(['auth:api', 'role:cajero,admin,superadmin'])->prefix('pos')->group(function () {
    Route::post('caja/abrir', [CajaController::class, 'abrir']);
    Route::get('caja/abierta', [CajaController::class, 'verCajaAbierta']);
    Route::post('caja/cerrar', [CajaController::class, 'cerrar']);

    Route::post('ventas', [VentaController::class, 'store']);
    Route::get('ventas', [VentaController::class, 'index']);
    Route::get('ventas/{id}', [VentaController::class, 'show']);
});

Route::middleware(['auth:api', 'role:admin,superadmin'])->prefix('arca')->group(function () {
    Route::post('test', [ArcaController::class, 'test']);
});

Route::middleware(['auth:api', 'role:cajero,admin,superadmin,repositor'])->group(function () {
    Route::get('productos', [ProductoController::class, 'index']);
});
