<p align="center">
  <img src="frontend/public/favicon.png" alt="Distrito Gourmet" width="90">
</p>

<h1 align="center">Distrito Gourmet</h1>
<p align="center"><i>Aplicacion full-stack para gestion digital de restaurante, reservas, carta y pedidos takeaway.</i></p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white">
  <img alt="Laravel" src="https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white">
  <img alt="Sanctum" src="https://img.shields.io/badge/Auth-Laravel%20Sanctum-FF2D20">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white">
  <img alt="Estado" src="https://img.shields.io/badge/Estado-En%20desarrollo-yellow">
</p>

---

## Indice

- [Resumen](#resumen)
- [Funcionalidades](#funcionalidades)
- [Arquitectura](#arquitectura)
- [Stack tecnologico](#stack-tecnologico)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Puesta en marcha](#puesta-en-marcha)
- [Scripts disponibles](#scripts-disponibles)
- [Documentacion](#documentacion)
- [Validacion](#validacion)
- [Autor](#autor)

---

## Resumen

**Distrito Gourmet** es una plataforma web desacoplada para digitalizar la operativa de un restaurante. El proyecto combina una API REST en Laravel con una SPA en React/Vite para cubrir la experiencia publica del comensal y la gestion interna del restaurante.

El objetivo principal es ofrecer una alternativa propia frente a plataformas de terceros: el restaurante conserva el control de su carta, reservas, pedidos y datos de clientes, sin depender de comisiones externas ni paneles cerrados.

## Funcionalidades

| Area | Cliente | Administracion |
| --- | --- | --- |
| Carta | Consulta de platos, vinos, bebidas y menus degustacion | Alta, edicion, disponibilidad y eliminacion de elementos |
| Reservas | Consulta de disponibilidad, seleccion de fecha, hora y comensales | Revision, confirmacion, cancelacion y control de ocupacion |
| Pedidos | Carrito y pedidos takeaway con hora de recogida | Seguimiento de estados operativos del pedido |
| Usuarios | Registro, login, perfil y actividad personal | Gestion de usuarios y roles |
| Contacto | Envio de consultas desde formulario publico | Recepcion estructurada de solicitudes |
| Metricas | No aplica | Indicadores de pedidos, reservas, aforo y ticket medio |

## Arquitectura

El proyecto sigue una arquitectura headless:

- `frontend/`: aplicacion React servida por Vite en desarrollo y Nginx en despliegue Docker.
- `backend/`: API Laravel 12 con autenticacion mediante Laravel Sanctum.
- `database/`: activos y datos auxiliares del proyecto.
- `scripts/`: automatizacion local para levantar backend y frontend desde un unico comando.
- `docs/`: documentacion funcional, tecnica, despliegue, seguridad y roadmap.

La comunicacion entre frontend y backend se realiza mediante rutas con prefijo `/api`. Los origenes, puertos y URLs especificos del entorno se configuran con variables `.env`; no deben hardcodearse en el codigo fuente.

## Stack tecnologico

| Capa | Tecnologia | Uso |
| --- | --- | --- |
| Frontend | React 19, Vite 7, React Router, Zustand | Interfaz SPA, navegacion y estado cliente |
| UI y experiencia | Tailwind CSS, GSAP, Lenis, SweetAlert2 | Estilos, animaciones y feedback visual |
| Backend | Laravel 12, PHP 8.2+, Sanctum | API REST, autenticacion y reglas de negocio |
| Datos | MySQL 8 | Persistencia de usuarios, carta, reservas y pedidos |
| Infraestructura | Docker Compose, Nginx | Orquestacion local/produccion y servicio del frontend |

## Estructura del repositorio

```text
distrito-gourmet/
|-- backend/                # API Laravel
|   |-- app/
|   |-- database/
|   |-- routes/
|   `-- tests/
|-- frontend/               # SPA React + Vite
|   |-- public/
|   `-- src/
|-- database/               # Activos de base de datos del proyecto
|-- docs/                   # Documentacion del proyecto
|-- scripts/                # Automatizacion de desarrollo/despliegue
|-- docker-compose.yml      # Servicios db, backend y frontend
|-- package.json            # Scripts raiz
`-- README.md
```

## Puesta en marcha

### Requisitos

- Git.
- Node.js y npm para scripts raiz y frontend.
- PHP 8.2+ y Composer si se trabaja sin Docker.
- Docker y Docker Compose para el entorno contenerizado.

### Instalacion rapida con Docker

```bash
git clone https://github.com/AVL05/distrito-gourmet.git
cd distrito-gourmet

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker-compose up -d --build
docker exec -it distrito-backend php artisan migrate --seed
```

Servicios por defecto:

- Frontend: puerto `80`.
- Backend: puerto `8000`.
- MySQL: puerto `3306`.

### Desarrollo local

```bash
npm run install:all
npm start
```

El script `npm start` levanta Laravel y Vite de forma coordinada. En Windows intenta resolver el binario de PHP disponible y configura variables necesarias para que Vite consuma la API.

## Scripts disponibles

| Comando | Descripcion |
| --- | --- |
| `npm run install:all` | Instala dependencias de backend con Composer y frontend con npm |
| `npm start` | Inicia el entorno de desarrollo completo mediante `scripts/dev.js` |
| `npm --prefix frontend run lint` | Ejecuta ESLint en la SPA |
| `npm --prefix frontend run build` | Genera build de produccion del frontend |
| `cd backend && php artisan test` | Ejecuta la suite de tests Laravel |
| `cd backend && php artisan route:list --path=api` | Lista rutas expuestas por la API |

## Documentacion

| Documento | Proposito |
| --- | --- |
| [Documentacion tecnica](./Documentacion.md) | Contexto amplio del proyecto y decisiones de implementacion |
| [API](./docs/API_DOCS.md) | Endpoints, autenticacion, payloads y codigos de respuesta |
| [Despliegue](./docs/DEPLOY.md) | Instalacion, Docker, entorno local, produccion y checklist |
| [Manual de usuario](./docs/MANUAL_USUARIO.md) | Uso funcional para cliente, staff y administrador |
| [Roadmap](./docs/ROADMAP.md) | Evolucion prevista y prioridades futuras |
| [Seguridad](./docs/SECURITY.md) | Medidas aplicadas, buenas practicas y riesgos pendientes |

## Validacion

Antes de entregar cambios relevantes:

```bash
npm --prefix frontend run lint
npm --prefix frontend run build
cd backend && php artisan test
cd backend && php artisan route:list --path=api
```

Smoke test recomendado:

1. Cargar carta publica.
2. Registrar o iniciar sesion.
3. Crear reserva.
4. Crear pedido takeaway.
5. Revisar perfil, pedidos y reservas del usuario.
6. Acceder como administrador y actualizar estados.

## Autor

Alex Vicente Lopez

Proyecto de Fin de Ciclo, IES Serra Perenxisa, 2025-2026
