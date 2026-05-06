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
        Schema::table('detalles_pedido', function (Blueprint $table) {
            $table->unsignedBigInteger('menu_degustacion_id')->nullable()->after('bebida_id');
            $table->foreign('menu_degustacion_id')->references('id')->on('menus_degustacion')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detalles_pedido', function (Blueprint $table) {
            $table->dropForeign(['menu_degustacion_id']);
            $table->dropColumn('menu_degustacion_id');
        });
    }
};
