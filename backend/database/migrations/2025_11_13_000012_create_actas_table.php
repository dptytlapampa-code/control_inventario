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
            $table->uuid('equipo_id');
            $table->uuid('hospital_id')->nullable();
            $table->uuid('created_by')->nullable();
            $table->string('receptor_nombre');
            $table->string('receptor_identificacion')->nullable();
            $table->string('receptor_cargo')->nullable();
            $table->text('motivo');
            $table->json('data')->nullable();
            $table->string('path')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('equipo_id')->references('id')->on('equipos')->cascadeOnDelete();
            $table->foreign('hospital_id')->references('id')->on('instituciones')->nullOnDelete();

            $table->index('tipo');
            $table->index('created_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('actas');
    }
};
