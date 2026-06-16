# Documentacion de API - Distrito Gourmet

Esta documentacion describe la API REST expuesta por el backend Laravel. Todas las rutas se sirven bajo el prefijo `/api`.

## Convenciones

| Aspecto | Valor |
| --- | --- |
| Base path | `/api` |
| Formato | JSON |
| Autenticacion | Bearer token emitido por Laravel Sanctum |
| Cabecera autenticada | `Authorization: Bearer {token}` |
| Content-Type | `application/json` |

En despliegues donde frontend y backend comparten dominio, el frontend debe consumir rutas relativas bajo `/api`. En desarrollo con Vite y Laravel en origenes separados, configura `VITE_API_URL` en `frontend/.env` con el origen del backend, sin incluir el sufijo `/api`.

## Credenciales de prueba

Estas credenciales dependen de los seeders disponibles en el entorno.

| Rol | Email | Contrasena |
| --- | --- | --- |
| Administrador | `admin@distritogourmet.com` | `password` |
| Cliente | `cliente@distritogourmet.com` | `vA391878` |
| Staff | `alex@distritogourmet.com` | `vA391878` |

No utilices estas credenciales en produccion.

## Autenticacion

### Registrar usuario

```http
POST /api/register
```

Body:

```json
{
  "nombre": "Nuevo Cliente",
  "email": "nuevo.cliente@example.com",
  "password": "password",
  "telefono": "+34 600 000 000"
}
```

Respuesta `201 Created`:

```json
{
  "token": "1|token...",
  "usuario": {
    "id": 4,
    "nombre": "Nuevo Cliente",
    "rol": "Cliente"
  }
}
```

### Iniciar sesion

```http
POST /api/login
```

Body:

```json
{
  "email": "admin@distritogourmet.com",
  "password": "password"
}
```

Respuesta `200 OK`:

```json
{
  "token": "1|token...",
  "usuario": {
    "id": 1,
    "nombre": "Admin Michelin",
    "rol": "Administrador"
  }
}
```

Las rutas `POST /api/register`, `POST /api/login` y `POST /api/contact` aplican rate limit mediante el middleware `throttle:auth`.

### Cerrar sesion

```http
POST /api/logout
Authorization: Bearer {token}
```

Respuesta `200 OK`:

```json
{
  "mensaje": "Sesion cerrada correctamente"
}
```

### Obtener usuario autenticado

```http
GET /api/user
Authorization: Bearer {token}
```

### Actualizar perfil propio

```http
PUT /api/profile
Authorization: Bearer {token}
```

## Rutas publicas

### Obtener carta completa

```http
GET /api/dishes
```

Devuelve un objeto agrupado con platos, vinos, bebidas y menus degustacion.

```json
{
  "platos": [],
  "vinos": [],
  "bebidas": [],
  "menus_degustacion": []
}
```

### Consultar disponibilidad de reservas

```http
GET /api/reservation-availability?date=2026-06-20
```

Respuesta `200 OK`:

```json
{
  "date": "2026-06-20",
  "capacity": 44,
  "turns": [
    {
      "time": "21:00",
      "time_value": "21:00:00",
      "occupied": 12,
      "available_seats": 32,
      "capacity": 44,
      "status": "available"
    }
  ]
}
```

Estados posibles de turno:

| Estado | Significado |
| --- | --- |
| `available` | Hay plazas suficientes |
| `limited` | Quedan pocas plazas disponibles |
| `complete` | El turno esta completo |

### Enviar contacto

```http
POST /api/contact
```

Body:

```json
{
  "name": "Laura Martinez",
  "email": "laura@example.com",
  "subject": "Evento privado",
  "message": "Consulta para una mesa de grupo."
}
```

Respuesta `201 Created`:

```json
{
  "mensaje": "Consulta recibida correctamente",
  "contact": {
    "reference": "DG-C-20260616-A1B2C3",
    "subject": "Evento privado"
  }
}
```

## Reservas

Requieren autenticacion.

### Listar mis reservas

```http
GET /api/reservations
Authorization: Bearer {token}
```

### Crear reserva

```http
POST /api/reservations
Authorization: Bearer {token}
```

Body:

```json
{
  "fecha_reserva": "2026-06-20",
  "hora_reserva": "21:00",
  "comensales": 2,
  "menu_degustacion_id": 2,
  "peticiones_especiales": "Celebracion aniversario"
}
```

Respuesta `201 Created`:

```json
{
  "mensaje": "Reserva confirmada correctamente",
  "reserva": {
    "codigo_reserva": "A3F7BC2D",
    "estado": "Confirmada"
  }
}
```

Reglas relevantes:

- `comensales` acepta valores de 1 a 8.
- Los turnos validos se controlan desde las reglas de reserva del backend.
- La capacidad operativa actual es de 44 comensales por turno.
- Si la reserva supera la capacidad del turno, se crea en estado `Pendiente`.

## Pedidos

Requieren autenticacion.

### Crear pedido

```http
POST /api/orders
Authorization: Bearer {token}
```

Body:

```json
{
  "metodo_pago": "card",
  "fecha_recogida": "2026-06-20",
  "hora_recogida": "14:30",
  "articulos": [
    {
      "db_id": 5,
      "tipo_item": "plato",
      "nombre": "Solomillo de Vaca Madurada",
      "cantidad": 1
    }
  ]
}
```

Valores validos:

| Campo | Valores |
| --- | --- |
| `tipo_item` | `plato`, `vino`, `bebida`, `menu_degustacion` |
| `metodo_pago` | `card`, `cash`, `paypal` |

El backend calcula precios y total desde el catalogo persistido. No se debe confiar en importes enviados desde cliente.

### Listar mis pedidos

```http
GET /api/orders
Authorization: Bearer {token}
```

## Administracion

Todas las rutas bajo `/api/admin` requieren autenticacion y rol `Administrador`.

### Metricas

```http
GET /api/admin/metrics
Authorization: Bearer {token}
```

Respuesta:

```json
{
  "active_orders": 3,
  "pending_reservations": 2,
  "upcoming_reservations": 12,
  "today_seats": 18,
  "capacity": 44,
  "average_ticket": 39.25,
  "top_dishes": [{ "name": "Arroz meloso de setas", "units": 6 }],
  "turn_occupancy": [{ "time": "21:00", "occupied": 18, "capacity": 44 }]
}
```

### Reservas

```http
GET    /api/admin/reservations
PATCH  /api/admin/reservations/{id}
DELETE /api/admin/reservations/{id}
```

Body para cambio de estado:

```json
{
  "estado": "Confirmada"
}
```

Estados validos: `Pendiente`, `Confirmada`, `Cancelada`.

### Pedidos

```http
GET    /api/admin/orders
PATCH  /api/admin/orders/{id}
DELETE /api/admin/orders/{id}
```

Body para cambio de estado:

```json
{
  "estado": "Preparando"
}
```

Estados validos: `Pendiente`, `Preparando`, `Listo`, `Entregado`, `Cancelado`.

### Usuarios

```http
GET    /api/admin/users
POST   /api/admin/users
PUT    /api/admin/users/{id}
DELETE /api/admin/users/{id}
```

Roles validos: `Administrador`, `Cliente`, `Staff`.

Un administrador no puede eliminar su propio usuario.

### Carta

```http
POST   /api/admin/dishes
PUT    /api/admin/dishes/{id}
DELETE /api/admin/dishes/{id}

GET    /api/admin/wines
POST   /api/admin/wines
PUT    /api/admin/wines/{id}
DELETE /api/admin/wines/{id}

GET    /api/admin/beverages
POST   /api/admin/beverages
PUT    /api/admin/beverages/{id}
DELETE /api/admin/beverages/{id}

GET    /api/admin/tasting-menus
POST   /api/admin/tasting-menus
PUT    /api/admin/tasting-menus/{id}
DELETE /api/admin/tasting-menus/{id}
```

Nota: `GET /api/dishes` es la ruta publica agregada para consultar la carta completa. Los listados administrativos separados de vinos, bebidas y menus degustacion estan protegidos.

## Codigos de respuesta

| Codigo | Significado |
| --- | --- |
| `200` | Peticion correcta |
| `201` | Recurso creado |
| `401` | Token ausente, invalido o sesion no autenticada |
| `403` | Usuario autenticado sin permisos suficientes |
| `404` | Recurso no encontrado |
| `422` | Error de validacion |
| `429` | Limite de intentos alcanzado |
| `500` | Error interno del servidor |

## Buenas practicas de consumo

- Mantener el token fuera del codigo fuente y limpiar credenciales al cerrar sesion.
- Centralizar el cliente HTTP del frontend para adjuntar `Authorization`.
- Usar rutas relativas `/api` cuando la aplicacion se sirve tras el mismo dominio.
- Mostrar al usuario los errores de validacion `422` de forma especifica.
- No enviar totales calculados por cliente como fuente de verdad para pedidos.
