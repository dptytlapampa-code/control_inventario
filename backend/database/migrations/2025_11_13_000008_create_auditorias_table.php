<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auditorias', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('user_id')->nullable();
            $table->string('user_name')->nullable();
            $table->string('user_email')->nullable();
            $table->string('user_role')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('accion');
            $table->string('modulo');
            $table->string('objeto_id')->nullable();
            $table->json('antes')->nullable();
            $table->json('despues')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('accion');
            $table->index('modulo');
            $table->index('objeto_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auditorias');
    }
};
