## 1. Docker Compose

- [x] 1.1 Añadir el servicio `postgres-backup` al `docker-compose.yml` usando la imagen `prodrigestivill/postgres-backup-local` con las variables de entorno `POSTGRES_HOST`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `SCHEDULE` y `BACKUP_KEEP_DAYS`
- [x] 1.2 Configurar `depends_on: postgres` en el servicio `postgres-backup`
- [x] 1.3 Unir el servicio `postgres-backup` a la red `wheimo`
- [x] 1.4 Añadir el volumen nombrado `postgres-backups` al servicio (montado en `/backups`) y declararlo en la sección `volumes` raíz del compose

## 2. Configuración por defecto

- [x] 2.1 Establecer `SCHEDULE` con valor por defecto `@daily` y `BACKUP_KEEP_DAYS` con valor `7` directamente en el `docker-compose.yml` (sobreescribibles desde `.env`)
- [x] 2.2 Documentar las variables `BACKUP_SCHEDULE` y `BACKUP_KEEP_DAYS` en el `README.md` o en el `.env.example` si existe

## 3. Verificación

- [x] 3.1 Arrancar el stack con `docker compose up -d postgres-backup` y verificar que el contenedor arranca sin errores
- [x] 3.2 Forzar un backup manual ejecutando el script dentro del contenedor y comprobar que se genera un `.sql.gz` en el volumen `postgres-backups`
