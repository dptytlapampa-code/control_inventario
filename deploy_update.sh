#!/bin/bash

echo "============================================="
echo "  CONTROL INVENTARIO - ACTUALIZACIÓN completa"
echo "============================================="

# 1) Detener contenedores
echo "[1/7] Deteniendo contenedores actuales..."
docker compose down --remove-orphans

# 2) Limpiar basura vieja que genera errores
echo "[2/7] Limpiando contenedores colgados, imágenes huérfanas y caché..."

# ⚠️ SIN borrar volúmenes
docker system prune -af --volumes=false

# 3) Actualizar la repo
echo "[3/7] Actualizando repositorio desde GitHub..."
git reset --hard
git pull origin main

# Si la repo usa otra rama, por ej. dev:
# git pull origin dev

# 4) Reconstrucción limpia de imágenes
echo "[4/7] Construyendo imágenes nuevamente..."
docker compose build --no-cache

# 5) Arrancar contenedores
echo "[5/7] Iniciando contenedores..."
docker compose up -d

# 6) Corrección de permisos (evita errores previos)
echo "[6/7] Ajustando permisos en backend y storage..."
if [ -d "./backend" ]; then
  sudo chown -R $USER:$USER backend
  sudo chmod -R 775 backend/storage backend/bootstrap/cache
fi

# 7) Limpieza final del frontend (evita errores viejos de node_modules)
echo "[7/7] Refrescando frontend..."
if [ -d "./frontend" ]; then
  cd frontend
  
  # eliminar node_modules corruptos (problema común)
  rm -rf node_modules .vite .cache
  
  npm install --legacy-peer-deps
  
  cd ..
fi

echo "============================================="
echo "   ACTUALIZACIÓN COMPLETA Y CONTENEDORES OK  "
echo "   Accede desde tu navegador al servidor     "
echo "============================================="
