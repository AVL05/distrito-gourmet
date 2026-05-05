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
        Schema::table('dishes', function (Blueprint $table) {
            $table->integer('max_per_order')->nullable()->default(null);
        });
        Schema::table('wines', function (Blueprint $table) {
            $table->integer('max_per_order')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dishes', function (Blueprint $table) {
            $table->dropColumn('max_per_order');
        });
        Schema::table('wines', function (Blueprint $table) {
            $table->dropColumn('max_per_order');
        });
    }
};
