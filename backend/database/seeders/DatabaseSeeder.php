<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin user
        \App\Models\User::factory()->create([
            'name' => 'Admin Michelin',
            'email' => 'admin@distritogourmet.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // VIP Client
        \App\Models\User::factory()->create([
            'name' => 'Cliente VIP',
            'email' => 'vip@example.com',
            'password' => bcrypt('password'),
            'role' => 'client',
            'phone' => '+34 600 000 000',
            'allergies' => 'Marisco',
            'preferences' => 'Mesa cerca de la ventana, prefiere vino tinto',
            'is_vip' => true,
        ]);

        // Tables
        $tables = [
            ['name' => 'Mesa 1', 'capacity' => 2, 'zone' => 'window'],
            ['name' => 'Mesa 2', 'capacity' => 4, 'zone' => 'main_room'],
            ['name' => 'Mesa 3', 'capacity' => 2, 'zone' => 'main_room'],
            ['name' => 'Chef\'s Table', 'capacity' => 6, 'zone' => 'chef_table'],
            ['name' => 'Privado', 'capacity' => 10, 'zone' => 'private'],
        ];
        foreach ($tables as $t) \App\Models\RestaurantTable::create($t);

        // ─── CATEGORÍAS DE MENÚ ─────────────────────────────
        $cats = [
            ['name' => 'Entrantes', 'description' => 'Para abrir el apetito.', 'order' => 1],
            ['name' => 'Principales', 'description' => 'Los protagonistas.', 'order' => 2],
            ['name' => 'Postres', 'description' => 'El broche de oro.', 'order' => 3],
        ];
        foreach ($cats as $c) \App\Models\MenuCategory::create($c);

        // ─── PLATOS (TODA LA CARTA) ─────────────────────────
        $dishes = [
            // Entrantes (category_id = 1)
            ['name' => 'Tartar de Atún Rojo', 'description' => 'Atún salvaje, aguacate, sésamo tostado y emulsión de wasabi.', 'price' => 24.0, 'menu_category_id' => 1],
            ['name' => 'Croquetas de Jamón Ibérico', 'description' => 'Cremosas por dentro, crujientes por fuera. Jamón de bellota 100%.', 'price' => 16.5, 'menu_category_id' => 1],
            ['name' => 'Carpaccio de Wagyū', 'description' => 'Con lascas de parmesano reggiano de 24 meses y aceite de trufa.', 'price' => 28.0, 'menu_category_id' => 1],
            ['name' => 'Ostras Gillardeau N.º 2', 'description' => 'Al natural con mignonette de chalota y perlas de yuzu.', 'price' => 38.0, 'menu_category_id' => 1],
            ['name' => 'Zamburiñas al Josper', 'description' => 'Con emulsión de ají amarillo, salicornia y polvo de jamón ibérico.', 'price' => 26.0, 'menu_category_id' => 1],
            ['name' => 'Caviar Beluga Iraní', 'description' => 'Selección exclusiva 30g, acompañado de blinis artesanales y crema agria.', 'price' => 210.0, 'menu_category_id' => 1],

            // Principales (category_id = 2)
            ['name' => 'Solomillo Rossini', 'description' => 'Foie gras fresco, reducción de Pedro Ximénez y trufa negra.', 'price' => 36.0, 'menu_category_id' => 2],
            ['name' => 'Lubina Salvaje', 'description' => 'A la espalda con verduras de temporada y refrito de ajos tiernos.', 'price' => 32.0, 'menu_category_id' => 2],
            ['name' => 'Risotto de Setas', 'description' => 'Boletus edulis, trompetas de la muerte y aceite de trufa blanca.', 'price' => 22.0, 'menu_category_id' => 2],
            ['name' => 'Pichón de Bresse', 'description' => 'Pechuga sangrante, muslo confitado, parmentier de chirivía y trufa negra.', 'price' => 45.0, 'menu_category_id' => 2],
            ['name' => 'Bogavante Azul Braseado', 'description' => 'Con mantequilla noisette, caviar cítrico y suculenta bisquet.', 'price' => 68.0, 'menu_category_id' => 2],

            // Postres (category_id = 3)
            ['name' => 'Coulant de Chocolate', 'description' => 'Corazón fundido de cacao 70% con helado de vainilla Bourbon.', 'price' => 12.0, 'menu_category_id' => 3],
            ['name' => 'Tarta de Queso', 'description' => 'Estilo La Viña, cremosa y con un toque de queso azul.', 'price' => 10.0, 'menu_category_id' => 3],
            ['name' => 'Milhojas de Vainilla Tahití', 'description' => 'Crema diplomática, praliné de nuez pecán y helado artesanal.', 'price' => 14.0, 'menu_category_id' => 3],
            ['name' => 'Esfera de Oro Especiado', 'description' => 'Texturas de avellana, chocolate 85% y corazón líquido de maracuyá.', 'price' => 18.0, 'menu_category_id' => 3],
        ];
        foreach ($dishes as $d) \App\Models\Dish::create($d);

        // ─── BEBIDAS (NO ALCOHÓLICAS + CÓCTELES) ────────────
        $beverages = [
            // Aguas
            ['name' => 'Agua Mineral Natural', 'description' => 'Agua de manantial, 75cl.', 'type' => 'agua', 'price' => 4.50],
            ['name' => 'Agua con Gas', 'description' => 'Agua mineral con gas natural, 75cl.', 'type' => 'agua', 'price' => 4.50],
            ['name' => 'San Pellegrino', 'description' => 'Agua mineral italiana con gas, 75cl.', 'type' => 'agua', 'price' => 6.00],

            // Refrescos
            ['name' => 'Coca-Cola Original', 'description' => 'Clásica, formato premium 33cl.', 'type' => 'refresco', 'price' => 4.00],
            ['name' => 'Coca-Cola Zero', 'description' => 'Sin azúcar, formato premium 33cl.', 'type' => 'refresco', 'price' => 4.00],
            ['name' => 'Fever-Tree Tónica Premium', 'description' => 'Indian Tonic Water, 20cl.', 'type' => 'refresco', 'price' => 4.50],
            ['name' => 'Zumo de Naranja Natural', 'description' => 'Recién exprimido, naranjas de Valencia.', 'type' => 'refresco', 'price' => 5.50],
            ['name' => 'Limonada de la Casa', 'description' => 'Limón, hierbabuena, miel de azahar y soda artesanal.', 'type' => 'refresco', 'price' => 6.00],

            // Cócteles
            ['name' => 'Negroni Clásico', 'description' => 'Gin, Campari y vermut rojo. Piel de naranja.', 'type' => 'cocktail', 'price' => 14.00],
            ['name' => 'Old Fashioned', 'description' => 'Bourbon, angostura, azúcar de caña y twist de naranja.', 'type' => 'cocktail', 'price' => 15.00],
            ['name' => 'Espresso Martini', 'description' => 'Vodka, licor de café, espresso recién preparado.', 'type' => 'cocktail', 'price' => 14.00],
            ['name' => 'Gin Tonic Premium', 'description' => 'Hendrick\'s Gin, Fever-Tree, pepino y pimienta rosa.', 'type' => 'cocktail', 'price' => 16.00],

            // Cafés e Infusiones
            ['name' => 'Espresso', 'description' => 'Café de especialidad, tueste medio, origen Colombia.', 'type' => 'cafe', 'price' => 3.50],
            ['name' => 'Cappuccino', 'description' => 'Espresso doble con leche texturizada y cacao.', 'type' => 'cafe', 'price' => 4.50],
            ['name' => 'Té Matcha Ceremonial', 'description' => 'Grado ceremonial, preparado con chasen tradicional.', 'type' => 'cafe', 'price' => 6.00],
            ['name' => 'Infusión de Hierbas del Jardín', 'description' => 'Manzanilla, lavanda y menta fresca. Servida en tetera.', 'type' => 'cafe', 'price' => 5.00],
        ];
        foreach ($beverages as $b) \App\Models\Beverage::create($b);

        // ─── BODEGA (VINOS) ─────────────────────────────────
        $wines = [
            // Tintos
            [
                'name' => 'Pago de Carraovejas',
                'type' => 'Tinto',
                'pairing_notes' => 'Ribera del Duero. Tinto fino, cabernet sauvignon y merlot. Elegante y profundo.',
                'price_bottle' => 48.00,
                'price_glass' => 9.00,
            ],
            [
                'name' => 'Vega Sicilia Único 2011',
                'type' => 'Tinto',
                'pairing_notes' => 'Ribera del Duero. La leyenda hecha vino, notas profundas y complejas de fruta madura y especias.',
                'price_bottle' => 495.00,
            ],
            [
                'name' => 'Flor de Pingus 2019',
                'type' => 'Tinto',
                'pairing_notes' => 'Ribera del Duero. Tempranillo puro. Intenso, sedoso y con final de gran persistencia.',
                'price_bottle' => 120.00,
            ],
            [
                'name' => 'Marqués de Murrieta Reserva',
                'type' => 'Tinto',
                'pairing_notes' => 'Rioja. Tempranillo, graciano y mazuelo. Clásico riojano con 20 meses en barrica.',
                'price_bottle' => 32.00,
                'price_glass' => 7.00,
            ],
            [
                'name' => 'Artadi Viñas de Gain',
                'type' => 'Tinto',
                'pairing_notes' => 'Rioja Alavesa. Tempranillo de viñas viejas. Fresco, frutal y con carácter.',
                'price_bottle' => 28.00,
                'price_glass' => 6.50,
            ],

            // Blancos
            [
                'name' => 'Albariño Pazo Señorans',
                'type' => 'Blanco',
                'pairing_notes' => 'Rías Baixas. Albariño puro. Fresco, mineral y con notas cítricas elegantes.',
                'price_bottle' => 26.00,
                'price_glass' => 6.00,
            ],
            [
                'name' => 'Godello Guímaro',
                'type' => 'Blanco',
                'pairing_notes' => 'Ribeira Sacra. Godello sobre lías. Textura cremosa, fruta blanca y mineralidad atlántica.',
                'price_bottle' => 22.00,
                'price_glass' => 5.50,
            ],
            [
                'name' => 'Enate Chardonnay 234',
                'type' => 'Blanco',
                'pairing_notes' => 'Somontano. Chardonnay fermentado en barrica. Mantequilla, vainilla y fruta tropical.',
                'price_bottle' => 18.00,
                'price_glass' => 5.00,
            ],

            // Espumosos
            [
                'name' => 'Moët & Chandon Imperial',
                'type' => 'Espumoso',
                'pairing_notes' => 'Champagne Brut. Vibrante, generoso y seductor. Ideal para celebrar.',
                'price_bottle' => 65.00,
            ],
            [
                'name' => 'Louis Roederer Cristal 2014',
                'type' => 'Espumoso',
                'pairing_notes' => 'Champagne. Oro líquido con burbuja finísima y notas tostadas extraordinarias.',
                'price_bottle' => 320.00,
            ],
            [
                'name' => 'Cava Recaredo Terrers Brut Nature',
                'type' => 'Espumoso',
                'pairing_notes' => 'Penedès. Xarel·lo y macabeo. Gran Reserva con 40 meses de crianza. Autólisis elegante.',
                'price_bottle' => 24.00,
                'price_glass' => 6.00,
            ],

            // Rosados
            [
                'name' => 'Miraval Rosé',
                'type' => 'Rosado',
                'pairing_notes' => 'Provence. Cinsault, garnacha y syrah. Elegante, ligero y con notas de pétalos de rosa.',
                'price_bottle' => 28.00,
                'price_glass' => 6.50,
            ],
        ];
        foreach ($wines as $w) \App\Models\Wine::create($w);

        // ─── MENÚS DEGUSTACIÓN ──────────────────────────────

        // Menú 1: Experiencia Clásica
        $menu1 = \App\Models\TastingMenu::create([
            'name' => 'Experiencia Clásica',
            'description' => 'Un recorrido por los sabores esenciales de nuestra cocina. Cinco tiempos que rinden homenaje a la tradición con un toque contemporáneo. Incluye maridaje con copa de vino por tiempo.',
            'price' => 75.00,
            'courses' => 5,
        ]);
        // Entrantes
        $menu1->dishes()->attach(2, ['course_number' => 1, 'notes' => 'Croquetas de Jamón Ibérico — aperitivo del chef']);
        $menu1->dishes()->attach(1, ['course_number' => 2, 'notes' => 'Tartar de Atún Rojo — porción degustación']);
        // Principales
        $menu1->dishes()->attach(8, ['course_number' => 3, 'notes' => 'Lubina Salvaje — con verduras de huerta']);
        $menu1->dishes()->attach(7, ['course_number' => 4, 'notes' => 'Solomillo Rossini — corte degustación']);
        // Postre
        $menu1->dishes()->attach(12, ['course_number' => 5, 'notes' => 'Coulant de Chocolate — con helado de vainilla']);

        // Menú 2: Gran Degustación
        $menu2 = \App\Models\TastingMenu::create([
            'name' => 'Gran Degustación',
            'description' => 'Siete tiempos que llevan nuestro arte culinario al máximo nivel. Una experiencia sensorial completa con productos premium y técnicas de vanguardia. Incluye maridaje exclusivo.',
            'price' => 120.00,
            'courses' => 7,
        ]);
        // Aperitivo
        $menu2->dishes()->attach(5, ['course_number' => 1, 'notes' => 'Zamburiñas al Josper — aperitivo']);
        // Entrantes
        $menu2->dishes()->attach(3, ['course_number' => 2, 'notes' => 'Carpaccio de Wagyū — láminas finas con trufa']);
        $menu2->dishes()->attach(4, ['course_number' => 3, 'notes' => 'Ostras Gillardeau — al natural']);
        // Pescado
        $menu2->dishes()->attach(8, ['course_number' => 4, 'notes' => 'Lubina Salvaje — presentación degustación']);
        // Carne
        $menu2->dishes()->attach(10, ['course_number' => 5, 'notes' => 'Pichón de Bresse — pechuga y muslo confitado']);
        // Pre-postre
        $menu2->dishes()->attach(14, ['course_number' => 6, 'notes' => 'Milhojas de Vainilla Tahití — versión mini']);
        // Postre
        $menu2->dishes()->attach(15, ['course_number' => 7, 'notes' => 'Esfera de Oro Especiado — con texturas de avellana']);

        // Menú 3: Menú del Chef — Exclusivo
        $menu3 = \App\Models\TastingMenu::create([
            'name' => 'Menú del Chef',
            'description' => 'La expresión más personal y exclusiva de nuestro Chef. Nueve tiempos con caviar, bogavante y las mejores elaboraciones de la carta. Maridaje premium con champagne y vinos de autor. Disponible únicamente en Chef\'s Table.',
            'price' => 220.00,
            'courses' => 9,
        ]);
        // Bienvenida
        $menu3->dishes()->attach(2, ['course_number' => 1, 'notes' => 'Croquetas de Jamón Ibérico — bienvenida del chef']);
        // Caviar
        $menu3->dishes()->attach(6, ['course_number' => 2, 'notes' => 'Caviar Beluga Iraní — con blinis y crema agria']);
        // Mariscos
        $menu3->dishes()->attach(4, ['course_number' => 3, 'notes' => 'Ostras Gillardeau N.º 2']);
        $menu3->dishes()->attach(5, ['course_number' => 4, 'notes' => 'Zamburiñas al Josper — con emulsión de ají']);
        // Pescado estrella
        $menu3->dishes()->attach(11, ['course_number' => 5, 'notes' => 'Bogavante Azul Braseado — pieza completa']);
        // Carne estrella
        $menu3->dishes()->attach(10, ['course_number' => 6, 'notes' => 'Pichón de Bresse — presentación del chef']);
        // Queso
        $menu3->dishes()->attach(9, ['course_number' => 7, 'notes' => 'Risotto de Setas — como intermezzo cremoso']);
        // Pre-postre
        $menu3->dishes()->attach(14, ['course_number' => 8, 'notes' => 'Milhojas de Vainilla Tahití']);
        // Gran postre
        $menu3->dishes()->attach(15, ['course_number' => 9, 'notes' => 'Esfera de Oro Especiado — con hoja de oro']);
    }
}
