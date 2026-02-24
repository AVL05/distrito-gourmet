<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Settings
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value');
            $table->timestamps();
        });

        // Restaurant Tables (Mesa)
        Schema::create('restaurant_tables', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. "Mesa 1", "Chef's Table"
            $table->integer('capacity');
            $table->string('zone')->default('main_room'); // main_room, private, terrace, chef_table
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Menu Categories (Menú Degustación, Carta VIP, etc)
        Schema::create('menu_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Dishes (Platos y Elaboraciones)
        Schema::create('dishes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description'); // Story behind the dish
            $table->decimal('price', 10, 2);
            $table->string('image')->nullable();
            $table->foreignId('menu_category_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('is_signature')->default(false); // Plato estrella
            $table->string('allergens')->nullable(); // Trigo, Lácteos, etc.
            $table->boolean('available')->default(true);
            $table->timestamps();
        });

        // Cellar / Wines (Bodega)
        Schema::create('wines', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('winery')->nullable();
            $table->string('vintage')->nullable(); // Año
            $table->string('type'); // Red, White, Sparkling, Sweet
            $table->text('pairing_notes')->nullable();
            $table->decimal('price_bottle', 10, 2)->nullable();
            $table->decimal('price_glass', 10, 2)->nullable();
            $table->timestamps();
        });

        // Reservations
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('restaurant_table_id')->nullable()->constrained()->onDelete('set null');
            $table->dateTime('reservation_time');
            $table->integer('people');
            $table->string('status')->default('pending'); // pending, confirmed, arrived, cancelled
            $table->string('experience_type')->default('tasting_menu'); // tasting_menu, a_la_carte
            $table->text('special_requests')->nullable();
            $table->text('allergies_noted')->nullable();
            $table->timestamps();
        });

        // Exclusive Orders / Takeaway (Gourmet box delivery)
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('status')->default('received'); // received, preparing, ready, delivered
            $table->string('type')->default('gourmet_pickup'); // gourmet_pickup, premium_delivery
            $table->decimal('total', 10, 2);
            $table->text('address')->nullable(); // For delivery
            $table->text('delivery_instructions')->nullable();
            $table->timestamps();
        });

        // Order Items
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('dish_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('wine_id')->nullable()->constrained()->onDelete('set null');
            $table->string('item_name'); // Snapshot of name
            $table->integer('quantity');
            $table->decimal('price', 10, 2); // Snapshot of price
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('wines');
        Schema::dropIfExists('dishes');
        Schema::dropIfExists('menu_categories');
        Schema::dropIfExists('restaurant_tables');
        Schema::dropIfExists('settings');
    }
};
