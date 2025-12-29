# Despliegue a producción

Sigue estos pasos desde el directorio raíz del proyecto para desplegar o revertir cambios.

## 1. Preparar variables de entorno
1. Copia el archivo `deploy.env.example` a `.env` y ajusta los valores sensibles:
   ```bash
   cp deploy.env.example .env
   # Genera APP_KEY con la imagen ya levantada o usando php artisan key:generate
   ```
2. Variables obligatorias:
   - `APP_ENV=production` y `APP_DEBUG=false` para ejecutar Laravel en modo producción.
   - Credenciales de base de datos: `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
   - Credenciales de Keycloak: `KEYCLOAK_DB_USERNAME`, `KEYCLOAK_DB_PASSWORD`, `KEYCLOAK_ADMIN`, `KEYCLOAK_ADMIN_PASSWORD`.

## 2. Despliegue estándar
Ejecuta el script automatizado (incluye backup opcional, rebuild e instalación de dependencias dentro de los contenedores):
```bash
./deploy_update.sh
```
El script realiza:
- `docker compose down --remove-orphans`.
- Limpieza de contenedores/imagenes huérfanas con `docker system prune -af --volumes=false`.
- `git pull` de la rama principal.
- **Backup opcional** de la base de datos (puede desactivarse con `SKIP_DB_BACKUP=true`).
- `docker compose build --no-cache` y `docker compose up -d`.
- Ejecución de migraciones y caches de Laravel: `php artisan migrate --force`, `config:cache`, `route:cache`, `view:cache`, `event:cache`, `optimize`.

## 3. Verificaciones rápidas
- Extensión GD en PHP: `docker compose exec backend php -m | grep gd`.
- Rutas cargadas: `docker compose exec backend php artisan route:list | head`.
- Exportaciones (Laravel Excel) disponibles: consume el endpoint de exportación correspondiente y valida que descargue un CSV/XLSX.
- Salud de servicios: `docker compose ps --status=running` y revisa los healthchecks configurados en `docker-compose.yml`.

## 4. Rollback
1. Detén servicios actuales: `docker compose down`.
2. Restaura la base de datos desde el último backup generado en `./backups`:
   ```bash
   docker compose up -d postgres
   cat backups/backup_<fecha>.sql | docker compose exec -T postgres psql -U ${DB_USERNAME:-inventario} ${DB_DATABASE:-inventario_db}
   ```
3. Opcional: vuelve a la última etiqueta o commit estable y ejecuta nuevamente `./deploy_update.sh`.

## 5. Notas adicionales
- Las variables de entorno no se hardcodean en los contenedores; `docker-compose.yml` las lee desde `.env`.
- El backend compila con GD y Laravel Excel incluido para exportaciones.
- Usa el mismo archivo `.env` para backend y Keycloak para mantener coherencia de credenciales.
