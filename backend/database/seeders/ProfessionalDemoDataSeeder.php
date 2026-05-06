<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ProfessionalDemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Truncar todas las tablas para sustituir los datos (nombres en español)
        $tablas = [
            'usuarios',
            'categorias_menu',
            'platos',
            'menus_degustacion',
            'platos_menu_degustacion',
            'vinos',
            'maridajes_plato_vino',
            'bebidas',
            'mesas',
            'reservas',
            'pedidos',
            'detalles_pedido',
            'ajustes'
        ];

        foreach ($tablas as $tabla) {
            DB::table($tabla)->truncate();
        }

        // 1. Categorías
        DB::table('categorias_menu')->insert([
            ['id' => 1, 'nombre' => 'Entrantes', 'descripcion' => 'Para abrir el apetito.', 'orden_visualizacion' => 1],
            ['id' => 2, 'nombre' => 'Principales', 'descripcion' => 'Los protagonistas.', 'orden_visualizacion' => 2],
            ['id' => 3, 'nombre' => 'Postres', 'descripcion' => 'El broche final.', 'orden_visualizacion' => 3],
        ]);

        // 2. Bebidas
        DB::table('bebidas')->insert([
            ['nombre' => 'Agua Mineral Natural', 'descripcion' => 'Agua de manantial premium 75cl.', 'tipo' => 'agua', 'precio' => 4.50, 'destacado' => false],
            ['nombre' => 'San Pellegrino', 'descripcion' => 'Agua mineral italiana con gas.', 'tipo' => 'agua', 'precio' => 6.00, 'destacado' => true],
            ['nombre' => 'Coca-Cola Original', 'descripcion' => 'Formato premium 33cl.', 'tipo' => 'refresco', 'precio' => 4.00, 'destacado' => false],
            ['nombre' => 'Limonada de la Casa', 'descripcion' => 'Limón, hierbabuena y miel de azahar.', 'tipo' => 'refresco', 'precio' => 6.00, 'destacado' => true],
            ['nombre' => 'Espresso Martini', 'descripcion' => 'Vodka, licor de café y espresso.', 'tipo' => 'cocktail', 'precio' => 14.00, 'destacado' => true],
            ['nombre' => 'Negroni Clásico', 'descripcion' => 'Gin, Campari y vermut rojo.', 'tipo' => 'cocktail', 'precio' => 14.00, 'destacado' => true],
            ['nombre' => 'Cappuccino', 'descripcion' => 'Espresso doble con leche texturizada.', 'tipo' => 'cafe', 'precio' => 4.50, 'destacado' => false],
            ['nombre' => 'Té Matcha Ceremonial', 'descripcion' => 'Preparado con chasen tradicional.', 'tipo' => 'cafe', 'precio' => 6.00, 'destacado' => true],
        ]);

        // 3. Vinos
        DB::table('vinos')->insert([
            ['id' => 1, 'nombre' => 'Pago de Carraovejas', 'region' => 'Ribera del Duero', 'uva' => 'Tempranillo', 'tipo' => 'Tinto', 'notas_maridaje' => 'Perfecto para carnes rojas.', 'precio_botella' => 48.00, 'precio_copa' => 9.00, 'destacado' => true],
            ['id' => 2, 'nombre' => 'Vega Sicilia Único 2011', 'region' => 'Ribera del Duero', 'uva' => 'Tempranillo', 'tipo' => 'Tinto', 'notas_maridaje' => 'Ideal para experiencias premium.', 'precio_botella' => 495.00, 'precio_copa' => null, 'destacado' => true],
            ['id' => 3, 'nombre' => 'Albariño Pazo Señorans', 'region' => 'Rías Baixas', 'uva' => 'Albariño', 'tipo' => 'Blanco', 'notas_maridaje' => 'Excelente con pescados y marisco.', 'precio_botella' => 26.00, 'precio_copa' => 6.00, 'destacado' => true],
            ['id' => 4, 'nombre' => 'Godello Guímaro', 'region' => 'Ribeira Sacra', 'uva' => 'Godello', 'tipo' => 'Blanco', 'notas_maridaje' => 'Mineral y elegante.', 'precio_botella' => 22.00, 'precio_copa' => 5.50, 'destacado' => false],
            ['id' => 5, 'nombre' => 'Moët & Chandon Imperial', 'region' => 'Champagne', 'uva' => 'Chardonnay', 'tipo' => 'Espumoso', 'notas_maridaje' => 'Ideal para celebraciones.', 'precio_botella' => 65.00, 'precio_copa' => null, 'destacado' => true],
            ['id' => 6, 'nombre' => 'Miraval Rosé', 'region' => 'Provence', 'uva' => 'Syrah y Garnacha', 'tipo' => 'Rosado', 'notas_maridaje' => 'Ligero y floral.', 'precio_botella' => 28.00, 'precio_copa' => 6.50, 'destacado' => false],
        ]);

        // 4. Platos
        DB::table('platos')->insert([
            // Entrantes
            ['id' => 1, 'nombre' => 'Croqueta Cremosa de Jamón Ibérico', 'slug' => 'croqueta-jamon-iberico', 'descripcion' => 'Bechamel infusionada en hueso de jamón de bellota 100% ibérico, rebozada en panko artesano.', 'precio' => 3.00, 'categoria_menu_id' => 1, 'alergenos' => 'Gluten, Lácteos, Huevo', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => true, 'es_por_unidad' => true, 'maximo_por_pedido' => 20],
            ['id' => 2, 'nombre' => 'Tartar de Gamba Roja y Lima', 'slug' => 'tartar-gamba-roja', 'descripcion' => 'Gamba roja de Denia picada a cuchillo, emulsión de sus cabezas, ralladura de lima y crujiente de algas.', 'precio' => 18.00, 'categoria_menu_id' => 1, 'alergenos' => 'Crustáceos', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => false, 'es_por_unidad' => false, 'maximo_por_pedido' => 8],
            ['id' => 3, 'nombre' => 'Pulpo a la Brasa con Parmentier Trufado', 'slug' => 'pulpo-brasa-parmentier', 'descripcion' => 'Tentáculo de pulpo de roca, puré de patata sedoso con aceite de trufa blanca y pimentón de la Vera.', 'precio' => 19.00, 'categoria_menu_id' => 1, 'alergenos' => 'Moluscos, Lácteos', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => false, 'es_por_unidad' => false, 'maximo_por_pedido' => 6],
            ['id' => 13, 'nombre' => 'Salmorejo de Mango y Virutas de Foie', 'slug' => 'salmorejo-mango-foie', 'descripcion' => 'Interpretación frutal del clásico cordobés con mango maduro y nieve de foie micuit.', 'precio' => 14.00, 'categoria_menu_id' => 1, 'alergenos' => 'Lácteos, Sulfitos', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => true, 'es_por_unidad' => false, 'maximo_por_pedido' => 10],
            ['id' => 14, 'nombre' => 'Carpaccio de Wagyu A5', 'slug' => 'carpaccio-wagyu', 'descripcion' => 'Láminas finas de buey de Kobe, lascas de parmesano de 36 meses y aceite de piñones tostados.', 'precio' => 24.00, 'categoria_menu_id' => 1, 'alergenos' => 'Lácteos, Frutos secos', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => false, 'es_por_unidad' => false, 'maximo_por_pedido' => 4],
            ['id' => 18, 'nombre' => 'Burrata de Puglia con Pesto de Pistacho', 'slug' => 'burrata-puglia-pistacho', 'descripcion' => 'Burrata fresca de 250g, corazón cremoso, pesto artesano de pistachos de Bronte y tomates cherry confitados.', 'precio' => 16.00, 'categoria_menu_id' => 1, 'alergenos' => 'Lácteos, Frutos secos', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => true, 'es_por_unidad' => false, 'maximo_por_pedido' => 5],
            ['id' => 19, 'nombre' => 'Anchoas del Cantábrico "00" sobre Brioche', 'slug' => 'anchoas-cantabrico-brioche', 'descripcion' => 'Anchoas seleccionadas de Santoña, mantequilla ahumada y pan de brioche tostado.', 'precio' => 4.50, 'categoria_menu_id' => 1, 'alergenos' => 'Gluten, Pescado, Lácteos', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => false, 'es_por_unidad' => true, 'maximo_por_pedido' => 12],

            // Principales
            ['id' => 4, 'nombre' => 'Lubina Salvaje y Velouté de Marisco', 'slug' => 'lubina-veloute-marisco', 'descripcion' => 'Lomo de lubina asado sobre su piel, velouté emulsionada de carabineros y espárragos trigueros.', 'precio' => 28.00, 'categoria_menu_id' => 2, 'alergenos' => 'Pescado, Crustáceos', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => false, 'es_por_unidad' => false, 'maximo_por_pedido' => 5],
            ['id' => 5, 'nombre' => 'Solomillo de Vaca Madurada', 'slug' => 'solomillo-vaca-madurada', 'descripcion' => 'Centro de solomillo con 45 días de maduración, reducción de oporto y chalotas glaseadas.', 'precio' => 32.00, 'categoria_menu_id' => 2, 'alergenos' => 'Sulfitos', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => false, 'es_por_unidad' => false, 'maximo_por_pedido' => 5],
            ['id' => 6, 'nombre' => 'Ravioli de Setas y Trufa Negra', 'slug' => 'ravioli-setas-trufa', 'descripcion' => 'Pasta fresca artesanal rellena de boletus edulis, crema ligera de queso pecorino y láminas de trufa fresca.', 'precio' => 22.00, 'categoria_menu_id' => 2, 'alergenos' => 'Gluten, Lácteos, Huevo', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => true, 'es_por_unidad' => false, 'maximo_por_pedido' => 6],
            ['id' => 7, 'nombre' => 'Risotto de Parmesano y Trufa Blanca', 'slug' => 'risotto-trufa-blanca', 'descripcion' => 'Arroz Carnaroli mantecado con mantequilla de Isigny, Parmigiano Reggiano y esencia de trufa de Alba.', 'precio' => 20.00, 'categoria_menu_id' => 2, 'alergenos' => 'Lácteos', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => true, 'es_por_unidad' => false, 'maximo_por_pedido' => 6],
            ['id' => 15, 'nombre' => 'Bacalao Skrei con Pil-Pil de Plancton', 'slug' => 'bacalao-skrei-plancton', 'descripcion' => 'Lomo de bacalao noruego de temporada confitado a baja temperatura con pil-pil marino de plancton puro.', 'precio' => 26.00, 'categoria_menu_id' => 2, 'alergenos' => 'Pescado', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => false, 'es_por_unidad' => false, 'maximo_por_pedido' => 5],
            ['id' => 16, 'nombre' => 'Costilla de Angus Glaseada', 'slug' => 'costilla-angus', 'descripcion' => 'Costilla cocinada 24 horas a 65ºC con glaseado de soja y bourbon, acompañada de puré de boniato.', 'precio' => 25.00, 'categoria_menu_id' => 2, 'alergenos' => 'Gluten, Soja', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => true, 'es_por_unidad' => false, 'maximo_por_pedido' => 4],
            ['id' => 20, 'nombre' => 'Presa Ibérica con Mojo de Pistacho', 'slug' => 'presa-iberica-mojo', 'descripcion' => 'Presa de cerdo ibérico de bellota marcada a la brasa, acompañada de mojo verde de pistachos y yuca frita.', 'precio' => 24.00, 'categoria_menu_id' => 2, 'alergenos' => 'Frutos secos', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => true, 'es_por_unidad' => false, 'maximo_por_pedido' => 6],
            ['id' => 21, 'nombre' => 'Lomo de Rodaballo Salvaje', 'slug' => 'rodaballo-salvaje', 'descripcion' => 'Rodaballo del Cantábrico a la parrilla con bilbaína tradicional y chips de ajos tiernos.', 'precio' => 30.00, 'categoria_menu_id' => 2, 'alergenos' => 'Pescado', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => false, 'es_por_unidad' => false, 'maximo_por_pedido' => 4],

            // Postres
            ['id' => 8, 'nombre' => 'Esfera de Chocolate y Núcleo Fundente', 'slug' => 'esfera-chocolate', 'descripcion' => 'Chocolate 70% cacao, corazón de caramelo salado y baño caliente de ganache de chocolate.', 'precio' => 12.00, 'categoria_menu_id' => 3, 'alergenos' => 'Gluten, Lácteos, Huevo', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => true, 'es_por_unidad' => false, 'maximo_por_pedido' => 6],
            ['id' => 9, 'nombre' => 'Tarta de Limón Desconstruida', 'slug' => 'tarta-limon-desconstruida', 'descripcion' => 'Lemon curd cítrico, tierra de galleta de mantequilla, merengue italiano tostado y sorbete de menta.', 'precio' => 10.00, 'categoria_menu_id' => 3, 'alergenos' => 'Gluten, Lácteos, Huevo', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => true, 'es_por_unidad' => false, 'maximo_por_pedido' => 6],
            ['id' => 10, 'nombre' => 'Petit Fours Artesanales', 'slug' => 'petit-fours', 'descripcion' => 'Surtido de bombones, mini-macarons de pistacho y nubes de violeta elaboradas en nuestro obrador.', 'precio' => 2.50, 'categoria_menu_id' => 3, 'alergenos' => 'Gluten, Frutos secos, Lácteos', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => true, 'es_por_unidad' => true, 'maximo_por_pedido' => 15],
            ['id' => 17, 'nombre' => 'Torrija Caramelizada en Pan de Brioche', 'slug' => 'torrija-brioche', 'descripcion' => 'Pan de brioche artesano empapado en leche de coco y canela, caramelizado con azúcar moscovado.', 'precio' => 11.00, 'categoria_menu_id' => 3, 'alergenos' => 'Gluten, Lácteos, Huevo', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => true, 'es_por_unidad' => false, 'maximo_por_pedido' => 8],
            ['id' => 22, 'nombre' => 'Coulant de Avellana y Helado de Leche', 'slug' => 'coulant-avellana', 'descripcion' => 'Bizcocho fluido de avellana tostada, praliné crujiente y helado artesano de leche fresca de granja.', 'precio' => 12.00, 'categoria_menu_id' => 3, 'alergenos' => 'Gluten, Lácteos, Frutos secos, Huevo', 'disponible' => true, 'visible_en_carta' => true, 'visible_en_degustacion' => true, 'disponible_para_llevar' => true, 'es_por_unidad' => false, 'maximo_por_pedido' => 5],

            // Solo Menús Degustación
            ['id' => 11, 'nombre' => 'Vieira Flambeada con Mantequilla Noisette', 'slug' => 'vieira-flambeada', 'descripcion' => 'Vieira de Galicia flambeada con brandy de Jerez sobre una base de crema de coliflor ahumada.', 'precio' => 14.00, 'categoria_menu_id' => 1, 'alergenos' => 'Moluscos, Lácteos', 'disponible' => true, 'visible_en_carta' => false, 'visible_en_degustacion' => true, 'disponible_para_llevar' => false, 'es_por_unidad' => false, 'maximo_por_pedido' => 999],
            ['id' => 12, 'nombre' => 'Pre-postre Cítrico de Yuzu y Albahaca', 'slug' => 'pre-postre-yuzu', 'descripcion' => 'Limpiador de paladar refrescante a base de gelificado de yuzu japonés y granizado de albahaca fresca.', 'precio' => 6.00, 'categoria_menu_id' => 3, 'alergenos' => 'Lácteos', 'disponible' => true, 'visible_en_carta' => false, 'visible_en_degustacion' => true, 'disponible_para_llevar' => false, 'es_por_unidad' => false, 'maximo_por_pedido' => 999],
        ]);

        // 5. Menús Degustación
        DB::table('menus_degustacion')->insert([
            ['id' => 1, 'nombre' => 'Menú Ejecutivo', 'slug' => 'menu-ejecutivo', 'descripcion' => 'Menú contemporáneo diseñado para servicio de mediodía.', 'precio' => 39.00, 'precio_maridaje' => 18.00, 'pasos' => 3, 'duracion_estimada_minutos' => 60, 'alternativa_vegetariana' => true, 'menu_de_temporada' => false],
            ['id' => 2, 'nombre' => 'Menú Degustación Tierra y Mar', 'slug' => 'menu-tierra-mar', 'descripcion' => 'Recorrido gastronómico que une producto marino y cocina contemporánea.', 'precio' => 95.00, 'precio_maridaje' => 45.00, 'pasos' => 8, 'duracion_estimada_minutos' => 120, 'alternativa_vegetariana' => true, 'menu_de_temporada' => true],
            ['id' => 3, 'nombre' => 'Chef Experience', 'slug' => 'chef-experience', 'descripcion' => 'Experiencia gastronómica exclusiva fuera de carta.', 'precio' => 145.00, 'precio_maridaje' => 75.00, 'pasos' => 10, 'duracion_estimada_minutos' => 180, 'alternativa_vegetariana' => false, 'menu_de_temporada' => true],
        ]);

        // 6. Platos de Menús Degustación
        DB::table('platos_menu_degustacion')->insert([
            ['menu_degustacion_id' => 1, 'plato_id' => 3, 'numero_paso' => 1, 'tamaño_porcion' => 'Pequeño'],
            ['menu_degustacion_id' => 1, 'plato_id' => 5, 'numero_paso' => 2, 'tamaño_porcion' => 'Completo'],
            ['menu_degustacion_id' => 1, 'plato_id' => 8, 'numero_paso' => 3, 'tamaño_porcion' => 'Completo'],
            ['menu_degustacion_id' => 2, 'plato_id' => 1, 'numero_paso' => 1, 'tamaño_porcion' => 'Snack'],
            ['menu_degustacion_id' => 2, 'plato_id' => 2, 'numero_paso' => 2, 'tamaño_porcion' => 'Pequeño'],
            ['menu_degustacion_id' => 2, 'plato_id' => 11, 'numero_paso' => 3, 'tamaño_porcion' => 'Pequeño'],
            ['menu_degustacion_id' => 2, 'plato_id' => 6, 'numero_paso' => 4, 'tamaño_porcion' => 'Pequeño'],
            ['menu_degustacion_id' => 2, 'plato_id' => 4, 'numero_paso' => 5, 'tamaño_porcion' => 'Medio'],
            ['menu_degustacion_id' => 2, 'plato_id' => 5, 'numero_paso' => 6, 'tamaño_porcion' => 'Medio'],
            ['menu_degustacion_id' => 2, 'plato_id' => 12, 'numero_paso' => 7, 'tamaño_porcion' => 'Snack'],
            ['menu_degustacion_id' => 2, 'plato_id' => 8, 'numero_paso' => 8, 'tamaño_porcion' => 'Completo'],
            ['menu_degustacion_id' => 3, 'plato_id' => 1, 'numero_paso' => 1, 'tamaño_porcion' => 'Snack'],
            ['menu_degustacion_id' => 3, 'plato_id' => 11, 'numero_paso' => 2, 'tamaño_porcion' => 'Pequeño'],
            ['menu_degustacion_id' => 3, 'plato_id' => 2, 'numero_paso' => 3, 'tamaño_porcion' => 'Pequeño'],
            ['menu_degustacion_id' => 3, 'plato_id' => 3, 'numero_paso' => 4, 'tamaño_porcion' => 'Pequeño'],
            ['menu_degustacion_id' => 3, 'plato_id' => 4, 'numero_paso' => 5, 'tamaño_porcion' => 'Medio'],
            ['menu_degustacion_id' => 3, 'plato_id' => 5, 'numero_paso' => 6, 'tamaño_porcion' => 'Medio'],
            ['menu_degustacion_id' => 3, 'plato_id' => 6, 'numero_paso' => 7, 'tamaño_porcion' => 'Pequeño'],
            ['menu_degustacion_id' => 3, 'plato_id' => 12, 'numero_paso' => 8, 'tamaño_porcion' => 'Snack'],
            ['menu_degustacion_id' => 3, 'plato_id' => 8, 'numero_paso' => 9, 'tamaño_porcion' => 'Completo'],
            ['menu_degustacion_id' => 3, 'plato_id' => 10, 'numero_paso' => 10, 'tamaño_porcion' => 'Snack'],
        ]);

        // 7. Maridajes
        DB::table('maridajes_plato_vino')->insert([
            ['plato_id' => 4, 'vino_id' => 3, 'nivel_recomendacion' => 'Perfecta', 'notas' => 'La mineralidad acompaña perfectamente la lubina.'],
            ['plato_id' => 5, 'vino_id' => 1, 'nivel_recomendacion' => 'Perfecta', 'notas' => 'Tinto estructurado ideal para carnes maduradas.'],
            ['plato_id' => 2, 'vino_id' => 5, 'nivel_recomendacion' => 'Muy buena', 'notas' => 'Champagne ideal para mariscos premium.'],
            ['plato_id' => 8, 'vino_id' => 5, 'nivel_recomendacion' => 'Perfecta', 'notas' => 'Champagne y chocolate generan un gran contraste.'],
        ]);

        // 8. Mesas
        DB::table('mesas')->insert([
            ['numero_mesa' => '1', 'capacidad' => 2, 'zona' => 'Ventanales', 'estado' => 'Libre'],
            ['numero_mesa' => '2', 'capacidad' => 4, 'zona' => 'Ventanales', 'estado' => 'Libre'],
            ['numero_mesa' => '3', 'capacidad' => 2, 'zona' => 'Salón Principal', 'estado' => 'Libre'],
            ['numero_mesa' => '4', 'capacidad' => 4, 'zona' => 'Salón Principal', 'estado' => 'Libre'],
            ['numero_mesa' => 'CT', 'capacidad' => 6, 'zona' => 'Chef\'s Table', 'estado' => 'Libre'],
        ]);

        // 9. Usuarios
        DB::table('usuarios')->insert([
            ['id' => 1, 'nombre' => 'Admin Michelin', 'email' => 'admin@distritogourmet.com', 'password' => Hash::make('password'), 'rol' => 'admin', 'telefono' => '+34 600 000 000', 'es_vip' => false],
            ['id' => 2, 'nombre' => 'Cliente VIP', 'email' => 'vip@distritogourmet.com', 'password' => Hash::make('password'), 'rol' => 'client', 'telefono' => '+34 611 111 111', 'es_vip' => true],
            ['id' => 3, 'nombre' => 'Alex', 'email' => 'alex@example.com', 'password' => Hash::make('password'), 'rol' => 'client', 'telefono' => '+34 622 222 222', 'es_vip' => false],
        ]);

        // 10. Reservas
        DB::table('reservas')->insert([
            ['usuario_id' => 2, 'mesa_id' => 4, 'codigo_reserva' => 'VIP-2026-001', 'fecha_reserva' => '2026-06-15', 'hora_reserva' => '21:00:00', 'comensales' => 2, 'menu_degustacion_id' => 3, 'estado' => 'Confirmada', 'peticiones_especiales' => 'Mesa privada y maridaje completo.'],
            ['usuario_id' => 3, 'mesa_id' => 2, 'codigo_reserva' => 'RSV-2026-014', 'fecha_reserva' => '2026-06-16', 'hora_reserva' => '14:30:00', 'comensales' => 2, 'menu_degustacion_id' => 1, 'estado' => 'Pendiente', 'peticiones_especiales' => 'Celebración aniversario.'],
        ]);

        // 11. Ajustes
        DB::table('ajustes')->insert([
            ['clave' => 'restaurant_name', 'valor' => 'Distrito Gourmet'],
            ['clave' => 'restaurant_phone', 'valor' => '+34 960 000 000'],
            ['clave' => 'restaurant_email', 'valor' => 'info@distritogourmet.com'],
            ['clave' => 'takeaway_enabled', 'valor' => 'true'],
            ['clave' => 'reservations_enabled', 'valor' => 'true'],
            ['clave' => 'instagram_url', 'valor' => 'https://instagram.com/distritogourmet'],
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
