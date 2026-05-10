#!/bin/bash

# Script de gestión para Distrito Gourmet
# Uso: ./manage.sh [start|stop|restart|status|logs|down]

COMMAND=$1
COMPOSE_FILE="docker-compose.yml"

case "$COMMAND" in
  start)
    echo "🚀 Iniciando Distrito Gourmet..."
    docker compose up -d
    ;;
  stop)
    echo "🛑 Deteniendo Distrito Gourmet..."
    docker compose stop
    ;;
  down)
    echo "🗑️ Eliminando contenedores de Distrito Gourmet..."
    docker compose down
    ;;
  restart)
    echo "🔄 Reiniciando Distrito Gourmet..."
    docker compose restart
    ;;
  status)
    echo "📊 Estado de los servicios:"
    docker compose ps
    ;;
  logs)
    echo "📜 Mostrando logs en tiempo real (Ctrl+C para salir):"
    docker compose logs -f
    ;;
  *)
    echo "❌ Uso: $0 {start|stop|down|restart|status|logs}"
    exit 1
    ;;
esac
