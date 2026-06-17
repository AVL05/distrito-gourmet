# Roadmap y Mejoras Futuras — Distrito Gourmet 🚀

Distrito Gourmet ha sido diseñado con una arquitectura escalable que permite la integración de nuevas funcionalidades sin comprometer la estabilidad del sistema actual. Estas son las líneas de evolución previstas.

---

## 📊 Resumen de estado

| Fase | Línea de trabajo | Estado |
|---|---|---|
| Entrega PFC | Disponibilidad pública de turnos, métricas de administración, revalidación de carrito y contacto validado desde API | ✅ Completado |
| Fase 1 | Pasarela de pagos real (Stripe/PayPal) | 📋 Planificado |
| Fase 1 | Notificaciones automáticas (Email / WhatsApp Business API) | 📋 Planificado |
| Fase 2 | Aplicación móvil nativa (React Native / Flutter) | 📋 Planificado |
| Fase 2 | Programa de fidelización (puntos y cupones) | 📋 Planificado |
| Fase 3 | Módulo de estadísticas avanzado | 📋 Planificado |
| Fase 3 | Gestión de inventario crítico | 📋 Planificado |

---

## 💳 Fase 1: Integración de pagos y notificaciones

- **Pasarela de pagos real:** integración con **Stripe** o **PayPal** para el cobro automático de pedidos takeaway y la gestión de "fianzas" en las reservas de mesas, como medida para reducir el *no-show*.
- **Sistema de notificaciones automáticas:** implementación de avisos vía **email (Mailgun/SMTP)** y **WhatsApp Business API** para confirmar reservas y avisar al cliente cuando su pedido esté listo para recoger.

## 📱 Fase 2: Movilidad y fidelización

- **Aplicación móvil nativa:** desarrollo de una app en **React Native** o **Flutter** reutilizando la misma API REST actual, permitiendo una experiencia de reserva más integrada y el uso de notificaciones push.
- **Programa de fidelización:** sistema de puntos por consumo y gestión de cupones de descuento personalizados para clientes recurrentes.

## 📈 Fase 3: Inteligencia de negocio

- **Módulo de estadísticas avanzado:** gráficos detallados de ocupación, platos más vendidos y ticket medio mensual para ayudar al restaurador en la toma de decisiones estratégicas.
- **Gestión de inventario crítico:** vinculación de los pedidos con el stock de ingredientes, avisando automáticamente cuando un producto de la carta deba marcarse como "no disponible".

---

## 🌍 Visión a largo plazo

El objetivo final es convertir Distrito Gourmet en un estándar de software libre para pequeños y medianos restaurantes que buscan independencia tecnológica, ofreciendo una herramienta profesional que compita de tú a tú con las grandes plataformas del sector.
