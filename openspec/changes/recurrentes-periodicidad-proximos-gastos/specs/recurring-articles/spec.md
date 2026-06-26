## MODIFIED Requirements

### Requirement: Artículo recurrente con campos completos
La entidad `Recurrent` SHALL tener los campos: `name` (obligatorio), `periodicityType` (`DAYS` | `ANNUAL`, por defecto `DAYS`), `periodicity` (días, nullable, solo relevante cuando `periodicityType = DAYS`), `periodicityMonth` (1-12, nullable, obligatorio cuando `periodicityType = ANNUAL`), `amount` (precio actual, decimal), `link` (URL, nullable), `establishment` (nombre del establecimiento, obligatorio).

#### Scenario: Crear artículo recurrente tipo DAYS
- **WHEN** se hace POST `/recurrents` con `name`, `establishment`, `periodicityType = "DAYS"`, `periodicity = 30`
- **THEN** el sistema devuelve 201 con el artículo creado incluyendo `periodicityType = "DAYS"`, `periodicity = 30` y `periodicityMonth = null`

#### Scenario: Crear artículo recurrente tipo ANNUAL
- **WHEN** se hace POST `/recurrents` con `name`, `establishment`, `periodicityType = "ANNUAL"`, `periodicityMonth = 10`
- **THEN** el sistema devuelve 201 con `periodicityType = "ANNUAL"`, `periodicityMonth = 10` y `periodicity = null`

#### Scenario: Crear artículo sin campos de periodicidad usa defaults
- **WHEN** se hace POST `/recurrents` solo con `name` y `establishment`
- **THEN** el sistema devuelve 201 con `periodicityType = "DAYS"`, `periodicity = null`, `periodicityMonth = null`

#### Scenario: Crear artículo sin nombre falla
- **WHEN** se hace POST `/recurrents` sin el campo `name`
- **THEN** el sistema devuelve 400

#### Scenario: Crear artículo sin establecimiento falla
- **WHEN** se hace POST `/recurrents` sin el campo `establishment`
- **THEN** el sistema devuelve 400

### Requirement: Listado de artículos recurrentes
El sistema SHALL devolver la lista de todos los artículos recurrentes del usuario autenticado, incluyendo los nuevos campos de periodicidad.

#### Scenario: Listar artículos recurrentes
- **WHEN** se hace GET `/recurrents`
- **THEN** el sistema devuelve 200 con array de artículos, cada uno con `id`, `name`, `establishment`, `periodicityType`, `periodicity`, `periodicityMonth`, `amount`, `link`, `createdAt`, `updatedAt`

### Requirement: Actualización de artículo recurrente
El sistema SHALL permitir actualizar `name`, `establishment`, `periodicityType`, `periodicity`, `periodicityMonth` y `link` de un artículo recurrente. El campo `amount` NO SHALL ser actualizable directamente.

#### Scenario: Cambiar tipo de periodicidad de DAYS a ANNUAL
- **WHEN** se hace PATCH `/recurrents/{id}` con `periodicityType = "ANNUAL"` y `periodicityMonth = 5`
- **THEN** el sistema devuelve 200 con `periodicityType = "ANNUAL"`, `periodicityMonth = 5`

#### Scenario: Cambiar tipo de periodicidad de ANNUAL a DAYS
- **WHEN** se hace PATCH `/recurrents/{id}` con `periodicityType = "DAYS"` y `periodicity = 365`
- **THEN** el sistema devuelve 200 con `periodicityType = "DAYS"`, `periodicity = 365`

#### Scenario: Actualizar amount directamente es ignorado
- **WHEN** se hace PATCH `/recurrents/{id}` con el campo `amount`
- **THEN** el sistema ignora el campo `amount` y devuelve 200 sin modificar el precio

#### Scenario: Actualizar artículo inexistente falla
- **WHEN** se hace PATCH `/recurrents/{id}` con un id que no existe
- **THEN** el sistema devuelve 404

### Requirement: Formulario de creación/edición con selector de tipo de periodicidad
El formulario de creación y edición de recurrentes SHALL permitir seleccionar el tipo de periodicidad mediante un selector visual, mostrando campos condicionalmente según el tipo seleccionado.

#### Scenario: Seleccionar tipo DAYS muestra campo de días
- **WHEN** el usuario selecciona "Por días" en el selector de tipo de periodicidad
- **THEN** se muestra el campo numérico de periodicidad en días y se oculta el selector de mes

#### Scenario: Seleccionar tipo ANNUAL muestra selector de mes
- **WHEN** el usuario selecciona "Anual" en el selector de tipo de periodicidad
- **THEN** se muestra un selector de mes (enero-diciembre) y se oculta el campo de días

#### Scenario: Editar recurrente existente precarga tipo y valores
- **WHEN** el usuario abre el formulario de edición de un recurrente existente
- **THEN** el tipo de periodicidad y su valor asociado (días o mes) están preseleccionados correctamente

### Requirement: Eliminación de artículo recurrente
El sistema SHALL eliminar un artículo recurrente y en cascada todas sus entradas de historial de precios.

#### Scenario: Eliminar artículo existente
- **WHEN** se hace DELETE `/recurrents/{id}`
- **THEN** el sistema devuelve 204 y el artículo no aparece en listados posteriores

#### Scenario: Eliminar artículo inexistente falla
- **WHEN** se hace DELETE `/recurrents/{id}` con un id que no existe
- **THEN** el sistema devuelve 404
