<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('actas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tipo');
            $table->string('equipo_id');
            $table->string('hospital_id')->nullable();
            $table->string('usuario_id')->nullable();
            $table->string('receptor_nombre');
            $table->string('receptor_identificacion')->nullable();
            $table->string('receptor_cargo')->nullable();
            $table->text('motivo');
            $table->json('data')->nullable();
            $table->string('path');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('actas');
    }
};
