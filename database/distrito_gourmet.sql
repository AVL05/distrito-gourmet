-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-05-2026 a las 17:27:23
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `distrito_gourmet`
--
CREATE DATABASE IF NOT EXISTS `distrito_gourmet`;
USE `distrito_gourmet`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `beverages`
--

CREATE TABLE `beverages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `beverages`
--

INSERT INTO `beverages` (`id`, `name`, `description`, `type`, `price`, `available`, `created_at`, `updated_at`) VALUES
(1, 'Agua Mineral Natural', 'Agua de manantial, 75cl.', 'agua', 4.50, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(2, 'Agua con Gas', 'Agua mineral con gas natural, 75cl.', 'agua', 4.50, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(3, 'San Pellegrino', 'Agua mineral italiana con gas, 75cl.', 'agua', 6.00, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(4, 'Coca-Cola Original', 'Clásica, formato premium 33cl.', 'refresco', 4.00, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(5, 'Coca-Cola Zero', 'Sin azúcar, formato premium 33cl.', 'refresco', 4.00, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(6, 'Fever-Tree Tónica Premium', 'Indian Tonic Water, 20cl.', 'refresco', 4.50, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(7, 'Zumo de Naranja Natural', 'Recién exprimido, naranjas de Valencia.', 'refresco', 5.50, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(8, 'Limonada de la Casa', 'Limón, hierbabuena, miel de azahar y soda artesanal.', 'refresco', 6.00, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(9, 'Negroni Clásico', 'Gin, Campari y vermut rojo. Piel de naranja.', 'cocktail', 14.00, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(10, 'Old Fashioned', 'Bourbon, angostura, azúcar de caña y twist de naranja.', 'cocktail', 15.00, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(11, 'Espresso Martini', 'Vodka, licor de café, espresso recién preparado.', 'cocktail', 14.00, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(12, 'Gin Tonic Premium', 'Hendrick\'s Gin, Fever-Tree, pepino y pimienta rosa.', 'cocktail', 16.00, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(13, 'Espresso', 'Café de especialidad, tueste medio, origen Colombia.', 'cafe', 3.50, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(14, 'Cappuccino', 'Espresso doble con leche texturizada y cacao.', 'cafe', 4.50, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(15, 'Té Matcha Ceremonial', 'Grado ceremonial, preparado con chasen tradicional.', 'cafe', 6.00, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(16, 'Infusión de Hierbas del Jardín', 'Manzanilla, lavanda y menta fresca. Servida en tetera.', 'cafe', 5.00, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dishes`
--

CREATE TABLE `dishes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `menu_category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_signature` tinyint(1) NOT NULL DEFAULT 0,
  `allergens` varchar(255) DEFAULT NULL,
  `available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `dishes`
--

INSERT INTO `dishes` (`id`, `name`, `description`, `price`, `image`, `menu_category_id`, `is_signature`, `allergens`, `available`, `created_at`, `updated_at`) VALUES
(1, 'Tartar de Atún Rojo', 'Atún salvaje, aguacate, sésamo tostado y emulsión de wasabi.', 24.00, NULL, 1, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(2, 'Croquetas de Jamón Ibérico', 'Cremosas por dentro, crujientes por fuera. Jamón de bellota 100%.', 16.50, NULL, 1, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(3, 'Carpaccio de Wagyū', 'Con lascas de parmesano reggiano de 24 meses y aceite de trufa.', 28.00, NULL, 1, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(4, 'Ostras Gillardeau N.º 2', 'Al natural con mignonette de chalota y perlas de yuzu.', 38.00, NULL, 1, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(5, 'Zamburiñas al Josper', 'Con emulsión de ají amarillo, salicornia y polvo de jamón ibérico.', 26.00, NULL, 1, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(6, 'Caviar Beluga Iraní', 'Selección exclusiva 30g, acompañado de blinis artesanales y crema agria.', 210.00, NULL, 1, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(7, 'Solomillo Rossini', 'Foie gras fresco, reducción de Pedro Ximénez y trufa negra.', 36.00, NULL, 2, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(8, 'Lubina Salvaje', 'A la espalda con verduras de temporada y refrito de ajos tiernos.', 32.00, NULL, 2, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(9, 'Risotto de Setas', 'Boletus edulis, trompetas de la muerte y aceite de trufa blanca.', 22.00, NULL, 2, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(10, 'Pichón de Bresse', 'Pechuga sangrante, muslo confitado, parmentier de chirivía y trufa negra.', 45.00, NULL, 2, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(11, 'Bogavante Azul Braseado', 'Con mantequilla noisette, caviar cítrico y suculenta bisquet.', 68.00, NULL, 2, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(12, 'Coulant de Chocolate', 'Corazón fundido de cacao 70% con helado de vainilla Bourbon.', 12.00, NULL, 3, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(13, 'Tarta de Queso', 'Estilo La Viña, cremosa y con un toque de queso azul.', 10.00, NULL, 3, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(14, 'Milhojas de Vainilla Tahití', 'Crema diplomática, praliné de nuez pecán y helado artesanal.', 14.00, NULL, 3, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(15, 'Esfera de Oro Especiado', 'Texturas de avellana, chocolate 85% y corazón líquido de maracuyá.', 18.00, NULL, 3, 0, NULL, 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu_categories`
--

CREATE TABLE `menu_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `menu_categories`
--

INSERT INTO `menu_categories` (`id`, `name`, `description`, `order`, `created_at`, `updated_at`) VALUES
(1, 'Entrantes', 'Para abrir el apetito.', 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(2, 'Principales', 'Los protagonistas.', 2, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(3, 'Postres', 'El broche de oro.', 3, '2026-04-06 15:38:28', '2026-04-06 15:38:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_01_01_000000_create_distrito_tables', 1),
(5, '2026_02_17_191259_create_personal_access_tokens_table', 1),
(6, '2026_03_03_173824_add_beverages_and_menus_tables', 1),
(7, '2026_03_22_102037_add_pickup_time_to_orders_table', 1),
(8, '2026_03_22_102352_add_payment_method_to_orders_table', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'received',
  `type` varchar(255) NOT NULL DEFAULT 'gourmet_pickup',
  `payment_method` varchar(255) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `pickup_time` datetime DEFAULT NULL,
  `address` text DEFAULT NULL,
  `delivery_instructions` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `dish_id` bigint(20) UNSIGNED DEFAULT NULL,
  `wine_id` bigint(20) UNSIGNED DEFAULT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservations`
--

CREATE TABLE `reservations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `restaurant_table_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reservation_time` datetime NOT NULL,
  `people` int(11) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `experience_type` varchar(255) NOT NULL DEFAULT 'tasting_menu',
  `special_requests` text DEFAULT NULL,
  `allergies_noted` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `restaurant_tables`
--

CREATE TABLE `restaurant_tables` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL,
  `zone` varchar(255) NOT NULL DEFAULT 'main_room',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `restaurant_tables`
--

INSERT INTO `restaurant_tables` (`id`, `name`, `capacity`, `zone`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Mesa 1', 2, 'window', 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(2, 'Mesa 2', 4, 'main_room', 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(3, 'Mesa 3', 2, 'main_room', 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(4, 'Chef\'s Table', 6, 'chef_table', 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(5, 'Privado', 10, 'private', 1, '2026-04-06 15:38:28', '2026-04-06 15:38:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tasting_menus`
--

CREATE TABLE `tasting_menus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `courses` int(11) NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tasting_menus`
--

INSERT INTO `tasting_menus` (`id`, `name`, `description`, `price`, `courses`, `available`, `created_at`, `updated_at`) VALUES
(1, 'Experiencia Clásica', 'Un recorrido por los sabores esenciales de nuestra cocina. Cinco tiempos que rinden homenaje a la tradición con un toque contemporáneo. Incluye maridaje con copa de vino por tiempo.', 75.00, 5, 1, '2026-04-06 15:38:29', '2026-04-06 15:38:29'),
(2, 'Gran Degustación', 'Siete tiempos que llevan nuestro arte culinario al máximo nivel. Una experiencia sensorial completa con productos premium y técnicas de vanguardia. Incluye maridaje exclusivo.', 120.00, 7, 1, '2026-04-06 15:38:29', '2026-04-06 15:38:29'),
(3, 'Menú del Chef', 'La expresión más personal y exclusiva de nuestro Chef. Nueve tiempos con caviar, bogavante y las mejores elaboraciones de la carta. Maridaje premium con champagne y vinos de autor. Disponible únicamente en Chef\'s Table.', 220.00, 9, 1, '2026-04-06 15:38:29', '2026-04-06 15:38:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tasting_menu_dishes`
--

CREATE TABLE `tasting_menu_dishes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tasting_menu_id` bigint(20) UNSIGNED NOT NULL,
  `dish_id` bigint(20) UNSIGNED NOT NULL,
  `course_number` int(11) NOT NULL DEFAULT 1,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tasting_menu_dishes`
--

INSERT INTO `tasting_menu_dishes` (`id`, `tasting_menu_id`, `dish_id`, `course_number`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 1, 'Croquetas de Jamón Ibérico — aperitivo del chef', NULL, NULL),
(2, 1, 1, 2, 'Tartar de Atún Rojo — porción degustación', NULL, NULL),
(3, 1, 8, 3, 'Lubina Salvaje — con verduras de huerta', NULL, NULL),
(4, 1, 7, 4, 'Solomillo Rossini — corte degustación', NULL, NULL),
(5, 1, 12, 5, 'Coulant de Chocolate — con helado de vainilla', NULL, NULL),
(6, 2, 5, 1, 'Zamburiñas al Josper — aperitivo', NULL, NULL),
(7, 2, 3, 2, 'Carpaccio de Wagyū — láminas finas con trufa', NULL, NULL),
(8, 2, 4, 3, 'Ostras Gillardeau — al natural', NULL, NULL),
(9, 2, 8, 4, 'Lubina Salvaje — presentación degustación', NULL, NULL),
(10, 2, 10, 5, 'Pichón de Bresse — pechuga y muslo confitado', NULL, NULL),
(11, 2, 14, 6, 'Milhojas de Vainilla Tahití — versión mini', NULL, NULL),
(12, 2, 15, 7, 'Esfera de Oro Especiado — con texturas de avellana', NULL, NULL),
(13, 3, 2, 1, 'Croquetas de Jamón Ibérico — bienvenida del chef', NULL, NULL),
(14, 3, 6, 2, 'Caviar Beluga Iraní — con blinis y crema agria', NULL, NULL),
(15, 3, 4, 3, 'Ostras Gillardeau N.º 2', NULL, NULL),
(16, 3, 5, 4, 'Zamburiñas al Josper — con emulsión de ají', NULL, NULL),
(17, 3, 11, 5, 'Bogavante Azul Braseado — pieza completa', NULL, NULL),
(18, 3, 10, 6, 'Pichón de Bresse — presentación del chef', NULL, NULL),
(19, 3, 9, 7, 'Risotto de Setas — como intermezzo cremoso', NULL, NULL),
(20, 3, 14, 8, 'Milhojas de Vainilla Tahití', NULL, NULL),
(21, 3, 15, 9, 'Esfera de Oro Especiado — con hoja de oro', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'client',
  `phone` varchar(255) DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `preferences` text DEFAULT NULL,
  `is_vip` tinyint(1) NOT NULL DEFAULT 0,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `phone`, `allergies`, `preferences`, `is_vip`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin Michelin', 'admin@distritogourmet.com', '2026-04-06 15:38:28', '$2y$12$nPSKjKCGSIk3jNekDinzPuxwI05IJgiIx8r0DjUfSoVD1jpAQZkMm', 'admin', NULL, NULL, NULL, 0, 'bnUspOu9Jt', '2026-04-06 15:38:28', '2026-04-06 15:38:28'),
(2, 'Cliente VIP', 'vip@example.com', '2026-04-06 15:38:28', '$2y$12$IFBCu55SwNUBSwb.MAQTD.DA5fV/4QWFUFkQ.g7w5YONzkXHWapOW', 'client', '+34 600 000 000', 'Marisco', 'Mesa cerca de la ventana, prefiere vino tinto', 1, 'Cz8siobfTP', '2026-04-06 15:38:28', '2026-04-06 15:38:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `wines`
--

CREATE TABLE `wines` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `winery` varchar(255) DEFAULT NULL,
  `vintage` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `pairing_notes` text DEFAULT NULL,
  `price_bottle` decimal(10,2) DEFAULT NULL,
  `price_glass` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `wines`
--

INSERT INTO `wines` (`id`, `name`, `winery`, `vintage`, `type`, `pairing_notes`, `price_bottle`, `price_glass`, `created_at`, `updated_at`) VALUES
(1, 'Pago de Carraovejas', NULL, NULL, 'Tinto', 'Ribera del Duero. Tinto fino, cabernet sauvignon y merlot. Elegante y profundo.', 48.00, 9.00, '2026-04-06 15:38:29', '2026-04-06 15:38:29'),
(2, 'Vega Sicilia Único 2011', NULL, NULL, 'Tinto', 'Ribera del Duero. La leyenda hecha vino, notas profundas y complejas de fruta madura y especias.', 495.00, NULL, '2026-04-06 15:38:29', '2026-04-06 15:38:29'),
(3, 'Flor de Pingus 2019', NULL, NULL, 'Tinto', 'Ribera del Duero. Tempranillo puro. Intenso, sedoso y con final de gran persistencia.', 120.00, NULL, '2026-04-06 15:38:29', '2026-04-06 15:38:29'),
(4, 'Marqués de Murrieta Reserva', NULL, NULL, 'Tinto', 'Rioja. Tempranillo, graciano y mazuelo. Clásico riojano con 20 meses en barrica.', 32.00, 7.00, '2026-04-06 15:38:29', '2026-04-06 15:38:29'),
(5, 'Artadi Viñas de Gain', NULL, NULL, 'Tinto', 'Rioja Alavesa. Tempranillo de viñas viejas. Fresco, frutal y con carácter.', 28.00, 6.50, '2026-04-06 15:38:29', '2026-04-06 15:38:29'),
(6, 'Albariño Pazo Señorans', NULL, NULL, 'Blanco', 'Rías Baixas. Albariño puro. Fresco, mineral y con notas cítricas elegantes.', 26.00, 6.00, '2026-04-06 15:38:29', '2026-04-06 15:38:29'),
(7, 'Godello Guímaro', NULL, NULL, 'Blanco', 'Ribeira Sacra. Godello sobre lías. Textura cremosa, fruta blanca y mineralidad atlántica.', 22.00, 5.50, '2026-04-06 15:38:29', '2026-04-06 15:38:29'),
(8, 'Enate Chardonnay 234', NULL, NULL, 'Blanco', 'Somontano. Chardonnay fermentado en barrica. Mantequilla, vainilla y fruta tropical.', 18.00, 5.00, '2026-04-06 15:38:29', '2026-04-06 15:38:29'),
(9, 'Moët & Chandon Imperial', NULL, NULL, 'Espumoso', 'Champagne Brut. Vibrante, generoso y seductor. Ideal para celebrar.', 65.00, NULL, '2026-04-06 15:38:29', '2026-04-06 15:38:29'),
(10, 'Louis Roederer Cristal 2014', NULL, NULL, 'Espumoso', 'Champagne. Oro líquido con burbuja finísima y notas tostadas extraordinarias.', 320.00, NULL, '2026-04-06 15:38:29', '2026-04-06 15:38:29'),
(11, 'Cava Recaredo Terrers Brut Nature', NULL, NULL, 'Espumoso', 'Penedès. Xarel·lo y macabeo. Gran Reserva con 40 meses de crianza. Autólisis elegante.', 24.00, 6.00, '2026-04-06 15:38:29', '2026-04-06 15:38:29'),
(12, 'Miraval Rosé', NULL, NULL, 'Rosado', 'Provence. Cinsault, garnacha y syrah. Elegante, ligero y con notas de pétalos de rosa.', 28.00, 6.50, '2026-04-06 15:38:29', '2026-04-06 15:38:29');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `beverages`
--
ALTER TABLE `beverages`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indices de la tabla `dishes`
--
ALTER TABLE `dishes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dishes_menu_category_id_foreign` (`menu_category_id`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `menu_categories`
--
ALTER TABLE `menu_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_dish_id_foreign` (`dish_id`),
  ADD KEY `order_items_wine_id_foreign` (`wine_id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indices de la tabla `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reservations_user_id_foreign` (`user_id`),
  ADD KEY `reservations_restaurant_table_id_foreign` (`restaurant_table_id`);

--
-- Indices de la tabla `restaurant_tables`
--
ALTER TABLE `restaurant_tables`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Indices de la tabla `tasting_menus`
--
ALTER TABLE `tasting_menus`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tasting_menu_dishes`
--
ALTER TABLE `tasting_menu_dishes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tasting_menu_dishes_tasting_menu_id_foreign` (`tasting_menu_id`),
  ADD KEY `tasting_menu_dishes_dish_id_foreign` (`dish_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indices de la tabla `wines`
--
ALTER TABLE `wines`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `beverages`
--
ALTER TABLE `beverages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `dishes`
--
ALTER TABLE `dishes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `menu_categories`
--
ALTER TABLE `menu_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `restaurant_tables`
--
ALTER TABLE `restaurant_tables`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tasting_menus`
--
ALTER TABLE `tasting_menus`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tasting_menu_dishes`
--
ALTER TABLE `tasting_menu_dishes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `wines`
--
ALTER TABLE `wines`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `dishes`
--
ALTER TABLE `dishes`
  ADD CONSTRAINT `dishes_menu_category_id_foreign` FOREIGN KEY (`menu_category_id`) REFERENCES `menu_categories` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_dish_id_foreign` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_wine_id_foreign` FOREIGN KEY (`wine_id`) REFERENCES `wines` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_restaurant_table_id_foreign` FOREIGN KEY (`restaurant_table_id`) REFERENCES `restaurant_tables` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reservations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tasting_menu_dishes`
--
ALTER TABLE `tasting_menu_dishes`
  ADD CONSTRAINT `tasting_menu_dishes_dish_id_foreign` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tasting_menu_dishes_tasting_menu_id_foreign` FOREIGN KEY (`tasting_menu_id`) REFERENCES `tasting_menus` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
