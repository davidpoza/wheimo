## Context

El stack actual (`docker-compose.yml`) dispone de un servicio `postgres:16-alpine` con datos persistidos en el volumen `postgres-data`. No existe ningún mecanismo de backup automático: una corrupción o borrado accidental del volumen implica pérdida total de datos.

El proyecto es un gestor de finanzas personales auto-hospedado; la base de datos contiene todos los movimientos, categorías y artículos del usuario. La solución debe encajar en el stack Docker Compose existente sin alterar los servicios actuales.

## Goals / Non-Goals

**Goals:**
- Backup automático de PostgreSQL mediante `pg_dump` en el mismo stack Docker Compose.
- Compresión gzip y nomenclatura con timestamp.
- Retención configurable (eliminar backups viejos).
- Sin dependencias externas (no S3, no servicios cloud).

**Non-Goals:**
- Subida de backups a almacenamiento remoto (S3, GCS, etc.).
- Restauración automatizada o scripts de restore.
- Monitorización de fallos de backup o alertas.
- Backup incremental.

## Decisions

### Imagen base: `prodrigestivill/postgres-backup-local`
**Decisión**: usar la imagen pública `prodrigestivill/postgres-backup-local`.

**Alternativas consideradas**:
- Imagen propia con Alpine + cron + `pg_dump`: mayor control, pero requiere mantenimiento del Dockerfile y del entrypoint de cron.
- `pg_basebackup` en lugar de `pg_dump`: backup físico más rápido para bases grandes, pero no portable ni fácil de inspeccionar; innecesario para este tamaño de datos.

**Rationale**: `prodrigestivill/postgres-backup-local` es la solución estándar de la comunidad para este caso exacto (cron + pg_dump + retención + gzip), bien mantenida, sin dependencias extra y configurable 100% por variables de entorno que ya existen en el proyecto.

### Variables de entorno
Reutilizar `POSTGRES_USER`, `POSTGRES_PASSWORD` y `POSTGRES_DB` ya definidas en el `.env` / `docker-compose.yml`. La imagen acepta `POSTGRES_HOST` y `POSTGRES_PORT` con valores por defecto `postgres` y `5432`, que coinciden con el nombre del servicio en la red `wheimo`.

### Programación del backup
Variable `SCHEDULE` en formato cron. Valor por defecto propuesto: `@daily` (equivalente a `0 0 * * *`). El usuario puede sobreescribir mediante `.env`.

### Retención
Variable `BACKUP_KEEP_DAYS` (nombre propio de la imagen). Por defecto 7 días. El usuario puede ajustarlo en `.env`.

### Red y volumen
- El contenedor se une a la red `wheimo` para resolver `postgres` por nombre.
- Nuevo volumen nombrado `postgres-backups` montado en `/backups` (ruta de la imagen).

## Risks / Trade-offs

- **Tamaño en disco**: sin rotación bien configurada, el volumen crece indefinidamente. → Mitigación: `BACKUP_KEEP_DAYS` configurado con sensato valor por defecto (7).
- **Ventana de pérdida de datos**: el backup diario implica hasta 24 h de datos en riesgo. → Aceptado; para mayor frecuencia el usuario puede ajustar `SCHEDULE`.
- **Sin verificación de integridad del dump**: el fichero generado podría estar corrupto sin que nadie lo detecte. → Fuera de alcance; la imagen no lo resuelve de forma nativa.
- **Sin offsite backup**: el volumen vive en el mismo host que los datos. Un fallo de hardware afecta a ambos. → Fuera de alcance (Non-Goal).

## Migration Plan

1. Añadir el servicio `postgres-backup` y el volumen `postgres-backups` al `docker-compose.yml`.
2. Añadir las variables `POSTGRES_DB`, `BACKUP_SCHEDULE` y `BACKUP_KEEP_DAYS` al `.env.example` (si existe) o documentarlas en el README.
3. Ejecutar `docker compose up -d postgres-backup` para arrancar el nuevo servicio sin interrumpir los existentes.
4. Verificar que el primer backup se genera correctamente con `docker compose logs postgres-backup`.

No se requiere rollback especial: eliminar el servicio y el volumen no afecta al resto del stack.

## Open Questions

- ¿Se desea que el backup se ejecute también al arrancar el contenedor (`BACKUP_ON_START=true`), además del cron?
- ¿Se quiere exponer el volumen de backups en el host mediante un `bind mount` para facilitar la copia manual?
