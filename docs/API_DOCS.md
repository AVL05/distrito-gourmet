# Documentación de la API — Distrito Gourmet

<p align="center">
  <img alt="API" src="https://img.shields.io/badge/API-RESTful-009688">
  <img alt="Auth" src="https://img.shields.io/badge/Auth-Laravel%20Sanctum-FF2D20">
  <img alt="Formato" src="https://img.shields.io/badge/Formato-JSON-yellow">
</p>

## 📑 Índice

- [Convenciones generales](#convenciones-generales)
- [Índice rápido de endpoints](#índice-rápido-de-endpoints)
- [Autenticación](#autenticación)
- [Carta (público)](#carta-público--sin-autenticación)
- [Disponibilidad de reservas](#disponibilidad-de-reservas)
- [Contacto](#contacto)
- [Reservas](#reservas)
- [Pedidos](#pedidos)
- [Administración](#administración-requiere-rol-administrador)
- [Códigos de respuesta y manejo de errores](#-códigos-de-respuesta-y-manejo-de-errores)

---

## Convenciones generales

| Aspecto | Detalle |
|---|---|
| **Base URL** | `/api` cuando frontend y backend comparten dominio. En desarrollo con Vite separado, configurar `VITE_API_URL` y usar `{VITE_API_URL}/api`. |
| **Formato** | `Content-Type: application/json` en peticiones y respuestas. |
| **Autenticación** | Bearer Token (Laravel Sanctum) en el header `Authorization: Bearer {token}` para las rutas protegidas. |
| **Idioma** | Mensajes de respuesta en castellano. |
| **Fechas** | Formato `YYYY-MM-DD`. |
| **Horas** | Formato `HH:MM` (24h). |
| **Paginación** | No aplica en los endpoints actuales; las listas se devuelven completas. |

> 💡 Las rutas bajo `/api/admin/*` requieren, además del token válido, que el usuario autenticado tenga el rol `Administrador`.

---

## Índice rápido de endpoints

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/register` | ❌ | Registro de nuevo usuario |
| `POST` | `/api/login` | ❌ | Inicio de sesión |
| `POST` | `/api/logout` | ✅ | Cierre de sesión |
| `GET` | `/api/user` | ✅ | Usuario autenticado |
| `GET` | `/api/dishes` | ❌ | Carta completa (platos, vinos, bebidas, menús) |
| `GET` | `/api/reservation-availability` | ❌ | Disponibilidad de turnos por fecha |
| `POST` | `/api/contact` | ❌ | Envío de consulta de contacto |
| `GET` | `/api/reservations` | ✅ | Listado de mis reservas |
| `POST` | `/api/reservations` | ✅ | Crear reserva |
| `GET` | `/api/orders` | ✅ | Listado de mis pedidos |
| `POST` | `/api/orders` | ✅ | Crear pedido |
| `GET` `PATCH` `DELETE` | `/api/admin/reservations[/{id}]` | 🔒 Admin | Gestión de reservas |
| `GET` `PATCH` `DELETE` | `/api/admin/orders[/{id}]` | 🔒 Admin | Gestión de pedidos |
| `GET` `PUT` `DELETE` | `/api/admin/users[/{id}]` | 🔒 Admin | Gestión de usuarios |
| `GET` `POST` `PUT` `DELETE` | `/api/admin/dishes[/{id}]` | 🔒 Admin | CRUD de platos |
| `GET` `POST` `PUT` `DELETE` | `/api/admin/wines[/{id}]` | 🔒 Admin | CRUD de vinos |
| `GET` `POST` `PUT` `DELETE` | `/api/admin/beverages[/{id}]` | 🔒 Admin | CRUD de bebidas |
| `GET` `POST` `PUT` `DELETE` | `/api/admin/tasting-menus[/{id}]` | 🔒 Admin | CRUD de menús degustación |
| `GET` | `/api/admin/metrics` | 🔒 Admin | KPIs del panel de administración |

---

## Autenticación

### Credenciales de prueba

> ⚠️ Estas credenciales son exclusivamente para **entorno de desarrollo/demo**. No deben usarse ni existir en un entorno de producción real.

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@distritogourmet.com` | `password` |
| Cliente | `cliente@distritogourmet.com` | `vA391878` |
| Staff | `alex@distritogourmet.com` | `vA391878` |

### Registro

```
POST /api/register
```

**Body:**

```json
{
  "nombre": "Nuevo Cliente",
  "email": "nuevo.cliente@example.com",
  "password": "password",
  "telefono": "+34 600 000 000"
}
```

**Respuesta:** `201 Created`

```json
{
  "token": "1|xxxx...",
  "usuario": { "id": 4, "nombre": "Nuevo Cliente", "rol": "Cliente" }
}
```

---

### Login

```
POST /api/login
```

**Body:**

```json
{
  "email": "admin@distritogourmet.com",
  "password": "password"
}
```

**Respuesta:** `200 OK`

```json
{
  "token": "1|xxxx...",
  "usuario": { "id": 1, "nombre": "Admin Michelin", "rol": "Administrador" }
}
```

> 🔒 `POST /api/register` y `POST /api/login` tienen un **rate limit de 5 intentos por minuto** por email/IP.

---

### Logout

```
POST /api/logout
Authorization: Bearer {token}
```

**Respuesta:** `200 OK`

```json
{ "mensaje": "Sesión cerrada correctamente" }
```

---

### Usuario autenticado

```
GET /api/user
Authorization: Bearer {token}
```

---

## Carta (Público — sin autenticación)

### Obtener carta completa

```
GET /api/dishes
```

Devuelve platos, vinos, bebidas y menús degustación en un solo objeto:

```json
{
  "platos": [...],
  "vinos": [...],
  "bebidas": [...],
  "menus_degustacion": [...]
}
```

---

## Disponibilidad de reservas

### Consultar turnos de una fecha

```
GET /api/reservation-availability?date=2026-06-20
```

**Respuesta:** `200 OK`

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

**Estados de turno:** `available` · `limited` · `complete`.

---

## Contacto

### Enviar consulta

```
POST /api/contact
```

**Body:**

```json
{
  "name": "Laura Martínez",
  "email": "laura@example.com",
  "subject": "Evento privado",
  "message": "Consulta para una mesa de grupo."
}
```

**Respuesta:** `201 Created`

```json
{
  "mensaje": "Consulta recibida correctamente",
  "contact": {
    "reference": "DG-C-20260616-A1B2C3",
    "subject": "Evento privado"
  }
}
```

---

## Reservas

### Listar mis reservas

```
GET /api/reservations
Authorization: Bearer {token}
```

---

### Crear reserva

```
POST /api/reservations
Authorization: Bearer {token}
```

**Body:**

```json
{
  "fecha_reserva": "2026-06-20",
  "hora_reserva": "21:00",
  "comensales": 2,
  "menu_degustacion_id": 2,
  "peticiones_especiales": "Celebración aniversario"
}
```

**Respuesta:** `201 Created`

```json
{
  "mensaje": "Reserva confirmada correctamente",
  "reserva": {
    "codigo_reserva": "A3F7BC2D",
    "estado": "Confirmada"
  }
}
```

**Reglas de negocio:**

- Máximo **8 comensales** por reserva.
- Horarios permitidos: `13:00`, `13:30`, `14:00`, `14:30`, `20:00`, `20:30`, `21:00`, `21:30`.
- Si la ocupación supera **44 comensales en el mismo turno**, el estado será `"Pendiente"` en lugar de `"Confirmada"`.

---

## Pedidos

### Crear pedido

```
POST /api/orders
Authorization: Bearer {token}
```

**Body:**

```json
{
  "metodo_pago": "card",
  "hora_recogida": "14:30",
  "fecha_recogida": "2026-06-15",
  "articulos": [
    {
      "db_id": 5,
      "tipo_item": "plato",
      "nombre": "Solomillo de Vaca Madurada",
      "cantidad": 1
    },
    {
      "db_id": 1,
      "tipo_item": "vino",
      "nombre": "Pago de Carraovejas",
      "cantidad": 1
    }
  ]
}
```

| Campo | Valores válidos |
|---|---|
| `tipo_item` | `plato` · `vino` · `bebida` · `menu_degustacion` |
| `metodo_pago` | `card` · `cash` · `paypal` |

> ⚠️ El backend **ignora** `precio` y `total` enviados por el cliente; el importe se calcula siempre desde el catálogo disponible en servidor, evitando manipulación de precios desde el frontend.

---

### Listar mis pedidos

```
GET /api/orders
Authorization: Bearer {token}
```

---

## Administración (Requiere rol Administrador)

### Reservas

```
GET    /api/admin/reservations          → Todas las reservas ordenadas por estado
PATCH  /api/admin/reservations/{id}     → Cambiar estado
DELETE /api/admin/reservations/{id}     → Eliminar reserva
```

**Estados válidos:** `Pendiente`, `Confirmada`, `Cancelada`.

### Pedidos

```
GET    /api/admin/orders                → Todos los pedidos
PATCH  /api/admin/orders/{id}           → Cambiar estado: Pendiente → Preparando → Listo → Entregado
DELETE /api/admin/orders/{id}           → Eliminar pedido
```

**Body para cambio de estado:**

```json
{ "estado": "Preparando" }
```

### Usuarios

```
GET    /api/admin/users                 → Listado de usuarios
PUT    /api/admin/users/{id}            → Actualizar datos de usuario
DELETE /api/admin/users/{id}            → Eliminar usuario
```

**Roles válidos:** `Administrador`, `Cliente`, `Staff`.

> ⚠️ Un administrador **no puede eliminar su propio usuario**, como medida de seguridad para evitar bloqueos accidentales del panel.

### Carta (CRUD completo)

```
POST   /api/admin/dishes                → Crear plato
PUT    /api/admin/dishes/{id}           → Editar plato
DELETE /api/admin/dishes/{id}           → Eliminar plato

GET    /api/admin/wines                 → Listado de vinos
POST   /api/admin/wines                 → Crear vino
PUT    /api/admin/wines/{id}            → Editar vino
DELETE /api/admin/wines/{id}            → Eliminar vino

GET    /api/admin/beverages             → Listado de bebidas
POST   /api/admin/beverages             → Crear bebida
PUT    /api/admin/beverages/{id}        → Editar bebida
DELETE /api/admin/beverages/{id}        → Eliminar bebida

GET    /api/admin/tasting-menus         → Listado de menús degustación
POST   /api/admin/tasting-menus         → Crear menú degustación
PUT    /api/admin/tasting-menus/{id}    → Editar menú degustación
DELETE /api/admin/tasting-menus/{id}    → Eliminar menú degustación
```

### Métricas

```
GET /api/admin/metrics
```

Devuelve KPIs para el panel:

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

---

## ⚠️ Códigos de respuesta y manejo de errores

| Código | Significado |
|---|---|
| `200` | OK — Petición correcta |
| `201` | Created — Recurso creado |
| `401` | Unauthorized — Token ausente o inválido |
| `403` | Forbidden — Usuario sin permisos suficientes |
| `422` | Unprocessable Entity — Error de validación |
| `429` | Too Many Requests — Rate limit alcanzado |
| `500` | Server Error — Error interno del servidor |

### Formato típico de error de validación (`422`)

Laravel devuelve los errores de validación agrupados por campo:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["El campo email es obligatorio."],
    "comensales": ["El número de comensales no puede superar 8."]
  }
}
```

### Formato típico de error de autenticación/autorización (`401` / `403`)

```json
{
  "message": "No autenticado."
}
```
