## Why

El proyecto carece de cualquier mecanismo de backup automático para la base de datos PostgreSQL. Un fallo de disco, corrupción de datos o error humano podría resultar en pérdida permanente de todos los datos financieros del usuario. Añadir un contenedor de backups automatizados en el stack de Docker Compose protege la integridad de los datos sin requerir intervención manual.

## What Changes

- Se añade un nuevo servicio `postgres-backup` al `docker-compose.yml` que realiza backups periódicos de la base de datos PostgreSQL.
- El contenedor ejecuta `pg_dump` de forma programada (cron) y almacena los dumps en un volumen persistente.
- Los backups se comprimen con gzip y se nombran con timestamp para facilitar la rotación.
- Se configura retención automática para eliminar backups más antiguos de N días.
- Las credenciales se obtienen de las variables de entorno ya existentes (`POSTGRES_USER`, `POSTGRES_PASSWORD`).

## Capabilities

### New Capabilities
- `postgresql-backup`: Backup automatizado de la base de datos PostgreSQL mediante un contenedor Docker con `pg_dump` y rotación de backups por retención configurable.

### Modified Capabilities
<!-- ninguna -->

## Impact

- `docker-compose.yml`: nuevo servicio `postgres-backup` y nuevo volumen `postgres-backups`.
- No hay cambios en la API, frontend ni en otros servicios.
- Dependencia del servicio `postgres` (el contenedor debe estar activo para hacer dump).
