# Manual de Usuario — Distrito Gourmet 📖

Bienvenido a la guía de uso de **Distrito Gourmet**. Esta plataforma está diseñada para ofrecer una experiencia sencilla tanto a comensales como al personal del restaurante, diferenciando tres perfiles de acceso: **Cliente**, **Staff** y **Administrador**.

---

## 📑 Índice

- [Perfil del Cliente](#-perfil-del-cliente)
- [Perfil de Staff (sala/cocina)](#-perfil-de-staff-salacocina)
- [Panel de Administración](#-panel-de-administración)
- [Preguntas frecuentes](#-preguntas-frecuentes)

---

## 👤 Perfil del Cliente

### 1. Registro e inicio de sesión

Para realizar reservas o pedidos, el usuario debe crear una cuenta en la menú → «Crear cuenta». Una vez logueado, podrá acceder a su historial personal de reservas y pedidos.

### 2. Carta interactiva

- **Exploración:** en la sección "Carta", el usuario puede visualizar platos, menús degustación, bodega y bar.
- **Filtros:** la carta agrupa el contenido por secciones para facilitar la navegación.
- **Selección:** los productos disponibles para recogida pueden añadirse al carrito.

### 3. Reservas de mesa

- El cliente selecciona la fecha y hora deseada entre los turnos disponibles.
- **Disponibilidad:** la web muestra las horas disponibles para el número de comensales. Una solicitud pendiente todavía no confirma la mesa; un administrador solo puede confirmarla si queda aforo en el servicio.
- **Preferencias:** el cliente puede indicar alergias, celebraciones u observaciones para el equipo de sala.
- El cliente puede consultar el estado de sus reservas (`Pendiente`, `Confirmada`, `Cancelada`) desde su área personal.

### 4. Pedidos online (takeaway)

- Los platos se añaden al carrito de compra.
- El usuario selecciona la hora de recogida.
- El pedido queda registrado en su área personal y su estado se actualiza a medida que cocina lo va preparando (`Pendiente` → `Preparando` → `Listo` → `Entregado`).

---

## 🍽️ Perfil de Staff (sala/cocina)

El personal de sala y cocina dispone de un acceso operativo más ligero que el del Administrador, pensado para el día a día del servicio:

- **Monitor de pedidos:** interfaz optimizada para cocina donde se actualiza el estado de los pedidos cuando se consulta o actualiza la vista, sin necesidad de acceder a la gestión completa de la carta o de usuarios.
- **Consulta de reservas del turno:** visión rápida de las reservas confirmadas y pendientes para organizar la sala.

> El alcance exacto de los permisos de Staff puede ampliarse en el futuro; revisa la [documentación técnica](../Documentacion.md) si necesitas el detalle de los permisos actuales por rol.

---

## 🔐 Panel de Administración

El personal del restaurante con privilegios de **Administrador** accede a la gestión completa del negocio.

### 1. Gestión de la carta (CRUD)

- **Añadir/editar platos:** permite modificar precios, descripciones, alérgenos y disponibilidad.
- **Bodega y bar:** control de vinos, bebidas, precios y disponibilidad.
- **Menús degustación:** configuración de los "pasos" que componen el menú.

### 2. Control operativo

- **Dashboard:** vista rápida de reservas, pedidos, cubiertos e importes de pedidos.
- **Gestión de reservas:** el administrador puede cambiar el estado de las reservas (confirmar/cancelar) y gestionar las peticiones especiales de los clientes.
- **Monitor de pedidos:** interfaz optimizada para cocina donde se actualiza el estado de los pedidos cuando se consulta o actualiza la vista.
- **Gestión de usuarios:** edición de datos y roles de los usuarios registrados (un administrador no puede eliminar su propia cuenta).

### 3. Configuración del local

- Los horarios y el límite de aforo (44 comensales) se definen en `backend/config/restaurant.php`.
- Cambios de horario o capacidad requieren ajuste técnico en la aplicación.

---

## ❓ Preguntas frecuentes

**¿Por qué mi reserva aparece como "Pendiente" en vez de "Confirmada"?**
Ocurre cuando el turno elegido ya está cerca del límite de aforo (44 comensales). La mesa no está confirmada. Consulte su estado en «Mis reservas» antes de acudir; la confirmación depende de que quede aforo.

**¿Puedo modificar un pedido después de enviarlo?**
Actualmente no es posible editar un pedido ya creado desde el área de cliente; si necesitas un cambio, contacta directamente con el restaurante a través del formulario de contacto.

**¿Qué pasa si llego más tarde de mi turno reservado?**
La plataforma no gestiona automáticamente los retrasos; te recomendamos avisar al restaurante directamente si vas a llegar tarde.

**¿Cómo sé si mi pedido takeaway ya está listo para recoger?**
El estado de tu pedido se actualiza en tu área personal cuando se consulta o actualiza la vista (`Pendiente` → `Preparando` → `Listo` → `Entregado`).


## Mejoras de navegación y operaciones

- La carta mantiene una presentación formal sin fotos. Puede buscar por nombre o descripción, excluir un alérgeno declarado y mostrar platos para llevar. Los filtros se conservan en la URL. La ausencia de información no acredita la ausencia de alérgenos; consulte las trazas con sala.
- La portada incluye una ilustración generada del pulpo a la brasa con parmentier trufado, basada en el catálogo. No es una fotografía de un plato servido.
- Si necesita iniciar sesión durante una reserva o pedido, vuelve al flujo original. El borrador de reserva se conserva durante esa navegación, sin guardar contraseñas ni tokens.
- `Reservas → Mis reservas` y el área personal muestran sus reservas, código y estado. Puede cancelar una reserva propia antes de su inicio; la acción pide confirmación y conserva el historial.
- Las horas se muestran en `Europe/Madrid`. Lunes y cenas de domingo están cerrados en el calendario inicial; los cierres puntuales también se excluyen. Si falla una consulta de disponibilidad, use **Reintentar**; no se sustituye la disponibilidad por datos inventados.
- Confirme el pedido y pague al recogerlo en el local. La confirmación no cobra tarjeta ni PayPal. Su cuenta muestra el estado del pedido; podrá recibir avisos si el operador configura el correo y el worker.
- La aplicación utiliza la API y sesiones reales. Para pruebas locales, `npm start` crea una base temporal con las tres cuentas iniciales y contraseña `password`; los cambios se pierden al reiniciar.

Configuración técnica del calendario y correo: [DEPLOY.md](DEPLOY.md#calendario-y-avisos-por-correo).
