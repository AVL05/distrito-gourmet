# Manual de usuario - Distrito Gourmet

Este manual describe los flujos principales de uso para clientes, staff y administradores. La disponibilidad exacta de cada opcion depende del rol asignado al usuario autenticado.

## Roles

| Rol | Alcance |
| --- | --- |
| Visitante | Consulta carta, disponibilidad y formulario de contacto |
| Cliente | Gestiona su perfil, reservas y pedidos |
| Staff | Acceso operativo segun permisos configurados |
| Administrador | Gestion completa de carta, reservas, pedidos, usuarios y metricas |

## Uso como visitante

### Consultar carta

1. Acceder a la seccion de carta.
2. Revisar platos, vinos, bebidas y menus degustacion.
3. Consultar informacion visible de cada producto: nombre, descripcion, precio, disponibilidad y datos relevantes como alergenos cuando esten disponibles.

### Consultar disponibilidad

1. Abrir el flujo de reserva.
2. Seleccionar una fecha.
3. Revisar turnos disponibles y ocupacion.

La disponibilidad es orientativa hasta completar la reserva con usuario autenticado.

### Enviar una consulta

1. Abrir el formulario de contacto.
2. Introducir nombre, email, asunto y mensaje.
3. Enviar el formulario.

El sistema devuelve una referencia de contacto para trazabilidad.

## Uso como cliente

### Registro

1. Acceder a la pantalla de registro.
2. Introducir nombre, email, telefono y contrasena.
3. Confirmar el formulario.

Tras el registro, el usuario recibe un token de sesion y puede operar como cliente.

### Inicio y cierre de sesion

1. Acceder a login.
2. Introducir email y contrasena.
3. Entrar en el area privada.
4. Usar la opcion de cerrar sesion al terminar, especialmente en dispositivos compartidos.

### Gestion de perfil

Desde el area privada, el cliente puede revisar y actualizar sus datos personales permitidos por la aplicacion. Los cambios se guardan en el backend y se aplican a futuras reservas o pedidos.

### Crear una reserva

1. Iniciar sesion.
2. Abrir el modulo de reservas.
3. Seleccionar fecha y hora.
4. Indicar numero de comensales.
5. Elegir menu degustacion si procede.
6. Anadir peticiones especiales, alergias o comentarios para sala.
7. Confirmar la reserva.

Estados posibles:

| Estado | Significado |
| --- | --- |
| `Confirmada` | La reserva entra dentro de la capacidad disponible |
| `Pendiente` | Requiere revision, normalmente por superar capacidad del turno |
| `Cancelada` | La reserva ha sido cancelada desde administracion |

Reglas actuales:

- Maximo 8 comensales por reserva.
- Capacidad operativa de 44 comensales por turno.
- Las reservas que superan capacidad se crean como pendientes.

### Crear un pedido takeaway

1. Iniciar sesion.
2. Anadir productos disponibles al carrito.
3. Revisar cantidades y contenido del pedido.
4. Seleccionar fecha y hora de recogida.
5. Elegir metodo de pago disponible.
6. Confirmar pedido.

Estados habituales del pedido:

| Estado | Significado |
| --- | --- |
| `Pendiente` | Pedido recibido |
| `Preparando` | Cocina esta trabajando en el pedido |
| `Listo` | Pedido preparado para recogida |
| `Entregado` | Pedido finalizado |
| `Cancelado` | Pedido cancelado |

Los importes se calculan desde la carta guardada en base de datos. Si cambia el precio o la disponibilidad, prevalece la informacion del backend.

## Uso como administrador

El panel de administracion requiere iniciar sesion con un usuario con rol `Administrador`.

### Dashboard

El dashboard resume informacion operativa:

- Pedidos activos.
- Reservas pendientes.
- Proximas reservas.
- Cubiertos del dia.
- Capacidad.
- Ticket medio.
- Platos mas vendidos.
- Ocupacion por turno.

Estos indicadores ayudan a priorizar gestion diaria, pero no sustituyen la revision de los listados detallados.

### Gestion de carta

El administrador puede gestionar:

- Platos.
- Vinos.
- Bebidas.
- Menus degustacion.

Buenas practicas:

- Mantener nombres claros y consistentes.
- Revisar precios antes de publicar.
- Marcar como no disponible aquello que no pueda servirse.
- Comprobar alergenos y descripciones antes de poner productos visibles.
- Probar cambios de carta en un entorno no productivo cuando sean masivos.

### Gestion de reservas

Acciones disponibles:

- Ver todas las reservas.
- Cambiar estado a `Pendiente`, `Confirmada` o `Cancelada`.
- Eliminar reservas cuando proceda.
- Revisar peticiones especiales del cliente.

Antes de confirmar reservas pendientes, comprobar ocupacion del turno y capacidad real del servicio.

### Gestion de pedidos

Acciones disponibles:

- Ver todos los pedidos.
- Actualizar estado operativo.
- Eliminar pedidos cuando proceda.

Flujo recomendado:

1. `Pendiente`: pedido recibido.
2. `Preparando`: cocina acepta el pedido.
3. `Listo`: pedido preparado.
4. `Entregado`: cliente recoge el pedido.

Usar `Cancelado` cuando el pedido no pueda completarse.

### Gestion de usuarios

El administrador puede:

- Listar usuarios.
- Crear usuarios.
- Editar datos permitidos.
- Cambiar roles segun reglas de la aplicacion.
- Eliminar usuarios, salvo su propio usuario administrador.

Cambiar roles afecta directamente al acceso al panel y a operaciones protegidas, por lo que debe hacerse con criterio.

## Recomendaciones operativas

- Revisar reservas pendientes al inicio y mitad de cada servicio.
- Mantener la carta actualizada antes de abrir pedidos takeaway.
- Evitar eliminar datos historicos si se necesitan para metricas o seguimiento.
- Cerrar sesion al terminar tareas administrativas.
- No compartir credenciales entre varios usuarios.

## Incidencias comunes

| Situacion | Accion recomendada |
| --- | --- |
| No puedo iniciar sesion | Revisar email/contrasena y solicitar restablecimiento si aplica |
| Una reserva queda pendiente | Revisar capacidad del turno desde administracion |
| Un producto no aparece en carta | Comprobar disponibilidad y datos del elemento en administracion |
| El pedido muestra otro total | El backend recalcula importes desde catalogo actualizado |
| No veo el panel admin | Confirmar que el usuario tiene rol `Administrador` |
