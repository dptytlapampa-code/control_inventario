<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ventas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caja_id')->constrained('cajas');
            $table->string('user_id');
            $table->unsignedBigInteger('numero_ticket');
            $table->string('modo');
            $table->decimal('subtotal', 12, 2);
            $table->decimal('descuento_porcentaje', 5, 2)->default(0);
            $table->decimal('descuento_monto', 12, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->decimal('total_costo', 12, 2);
            $table->boolean('venta_debajo_costo')->default(false);
            $table->string('medio_pago_resumen');
            $table->timestamps();

            $table->index('user_id');
            $table->index('caja_id');
            $table->index('numero_ticket');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};
