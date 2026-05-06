<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('email')->unique();
            $table->timestamp('email_verificado_a')->nullable();
            $table->string('password');
            $table->string('rol')->default('client'); // admin, staff, client
            $table->string('telefono')->nullable();
            $table->text('alergias')->nullable();
            $table->text('preferencias')->nullable();
            $table->boolean('es_vip')->default(false);
            $table->rememberToken();
            $table->timestamp('creado_a')->nullable();
            $table->timestamp('actualizado_a')->nullable();
        });

        Schema::create('tokens_recuperacion_password', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('creado_a')->nullable();
        });

        Schema::create('sesiones', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('usuario_id')->nullable()->index();
            $table->string('direccion_ip', 45)->nullable();
            $table->text('agente_usuario')->nullable();
            $table->longText('carga_util');
            $table->integer('ultima_actividad')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
        Schema::dropIfExists('tokens_recuperacion_password');
        Schema::dropIfExists('sesiones');
    }
};
