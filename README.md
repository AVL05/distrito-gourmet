# Distrito Gourmet 🍽️

**Distrito Gourmet** es una plataforma web integral diseñada para transformar la gestión digital de restaurantes de alta cocina. A diferencia de las plataformas genéricas de terceros, esta solución devuelve la soberanía tecnológica y de datos al restaurador, eliminando comisiones y ofreciendo una experiencia de usuario totalmente adaptada a la identidad del local.

---

## ✨ ¿Qué ofrece la plataforma?

La aplicación se divide en dos grandes experiencias diseñadas específicamente para maximizar la eficiencia y la satisfacción del cliente:

### 👤 Experiencia para el Comensal
- **Carta Gastronómica Interactiva:** Navegación fluida por la oferta culinaria con filtrado avanzado por alérgenos y categorías.
- **Sommelier Digital:** Sistema de recomendaciones de vinos (maridaje) integrado en la carta para cada plato.
- **Reserva de Experiencias:** Motor de reservas en tiempo real que permite elegir no solo la mesa, sino el menú degustación deseado.
- **Pedidos Online (Takeaway):** Gestión de pedidos para llevar con carrito de compra reactivo y notificaciones de estado.

### 🔐 Gestión para el Restaurador
- **Panel de Administración Real-Time:** Control total sobre la carta, precios, bodega y disponibilidad de mesas.
- **Gestión de Menús Degustación:** Herramienta única para estructurar menús por "pasos" y tiempos.
- **Control de Aforo Inteligente:** Algoritmo que gestiona automáticamente las reservas según la capacidad del local (44 comensales) y franjas horarias.
- **Soberanía de Datos:** Acceso directo a la base de datos de clientes y métricas de consumo sin intermediarios.

---

## 🚀 Stack Tecnológico

El proyecto utiliza una arquitectura **Headless (desacoplada)** de última generación:

- **Frontend:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [Zustand](https://zustand-demo.pmnd.rs/) (SPA de alto rendimiento).
- **Backend:** [Laravel 12](https://laravel.com/) (API RESTful segura con Sanctum).
- **Animaciones:** [GSAP](https://gsap.com/) para una navegación fluida y estética "gourmet".
- **Infraestructura:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) para un despliegue consistente.

---

## 📖 Documentación Detallada

Para profundizar en los aspectos técnicos o manuales de uso, consulta:

1.  **[Documentación Técnica (Arquitectura)](./Documentacion.md):** Decisiones de diseño, patrones y estructura del código.
2.  **[Guía de Despliegue](./docs/DEPLOY.md):** Instalación local y en producción (Docker/Homelab).
3.  **[Manual de Usuario](./docs/MANUAL_USUARIO.md):** Guía paso a paso para clientes y administradores.
4.  **[Documentación de la API](./docs/API_DOCS.md):** Endpoints, autenticación y esquemas de datos.

---

## 🛠️ Instalación Rápida con Docker

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/distrito-gourmet.git

# Levantar el entorno completo
docker-compose up -d --build

# Inicializar base de datos y datos de prueba
docker exec -it distrito-backend php artisan migrate --seed
```

---
**Desarrollado por:** Alex Vicente Lopez  
**Proyecto de Fin de Ciclo (PFC)** · IES Serra Perenxisa · 2025-2026
