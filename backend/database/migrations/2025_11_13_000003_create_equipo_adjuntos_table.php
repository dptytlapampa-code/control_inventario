<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipo_adjuntos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('equipo_id');
            $table->string('nombre_original');
            $table->string('nombre_archivo');
            $table->string('mime');
            $table->unsignedBigInteger('size');
            $table->string('path');
            $table->timestamps();

            $table->index('equipo_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipo_adjuntos');
    }
};
