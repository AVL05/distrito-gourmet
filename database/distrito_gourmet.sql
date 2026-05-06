-- =====================================================
-- DISTRITO GOURMET
-- Esquema profesional para TFG DAW
-- Arquitectura SQL optimizada para restaurante premium
-- =====================================================

CREATE DATABASE IF NOT EXISTS distrito_gourmet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE distrito_gourmet;

-- =====================================================
-- TABLA: USUARIOS
-- =====================================================

CREATE TABLE usuarios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'staff', 'client') DEFAULT 'client',
    telefono VARCHAR(50) NULL,
    alergias TEXT NULL,
    preferencias TEXT NULL,
    es_vip BOOLEAN DEFAULT FALSE,
    email_verificado_a TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    creado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: CATEGORIAS_MENU
-- =====================================================

CREATE TABLE categorias_menu (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NULL,
    orden_visualizacion INT DEFAULT 0,
    creado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO
    categorias_menu (
        nombre,
        descripcion,
        orden_visualizacion
    )
VALUES (
        'Entrantes',
        'Para abrir el apetito.',
        1
    ),
    (
        'Principales',
        'Los protagonistas.',
        2
    ),
    (
        'Postres',
        'El broche final.',
        3
    );

-- =====================================================
-- TABLA: PLATOS
-- =====================================================

CREATE TABLE platos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NULL,
    descripcion TEXT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    categoria_menu_id BIGINT UNSIGNED NULL,
    alergenos VARCHAR(255) NULL,
    disponible BOOLEAN DEFAULT TRUE,
    visible_en_carta BOOLEAN DEFAULT TRUE,
    visible_en_degustacion BOOLEAN DEFAULT TRUE,
    disponible_para_llevar BOOLEAN DEFAULT TRUE,
    es_por_unidad BOOLEAN DEFAULT FALSE,
    maximo_por_pedido INT DEFAULT 999,
    CONSTRAINT fk_platos_categoria FOREIGN KEY (categoria_menu_id) REFERENCES categorias_menu (id) ON DELETE SET NULL
);

-- =====================================================
-- TABLA: MENUS_DEGUSTACION
-- =====================================================

CREATE TABLE menus_degustacion (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NULL,
    descripcion TEXT NULL,
    imagen VARCHAR(255) NULL,
    precio DECIMAL(10, 2) NOT NULL,
    precio_maridaje DECIMAL(10, 2) NULL,
    pasos INT NOT NULL,
    duracion_estimada_minutos INT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    alternativa_vegetariana BOOLEAN DEFAULT FALSE,
    menu_de_temporada BOOLEAN DEFAULT FALSE,
    creado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: PLATOS_MENU_DEGUSTACION
-- =====================================================

CREATE TABLE platos_menu_degustacion (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    menu_degustacion_id BIGINT UNSIGNED NOT NULL,
    plato_id BIGINT UNSIGNED NOT NULL,
    numero_paso INT NOT NULL,
    tamaño_porcion ENUM(
        'Snack',
        'Pequeño',
        'Medio',
        'Completo'
    ) DEFAULT 'Pequeño',
    notes TEXT NULL,
    creado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_platos_menu_deg_menu FOREIGN KEY (menu_degustacion_id) REFERENCES menus_degustacion (id) ON DELETE CASCADE,
    CONSTRAINT fk_platos_menu_deg_plato FOREIGN KEY (plato_id) REFERENCES platos (id) ON DELETE CASCADE
);

-- =====================================================
-- TABLA: VINOS
-- =====================================================

CREATE TABLE vinos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    bodega VARCHAR(255) NULL,
    añada VARCHAR(50) NULL,
    pais VARCHAR(100) NULL,
    region VARCHAR(100) NULL,
    uva VARCHAR(100) NULL,
    tipo ENUM(
        'Tinto',
        'Blanco',
        'Rosado',
        'Espumoso',
        'Dulce'
    ) NOT NULL,
    notas_maridaje TEXT NULL,
    descripcion TEXT NULL,
    imagen VARCHAR(255) NULL,
    porcentaje_alcohol DECIMAL(4, 2) NULL,
    temperatura_servicio VARCHAR(50) NULL,
    precio_botella DECIMAL(10, 2) NULL,
    precio_copa DECIMAL(10, 2) NULL,
    disponible BOOLEAN DEFAULT TRUE,
    destacado BOOLEAN DEFAULT FALSE,
    maximo_por_pedido INT DEFAULT 999,
    creado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: BEBIDAS
-- =====================================================

CREATE TABLE bebidas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NULL,
    tipo ENUM(
        'agua',
        'refresco',
        'cocktail',
        'cafe'
    ) NOT NULL,
    imagen VARCHAR(255) NULL,
    precio DECIMAL(10, 2) NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    destacado BOOLEAN DEFAULT FALSE,
    creado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: MESAS
-- =====================================================

CREATE TABLE mesas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero_mesa VARCHAR(50) NOT NULL UNIQUE,
    capacidad INT NOT NULL,
    zona VARCHAR(100) DEFAULT 'Salón Principal',
    estado ENUM(
        'Libre',
        'Reservada',
        'Ocupada',
        'Mantenimiento'
    ) DEFAULT 'Libre',
    esta_activo BOOLEAN DEFAULT TRUE,
    creado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: RESERVAS
-- =====================================================

CREATE TABLE reservas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT UNSIGNED NOT NULL,
    mesa_id BIGINT UNSIGNED NULL,
    codigo_reserva VARCHAR(100) UNIQUE NULL,
    fecha_reserva DATE NULL,
    hora_reserva TIME NULL,
    comensales INT DEFAULT 1,
    menu_degustacion_id BIGINT UNSIGNED NULL,
    estado ENUM(
        'Pendiente',
        'Confirmada',
        'Cancelada'
    ) DEFAULT 'Pendiente',
    peticiones_especiales TEXT NULL,
    creado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_reservas_mesa FOREIGN KEY (mesa_id) REFERENCES mesas (id) ON DELETE SET NULL
);

-- =====================================================
-- TABLA: PEDIDOS
-- =====================================================

CREATE TABLE pedidos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT UNSIGNED NOT NULL,
    numero_pedido VARCHAR(100) UNIQUE NULL,
    estado ENUM(
        'Pendiente',
        'Preparando',
        'Listo',
        'Entregado',
        'Cancelado'
    ) DEFAULT 'Pendiente',
    tipo_pedido ENUM(
        'Sala',
        'Takeaway',
        'Delivery'
    ) DEFAULT 'Sala',
    subtotal DECIMAL(10, 2) DEFAULT 0,
    impuestos DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) DEFAULT 0,
    direccion TEXT NULL,
    creado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

-- =====================================================
-- TABLA: DETALLES_PEDIDO
-- =====================================================

CREATE TABLE detalles_pedido (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT UNSIGNED NOT NULL,
    plato_id BIGINT UNSIGNED NULL,
    vino_id BIGINT UNSIGNED NULL,
    bebida_id BIGINT UNSIGNED NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NULL,
    precio_total DECIMAL(10, 2) NULL,
    creado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_detalles_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
    CONSTRAINT fk_detalles_plato FOREIGN KEY (plato_id) REFERENCES platos (id) ON DELETE SET NULL
);

-- =====================================================
-- TABLA: AJUSTES
-- =====================================================

CREATE TABLE ajustes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    clave VARCHAR(255) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    creado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_a TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- POBLADO DE DATOS (Demo Profesional)
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Categorías
INSERT INTO
    categorias_menu (
        id,
        nombre,
        descripcion,
        orden_visualizacion
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

-- Bebidas
INSERT INTO
    bebidas (
        nombre,
        descripcion,
        tipo,
        precio,
        destacado
    )
VALUES (
        'Agua Mineral Natural',
        'Agua de manantial premium 75cl.',
        'agua',
        4.50,
        FALSE
    ),
    (
        'San Pellegrino',
        'Agua mineral italiana con gas.',
        'agua',
        6.00,
        TRUE
    ),
    (
        'Coca-Cola Original',
        'Formato premium 33cl.',
        'refresco',
        4.00,
        FALSE
    ),
    (
        'Limonada de la Casa',
        'Limón, hierbabuena y miel de azahar.',
        'refresco',
        6.00,
        TRUE
    ),
    (
        'Espresso Martini',
        'Vodka, licor de café y espresso.',
        'cocktail',
        14.00,
        TRUE
    ),
    (
        'Negroni Clásico',
        'Gin, Campari y vermut rojo.',
        'cocktail',
        14.00,
        TRUE
    ),
    (
        'Cappuccino',
        'Espresso doble con leche texturizada.',
        'cafe',
        4.50,
        FALSE
    ),
    (
        'Té Matcha Ceremonial',
        'Preparado con chasen tradicional.',
        'cafe',
        6.00,
        TRUE
    );

-- Vinos
INSERT INTO
    vinos (
        id,
        nombre,
        bodega,
        añada,
        pais,
        region,
        uva,
        tipo,
        notas_maridaje,
        precio_botella,
        precio_copa,
        destacado
    )
VALUES (
        1,
        'Pago de Carraovejas',
        'Pago de Carraovejas',
        '2021',
        'España',
        'Ribera del Duero',
        'Tempranillo',
        'Tinto',
        'Perfecto para carnes rojas.',
        48.00,
        9.00,
        TRUE
    ),
    (
        2,
        'Vega Sicilia Único 2011',
        'Vega Sicilia',
        '2011',
        'España',
        'Ribera del Duero',
        'Tempranillo',
        'Tinto',
        'Ideal para experiencias premium.',
        495.00,
        NULL,
        TRUE
    ),
    (
        3,
        'Albariño Pazo Señorans',
        'Pazo de Señorans',
        '2022',
        'España',
        'Rías Baixas',
        'Albariño',
        'Blanco',
        'Excelente con pescados y marisco.',
        26.00,
        6.00,
        TRUE
    ),
    (
        4,
        'Godello Guímaro',
        'Guímaro',
        '2022',
        'España',
        'Ribeira Sacra',
        'Godello',
        'Blanco',
        'Mineral y elegante.',
        22.00,
        5.50,
        FALSE
    ),
    (
        5,
        'Moët & Chandon Imperial',
        'Moët & Chandon',
        'NV',
        'Francia',
        'Champagne',
        'Chardonnay',
        'Espumoso',
        'Ideal para celebraciones.',
        65.00,
        NULL,
        TRUE
    ),
    (
        6,
        'Miraval Rosé',
        'Miraval',
        '2022',
        'Francia',
        'Provence',
        'Syrah y Garnacha',
        'Rosado',
        'Ligero y floral.',
        28.00,
        6.50,
        FALSE
    );

-- Platos
INSERT INTO
    platos (
        id,
        nombre,
        slug,
        descripcion,
        precio,
        categoria_menu_id,
        alergenos,
        disponible,
        visible_en_carta,
        visible_en_degustacion,
        disponible_para_llevar,
        es_por_unidad,
        maximo_por_pedido
    )
VALUES (
        1,
        'Croqueta Cremosa de Jamón Ibérico',
        'croqueta-jamon-iberico',
        'Bechamel infusionada en hueso de jamón de bellota 100% ibérico, rebozada en panko artesano.',
        3.00,
        1,
        'Gluten, Lácteos, Huevo',
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
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
        TRUE,
        TRUE,
        TRUE,
        FALSE,
        FALSE,
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
        TRUE,
        TRUE,
        TRUE,
        FALSE,
        FALSE,
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
        TRUE,
        TRUE,
        TRUE,
        FALSE,
        FALSE,
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
        TRUE,
        TRUE,
        TRUE,
        FALSE,
        FALSE,
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
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        FALSE,
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
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        FALSE,
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
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        FALSE,
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
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        FALSE,
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
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        15
    );

-- Menús Degustación
INSERT INTO
    menus_degustacion (
        id,
        nombre,
        slug,
        descripcion,
        precio,
        precio_maridaje,
        pasos,
        duracion_estimada_minutos,
        disponible,
        alternativa_vegetariana,
        menu_de_temporada
    )
VALUES (
        1,
        'Menú Ejecutivo',
        'menu-ejecutivo',
        'Menú contemporáneo diseñado para servicio de mediodía.',
        39.00,
        18.00,
        3,
        60,
        TRUE,
        TRUE,
        FALSE
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
        TRUE,
        TRUE,
        TRUE
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
        TRUE,
        FALSE,
        TRUE
    );

-- Mesas
INSERT INTO
    mesas (
        numero_mesa,
        capacidad,
        zona,
        estado
    )
VALUES ('1', 2, 'Ventanales', 'Libre'),
    ('2', 4, 'Ventanales', 'Libre'),
    (
        '3',
        2,
        'Salón Principal',
        'Libre'
    ),
    (
        '4',
        4,
        'Salón Principal',
        'Libre'
    ),
    (
        'CT',
        6,
        'Chef''s Table',
        'Libre'
    );

-- Usuarios
INSERT INTO
    usuarios (
        id,
        nombre,
        email,
        password,
        rol,
        telefono,
        es_vip
    )
VALUES (
        1,
        'Admin Michelin',
        'admin@distritogourmet.com',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'admin',
        '+34 600 000 000',
        FALSE
    ),
    (
        2,
        'Cliente VIP',
        'vip@distritogourmet.com',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'client',
        '+34 611 111 111',
        TRUE
    );

-- Ajustes
INSERT INTO
    ajustes (clave, valor)
VALUES (
        'restaurant_name',
        'Distrito Gourmet'
    ),
    (
        'restaurant_phone',
        '+34 960 000 000'
    ),
    (
        'restaurant_email',
        'info@distritogourmet.com'
    ),
    ('takeaway_enabled', 'true'),
    (
        'reservations_enabled',
        'true'
    );

SET FOREIGN_KEY_CHECKS = 1;
