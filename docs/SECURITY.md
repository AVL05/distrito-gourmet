# Seguridad y Protección de Datos — Distrito Gourmet 🛡️

La seguridad es un pilar fundamental en el desarrollo de **Distrito Gourmet**. Se han implementado múltiples capas de protección siguiendo los estándares actuales de la industria para garantizar la integridad de los datos y la privacidad de los usuarios.

---

## 🔐 Autenticación y Autorización

### 1. Autenticación Stateless (Laravel Sanctum)
En lugar de sesiones tradicionales por cookies, el sistema utiliza **tokens de portador (Bearer Tokens)**. 
- Los tokens son únicos por sesión y se almacenan de forma segura en el cliente.
- Permite una comunicación desacoplada y segura entre el Frontend (React) y el Backend (Laravel).

### 2. Control de Acceso basado en Roles (RBAC)
Se ha implementado una lógica de roles diferenciada:
- **Cliente:** Acceso limitado a sus propias reservas, pedidos y perfil.
- **Administrador:** Acceso total a los módulos CRUD de la carta, gestión de usuarios y monitorización global del local.

---

## 🛡️ Protección de la Base de Datos

### 1. Prevención de Inyección SQL
Gracias al uso de **Eloquent ORM**, todas las consultas a la base de datos utilizan sentencias preparadas y vinculación de parámetros (*parameter binding*). Esto hace que sea técnicamente imposible realizar ataques de inyección SQL a través de los formularios de la aplicación.

### 2. Cifrado de Contraseñas
Nunca se almacenan contraseñas en texto plano. Se utiliza el algoritmo de hashing **Bcrypt** (el estándar de Laravel), lo que garantiza que, incluso en el caso improbable de un acceso no autorizado a la base de datos, las credenciales de los usuarios permanezcan cifradas y sean ilegibles.

---

## 🚦 Validación y Sanitización

### 1. Validación en el Servidor
Cada petición sensible que llega a la API es validada mediante las reglas de validación de Laravel en los controladores. Se comprueban tipos de datos, longitudes, formatos, estados permitidos, roles válidos, métodos de pago y disponibilidad de los artículos antes de escribir en base de datos.

### 2. Control de Origen y API
El frontend consume la API mediante el prefijo `/api` y, en desarrollo, Vite puede proxificar las peticiones hacia Laravel usando `VITE_API_URL`. Los orígenes concretos se gestionan por entorno y no se hardcodean en el código fuente.

### 3. Rate Limiting
Las rutas públicas de autenticación (`/api/login` y `/api/register`) aplican límite de intentos por email/IP para reducir abuso por fuerza bruta.

---

## 📜 Cumplimiento de Normativa (RGPD)

- **Soberanía de Datos:** A diferencia de las plataformas de terceros, el restaurante es el único dueño de su base de datos, cumpliendo con el principio de control sobre la información de carácter personal.
- **Información Nutricional:** El sistema incluye la gestión obligatoria de **alérgenos**, cumpliendo con la normativa europea de información alimentaria.
