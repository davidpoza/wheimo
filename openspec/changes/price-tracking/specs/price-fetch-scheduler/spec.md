## ADDED Requirements

### Requirement: Ejecución diaria automática de todos los fetchers activos
El sistema SHALL ejecutar automáticamente todos los PriceFetchers correspondientes a los trackers activos una vez al día (a las 07:00 hora del servidor). Las lecturas ya existentes para ese día no se vuelven a insertar (deduplicación por `tracker_id` + `reading_date`).

#### Scenario: Ejecución diaria con trackers activos
- **WHEN** el scheduler se dispara a las 07:00
- **THEN** el sistema invoca el fetcher de cada tracker con `active = true`
- **THEN** las lecturas nuevas se persisten en `price_readings`
- **THEN** si ya existe una lectura para ese tracker en la fecha de hoy, no se inserta duplicado

#### Scenario: Ejecución diaria sin trackers activos
- **WHEN** el scheduler se dispara y no hay trackers con `active = true`
- **THEN** no se realiza ninguna llamada externa y el sistema completa sin error

#### Scenario: Fallo de un fetcher no afecta a los demás
- **WHEN** el scheduler se dispara y el fetcher de un tracker lanza una excepción
- **THEN** el error se registra en el log del servidor
- **THEN** el scheduler continúa ejecutando los fetchers de los restantes trackers activos

### Requirement: Disparar fetch manualmente desde la API
El sistema SHALL permitir forzar la ejecución del fetch de uno o todos los trackers activos en cualquier momento, independientemente del horario del scheduler.

#### Scenario: Disparar todos los trackers manualmente
- **WHEN** se hace POST `/api/price-trackers/fetch`
- **THEN** el sistema ejecuta el fetch de todos los trackers activos de forma síncrona
- **THEN** devuelve 200 con `{triggered: N, results: [{trackerId, status: "ok"|"error", message?}]}`

#### Scenario: Disparar un tracker específico manualmente
- **WHEN** se hace POST `/api/price-trackers/{id}/fetch`
- **THEN** el sistema ejecuta el fetch únicamente para ese tracker
- **THEN** devuelve 200 con `{trackerId, status: "ok"|"error", newReadings: N, message?}`

#### Scenario: Disparar tracker inexistente
- **WHEN** se hace POST `/api/price-trackers/{id}/fetch` con id que no existe
- **THEN** el sistema devuelve 404

#### Scenario: Fetch manual respeta deduplicación
- **WHEN** se hace POST `/api/price-trackers/{id}/fetch` y ya existe una lectura para hoy
- **THEN** el sistema no inserta duplicado y devuelve `{status: "ok", newReadings: 0}`

### Requirement: Interfaz PriceFetcher extensible
El sistema SHALL definir una interfaz `PriceFetcher` que toda implementación SHALL cumplir. El framework de inyección de dependencias (Spring) SHALL descubrir automáticamente todas las implementaciones registradas como beans.

#### Scenario: Registro automático de fetchers
- **WHEN** se añade una nueva clase que implementa `PriceFetcher` y se anota como `@Component`
- **THEN** el scheduler la incluye automáticamente en el pool de fetchers disponibles sin modificar código existente

#### Scenario: Resolución de fetcher por tipo
- **WHEN** el scheduler procesa un tracker con `fetcherType = "GASOIL"`
- **THEN** el sistema selecciona el `PriceFetcher` cuyo método `getType()` retorna `"GASOIL"`

#### Scenario: Fetcher no encontrado para un tipo
- **WHEN** existe un tracker con `fetcherType` para el que no hay implementación de `PriceFetcher`
- **THEN** el sistema registra un error en el log y continúa con los demás trackers
