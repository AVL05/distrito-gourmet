<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {


        // Categorías de Menú
        Schema::create('categorias_menu', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->integer('orden_visualizacion')->default(0);
        });

        // Platos
        Schema::create('platos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('slug')->unique()->nullable();
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 10, 2);
            $table->foreignId('categoria_menu_id')->nullable()->constrained('categorias_menu')->onDelete('set null');
            $table->string('alergenos')->nullable();
            $table->boolean('disponible')->default(true);
            $table->boolean('visible_en_carta')->default(true);
            $table->boolean('visible_en_degustacion')->default(true);
            $table->boolean('disponible_para_llevar')->default(true);
            $table->boolean('es_por_unidad')->default(false);
            $table->integer('maximo_por_pedido')->default(999);
        });

        // Vinos / Bodega
        Schema::create('vinos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('region')->nullable();
            $table->string('uva')->nullable();
            $table->enum('tipo', ['Tinto', 'Blanco', 'Rosado', 'Espumoso', 'Dulce']);
            $table->text('notas_maridaje')->nullable();
            $table->text('descripcion')->nullable();
            $table->decimal('precio_botella', 10, 2)->nullable();
            $table->decimal('precio_copa', 10, 2)->nullable();
            $table->boolean('disponible')->default(true);
            $table->boolean('destacado')->default(false);
            $table->integer('maximo_por_pedido')->default(999);
        });

        // Reservas
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->string('codigo_reserva')->unique()->nullable();
            $table->date('fecha_reserva')->nullable();
            $table->time('hora_reserva')->nullable();
            $table->integer('comensales')->default(1);
            $table->unsignedBigInteger('menu_degustacion_id')->nullable();
            $table->string('estado')->default('Pendiente'); // Pendiente, Confirmada, Cancelada
            $table->text('peticiones_especiales')->nullable();
            $table->timestamp('creado_a')->nullable();
            $table->timestamp('actualizado_a')->nullable();
        });

        // Pedidos
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->string('numero_pedido')->unique()->nullable();
            $table->enum('estado', ['Pendiente', 'Preparando', 'Listo', 'Entregado', 'Cancelado'])->default('Pendiente');
            $table->enum('tipo_pedido', ['Sala', 'Takeaway', 'Delivery'])->default('Sala');
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('impuestos', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->text('direccion')->nullable();
            $table->timestamp('creado_a')->nullable();
            $table->timestamp('actualizado_a')->nullable();
        });

        // Detalles del Pedido
        Schema::create('detalles_pedido', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')->constrained('pedidos')->onDelete('cascade');
            $table->foreignId('plato_id')->nullable()->constrained('platos')->onDelete('set null');
            $table->unsignedBigInteger('vino_id')->nullable();
            $table->unsignedBigInteger('bebida_id')->nullable();
            $table->integer('cantidad');
            $table->decimal('precio_unitario', 10, 2)->nullable();
            $table->decimal('precio_total', 10, 2)->nullable();
        });

        // Bebidas
        Schema::create('bebidas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->enum('tipo', ['agua', 'refresco', 'cocktail', 'cafe']);
            $table->decimal('precio', 10, 2);
            $table->boolean('disponible')->default(true);
            $table->boolean('destacado')->default(false);
        });

        // Menús Degustación
        Schema::create('menus_degustacion', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('slug')->unique()->nullable();
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 10, 2);
            $table->decimal('precio_maridaje', 10, 2)->nullable();
            $table->integer('pasos');
            $table->integer('duracion_estimada_minutos')->nullable();
            $table->boolean('disponible')->default(true);
        });

        // Platos de Menús Degustación
        Schema::create('platos_menu_degustacion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_degustacion_id')->constrained('menus_degustacion')->onDelete('cascade');
            $table->foreignId('plato_id')->constrained('platos')->onDelete('cascade');
            $table->integer('numero_paso')->default(1);
        });

        // Maridajes Plato-Vino
        Schema::create('maridajes_plato_vino', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plato_id')->constrained('platos')->onDelete('cascade');
            $table->foreignId('vino_id')->constrained('vinos')->onDelete('cascade');
            $table->enum('nivel_recomendacion', ['Buena', 'Muy buena', 'Perfecta'])->default('Muy buena');
            $table->text('notas')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('maridajes_plato_vino');
        Schema::dropIfExists('platos_menu_degustacion');
        Schema::dropIfExists('menus_degustacion');
        Schema::dropIfExists('bebidas');
        Schema::dropIfExists('detalles_pedido');
        Schema::dropIfExists('pedidos');
        Schema::dropIfExists('reservas');
        Schema::dropIfExists('vinos');
        Schema::dropIfExists('platos');
        Schema::dropIfExists('categorias_menu');
    }
};
