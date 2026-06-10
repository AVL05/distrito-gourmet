# Documentación API — Distrito Gourmet

> Base URL: `/api` cuando frontend y backend comparten dominio. En desarrollo con Vite separado, configurar `VITE_API_URL` y usar `{VITE_API_URL}/api`.
> Autenticación: **Bearer Token** (Laravel Sanctum)

---

## Autenticación

### Credenciales de prueba

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
> `POST /api/register` y `POST /api/login` tienen rate limit de 5 intentos por minuto por email/IP.

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
**Reglas:** máximo 8 comensales por reserva; horarios permitidos `13:00`, `13:30`, `14:00`, `14:30`, `20:00`, `20:30`, `21:00`, `21:30`; si la ocupación supera **44 comensales en el mismo turno**, el estado será `"Pendiente"` en lugar de `"Confirmada"`.

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
**Valores válidos para `tipo_item`:** `plato` · `vino` · `bebida` · `menu_degustacion`
**Valores válidos para `metodo_pago`:** `card` · `cash` · `paypal`
> El backend ignora `precio` y `total` enviados por cliente; calcula importes desde el catálogo disponible.

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
**Roles válidos:** `Administrador`, `Cliente`, `Staff`. Un administrador no puede eliminar su propio usuario.

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

---

## Códigos de Respuesta

| Código | Significado |
|---|---|
| `200` | OK — Petición correcta |
| `201` | Created — Recurso creado |
| `401` | Unauthorized — Token ausente o inválido |
| `403` | Forbidden — Usuario sin permisos suficientes |
| `429` | Too Many Requests — Rate limit alcanzado |
| `422` | Unprocessable — Error de validación |
| `500` | Server Error — Error interno del servidor |
