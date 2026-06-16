# Roadmap - Distrito Gourmet

Este roadmap recoge mejoras previstas y criterios de evolucion del proyecto. No representa compromisos cerrados de entrega; sirve como guia tecnica y funcional para priorizar futuras iteraciones.

## Estado actual

La version actual cubre los flujos base:

- Carta publica agregada.
- Registro, login, logout y perfil.
- Autenticacion con Laravel Sanctum.
- Reservas con control de capacidad por turno.
- Pedidos takeaway con recalculo de importes en backend.
- Panel de administracion para carta, usuarios, reservas y pedidos.
- Metricas operativas basicas.
- Formulario de contacto validado desde API.
- Entorno Docker Compose para base de datos, backend y frontend.

## Principios de evolucion

- Mantener separacion clara entre frontend y backend.
- Conservar rutas API bajo el prefijo `/api`.
- Evitar valores de entorno hardcodeados.
- Priorizar seguridad y trazabilidad sobre velocidad de entrega.
- Introducir dependencias solo cuando reduzcan complejidad real.
- Validar cada fase con pruebas, build o smoke test documentado.

## Fase 1 - Estabilizacion y calidad

Objetivo: reforzar la base antes de anadir funcionalidades de negocio complejas.

Prioridades:

- Ampliar cobertura de tests backend para reservas, pedidos, autenticacion y permisos admin.
- Anadir pruebas de integracion frontend para flujos criticos.
- Documentar modelos de datos principales y relaciones.
- Revisar tratamiento de errores API y mensajes visibles al usuario.
- Mejorar observabilidad: logs estructurados para reservas, pedidos y autenticacion.
- Formalizar datos seed para demo, desarrollo y pruebas.

Criterio de salida:

- Build frontend reproducible.
- Tests backend pasando.
- Smoke test documentado para cliente y administrador.
- Errores funcionales principales cubiertos por pruebas o checklist.

## Fase 2 - Pagos y notificaciones

Objetivo: convertir pedidos y reservas en procesos mas cercanos a produccion.

Funcionalidades candidatas:

- Integracion con Stripe o PayPal para pagos reales.
- Confirmacion por email para reservas y pedidos.
- Notificaciones de estado de pedido.
- Politica de fianza o garantia para reservas de alto volumen.
- Plantillas de email transaccional.

Riesgos a controlar:

- Webhooks de pago y reintentos.
- Estados inconsistentes entre pasarela y base de datos.
- Gestion segura de claves.
- Cumplimiento legal en comunicaciones comerciales.

## Fase 3 - Operativa de restaurante

Objetivo: mejorar la utilidad diaria del panel interno.

Funcionalidades candidatas:

- Calendario visual de reservas.
- Bloqueo manual de turnos.
- Configuracion editable de horarios y capacidad.
- Monitor de cocina optimizado para pedidos activos.
- Gestion de disponibilidad por producto.
- Historial de cambios en reservas y pedidos.

Criterio de salida:

- El administrador puede adaptar servicio y capacidad sin cambios de codigo.
- Los cambios operativos quedan registrados.

## Fase 4 - Fidelizacion y cliente recurrente

Objetivo: aumentar recurrencia y personalizacion.

Funcionalidades candidatas:

- Programa de puntos.
- Cupones o descuentos controlados desde administracion.
- Preferencias del cliente.
- Historial de consumo consultable.
- Segmentacion basica para clientes recurrentes.

Riesgos a controlar:

- Privacidad y consentimiento.
- Reglas de descuento acumulables.
- Evitar exponer datos personales a usuarios no autorizados.

## Fase 5 - Inteligencia de negocio

Objetivo: convertir los datos operativos en decisiones accionables.

Funcionalidades candidatas:

- Graficos de ocupacion por dia, turno y mes.
- Ranking de platos por unidades e ingresos.
- Ticket medio por periodo.
- Exportacion CSV para analisis externo.
- Prediccion sencilla de demanda a partir de historico.

Requisitos previos:

- Datos historicos consistentes.
- Estados normalizados.
- Criterios claros para excluir cancelaciones, pruebas y datos demo.

## Fase 6 - Canales adicionales

Objetivo: ampliar puntos de acceso reutilizando la API.

Opciones:

- Aplicacion movil con React Native o Flutter.
- Panel especifico para tablets en sala/cocina.
- Integracion con WhatsApp Business API.
- Portal de eventos privados o reservas de grupo.

Cada nuevo canal debe consumir la API existente y no duplicar reglas de negocio criticas fuera del backend.

## Deuda tecnica identificada

- Formalizar documentacion de arquitectura en un archivo propio si el proyecto crece.
- Definir estrategia de backups y restauracion.
- Separar configuracion de horarios/capacidad de constantes de codigo.
- Evaluar auditoria de acciones administrativas.
- Revisar politica de retencion de datos personales.

## Documentacion adicional recomendada

Si el proyecto sigue creciendo, seria conveniente crear:

- `docs/ARCHITECTURE.md`: diagrama de componentes, flujo de datos, modelos principales y decisiones tecnicas.
- `docs/CONTRIBUTING.md`: normas de ramas, commits, validacion y revisiones.
- `docs/DATA_MODEL.md`: entidades, relaciones y reglas de integridad.

No los he creado en esta pasada para mantener el cambio limitado a los documentos solicitados.
