# Product hardening implementation plan

**Goal:** Aplicar la revisión de fiabilidad, diseño y funcionalidades manteniendo una carta formal sin fotos.
**Architecture:** Cambios incrementales en los servicios Laravel y las vistas React existentes. Calendario configurable compartido por reservas y recogidas; Sanctum y demo de solo lectura conservados.
**Tech Stack:** Laravel 12, React 19, JavaScript, Zustand, Tailwind, GSAP.

## 1. Reservas, calendario y avisos
- Añadir pruebas de cierres, horas pasadas, aforo al confirmar, cancelación propia y aislamiento entre usuarios en `backend/tests/Feature/RestaurantOperationsTest.php`.
- Centralizar horario y festivos en `backend/config/restaurant.php` y `backend/app/Services/RestaurantSchedule.php`.
- Serializar cambios de reservas mediante bloqueo transaccional de una fila estable compartida, incluida la primera reserva del turno; conservar reservas pendientes cuando no cabe el grupo.
- Añadir cancelación propia antes del turno y notificaciones Laravel tras confirmar cambios.
- Ejecutar `php artisan test`, rutas y Pint desde backend; documentar contrato y configuración.

## 2. Pedidos y persistencia frontend
- Probar pago en local, transiciones y rechazo de horarios inválidos en backend.
- Probar carrito inválido, almacenamiento bloqueado y filtros mediante Node test runner existente.
- Actualizar consumidores de estados, evitar mensajes de cobro, mantener reintento de errores.
- Conservar destino y borrador de reserva al autenticarse, sin almacenar tokens.

## 3. Experiencia y carta
- Añadir reservas propias al dashboard, con carga, vacío, error y cancelación confirmada.
- Añadir búsqueda, filtros de alérgenos y takeaway en `MenuView.jsx`; conservar carta tipográfica sin imágenes.
- Corregir disponibilidad simulada fuera de demo y errores de recogida.
- Probar lógica y revisar comportamiento en navegador.

## 4. Diseño y accesibilidad
- Mantener paleta y tipografía existentes; simplificar inicio, reducir marquesinas, mostrar navegación de escritorio.
- Crear una imagen gastronómica para inicio, guardar activo local y optimizar fotografías y favicon preservando originales.
- Gestionar foco, menú cerrado, reducción de movimiento, desbordamiento y enlaces de contacto.
- Revisar escritorio 1440 y móvil 390, teclado y estados de fallo.

## 5. Cierre
- Actualizar API, manual y despliegue con calendario, pago local y correo.
- Ejecutar lint, tests, build, auditorías frontend/backend, Laravel tests, Pint y rutas.
- Revisar diff y cobertura de todas las mejoras. Sin commit, push, PR ni despliegue.
