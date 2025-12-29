#!/bin/bash

set -euo pipefail

echo "============================================="
echo "  CONTROL INVENTARIO - ACTUALIZACIÓN completa"
echo "============================================="

BACKUP_DIR=${BACKUP_DIR:-./backups}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 1) Detener contenedores
echo "[1/8] Deteniendo contenedores actuales..."
docker compose down --remove-orphans

# 2) Limpiar basura vieja que genera errores
echo "[2/8] Limpiando contenedores colgados, imágenes huérfanas y caché..."
docker system prune -af --volumes=false

# 3) Actualizar la repo
echo "[3/8] Actualizando repositorio desde GitHub..."
git reset --hard
git pull origin main

# Si la repo usa otra rama, por ej. dev:
# git pull origin dev

# 4) Backup opcional de base de datos
if [ "${SKIP_DB_BACKUP:-false}" != "true" ]; then
  echo "[4/8] Creando backup de base de datos..."
  mkdir -p "$BACKUP_DIR"
  docker compose up -d postgres
  sleep 5
  docker compose exec -T postgres pg_dump -U "${DB_USERNAME:-inventario}" "${DB_DATABASE:-inventario_db}" > "$BACKUP_DIR/backup_${TIMESTAMP}.sql" || echo "Backup falló, continuarás bajo tu propio riesgo"
else
  echo "[4/8] Saltando backup de base de datos por configuración"
fi

# 5) Reconstrucción limpia de imágenes
echo "[5/8] Construyendo imágenes nuevamente..."
docker compose build --no-cache

# 6) Arrancar contenedores
echo "[6/8] Iniciando contenedores..."
docker compose up -d

# 7) Migraciones y caches de Laravel
echo "[7/8] Ejecutando migraciones y caches de Laravel..."
docker compose exec backend php artisan migrate --force
docker compose exec backend php artisan config:cache
docker compose exec backend php artisan route:cache
docker compose exec backend php artisan view:cache
docker compose exec backend php artisan event:cache
docker compose exec backend php artisan optimize

# 8) Corrección de permisos (evita errores previos)
echo "[8/8] Ajustando permisos en backend y storage..."
if [ -d "./backend" ]; then
  sudo chown -R $USER:$USER backend
  sudo chmod -R 775 backend/storage backend/bootstrap/cache
fi

echo "============================================="
echo "   ACTUALIZACIÓN COMPLETA Y CONTENEDORES OK  "
echo "   Accede desde tu navegador al servidor     "
echo "============================================="
