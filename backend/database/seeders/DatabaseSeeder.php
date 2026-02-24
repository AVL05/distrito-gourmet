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

        // Menu Categories
        $cats = [
            ['name' => 'Entrantes', 'description' => 'Para abrir el apetito.', 'order' => 1],
            ['name' => 'Principales', 'description' => 'Los protagonistas.', 'order' => 2],
            ['name' => 'Postres', 'description' => 'El broche de oro.', 'order' => 3],
        ];
        foreach ($cats as $c) \App\Models\MenuCategory::create($c);

        // Dishes
        $dishes = [
            // Entrantes
            ['name' => 'Tartar de Atún Rojo', 'description' => 'Atún salvaje, aguacate, sésamo tostado y emulsión de wasabi.', 'price' => 24.0, 'menu_category_id' => 1, 'image' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'],
            ['name' => 'Croquetas de Jamón Ibérico', 'description' => 'Cremosas por dentro, crujientes por fuera. Jamón de bellota 100%.', 'price' => 16.5, 'menu_category_id' => 1, 'image' => 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80'],
            ['name' => 'Carpaccio de Wagyū', 'description' => 'Con lascas de parmesano reggiano de 24 meses y aceite de trufa.', 'price' => 28.0, 'menu_category_id' => 1, 'image' => 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'],
            ['name' => 'Ostras Gillardeau N.º 2', 'description' => 'Al natural con mignonette de chalota y perlas de yuzu.', 'price' => 38.0, 'menu_category_id' => 1, 'image' => 'https://images.unsplash.com/photo-1614930335043-4e43ab44502d?auto=format&fit=crop&w=800&q=80'],
            ['name' => 'Zamburiñas al Josper', 'description' => 'Con emulsión de ají amarillo, salicornia y polvo de jamón ibérico.', 'price' => 26.0, 'menu_category_id' => 1, 'image' => 'https://images.unsplash.com/photo-1554502444-464aebdca4fa?auto=format&fit=crop&w=800&q=80'],
            ['name' => 'Caviar Beluga Iraní', 'description' => 'Selección exclusiva 30g, acompañado de blinis artesanales y crema agria.', 'price' => 210.0, 'menu_category_id' => 1, 'image' => 'https://images.unsplash.com/photo-1625944230945-1b7dd12ce20f?auto=format&fit=crop&w=800&q=80'],

            // Principales
            ['name' => 'Solomillo Rossini', 'description' => 'Foie gras fresco, reducción de Pedro Ximénez y trufa negra.', 'price' => 36.0, 'menu_category_id' => 2, 'image' => 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80'],
            ['name' => 'Lubina Salvaje', 'description' => 'A la espalda con verduras de temporada y refrito de ajos tiernos.', 'price' => 32.0, 'menu_category_id' => 2, 'image' => 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=800&q=80'],
            ['name' => 'Risotto de Setas', 'description' => 'Boletus edulis, trompetas de la muerte y aceite de trufa blanca.', 'price' => 22.0, 'menu_category_id' => 2, 'image' => 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80'],
            ['name' => 'Pichón de Bresse', 'description' => 'Pechuga sangrante, muslo confitado, parmentier de chirivía y trufa negra.', 'price' => 45.0, 'menu_category_id' => 2, 'image' => 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&w=800&q=80'],
            ['name' => 'Bogavante Azul Braseado', 'description' => 'Con mantequilla noisette, caviar cítrico y suculenta bisquet.', 'price' => 68.0, 'menu_category_id' => 2, 'image' => 'https://images.unsplash.com/photo-1553659971-ce4f09d6402f?auto=format&fit=crop&w=800&q=80'],

            // Postres
            ['name' => 'Coulant de Chocolate', 'description' => 'Corazón fundido de cacao 70% con helado de vainilla Bourbon.', 'price' => 12.0, 'menu_category_id' => 3, 'image' => 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'],
            ['name' => 'Tarta de Queso', 'description' => 'Estilo La Viña, cremosa y con un toque de queso azul.', 'price' => 10.0, 'menu_category_id' => 3, 'image' => 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80'],
            ['name' => 'Milhojas de Vainilla Tahití', 'description' => 'Crema diplomática, praliné de nuez pecán y helado artesanal.', 'price' => 14.0, 'menu_category_id' => 3, 'image' => 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80'],
            ['name' => 'Esfera de Oro Especiado', 'description' => 'Texturas de avellana, chocolate 85% y corazón líquido de maracuyá.', 'price' => 18.0, 'menu_category_id' => 3, 'image' => 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80']
        ];
        foreach ($dishes as $d) \App\Models\Dish::create($d);

        // Wines
        $wines = [
            [
                'name' => 'Moët & Chandon Imperial',
                'type' => 'Sparkling',
                'pairing_notes' => 'Champagne Brut. Vibrante, generoso y seductor.',
                'price_bottle' => 65.00,
            ],
            [
                'name' => 'Pago de Carraovejas',
                'type' => 'Red',
                'pairing_notes' => 'Ribera del Duero. Tinto fino, cabernet sauvignon y merlot.',
                'price_bottle' => 48.00,
            ],
            [
                'name' => 'Vega Sicilia Único 2011',
                'type' => 'Red',
                'pairing_notes' => 'Ribera del Duero. La leyenda hecha vino, notas profundas y complejas.',
                'price_bottle' => 495.00,
            ],
            [
                'name' => 'Louis Roederer Cristal 2014',
                'type' => 'Sparkling',
                'pairing_notes' => 'Champagne. Oro líquido con burbuja finísima y notas tostadas.',
                'price_bottle' => 320.00,
            ]
        ];
        foreach ($wines as $w) \App\Models\Wine::create($w);
    }
}
