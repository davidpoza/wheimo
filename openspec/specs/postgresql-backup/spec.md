### Requirement: Backup automático periódico
El sistema SHALL ejecutar `pg_dump` de forma periódica sobre la base de datos PostgreSQL y almacenar el resultado en un volumen persistente. El intervalo de ejecución SHALL ser configurable mediante variable de entorno (`BACKUP_SCHEDULE`, formato cron).

#### Scenario: Backup ejecutado según schedule
- **WHEN** el cron interno del contenedor de backup dispara según `BACKUP_SCHEDULE`
- **THEN** se genera un fichero `.sql.gz` en el volumen de backups con nombre `wheimo_<YYYYMMDD_HHMMSS>.sql.gz`

#### Scenario: Variable de entorno schedule no definida
- **WHEN** `BACKUP_SCHEDULE` no está definida
- **THEN** el contenedor usa el valor por defecto (`0 2 * * *`, cada día a las 02:00 UTC)

### Requirement: Compresión de backups
El backup resultante SHALL comprimirse con gzip para minimizar el espacio en disco.

#### Scenario: Fichero generado es comprimido
- **WHEN** se completa el dump de la base de datos
- **THEN** el fichero guardado tiene extensión `.sql.gz` y está comprimido con gzip

### Requirement: Retención automática de backups
El sistema SHALL eliminar automáticamente los backups más antiguos que el número de días configurado en `BACKUP_RETENTION_DAYS` (por defecto 7 días).

#### Scenario: Backups antiguos eliminados
- **WHEN** se ejecuta un nuevo backup
- **THEN** se eliminan del volumen todos los ficheros `.sql.gz` con más de `BACKUP_RETENTION_DAYS` días de antigüedad

#### Scenario: Variable de retención no definida
- **WHEN** `BACKUP_RETENTION_DAYS` no está definida
- **THEN** el contenedor usa el valor por defecto de 7 días

### Requirement: Uso de credenciales existentes
El contenedor de backup SHALL obtener las credenciales de la base de datos de las mismas variables de entorno que el servicio `postgres` (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`).

#### Scenario: Credenciales correctas
- **WHEN** `POSTGRES_USER`, `POSTGRES_PASSWORD` y `POSTGRES_DB` están definidas
- **THEN** el dump se ejecuta correctamente conectando al host `postgres` en el puerto `5432`

### Requirement: Dependencia del servicio postgres
El contenedor de backup SHALL declarar dependencia de `postgres` en Docker Compose para garantizar que el servicio de base de datos esté disponible antes de intentar cualquier conexión.

#### Scenario: Orden de arranque correcto
- **WHEN** se ejecuta `docker compose up`
- **THEN** el contenedor `postgres-backup` no inicia hasta que `postgres` esté en estado `healthy` o `started`

### Requirement: Volumen persistente de backups
Los ficheros de backup SHALL almacenarse en un volumen Docker nombrado (`postgres-backups`) para sobrevivir reinicios o recreaciones del contenedor.

#### Scenario: Backup persiste tras reinicio del contenedor
- **WHEN** el contenedor `postgres-backup` se reinicia
- **THEN** los ficheros de backup previos siguen disponibles en el volumen `postgres-backups`
