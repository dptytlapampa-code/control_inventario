<?php

Route::middleware(['auth:keycloak', 'role:superadmin'])->group(function () {
    Route::get('/tipos-institucion', [\App\Http\Controllers\TipoInstitucionController::class, 'index']);
    Route::post('/tipos-institucion', [\App\Http\Controllers\TipoInstitucionController::class, 'store']);
    Route::get('/tipos-institucion/{id}', [\App\Http\Controllers\TipoInstitucionController::class, 'show']);
    Route::put('/tipos-institucion/{id}', [\App\Http\Controllers\TipoInstitucionController::class, 'update']);
    Route::delete('/tipos-institucion/{id}', [\App\Http\Controllers\TipoInstitucionController::class, 'destroy']);
});
