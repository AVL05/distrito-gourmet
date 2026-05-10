#!/bin/bash

# Script de Auto-Actualización para Distrito Gourmet
# Este script comprueba si hay cambios en GitHub y los aplica automáticamente.

REPO_DIR="$HOME/distrito-gourmet"
cd "$REPO_DIR" || exit

# 1. Traer información de las ramas remotas
git fetch origin main -q

# 2. Comparar la versión local con la remota
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "[$(date)] ✨ Detectados cambios en GitHub. Actualizando..."
    
    # 3. Descargar los cambios
    git pull origin main
    
    # 4. Dar permisos al script de gestión por si acaso
    chmod +x scripts/manage.sh
    
    # 5. Reiniciar los contenedores para aplicar cambios
    ./scripts/manage.sh start
    
    echo "[$(date)] ✅ Sistema actualizado y reiniciado."
else
    # Opcional: descomentar para debug
    # echo "[$(date)] 😴 Todo al día."
    exit 0
fi
