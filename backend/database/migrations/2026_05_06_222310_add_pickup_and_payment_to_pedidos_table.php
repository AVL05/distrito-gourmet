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
        Schema::table('pedidos', function (Blueprint $table) {
            $table->time('hora_recogida')->nullable()->after('tipo_pedido');
            $table->date('fecha_recogida')->nullable()->after('hora_recogida');
            $table->string('metodo_pago')->nullable()->after('total');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropColumn(['hora_recogida', 'fecha_recogida', 'metodo_pago']);
        });
    }
};
