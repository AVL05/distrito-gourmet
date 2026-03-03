<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = [
            'migrations',
            'password_reset_tokens',
            'users',
            'sessions',
            'cache',
            'cache_locks',
            'jobs',
            'job_batches',
            'failed_jobs',
            'settings',
            'menu_categories',
            'dishes',
            'reservations',
            'restaurant_tables',
            'orders',
            'order_items',
            'wines',
            'personal_access_tokens',
            'beverages',
            'tasting_menus',
            'tasting_menu_dishes',
        ];

        foreach ($tables as $table) {
            DB::statement("ALTER TABLE $table ENABLE ROW LEVEL SECURITY;");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'migrations',
            'password_reset_tokens',
            'users',
            'sessions',
            'cache',
            'cache_locks',
            'jobs',
            'job_batches',
            'failed_jobs',
            'settings',
            'menu_categories',
            'dishes',
            'reservations',
            'restaurant_tables',
            'orders',
            'order_items',
            'wines',
            'personal_access_tokens',
            'beverages',
            'tasting_menus',
            'tasting_menu_dishes',
        ];

        foreach ($tables as $table) {
            DB::statement("ALTER TABLE $table DISABLE ROW LEVEL SECURITY;");
        }
    }
};
