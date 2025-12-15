<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unidades_organizacionales', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('institucion_id');
            $table->uuid('parent_id')->nullable();
            $table->string('nombre');
            $table->string('tipo');
            $table->text('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->foreign('institucion_id')->references('id')->on('instituciones');
            $table->foreign('parent_id')->references('id')->on('unidades_organizacionales');
            $table->index(['institucion_id', 'tipo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unidades_organizacionales');
    }
};
