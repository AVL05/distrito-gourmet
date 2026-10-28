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

### 1. Autenticación SPA con Laravel Sanctum

El frontend utiliza sesiones de primera parte protegidas por Laravel Sanctum:

- La cookie de sesión es `HttpOnly`, por lo que JavaScript no puede leerla.
- Las peticiones mutables exigen token CSRF y envían credenciales de forma explícita.
- La sesión se regenera tras registro o login y se invalida completamente durante logout.
- Los orígenes stateful y CORS se definen por entorno.

### 2. Control de acceso basado en roles (RBAC)

Se ha implementado una lógica de roles diferenciada:

- **Cliente:** acceso limitado a sus propias reservas, pedidos y perfil.
- **Staff:** acceso operativo a las herramientas del día a día de sala/cocina (p. ej. monitor de pedidos), sin alcance sobre la gestión completa del sistema.
- **Administrador:** acceso total a los módulos CRUD de la carta, gestión de usuarios y monitorización global del local.

---

## 🛡️ Protección de la base de datos

### 1. Prevención de inyección SQL

Gracias al uso de **Eloquent ORM**, todas las consultas a la base de datos utilizan sentencias preparadas y vinculación de parámetros (*parameter binding*). Esto reduce el riesgo de inyección SQL; las consultas SQL construidas manualmente requieren revisión y parámetros vinculados.

### 2. Hash de contraseñas

Nunca se almacenan contraseñas en texto plano. Se utiliza el algoritmo de hashing **Bcrypt** (el estándar de Laravel), lo que garantiza que, incluso en el caso improbable de un acceso no autorizado a la base de datos, se almacenen hashes en lugar de contraseñas recuperables. Las contraseñas débiles siguen siendo vulnerables a ataques por diccionario.

---

## 🚦 Validación y sanitización

### 1. Validación en el servidor

Cada petición sensible que llega a la API es validada mediante las reglas de validación de Laravel en los controladores. Se comprueban tipos de datos, longitudes, formatos, estados permitidos, roles válidos, métodos de pago y disponibilidad de los artículos antes de escribir en base de datos.

### 2. Control de origen y API

El frontend consume la API mediante el prefijo `/api` y, en desarrollo, Vite puede proxificar las peticiones hacia Laravel usando `VITE_PROXY_TARGET` en el arranque unificado. Los orígenes concretos se gestionan por entorno y no se hardcodean en el código fuente.

### 3. Rate limiting

Todas las rutas API tienen un límite general de 120 peticiones/minuto por usuario autenticado o IP anónima. Además:

| Operación | Límites |
| --- | --- |
| Login, registro, solicitud y restablecimiento de contraseña | 30/min por IP, 10/min por cuenta normalizada y 5/min por combinación cuenta/IP |
| Contacto | 5/min por IP, independientemente del correo enviado |
| Perfil y actualización administrativa de usuarios | 10/min por usuario (contador compartido) |
| Crear pedidos | 5/min y 30/hora por usuario |
| Crear reservas | 5/min y 20/hora por usuario |

Los límites cuentan también los intentos inválidos, devuelven HTTP 429 y `Retry-After`, y necesitan un almacén de caché compartido en producción (`CACHE_STORE=database` o Redis). No sustituyen un WAF ni la protección de red frente a DDoS.

### 4. Cambios de cuenta y auditoría

Cambiar el correo o la contraseña propios exige `current_password` válido. Nombre y teléfono no requieren esa confirmación. El perfil no permite modificar roles; esa operación sigue limitada al endpoint administrativo. El frontend mantiene el usuario en memoria y ya no persiste el perfil en `localStorage`.

El middleware `SecurityAudit` registra escrituras administrativas exitosas (`security.admin_write`) y rechazos 401/403/429 o login inválido (`security.request_denied`). Solo conserva identificador interno del actor, IP, método, plantilla de ruta y estado HTTP. No registra cuerpos, parámetros de consulta, contraseñas, tokens ni cookies. IP e identificadores siguen siendo datos a proteger; limitar acceso y retención de logs. La configuración de alertas y retención del alojamiento es una tarea operativa, no viene activada por el middleware.

### 5. Proxies y red

Por defecto no se confía en cabeceras reenviadas. Configurar `TRUSTED_PROXIES` según [la guía de despliegue](DEPLOY.md#proxies-alertas-y-recuperación). Docker mantiene MySQL en su red interna y publica el acceso directo del backend solo en loopback. No reutilizar credenciales de prueba en un servidor público.

---

## 📜 Cumplimiento de normativa (RGPD)

- El alojamiento propio y el control de la base de datos no acreditan por sí solos cumplimiento normativo. La documentación legal y el tratamiento real de datos requieren revisión antes de admitir usuarios públicos.
- La carta muestra los alérgenos declarados. La integridad del catálogo y las posibles trazas deben verificarse con el responsable de cocina; no se declara certificación ni cumplimiento automático.

---

## 🔧 Recomendaciones adicionales para producción

Las siguientes prácticas son recomendaciones de hardening estándar de la industria a considerar antes de un despliegue en producción real; no describen necesariamente funcionalidad ya implementada en el proyecto:

- **HTTPS obligatorio:** servir frontend y API exclusivamente bajo TLS (por ejemplo mediante Nginx/Traefik + Let's Encrypt), redirigiendo todo el tráfico HTTP a HTTPS.
- **CORS restrictivo:** limitar los orígenes permitidos en la API al dominio real de producción, evitando configuraciones abiertas (`*`).
- **`APP_DEBUG=false`** en producción, para no exponer trazas de error ni información interna del stack.
- **Gestión de secretos:** mantener `backend/.env` y `frontend/.env` fuera del control de versiones, y rotar credenciales (DB, claves de aplicación) periódicamente.
- **Copias de seguridad:** establecer una política de backups automáticos de la base de datos, con pruebas periódicas de restauración.
- **Expiración y revocación de sesiones:** ajustar `SESSION_LIFETIME` a las necesidades reales y ofrecer al usuario control sobre sesiones activas.
- **Cabeceras de seguridad HTTP:** mantener CSP, protección contra framing, `X-Content-Type-Options`, `Referrer-Policy` y HSTS en el proxy de producción.

---

## 🐛 Reporte de vulnerabilidades

Si detectas una vulnerabilidad de seguridad en Distrito Gourmet, te pedimos que actúes de forma responsable:

1. **No** abras un issue público describiendo el fallo en detalle.
2. Contacta de forma privada con el autor del proyecto indicando una descripción del problema, pasos para reproducirlo y, si es posible, su impacto potencial.
3. Se intentará confirmar la recepción del reporte y dar una valoración inicial en un plazo razonable.

> Al tratarse de un Proyecto de Fin de Ciclo (PFC) académico, este proceso de reporte es informal; en un contexto de producción real se recomienda formalizarlo con un canal y SLA definidos (por ejemplo, una dirección de contacto dedicada a seguridad).
