<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mantenimientos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('equipo_id');
            $table->uuid('hospital_id');
            $table->uuid('servicio_id')->nullable();
            $table->uuid('oficina_id')->nullable();
            $table->string('tipo');
            $table->text('descripcion')->nullable();
            $table->string('estado')->default('pendiente');
            $table->date('fecha');
            $table->decimal('costo', 12, 2)->nullable();
            $table->timestamps();

            $table->foreign('equipo_id')->references('id')->on('equipos');
            $table->foreign('hospital_id')->references('id')->on('instituciones');
            $table->foreign('servicio_id')->references('id')->on('unidades_organizacionales');
            $table->foreign('oficina_id')->references('id')->on('unidades_organizacionales');
            $table->index(['hospital_id', 'estado']);
            $table->index('fecha');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mantenimientos');
    }
};
