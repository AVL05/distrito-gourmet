# Mejoras de producto — 12 de octubre de 2026

## Estado posterior al arranque local completo

El modo público de demostración está desactivado de forma permanente. La aplicación consulta Laravel y utiliza sesiones reales. `npm start` crea una SQLite temporal aislada con catálogo y cuentas iniciales; las tres contraseñas son `password`. El proxy de Vite mantiene `/api` y `/sanctum` en el origen de la web para evitar el fallo CSRF entre localhost y 127.0.0.1.

Validaciones posteriores realizadas: 11 tests frontend, lint y build correctos; 18 tests backend y Pint correctos. Se comprobó el login mediante navegador con acceso al área personal y la eliminación de la base temporal al detener. Los recuentos y pruebas de demostración más abajo son evidencia histórica de las etapas anteriores.

El objetivo visual es una experiencia gastronómica cuidada: carta tipográfica sin fotos, cabecera sin enlaces duplicados y mensajes orientados al cliente. No se afirma reconocimiento Michelin ni aprobación de producción. Para publicación siguen pendientes configuración real, sustitución de credenciales iniciales, datos legales/contacto, auditoría frontend y verificaciones operativas indicadas en este documento.

## Revisión posterior de experiencia de usuario

Cabecera sin enlaces duplicados y hero con altura dinámica de pantalla contando la cabecera. Retirada la leyenda bajo la imagen de portada por petición del usuario; la procedencia se conserva en ASSETS.md.

Simplificados los recorridos del cliente: «Ver carrito», «Elegir recogida» y «Confirmar pedido»; productos y cantidades visibles antes de confirmar, pago en efectivo explícito y aviso de demostración antes de intentar enviar. Reservas muestra hora local y disponibilidad útil sin ocupación interna; el historial usa el título «Mis reservas» y explica el estado pendiente. Retiradas métricas de gasto y distintivos de miembro; la cuenta describe únicamente los datos que se pueden editar. Perfil incorpora etiquetas asociadas, autocompletado y regreso a la cuenta; registro muestra el requisito de contraseña antes de escribir. Los errores de servidor no muestran mensajes internos.

Validación de esta revisión: lint y build PASS; 10 tests frontend PASS, incluido el nuevo test de mensajes de error. Navegador local en demostración: filtro para llevar, añadir plato, carrito y título del historial de reservas a 390 px. No se repitieron operaciones autenticadas ni envío real en esta revisión; siguen aplicándose los límites operativos descritos abajo.

Implementación local e incremental sobre React/JavaScript y Laravel. Sin publicación, commit ni cambio de rama.

## Cambios implementados

- Calendario compartido de servicios, cierres configurables y validación de fechas y horas en servidor. La disponibilidad real nunca utiliza datos de demostración como recuperación de errores.
- Aforo compartido por servicio, con bloqueo transaccional estable al crear y confirmar reservas. Las reservas pendientes no consumen plazas confirmadas.
- Historial de reservas propias y cancelación de reservas futuras, con autorización de propietario en servidor.
- Pedidos con precios autoritativos, recogida validada, pago en el local y transiciones de estado controladas. El timeout de siete segundos se limita a consultas GET.
- Notificaciones de reservas y pedidos en cola, con migraciones para la cola y su registro de fallos.
- Recuperación del destino y borrador de reserva tras iniciar sesión; carrito resistente a datos corruptos y almacenamiento bloqueado.
- Estados de carga, vacío, error y reintento; búsqueda y filtros de alérgenos y disponibilidad para llevar en la carta.
- Navegación de escritorio, gestión de foco y teclado, contenido cerrado inerte, enlace para saltar al contenido, contraste y movimiento reducido.
- Portada simplificada, fotografías existentes optimizadas y nueva ilustración del pulpo a la brasa con parmentier trufado. La carta permanece sin fotografías. Procedencia y prompt en [ASSETS.md](ASSETS.md).
- Actualizaciones compatibles de dependencias y eliminación de plugins de Tailwind no utilizados.

## Validación realizada

| Comprobación | Resultado |
| --- | --- |
| Frontend lint | PASS |
| Frontend tests | PASS: 9 tests |
| Frontend build | PASS |
| Laravel tests | PASS: 17 tests, 83 assertions |
| Pint | PASS |
| Composer audit --locked | PASS: sin avisos |
| Listado de rutas API | PASS: 49 rutas |
| git diff --check | PASS |
| Auditoría frontend | FAIL: 7 entradas, 5 altas y 2 moderadas |

Verificación manual en navegador local: búsqueda y filtros sin imágenes en la carta, navegación por teclado, cierre con Escape, retorno desde login con borrador, reserva y cancelación propias, pedido con precio calculado por servidor e historial. Datos sintéticos en SQLite aislado; sin modificar datos reales. Carta móvil comprobada a 390 px: ancho del documento 390 px y cero imágenes dentro de `main`. Movimiento reducido comprobado sin Lenis activo.

Capturas de evidencia: [portada](screenshots/home-desktop.jpg) y [carta móvil](screenshots/menu-mobile.jpg). Son capturas de viewport, no de página completa.

## Límites y puesta en servicio

Los avisos restantes afectan a `braces`, `chokidar`, `fast-glob`, `micromatch`, `postcss-nested`, `postcss-selector-parser` y `tailwindcss` en el árbol de herramientas de Tailwind 3. No se suprimen ni se declara limpia la auditoría. La solución automática propone Tailwind 4, una migración que requiere alcance propio.

No se ha ejecutado concurrencia real sobre MySQL ni entrega SMTP de correo ni verificación en producción. Las pruebas cubren capacidad y persistencia de notificaciones en cola, pero no sustituyen esas comprobaciones operativas.

Antes de publicar: aplicar las dos nuevas migraciones, revisar calendario/cierres, configurar SMTP y ejecutar el worker de cola. Instrucciones en [DEPLOY.md](DEPLOY.md). Los pedidos nuevos se pagan en el local; no existe procesamiento de pagos online. Confirmar los datos de contacto y legales del restaurante antes de uso real.

Los archivos preexistentes `docs/plans/2026-10-12-product-hardening.md` y `pnpm-lock.yaml` no forman parte de esta implementación ni se han modificado.
