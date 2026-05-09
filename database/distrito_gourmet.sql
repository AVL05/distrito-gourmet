-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-05-2026 a las 17:11:53
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;

--
-- Base de datos: `distrito_gourmet`
--
CREATE DATABASE IF NOT EXISTS `distrito_gourmet` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `distrito_gourmet`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bebidas`
--

CREATE TABLE `bebidas` (
    `id` bigint(20) UNSIGNED NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `descripcion` text DEFAULT NULL,
    `tipo` enum(
        'agua',
        'refresco',
        'cocktail',
        'cafe'
    ) NOT NULL,
    `precio` decimal(10, 2) NOT NULL,
    `disponible` tinyint(1) NOT NULL DEFAULT 1,
    `destacado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `bebidas`
--

INSERT INTO
    `bebidas` (
        `id`,
        `nombre`,
        `descripcion`,
        `tipo`,
        `precio`,
        `disponible`,
        `destacado`
    )
VALUES (
        1,
        'Agua Mineral Natural',
        'Agua de manantial premium 75cl.',
        'agua',
        4.50,
        1,
        0
    ),
    (
        2,
        'San Pellegrino',
        'Agua mineral italiana con gas.',
        'agua',
        6.00,
        1,
        1
    ),
    (
        3,
        'Coca-Cola Original',
        'Formato premium 33cl.',
        'refresco',
        4.00,
        1,
        0
    ),
    (
        4,
        'Limonada de la Casa',
        'Limón, hierbabuena y miel de azahar.',
        'refresco',
        6.00,
        1,
        1
    ),
    (
        5,
        'Espresso Martini',
        'Vodka, licor de café y espresso.',
        'cocktail',
        14.00,
        1,
        1
    ),
    (
        6,
        'Negroni Clásico',
        'Gin, Campari y vermut rojo.',
        'cocktail',
        14.00,
        1,
        1
    ),
    (
        7,
        'Cappuccino',
        'Espresso doble con leche texturizada.',
        'cafe',
        4.50,
        1,
        0
    ),
    (
        8,
        'Té Matcha Ceremonial',
        'Preparado con chasen tradicional.',
        'cafe',
        6.00,
        1,
        1
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_menu`
--

CREATE TABLE `categorias_menu` (
    `id` bigint(20) UNSIGNED NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `descripcion` text DEFAULT NULL,
    `orden_visualizacion` int(11) NOT NULL DEFAULT 0
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias_menu`
--

INSERT INTO
    `categorias_menu` (
        `id`,
        `nombre`,
        `descripcion`,
        `orden_visualizacion`
    )
VALUES (
        1,
        'Entrantes',
        'Para abrir el apetito.',
        1
    ),
    (
        2,
        'Principales',
        'Los protagonistas.',
        2
    ),
    (
        3,
        'Postres',
        'El broche final.',
        3
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_pedido`
--

CREATE TABLE `detalles_pedido` (
    `id` bigint(20) UNSIGNED NOT NULL,
    `pedido_id` bigint(20) UNSIGNED NOT NULL,
    `plato_id` bigint(20) UNSIGNED DEFAULT NULL,
    `vino_id` bigint(20) UNSIGNED DEFAULT NULL,
    `bebida_id` bigint(20) UNSIGNED DEFAULT NULL,
    `menu_degustacion_id` bigint(20) UNSIGNED DEFAULT NULL,
    `cantidad` int(11) NOT NULL,
    `precio_unitario` decimal(10, 2) DEFAULT NULL,
    `precio_total` decimal(10, 2) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `detalles_pedido`
--

INSERT INTO
    `detalles_pedido` (
        `id`,
        `pedido_id`,
        `plato_id`,
        `vino_id`,
        `bebida_id`,
        `menu_degustacion_id`,
        `cantidad`,
        `precio_unitario`,
        `precio_total`
    )
VALUES (
        1,
        12,
        1,
        NULL,
        NULL,
        NULL,
        1,
        3.00,
        3.00
    ),
    (
        2,
        12,
        14,
        NULL,
        NULL,
        NULL,
        1,
        24.00,
        24.00
    ),
    (
        3,
        12,
        4,
        NULL,
        NULL,
        NULL,
        1,
        28.00,
        28.00
    ),
    (
        4,
        12,
        8,
        NULL,
        NULL,
        NULL,
        1,
        12.00,
        12.00
    ),
    (
        5,
        13,
        22,
        NULL,
        NULL,
        NULL,
        1,
        12.00,
        12.00
    ),
    (
        6,
        13,
        15,
        NULL,
        NULL,
        NULL,
        1,
        26.00,
        26.00
    ),
    (
        7,
        13,
        18,
        NULL,
        NULL,
        NULL,
        1,
        16.00,
        16.00
    ),
    (
        8,
        13,
        19,
        NULL,
        NULL,
        NULL,
        1,
        4.50,
        4.50
    ),
    (
        9,
        14,
        2,
        NULL,
        NULL,
        NULL,
        1,
        18.00,
        18.00
    ),
    (
        10,
        15,
        1,
        NULL,
        NULL,
        NULL,
        1,
        3.00,
        3.00
    ),
    (
        11,
        16,
        1,
        NULL,
        NULL,
        NULL,
        1,
        3.00,
        3.00
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `maridajes_plato_vino`
--

CREATE TABLE `maridajes_plato_vino` (
    `id` bigint(20) UNSIGNED NOT NULL,
    `plato_id` bigint(20) UNSIGNED NOT NULL,
    `vino_id` bigint(20) UNSIGNED NOT NULL,
    `nivel_recomendacion` enum(
        'Buena',
        'Muy buena',
        'Perfecta'
    ) NOT NULL DEFAULT 'Muy buena',
    `notas` text DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `maridajes_plato_vino`
--

INSERT INTO
    `maridajes_plato_vino` (
        `id`,
        `plato_id`,
        `vino_id`,
        `nivel_recomendacion`,
        `notas`
    )
VALUES (
        1,
        4,
        3,
        'Perfecta',
        'La mineralidad acompaña perfectamente la lubina.'
    ),
    (
        2,
        5,
        1,
        'Perfecta',
        'Tinto estructurado ideal para carnes maduradas.'
    ),
    (
        3,
        2,
        5,
        'Muy buena',
        'Champagne ideal para mariscos premium.'
    ),
    (
        4,
        8,
        5,
        'Perfecta',
        'Champagne y chocolate generan un gran contraste.'
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menus_degustacion`
--

CREATE TABLE `menus_degustacion` (
    `id` bigint(20) UNSIGNED NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `slug` varchar(255) DEFAULT NULL,
    `descripcion` text DEFAULT NULL,
    `precio` decimal(10, 2) NOT NULL,
    `precio_maridaje` decimal(10, 2) DEFAULT NULL,
    `pasos` int(11) NOT NULL,
    `duracion_estimada_minutos` int(11) DEFAULT NULL,
    `disponible` tinyint(1) NOT NULL DEFAULT 1
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `menus_degustacion`
--

INSERT INTO
    `menus_degustacion` (
        `id`,
        `nombre`,
        `slug`,
        `descripcion`,
        `precio`,
        `precio_maridaje`,
        `pasos`,
        `duracion_estimada_minutos`,
        `disponible`
    )
VALUES (
        1,
        'Menú Ejecutivo',
        'menu-ejecutivo',
        'Menú contemporáneo',
        39.00,
        NULL,
        3,
        60,
        1
    ),
    (
        2,
        'Menú Degustación Tierra y Mar',
        'menu-tierra-mar',
        'Recorrido gastronómico que une producto marino y cocina contemporánea.',
        95.00,
        45.00,
        8,
        120,
        1
    ),
    (
        3,
        'Chef Experience',
        'chef-experience',
        'Experiencia gastronómica exclusiva fuera de carta.',
        145.00,
        75.00,
        10,
        180,
        1
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
    `id` int(10) UNSIGNED NOT NULL,
    `migration` varchar(255) NOT NULL,
    `batch` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO
    `migrations` (`id`, `migration`, `batch`)
VALUES (
        1,
        '0001_01_01_000000_create_users_table',
        1
    ),
    (
        2,
        '2024_01_01_000000_create_distrito_tables',
        1
    ),
    (
        3,
        '2024_01_01_000001_create_personal_access_tokens_table',
        1
    ),
    (
        4,
        '2026_05_06_222310_add_pickup_and_payment_to_pedidos_table',
        2
    ),
    (
        5,
        '2026_05_06_222314_add_menu_degustacion_to_detalles_pedido_table',
        2
    ),
    (
        6,
        '2026_05_07_203419_create_password_reset_tokens_table',
        3
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
    `id` bigint(20) UNSIGNED NOT NULL,
    `usuario_id` bigint(20) UNSIGNED NOT NULL,
    `numero_pedido` varchar(255) DEFAULT NULL,
    `estado` enum(
        'Pendiente',
        'Preparando',
        'Listo',
        'Entregado',
        'Cancelado'
    ) NOT NULL DEFAULT 'Pendiente',
    `tipo_pedido` enum(
        'Sala',
        'Takeaway',
        'Delivery'
    ) NOT NULL DEFAULT 'Sala',
    `hora_recogida` time DEFAULT NULL,
    `fecha_recogida` date DEFAULT NULL,
    `subtotal` decimal(10, 2) NOT NULL DEFAULT 0.00,
    `impuestos` decimal(10, 2) NOT NULL DEFAULT 0.00,
    `total` decimal(10, 2) NOT NULL DEFAULT 0.00,
    `metodo_pago` varchar(255) DEFAULT NULL,
    `direccion` text DEFAULT NULL,
    `creado_a` timestamp NULL DEFAULT NULL,
    `actualizado_a` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO
    `pedidos` (
        `id`,
        `usuario_id`,
        `numero_pedido`,
        `estado`,
        `tipo_pedido`,
        `hora_recogida`,
        `fecha_recogida`,
        `subtotal`,
        `impuestos`,
        `total`,
        `metodo_pago`,
        `direccion`,
        `creado_a`,
        `actualizado_a`
    )
VALUES (
        12,
        4,
        'DG-20260506-454E',
        'Pendiente',
        'Takeaway',
        '14:00:00',
        '2026-05-07',
        60.91,
        6.09,
        67.00,
        'cash',
        NULL,
        '2026-05-06 20:26:57',
        '2026-05-06 20:26:57'
    ),
    (
        13,
        1,
        'DG-20260507-ABFF',
        'Cancelado',
        'Takeaway',
        '20:00:00',
        '2026-05-07',
        53.18,
        5.32,
        58.50,
        'paypal',
        NULL,
        '2026-05-07 16:37:22',
        '2026-05-07 17:27:31'
    ),
    (
        14,
        1,
        'DG-20260507-D472',
        'Entregado',
        'Takeaway',
        '21:00:00',
        '2026-05-07',
        16.36,
        1.64,
        18.00,
        'cash',
        NULL,
        '2026-05-07 16:54:07',
        '2026-05-07 17:27:28'
    ),
    (
        15,
        1,
        'DG-20260507-C5D6',
        'Listo',
        'Takeaway',
        '20:00:00',
        '2026-05-07',
        2.73,
        0.27,
        3.00,
        'card',
        NULL,
        '2026-05-07 17:14:07',
        '2026-05-07 17:27:25'
    ),
    (
        16,
        1,
        'DG-20260507-D650',
        'Preparando',
        'Takeaway',
        '20:00:00',
        '2026-05-07',
        2.73,
        0.27,
        3.00,
        'cash',
        NULL,
        '2026-05-07 17:16:53',
        '2026-05-07 17:27:11'
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
    `id` bigint(20) UNSIGNED NOT NULL,
    `tokenable_type` varchar(255) NOT NULL,
    `tokenable_id` bigint(20) UNSIGNED NOT NULL,
    `name` varchar(255) NOT NULL,
    `token` varchar(64) NOT NULL,
    `abilities` text DEFAULT NULL,
    `last_used_at` timestamp NULL DEFAULT NULL,
    `expires_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `personal_access_tokens`
--

INSERT INTO
    `personal_access_tokens` (
        `id`,
        `tokenable_type`,
        `tokenable_id`,
        `name`,
        `token`,
        `abilities`,
        `last_used_at`,
        `expires_at`,
        `created_at`,
        `updated_at`
    )
VALUES (
        4,
        'App\\Models\\Usuario',
        1,
        'auth_token',
        'b90241887c83bbd6fa35f307e055d2e9cfa973d7fadba47b088a249a2f35e09a',
        '[\"*\"]',
        '2026-05-07 21:16:10',
        NULL,
        '2026-05-07 21:16:07',
        '2026-05-07 21:16:10'
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platos`
--

CREATE TABLE `platos` (
    `id` bigint(20) UNSIGNED NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `slug` varchar(255) DEFAULT NULL,
    `descripcion` text DEFAULT NULL,
    `precio` decimal(10, 2) NOT NULL,
    `categoria_menu_id` bigint(20) UNSIGNED DEFAULT NULL,
    `alergenos` varchar(255) DEFAULT NULL,
    `disponible` tinyint(1) NOT NULL DEFAULT 1,
    `visible_en_carta` tinyint(1) NOT NULL DEFAULT 1,
    `visible_en_degustacion` tinyint(1) NOT NULL DEFAULT 1,
    `disponible_para_llevar` tinyint(1) NOT NULL DEFAULT 1,
    `es_por_unidad` tinyint(1) NOT NULL DEFAULT 0,
    `maximo_por_pedido` int(11) NOT NULL DEFAULT 999
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `platos`
--

INSERT INTO
    `platos` (
        `id`,
        `nombre`,
        `slug`,
        `descripcion`,
        `precio`,
        `categoria_menu_id`,
        `alergenos`,
        `disponible`,
        `visible_en_carta`,
        `visible_en_degustacion`,
        `disponible_para_llevar`,
        `es_por_unidad`,
        `maximo_por_pedido`
    )
VALUES (
        1,
        'Croqueta Cremosa de Jamón Ibérico',
        'croqueta-jamon-iberico',
        'Bechamel infusionada en hueso de jamón de bellota 100% ibérico, rebozada en panko artesano.',
        3.00,
        1,
        'Gluten, Lácteos, Huevo',
        1,
        1,
        1,
        1,
        1,
        20
    ),
    (
        2,
        'Tartar de Gamba Roja y Lima',
        'tartar-gamba-roja',
        'Gamba roja de Denia picada a cuchillo, emulsión de sus cabezas, ralladura de lima y crujiente de algas.',
        18.00,
        1,
        'Crustáceos',
        1,
        1,
        1,
        0,
        0,
        8
    ),
    (
        3,
        'Pulpo a la Brasa con Parmentier Trufado',
        'pulpo-brasa-parmentier',
        'Tentáculo de pulpo de roca, puré de patata sedoso con aceite de trufa blanca y pimentón de la Vera.',
        19.00,
        1,
        'Moluscos, Lácteos',
        1,
        1,
        1,
        0,
        0,
        6
    ),
    (
        4,
        'Lubina Salvaje y Velouté de Marisco',
        'lubina-veloute-marisco',
        'Lomo de lubina asado sobre su piel, velouté emulsionada de carabineros y espárragos trigueros.',
        28.00,
        2,
        'Pescado, Crustáceos',
        1,
        1,
        1,
        0,
        0,
        5
    ),
    (
        5,
        'Solomillo de Vaca Madurada',
        'solomillo-vaca-madurada',
        'Centro de solomillo con 45 días de maduración, reducción de oporto y chalotas glaseadas.',
        32.00,
        2,
        'Sulfitos',
        1,
        1,
        1,
        0,
        0,
        5
    ),
    (
        6,
        'Ravioli de Setas y Trufa Negra',
        'ravioli-setas-trufa',
        'Pasta fresca artesanal rellena de boletus edulis, crema ligera de queso pecorino y láminas de trufa fresca.',
        22.00,
        2,
        'Gluten, Lácteos, Huevo',
        1,
        1,
        1,
        1,
        0,
        6
    ),
    (
        7,
        'Risotto de Parmesano y Trufa Blanca',
        'risotto-trufa-blanca',
        'Arroz Carnaroli mantecado con mantequilla de Isigny, Parmigiano Reggiano y esencia de trufa de Alba.',
        20.00,
        2,
        'Lácteos',
        1,
        1,
        1,
        1,
        0,
        6
    ),
    (
        8,
        'Esfera de Chocolate y Núcleo Fundente',
        'esfera-chocolate',
        'Chocolate 70% cacao, corazón de caramelo salado y baño caliente de ganache de chocolate.',
        12.00,
        3,
        'Gluten, Lácteos, Huevo',
        1,
        1,
        1,
        1,
        0,
        6
    ),
    (
        9,
        'Tarta de Limón Desconstruida',
        'tarta-limon-desconstruida',
        'Lemon curd cítrico, tierra de galleta de mantequilla, merengue italiano tostado y sorbete de menta.',
        10.00,
        3,
        'Gluten, Lácteos, Huevo',
        1,
        1,
        1,
        1,
        0,
        6
    ),
    (
        10,
        'Petit Fours Artesanales',
        'petit-fours',
        'Surtido de bombones, mini-macarons de pistacho y nubes de violeta elaboradas en nuestro obrador.',
        2.50,
        3,
        'Gluten, Frutos secos, Lácteos',
        1,
        1,
        1,
        1,
        1,
        15
    ),
    (
        11,
        'Vieira Flambeada con Mantequilla Noisette',
        'vieira-flambeada',
        'Vieira de Galicia flambeada con brandy de Jerez sobre una base de crema de coliflor ahumada.',
        14.00,
        1,
        'Moluscos, Lácteos',
        1,
        0,
        1,
        0,
        0,
        999
    ),
    (
        12,
        'Pre-postre Cítrico de Yuzu y Albahaca',
        'pre-postre-yuzu',
        'Limpiador de paladar refrescante a base de gelificado de yuzu japonés y granizado de albahaca fresca.',
        6.00,
        3,
        'Lácteos',
        1,
        0,
        1,
        0,
        0,
        999
    ),
    (
        13,
        'Salmorejo de Mango y Virutas de Foie',
        'salmorejo-mango-foie',
        'Interpretación frutal del clásico cordobés con mango maduro y nieve de foie micuit.',
        14.00,
        1,
        'Lácteos, Sulfitos',
        1,
        1,
        1,
        1,
        0,
        10
    ),
    (
        14,
        'Carpaccio de Wagyu A5',
        'carpaccio-wagyu',
        'Láminas finas de buey de Kobe, lascas de parmesano de 36 meses y aceite de piñones tostados.',
        24.00,
        1,
        'Lácteos, Frutos secos',
        1,
        1,
        1,
        0,
        0,
        4
    ),
    (
        15,
        'Bacalao Skrei con Pil-Pil de Plancton',
        'bacalao-skrei-plancton',
        'Lomo de bacalao noruego de temporada confitado a baja temperatura con pil-pil marino de plancton puro.',
        26.00,
        2,
        'Pescado',
        1,
        1,
        1,
        0,
        0,
        5
    ),
    (
        16,
        'Costilla de Angus Glaseada',
        'costilla-angus',
        'Costilla cocinada 24 horas a 65ºC con glaseado de soja y bourbon, acompañada de puré de boniato.',
        25.00,
        2,
        'Gluten, Soja',
        1,
        1,
        1,
        1,
        0,
        4
    ),
    (
        17,
        'Torrija Caramelizada en Pan de Brioche',
        'torrija-brioche',
        'Pan de brioche artesano empapado en leche de coco y canela, caramelizado con azúcar moscovado.',
        11.00,
        3,
        'Gluten, Lácteos, Huevo',
        1,
        1,
        1,
        1,
        0,
        8
    ),
    (
        18,
        'Burrata de Puglia con Pesto de Pistacho',
        'burrata-puglia-pistacho',
        'Burrata fresca de 250g, corazón cremoso, pesto artesano de pistachos de Bronte y tomates cherry confitados.',
        16.00,
        1,
        'Lácteos, Frutos secos',
        1,
        1,
        1,
        1,
        0,
        5
    ),
    (
        19,
        'Anchoas del Cantábrico \"00\" sobre Brioche',
        'anchoas-cantabrico-brioche',
        'Anchoas seleccionadas de Santoña, mantequilla ahumada y pan de brioche tostado.',
        4.50,
        1,
        'Gluten, Pescado, Lácteos',
        1,
        1,
        1,
        0,
        1,
        12
    ),
    (
        20,
        'Presa Ibérica con Mojo de Pistacho',
        'presa-iberica-mojo',
        'Presa de cerdo ibérico de bellota marcada a la brasa, acompañada de mojo verde de pistachos y yuca frita.',
        24.00,
        2,
        'Frutos secos',
        1,
        1,
        1,
        1,
        0,
        6
    ),
    (
        21,
        'Lomo de Rodaballo Salvaje',
        'rodaballo-salvaje',
        'Rodaballo del Cantábrico a la parrilla con bilbaína tradicional y chips de ajos tiernos.',
        30.00,
        2,
        'Pescado',
        1,
        1,
        1,
        0,
        0,
        4
    ),
    (
        22,
        'Coulant de Avellana y Helado de Leche',
        'coulant-avellana',
        'Bizcocho fluido de avellana tostada, praliné crujiente y helado artesano de leche fresca de granja.',
        12.00,
        3,
        'Gluten, Lácteos, Frutos secos, Huevo',
        1,
        1,
        1,
        1,
        0,
        5
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platos_menu_degustacion`
--

CREATE TABLE `platos_menu_degustacion` (
    `id` bigint(20) UNSIGNED NOT NULL,
    `menu_degustacion_id` bigint(20) UNSIGNED NOT NULL,
    `plato_id` bigint(20) UNSIGNED NOT NULL,
    `numero_paso` int(11) NOT NULL DEFAULT 1
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `platos_menu_degustacion`
--

INSERT INTO
    `platos_menu_degustacion` (
        `id`,
        `menu_degustacion_id`,
        `plato_id`,
        `numero_paso`
    )
VALUES (1, 1, 3, 1),
    (2, 1, 5, 2),
    (3, 1, 8, 3),
    (4, 2, 1, 1),
    (5, 2, 2, 2),
    (6, 2, 11, 3),
    (7, 2, 6, 4),
    (8, 2, 4, 5),
    (9, 2, 5, 6),
    (10, 2, 12, 7),
    (11, 2, 8, 8),
    (12, 3, 1, 1),
    (13, 3, 11, 2),
    (14, 3, 2, 3),
    (15, 3, 3, 4),
    (16, 3, 4, 5),
    (17, 3, 5, 6),
    (18, 3, 6, 7),
    (19, 3, 12, 8),
    (20, 3, 8, 9),
    (21, 3, 10, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
    `id` bigint(20) UNSIGNED NOT NULL,
    `usuario_id` bigint(20) UNSIGNED NOT NULL,
    `codigo_reserva` varchar(255) DEFAULT NULL,
    `fecha_reserva` date DEFAULT NULL,
    `hora_reserva` time DEFAULT NULL,
    `comensales` int(11) NOT NULL DEFAULT 1,
    `menu_degustacion_id` bigint(20) UNSIGNED DEFAULT NULL,
    `estado` varchar(255) NOT NULL DEFAULT 'Pendiente',
    `peticiones_especiales` text DEFAULT NULL,
    `creado_a` timestamp NULL DEFAULT NULL,
    `actualizado_a` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO
    `reservas` (
        `id`,
        `usuario_id`,
        `codigo_reserva`,
        `fecha_reserva`,
        `hora_reserva`,
        `comensales`,
        `menu_degustacion_id`,
        `estado`,
        `peticiones_especiales`,
        `creado_a`,
        `actualizado_a`
    )
VALUES (
        3,
        1,
        '7C117382',
        '2026-05-15',
        '14:00:00',
        2,
        NULL,
        'Pendiente',
        'sa',
        '2026-05-06 20:42:41',
        '2026-05-06 20:44:08'
    ),
    (
        4,
        1,
        '8461DAEC',
        '2026-05-29',
        '14:00:00',
        3,
        NULL,
        'Confirmada',
        'scsdfzscs fsdscda',
        '2026-05-07 17:13:42',
        '2026-05-07 17:13:42'
    ),
    (
        5,
        1,
        'A2364408',
        '2026-05-20',
        '14:00:00',
        3,
        NULL,
        'Cancelada',
        'd',
        '2026-05-07 17:21:39',
        '2026-05-07 17:27:51'
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tokens_recuperacion_password`
--

CREATE TABLE `tokens_recuperacion_password` (
    `email` varchar(255) NOT NULL,
    `token` varchar(255) NOT NULL,
    `created_at` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
    `id` bigint(20) UNSIGNED NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `rol` enum(
        'Administrador',
        'Staff',
        'Cliente'
    ) NOT NULL DEFAULT 'Cliente',
    `telefono` varchar(255) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO
    `usuarios` (
        `id`,
        `nombre`,
        `email`,
        `password`,
        `rol`,
        `telefono`
    )
VALUES (
        1,
        'Admin Michelin',
        'admin@distritogourmet.com',
        '$2y$12$V/ggxPNyEN5GuNpRRNrW9uZ/8Xok0E6Deho7mf99uGBkN.4ho.UXy',
        'Administrador',
        '+34 600 000 000'
    ),
    (
        2,
        'Cliente VIP',
        'vip@distritogourmet.com',
        '$2y$12$BwJFteCLnE4tCkoBZ3hrV.YUd24YUykGkE6VcOmCrBkukuu455PzW',
        'Cliente',
        '+34 611 111 111'
    ),
    (
        4,
        'Alex',
        'alex@distritogourmet.com',
        '$2y$12$JLTBqInQAf0EPtuFxhxY0ukW3GTjuRm67OTtre0AxOt.deSFwUpVK',
        'Staff',
        '+34 600 000 000'
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vinos`
--

CREATE TABLE `vinos` (
    `id` bigint(20) UNSIGNED NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `region` varchar(255) DEFAULT NULL,
    `uva` varchar(255) DEFAULT NULL,
    `tipo` enum(
        'Tinto',
        'Blanco',
        'Rosado',
        'Espumoso',
        'Dulce'
    ) NOT NULL,
    `notas_maridaje` text DEFAULT NULL,
    `descripcion` text DEFAULT NULL,
    `precio_botella` decimal(10, 2) DEFAULT NULL,
    `precio_copa` decimal(10, 2) DEFAULT NULL,
    `disponible` tinyint(1) NOT NULL DEFAULT 1,
    `destacado` tinyint(1) NOT NULL DEFAULT 0,
    `maximo_por_pedido` int(11) NOT NULL DEFAULT 999
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `vinos`
--

INSERT INTO
    `vinos` (
        `id`,
        `nombre`,
        `region`,
        `uva`,
        `tipo`,
        `notas_maridaje`,
        `descripcion`,
        `precio_botella`,
        `precio_copa`,
        `disponible`,
        `destacado`,
        `maximo_por_pedido`
    )
VALUES (
        1,
        'Pago de Carraovejas',
        'Ribera del Duero',
        'Tempranillo',
        'Tinto',
        'Perfecto para carnes rojas.',
        NULL,
        48.00,
        9.00,
        1,
        1,
        999
    ),
    (
        2,
        'Vega Sicilia Único 2011',
        'Ribera del Duero',
        'Tempranillo',
        'Tinto',
        'Ideal para experiencias premium.',
        NULL,
        495.00,
        NULL,
        1,
        1,
        999
    ),
    (
        3,
        'Albariño Pazo Señorans',
        'Rías Baixas',
        'Albariño',
        'Blanco',
        'Excelente con pescados y marisco.',
        NULL,
        26.00,
        6.00,
        1,
        1,
        999
    ),
    (
        4,
        'Godello Guímaro',
        'Ribeira Sacra',
        'Godello',
        'Blanco',
        'Mineral y elegante.',
        NULL,
        22.00,
        5.50,
        1,
        0,
        999
    ),
    (
        5,
        'Moët & Chandon Imperial',
        'Champagne',
        'Chardonnay',
        'Espumoso',
        'Ideal para celebraciones.',
        NULL,
        65.00,
        NULL,
        1,
        1,
        999
    ),
    (
        6,
        'Miraval Rosé',
        'Provence',
        'Syrah y Garnacha',
        'Rosado',
        'Ligero y floral.',
        NULL,
        28.00,
        6.50,
        1,
        0,
        999
    );

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bebidas`
--
ALTER TABLE `bebidas` ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categorias_menu`
--
ALTER TABLE `categorias_menu` ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
ADD PRIMARY KEY (`id`),
ADD KEY `detalles_pedido_pedido_id_foreign` (`pedido_id`),
ADD KEY `detalles_pedido_plato_id_foreign` (`plato_id`),
ADD KEY `detalles_pedido_menu_degustacion_id_foreign` (`menu_degustacion_id`);

--
-- Indices de la tabla `maridajes_plato_vino`
--
ALTER TABLE `maridajes_plato_vino`
ADD PRIMARY KEY (`id`),
ADD KEY `maridajes_plato_vino_plato_id_foreign` (`plato_id`),
ADD KEY `maridajes_plato_vino_vino_id_foreign` (`vino_id`);

--
-- Indices de la tabla `menus_degustacion`
--
ALTER TABLE `menus_degustacion`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `menus_degustacion_slug_unique` (`slug`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations` ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `pedidos_numero_pedido_unique` (`numero_pedido`),
ADD KEY `pedidos_usuario_id_foreign` (`usuario_id`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (
    `tokenable_type`,
    `tokenable_id`
);

--
-- Indices de la tabla `platos`
--
ALTER TABLE `platos`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `platos_slug_unique` (`slug`),
ADD KEY `platos_categoria_menu_id_foreign` (`categoria_menu_id`);

--
-- Indices de la tabla `platos_menu_degustacion`
--
ALTER TABLE `platos_menu_degustacion`
ADD PRIMARY KEY (`id`),
ADD KEY `platos_menu_degustacion_menu_degustacion_id_foreign` (`menu_degustacion_id`),
ADD KEY `platos_menu_degustacion_plato_id_foreign` (`plato_id`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `reservas_codigo_reserva_unique` (`codigo_reserva`),
ADD KEY `reservas_usuario_id_foreign` (`usuario_id`);

--
-- Indices de la tabla `tokens_recuperacion_password`
--
ALTER TABLE `tokens_recuperacion_password` ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `usuarios_email_unique` (`email`);

--
-- Indices de la tabla `vinos`
--
ALTER TABLE `vinos` ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bebidas`
--
ALTER TABLE `bebidas`
MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 9;

--
-- AUTO_INCREMENT de la tabla `categorias_menu`
--
ALTER TABLE `categorias_menu`
MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 4;

--
-- AUTO_INCREMENT de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 12;

--
-- AUTO_INCREMENT de la tabla `maridajes_plato_vino`
--
ALTER TABLE `maridajes_plato_vino`
MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 5;

--
-- AUTO_INCREMENT de la tabla `menus_degustacion`
--
ALTER TABLE `menus_degustacion`
MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 4;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 7;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 17;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 5;

--
-- AUTO_INCREMENT de la tabla `platos`
--
ALTER TABLE `platos`
MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 23;

--
-- AUTO_INCREMENT de la tabla `platos_menu_degustacion`
--
ALTER TABLE `platos_menu_degustacion`
MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 22;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 5;

--
-- AUTO_INCREMENT de la tabla `vinos`
--
ALTER TABLE `vinos`
MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
ADD CONSTRAINT `detalles_pedido_menu_degustacion_id_foreign` FOREIGN KEY (`menu_degustacion_id`) REFERENCES `menus_degustacion` (`id`) ON DELETE SET NULL,
ADD CONSTRAINT `detalles_pedido_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `detalles_pedido_plato_id_foreign` FOREIGN KEY (`plato_id`) REFERENCES `platos` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `maridajes_plato_vino`
--
ALTER TABLE `maridajes_plato_vino`
ADD CONSTRAINT `maridajes_plato_vino_plato_id_foreign` FOREIGN KEY (`plato_id`) REFERENCES `platos` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `maridajes_plato_vino_vino_id_foreign` FOREIGN KEY (`vino_id`) REFERENCES `vinos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
ADD CONSTRAINT `pedidos_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `platos`
--
ALTER TABLE `platos`
ADD CONSTRAINT `platos_categoria_menu_id_foreign` FOREIGN KEY (`categoria_menu_id`) REFERENCES `categorias_menu` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `platos_menu_degustacion`
--
ALTER TABLE `platos_menu_degustacion`
ADD CONSTRAINT `platos_menu_degustacion_menu_degustacion_id_foreign` FOREIGN KEY (`menu_degustacion_id`) REFERENCES `menus_degustacion` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `platos_menu_degustacion_plato_id_foreign` FOREIGN KEY (`plato_id`) REFERENCES `platos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
ADD CONSTRAINT `reservas_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;
