<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre');
            $table->string('serie')->nullable();
            $table->string('bien_patrimonial')->nullable();
            $table->uuid('hospital_id');
            $table->uuid('servicio_id')->nullable();
            $table->uuid('oficina_id')->nullable();
            $table->string('estado')->default('activo');
            $table->text('descripcion')->nullable();
            $table->timestamps();

            $table->foreign('hospital_id')->references('id')->on('instituciones');
            $table->foreign('servicio_id')->references('id')->on('unidades_organizacionales');
            $table->foreign('oficina_id')->references('id')->on('unidades_organizacionales');
            $table->index(['hospital_id', 'estado']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipos');
    }
};
