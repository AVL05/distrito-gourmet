# Seguridad y proteccion de datos - Distrito Gourmet

Este documento resume las medidas de seguridad aplicadas, las buenas practicas esperadas en despliegue y los riesgos que deben revisarse antes de usar la aplicacion en un entorno real.

## Modelo de seguridad

Distrito Gourmet separa responsabilidades entre:

- Frontend React: interfaz de usuario y consumo de API.
- Backend Laravel: autenticacion, autorizacion, validacion y reglas de negocio.
- Base de datos MySQL: persistencia de usuarios, carta, reservas y pedidos.

La seguridad critica debe residir en backend. El frontend puede mejorar la experiencia, pero no debe considerarse una barrera de seguridad.

## Autenticacion

La API utiliza Laravel Sanctum con tokens Bearer.

Flujo general:

1. El usuario se registra o inicia sesion.
2. El backend valida credenciales.
3. Laravel emite un token.
4. El frontend adjunta `Authorization: Bearer {token}` en rutas protegidas.
5. El logout invalida el token actual.

Buenas practicas:

- No incluir tokens en URLs.
- No guardar tokens en codigo fuente.
- Cerrar sesion en dispositivos compartidos.
- Rotar credenciales de prueba antes de cualquier despliegue publico.

## Autorizacion y roles

El sistema diferencia roles:

| Rol | Permisos principales |
| --- | --- |
| Cliente | Gestion de sus reservas, pedidos y perfil |
| Staff | Acceso operativo segun reglas configuradas |
| Administrador | Gestion global de usuarios, carta, reservas, pedidos y metricas |

Las rutas administrativas estan bajo `/api/admin` y requieren autenticacion mas middleware de rol administrador.

Controles relevantes:

- Un usuario no administrador no debe acceder a rutas de administracion.
- Un administrador no puede eliminar su propio usuario administrador.
- Los cambios de rol deben hacerse solo desde contexto administrativo.

## Validacion de entrada

Las operaciones sensibles validan datos en servidor mediante reglas Laravel:

- Registro y login.
- Contacto.
- Reservas.
- Pedidos.
- Cambios de estado.
- Gestion de carta.
- Gestion de usuarios.

Ejemplos de reglas de negocio aplicadas en backend:

- Maximo 8 comensales por reserva.
- Capacidad de 44 comensales por turno.
- Estados permitidos para reservas y pedidos.
- Tipos de item permitidos en pedidos.
- Metodos de pago permitidos.
- Recalculo de importes desde catalogo persistido.

El cliente no es fuente de verdad para precios, totales, roles ni permisos.

## Proteccion de datos

### Contrasenas

Las contrasenas se almacenan hasheadas mediante el mecanismo estandar de Laravel. Nunca deben guardarse ni registrarse en texto plano.

### Base de datos

Laravel Eloquent y el query builder usan consultas parametrizadas, reduciendo el riesgo de inyeccion SQL cuando se evitan consultas raw inseguras.

Buenas practicas:

- Evitar concatenar datos de usuario en SQL manual.
- Revisar permisos del usuario MySQL.
- No reutilizar credenciales de desarrollo en produccion.
- Mantener backups cifrados si contienen datos personales.

### Datos personales

El sistema trata datos como nombre, email, telefono, reservas, pedidos y posibles peticiones especiales. Esos campos pueden contener informacion personal o sensible.

Recomendaciones:

- Definir politica de retencion de datos.
- Limitar acceso administrativo a personal autorizado.
- Evitar incluir datos personales en logs.
- Documentar proceso de borrado o anonimizado si aplica.
- Informar al usuario sobre tratamiento de datos en una politica de privacidad.

## Configuracion por entorno

Valores sensibles y dependientes del entorno deben vivir en `.env`.

No hardcodear:

- Origenes de API.
- IPs LAN.
- URLs locales.
- Credenciales.
- Tokens.
- Webhooks.

En produccion:

```env
APP_ENV=production
APP_DEBUG=false
```

Tambien se deben revisar:

- `APP_KEY`.
- Credenciales `DB_*`.
- Configuracion de correo.
- Webhooks externos.
- Politica CORS si se sirve frontend y backend desde origenes distintos.

## Rate limiting

Las rutas publicas de autenticacion y contacto aplican `throttle:auth`.

Objetivo:

- Reducir abuso por fuerza bruta.
- Limitar automatismos sobre formularios publicos.
- Proteger recursos de API ante trafico repetitivo.

Si el proyecto se expone publicamente, conviene revisar limites por entorno y combinarlo con protecciones de infraestructura cuando proceda.

## Seguridad en pedidos y reservas

### Pedidos

- El backend recalcula precios desde base de datos.
- El cliente no controla el total final.
- Los estados se restringen a valores permitidos.
- La administracion controla el avance operativo del pedido.

### Reservas

- El backend valida fecha, hora, comensales y capacidad.
- Las reservas que exceden capacidad quedan pendientes.
- Las canceladas no deben contar como ocupacion activa.

## Cabeceras, HTTPS y proxy

Para despliegues publicos:

- Servir siempre bajo HTTPS.
- Terminar TLS en proxy inverso o proveedor gestionado.
- Revisar cabeceras de seguridad en Nginx/proxy.
- Evitar exponer directamente servicios internos como MySQL.
- Mantener `/api` correctamente proxificado hacia Laravel.

Cabeceras recomendables a nivel proxy:

- `Strict-Transport-Security`.
- `X-Content-Type-Options`.
- `X-Frame-Options` o `Content-Security-Policy` con `frame-ancestors`.
- `Referrer-Policy`.
- `Content-Security-Policy` adaptada a los recursos reales de la app.

## Dependencias y mantenimiento

Buenas practicas:

- Mantener Composer y npm actualizados.
- Revisar alertas de seguridad de dependencias.
- Ejecutar build y tests antes de desplegar.
- Evitar dependencias innecesarias.
- Registrar cambios relevantes en documentacion.

Comandos utiles:

```bash
composer audit
npm audit --prefix frontend
npm --prefix frontend run build
cd backend && php artisan test
```

## Checklist antes de produccion

- `APP_DEBUG=false`.
- Credenciales reales y robustas.
- Seeders de demo no expuestos como usuarios reales.
- HTTPS activo.
- Backups definidos y probados.
- Logs sin datos sensibles.
- Politica de privacidad preparada.
- CORS/proxy revisado.
- Rutas admin protegidas.
- Tests y smoke test ejecutados.

## Riesgos pendientes

| Riesgo | Impacto | Mitigacion recomendada |
| --- | --- | --- |
| Uso de credenciales demo | Acceso no autorizado | Rotar usuarios y contrasenas antes de publicar |
| Falta de recuperacion de contrasena | Soporte manual | Implementar flujo seguro de reset |
| Configuracion estatica de capacidad/horarios | Cambios requieren despliegue | Mover reglas operativas a configuracion administrable |
| Logs con datos personales | Riesgo de privacidad | Revisar contenido de logs y niveles por entorno |
| Sin auditoria admin completa | Menor trazabilidad | Registrar acciones criticas de administracion |
