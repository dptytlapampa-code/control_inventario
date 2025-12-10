<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cajas', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->string('estado');
            $table->decimal('saldo_inicial', 12, 2);
            $table->decimal('saldo_final', 12, 2)->nullable();
            $table->decimal('total_efectivo', 12, 2)->default(0);
            $table->decimal('total_debito', 12, 2)->default(0);
            $table->decimal('total_credito', 12, 2)->default(0);
            $table->decimal('total_transferencia', 12, 2)->default(0);
            $table->decimal('total_descuentos', 12, 2)->default(0);
            $table->decimal('total_costo', 12, 2)->default(0);
            $table->decimal('total_ventas', 12, 2)->default(0);
            $table->decimal('diferencia_efectivo', 12, 2)->default(0);
            $table->timestamp('abierta_en');
            $table->timestamp('cerrada_en')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cajas');
    }
};
