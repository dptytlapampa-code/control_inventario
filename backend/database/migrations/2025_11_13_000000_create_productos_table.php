<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('codigo')->unique();
            $table->decimal('precio_venta', 12, 2);
            $table->decimal('costo', 12, 2);
            $table->decimal('stock', 12, 2)->default(0);
            $table->timestamps();

            $table->index('nombre');
            $table->index('codigo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
