<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('instituciones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tipo_institucion_id');
            $table->string('nombre');
            $table->string('localidad');
            $table->string('domicilio')->nullable();
            $table->string('telefono')->nullable();
            $table->string('zona_sanitaria')->nullable();
            $table->decimal('latitud', 10, 7)->nullable();
            $table->decimal('longitud', 10, 7)->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->foreign('tipo_institucion_id')->references('id')->on('tipos_institucion');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instituciones');
    }
};
