<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Beverages (non-wine drinks: agua, refrescos, cócteles, cafés, etc.)
        Schema::create('beverages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type'); // agua, refresco, cocktail, cafe, infusion
            $table->decimal('price', 10, 2);
            $table->boolean('available')->default(true);
            $table->timestamps();
        });

        // Tasting Menus (Menús Degustación)
        Schema::create('tasting_menus', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('courses'); // Número de tiempos
            $table->boolean('available')->default(true);
            $table->timestamps();
        });

        // Pivot: dishes included in each tasting menu
        Schema::create('tasting_menu_dishes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tasting_menu_id')->constrained()->onDelete('cascade');
            $table->foreignId('dish_id')->constrained()->onDelete('cascade');
            $table->integer('course_number')->default(1); // Qué "tiempo" del menú
            $table->text('notes')->nullable(); // e.g. "versión mini", "porción degustación"
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasting_menu_dishes');
        Schema::dropIfExists('tasting_menus');
        Schema::dropIfExists('beverages');
    }
};
