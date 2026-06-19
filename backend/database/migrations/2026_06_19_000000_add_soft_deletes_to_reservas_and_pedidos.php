<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            $table->softDeletes('eliminado_a')->after('actualizado_a');
        });

        Schema::table('pedidos', function (Blueprint $table) {
            $table->softDeletes('eliminado_a')->after('actualizado_a');
        });
    }

    public function down(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            $table->dropSoftDeletes('eliminado_a');
        });

        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropSoftDeletes('eliminado_a');
        });
    }
};
