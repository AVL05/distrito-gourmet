# Seguridad y presentación: plan de implementación

> **For agentic workers:** Use executing-plans or the LOCAL SPECIALIST ROUTER. All delegated agents must execute sequentially, one at a time.

**Goal:** Reducir abuso de la API y cambios de cuenta no autorizados, actualizar dependencias vulnerables y mejorar el primer contacto con el restaurante.

**Architecture:** Mantener React/JavaScript, Zustand, Axios y Laravel/Sanctum. Reutilizar validación, límites y logs de Laravel, componentes y fotografías existentes. Trabajar en la rama actual, sin commit, push ni despliegue.

**Tech Stack:** React 19, Vite 7, Tailwind, Laravel 12, PHP 8.2+, MySQL/SQLite.

## Contrato de diseño aprobado

- Identidad editorial gastronómica en verde, crema y dorado; tipografías existentes.
- Foto del pulpo en portada y reserva como acción principal; sin inventar platos, reseñas o métricas.
- Navegación explícita en escritorio; menú móvil con cierre, foco y teclado conservados.
- Alérgenos y límites legibles, sin atenuación; imágenes solo cuando corresponden al plato.
- Conservar filtros, carrito, estados de carga/error, rutas y movimiento reducido.

## 1. Dependencias

Actualizar `symfony/http-foundation` dentro de la rama compatible y los paquetes afectados del frontend sin cambiar de versión mayor. Conservar manifiestos y lockfiles coherentes. Ejecutar ambas auditorías, lint, tests y build.

## 2. Protección de la API

Archivos: `AppServiceProvider`, `bootstrap/app.php`, rutas API, configuración y middleware de auditoría.

Escribir primero regresiones en `backend/tests/Feature/SecurityHardeningTest.php`: emails rotativos, contacto, recuperación, operaciones autenticadas e IP reenviada no confiable. Añadir límites independientes por IP/cuenta, un límite general y límites de escritura. No registrar cuerpos, cookies, tokens ni correos. Registrar cambios administrativos y bloqueos con ruta parametrizada e identificador interno.

## 3. Cuenta

Archivos: `AuthController`, `UsuarioController`, `ProfileView`, pruebas y API docs.

Probar que email/contraseña propios no cambian sin contraseña actual válida; permitir actualizar nombre/teléfono sin ella. Mantener gestión administrativa de otros usuarios y permisos. Validar tipos antes de normalizar el login, eliminar persistencia innecesaria del perfil en localStorage y mostrar errores de campo sin perder el formulario.

## 4. Infraestructura

Archivos: `docker-compose.yml`, configuración de proxies, `.env.example`, `docs/DEPLOY.md` y `docs/SECURITY.md`.

Mantener MySQL en red interna y acceso directo de desarrollo al backend solo en loopback. Hacer explícitos los proxies de confianza por entorno. Documentar configuración requerida en Render, copias cifradas, restauración aislada y alertas a partir de logs. No cambiar servicios externos ni credenciales.

## 5. Presentación

Archivos: `HomeView`, `Navbar`, `MenuView`. Implementación delegada a un único agente, con revisión posterior. Validación en navegador local a 1440 y 390 px, navegación, filtros y consola.

## 6. Verificación y límites

Ejecutar `php artisan test`, Pint, route list, Composer audit y frontend lint/tests/build/audit. Validar Compose si Docker está disponible. Capturar portada final y revisar diff/secretos. Informar de comandos bloqueados sin atribuirles éxito.

El despliegue, WAF externo, alertas operativas, rotación de credenciales y restauración real se entregan como tareas de operación pendientes. MFA requiere un flujo completo de alta/recuperación y se mantiene como siguiente incremento; no se añade criptografía propia ni se bloquea a administradores existentes.

## Resultado verificado

- Backend: 37 tests, 331 assertions, todos PASS usando SQLite; Pint PASS y listado de rutas ejecutado. Las regresiones nuevas se comprobaron fallando antes de implementar las correcciones.
- Frontend: lint PASS, 12 tests PASS, build PASS. Ambas auditorías de dependencias sin avisos conocidos al ejecutarlas.
- Actualizaciones: Symfony HTTP Foundation 7.4.21, Axios 1.21.0, Vite 7.3.7, follow-redirects 1.16.2 y Zod 4.6.7, sin añadir dependencias directas.
- Compose: `docker compose config --quiet` PASS usando valores de validación para interpolar las contraseñas. Build/arranque de contenedores y `nginx -t` BLOCKED: Docker Desktop no está activo. No se cambió su configuración.
- Navegador local: portada a 1440 y 390 px sin desbordamiento horizontal; navegación explícita de escritorio, menú móvil con Escape y retorno de foco, búsqueda de pulpo, exclusión de moluscos/estado vacío, limpiar filtros, añadir al carrito, login con cuenta ficticia y actualización de nombre sin contraseña. Las imágenes existentes cargan y no se observaron errores de consola en los recorridos comprobados. No se midieron Core Web Vitals ni se hizo una auditoría WCAG completa.
- Se utilizó una base temporal fuera del repositorio, sin enviar correo ni tocar datos de producción. El directorio temporal inválido del PHP local se evitó configurando TEMP/TMP y `sys_temp_dir` solo en los procesos de validación.
- La revisión final mantiene roles, CSRF y demo desactivada según el comportamiento actual. La validación local no incluye aprobación de producción; la publicación y comprobación de los despliegues se realizan por separado.
