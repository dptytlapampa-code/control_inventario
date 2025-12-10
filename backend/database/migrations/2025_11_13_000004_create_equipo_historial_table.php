<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipo_historial', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('equipo_id');
            $table->string('tipo_evento');
            $table->text('descripcion')->nullable();
            $table->string('usuario_registra');
            $table->timestamp('fecha_evento');
            $table->uuid('oficina_origen_id')->nullable();
            $table->uuid('oficina_destino_id')->nullable();
            $table->timestamps();

            $table->index('equipo_id');
            $table->index('fecha_evento');
            $table->foreign('oficina_origen_id')->references('id')->on('unidades_organizacionales');
            $table->foreign('oficina_destino_id')->references('id')->on('unidades_organizacionales');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipo_historial');
    }
};
