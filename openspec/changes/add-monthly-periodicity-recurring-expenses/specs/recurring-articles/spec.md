## MODIFIED Requirements

### Requirement: Artículo recurrente con campos completos
La entidad `Recurrent` SHALL tener los campos: `name` (obligatorio), `periodicity` (días, nullable), `amount` (precio actual, decimal), `link` (URL, nullable), `establishment` (nombre del establecimiento, obligatorio), `periodicityType` (valores: `DAYS`, `ANNUAL`, `MONTHLY`; por defecto `DAYS`), `periodicityMonth` (mes del año 1-12, usado solo para tipo `ANNUAL`, nullable), `periodicityDay` (día del mes 1-31, usado solo para tipo `MONTHLY`, nullable).

#### Scenario: Crear artículo recurrente con todos los campos
- **WHEN** se hace POST `/recurrents` con `name`, `establishment`, `periodicity`, `amount` y `link`
- **THEN** el sistema devuelve 201 con el artículo creado incluyendo todos los campos

#### Scenario: Crear artículo recurrente sin campos opcionales
- **WHEN** se hace POST `/recurrents` solo con `name` y `establishment`
- **THEN** el sistema devuelve 201 con `periodicity` null, `amount` 0.00, `link` null, `periodicityDay` null y `periodicityMonth` null

#### Scenario: Crear artículo sin nombre falla
- **WHEN** se hace POST `/recurrents` sin el campo `name`
- **THEN** el sistema devuelve 400

#### Scenario: Crear artículo sin establecimiento falla
- **WHEN** se hace POST `/recurrents` sin el campo `establishment`
- **THEN** el sistema devuelve 400

### Requirement: Listado de artículos recurrentes
El sistema SHALL devolver la lista de todos los artículos recurrentes del usuario autenticado, incluyendo el precio actual.

#### Scenario: Listar artículos recurrentes
- **WHEN** se hace GET `/recurrents`
- **THEN** el sistema devuelve 200 con array de artículos, cada uno con `id`, `name`, `establishment`, `periodicity`, `periodicityType`, `periodicityMonth`, `periodicityDay`, `amount`, `link`, `createdAt`, `updatedAt`

### Requirement: Actualización de artículo recurrente
El sistema SHALL permitir actualizar `name`, `establishment`, `periodicity`, `periodicityType`, `periodicityMonth`, `periodicityDay` y `link` de un artículo recurrente. El campo `amount` NO SHALL ser actualizable directamente; solo se modifica vía historial de precios.

#### Scenario: Actualizar campos permitidos
- **WHEN** se hace PATCH `/recurrents/{id}` con `name`, `establishment`, `periodicity`, `periodicityType`, `periodicityMonth`, `periodicityDay` o `link`
- **THEN** el sistema devuelve 200 con el artículo actualizado

#### Scenario: Actualizar amount directamente es ignorado
- **WHEN** se hace PATCH `/recurrents/{id}` con el campo `amount`
- **THEN** el sistema ignora el campo `amount` y devuelve 200 sin modificar el precio

#### Scenario: Actualizar artículo inexistente falla
- **WHEN** se hace PATCH `/recurrents/{id}` con un id que no existe
- **THEN** el sistema devuelve 404

### Requirement: Eliminación de artículo recurrente
El sistema SHALL eliminar un artículo recurrente y en cascada todas sus entradas de historial de precios.

#### Scenario: Eliminar artículo existente
- **WHEN** se hace DELETE `/recurrents/{id}`
- **THEN** el sistema devuelve 204 y el artículo no aparece en listados posteriores

#### Scenario: Eliminar artículo inexistente falla
- **WHEN** se hace DELETE `/recurrents/{id}` con un id que no existe
- **THEN** el sistema devuelve 404
