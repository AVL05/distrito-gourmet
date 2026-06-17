# Seguridad y Protección de Datos — Distrito Gourmet 🛡️

La seguridad es un pilar fundamental en el desarrollo de **Distrito Gourmet**. Se han implementado múltiples capas de protección siguiendo los estándares actuales de la industria para garantizar la integridad de los datos y la privacidad de los usuarios.

---

## 📑 Índice

- [Autenticación y autorización](#-autenticación-y-autorización)
- [Protección de la base de datos](#-protección-de-la-base-de-datos)
- [Validación y sanitización](#-validación-y-sanitización)
- [Cumplimiento de normativa (RGPD)](#-cumplimiento-de-normativa-rgpd)
- [Recomendaciones adicionales para producción](#-recomendaciones-adicionales-para-producción)
- [Reporte de vulnerabilidades](#-reporte-de-vulnerabilidades)

---

## 🔐 Autenticación y autorización

### 1. Autenticación stateless (Laravel Sanctum)

En lugar de sesiones tradicionales por cookies, el sistema utiliza **tokens de portador (Bearer Tokens)**:

- Los tokens son únicos por sesión y se almacenan de forma segura en el cliente.
- Permiten una comunicación desacoplada y segura entre el frontend (React) y el backend (Laravel).

### 2. Control de acceso basado en roles (RBAC)

Se ha implementado una lógica de roles diferenciada:

- **Cliente:** acceso limitado a sus propias reservas, pedidos y perfil.
- **Staff:** acceso operativo a las herramientas del día a día de sala/cocina (p. ej. monitor de pedidos), sin alcance sobre la gestión completa del sistema.
- **Administrador:** acceso total a los módulos CRUD de la carta, gestión de usuarios y monitorización global del local.

---

## 🛡️ Protección de la base de datos

### 1. Prevención de inyección SQL

Gracias al uso de **Eloquent ORM**, todas las consultas a la base de datos utilizan sentencias preparadas y vinculación de parámetros (*parameter binding*). Esto hace que sea técnicamente imposible realizar ataques de inyección SQL a través de los formularios de la aplicación.

### 2. Cifrado de contraseñas

Nunca se almacenan contraseñas en texto plano. Se utiliza el algoritmo de hashing **Bcrypt** (el estándar de Laravel), lo que garantiza que, incluso en el caso improbable de un acceso no autorizado a la base de datos, las credenciales de los usuarios permanezcan cifradas y sean ilegibles.

---

## 🚦 Validación y sanitización

### 1. Validación en el servidor

Cada petición sensible que llega a la API es validada mediante las reglas de validación de Laravel en los controladores. Se comprueban tipos de datos, longitudes, formatos, estados permitidos, roles válidos, métodos de pago y disponibilidad de los artículos antes de escribir en base de datos.

### 2. Control de origen y API

El frontend consume la API mediante el prefijo `/api` y, en desarrollo, Vite puede proxificar las peticiones hacia Laravel usando `VITE_API_URL`. Los orígenes concretos se gestionan por entorno y no se hardcodean en el código fuente.

### 3. Rate limiting

Las rutas públicas de autenticación (`/api/login` y `/api/register`) aplican límite de intentos por email/IP para reducir abuso por fuerza bruta.

---

## 📜 Cumplimiento de normativa (RGPD)

- **Soberanía de datos:** a diferencia de las plataformas de terceros, el restaurante es el único dueño de su base de datos, cumpliendo con el principio de control sobre la información de carácter personal.
- **Información nutricional:** el sistema incluye la gestión obligatoria de **alérgenos**, cumpliendo con la normativa europea de información alimentaria.

---

## 🔧 Recomendaciones adicionales para producción

Las siguientes prácticas son recomendaciones de hardening estándar de la industria a considerar antes de un despliegue en producción real; no describen necesariamente funcionalidad ya implementada en el proyecto:

- **HTTPS obligatorio:** servir frontend y API exclusivamente bajo TLS (por ejemplo mediante Nginx/Traefik + Let's Encrypt), redirigiendo todo el tráfico HTTP a HTTPS.
- **CORS restrictivo:** limitar los orígenes permitidos en la API al dominio real de producción, evitando configuraciones abiertas (`*`).
- **`APP_DEBUG=false`** en producción, para no exponer trazas de error ni información interna del stack.
- **Gestión de secretos:** mantener `backend/.env` y `frontend/.env` fuera del control de versiones, y rotar credenciales (DB, claves de aplicación) periódicamente.
- **Copias de seguridad:** establecer una política de backups automáticos de la base de datos, con pruebas periódicas de restauración.
- **Expiración y revocación de tokens:** revisar la configuración de expiración de los tokens de Sanctum y ofrecer al usuario la posibilidad de revocar sesiones activas.
- **Cabeceras de seguridad HTTP:** considerar cabeceras como `Content-Security-Policy`, `X-Content-Type-Options` y `Strict-Transport-Security` a nivel de proxy/Nginx.

---

## 🐛 Reporte de vulnerabilidades

Si detectas una vulnerabilidad de seguridad en Distrito Gourmet, te pedimos que actúes de forma responsable:

1. **No** abras un issue público describiendo el fallo en detalle.
2. Contacta de forma privada con el autor del proyecto indicando una descripción del problema, pasos para reproducirlo y, si es posible, su impacto potencial.
3. Se intentará confirmar la recepción del reporte y dar una valoración inicial en un plazo razonable.

> Al tratarse de un Proyecto de Fin de Ciclo (PFC) académico, este proceso de reporte es informal; en un contexto de producción real se recomienda formalizarlo con un canal y SLA definidos (por ejemplo, una dirección de contacto dedicada a seguridad).
