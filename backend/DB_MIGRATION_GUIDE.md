# 🗄️ Guía de Conexión de Base de Datos

Esta guía explica cómo cambiar entre **XAMPP (MySQL)** y **Supabase (PostgreSQL)** de forma segura y sin errores.

## 1. Configuración del Archivo `.env`

El archivo `.env` es el control central. Hemos preparado dos bloques de configuración.

### Para usar XAMPP (Local)

1. Asegúrate de que `DB_CONNECTION=mysql`.
2. Verifica que los datos de la **OPCIÓN A** estén activos (no comentados).
3. Inicia Apache y MySQL en tu panel de control de XAMPP.

### Para usar Supabase (Remoto)

1. Cambia a `DB_CONNECTION=pgsql`.
2. Comenta los datos de la OPCIÓN A (añadiendo `#` al principio).
3. Descomenta los datos de la **OPCIÓN B** y rellénalos con la información de tu dashboard de Supabase (Project Settings > Database).

---

## 2. Cómo Migrar la Estructura a Supabase

Cuando te conectes a Supabase por primera vez, la base de datos estará vacía. Debes ejecutar las migraciones:

```bash
# Desde la carpeta /backend
php artisan migrate
```

Si quieres incluir datos de prueba (seeders):

```bash
php artisan migrate --seed
```

---

## 3. Resumen de Diferencias Relevantes

| Característica | XAMPP (MySQL)        | Supabase (PostgreSQL) |
| :------------- | :------------------- | :-------------------- |
| **Driver**     | `mysql`              | `pgsql`               |
| **Puerto**     | 3306                 | 5432                  |
| **Usuario**    | `root` (por defecto) | `postgres`            |
| **Ubicación**  | Local (Tu PC)        | Cloud (Internet)      |

> [!IMPORTANT]
> **Seguridad:** Nunca subas tu contraseña de Supabase a repositorios públicos de GitHub. Asegúrate de que el archivo `.env` esté en tu `.gitignore`.
