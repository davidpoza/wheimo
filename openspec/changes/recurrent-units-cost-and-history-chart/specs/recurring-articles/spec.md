## MODIFIED Requirements

### Requirement: Artículo recurrente con campos completos
La entidad `Recurrent` SHALL tener los campos: `name` (obligatorio), `periodicity` (días, nullable), `amount` (precio unitario actual, decimal), `units` (unidades actuales, decimal, nullable), `link` (URL, nullable), `establishment` (nombre del establecimiento, obligatorio).

#### Scenario: Crear artículo recurrente con todos los campos
- **WHEN** se hace POST `/recurrents` con `name`, `establishment`, `periodicity`, `amount` y `link`
- **THEN** el sistema devuelve 201 con el artículo creado incluyendo todos los campos

#### Scenario: Crear artículo recurrente sin campos opcionales
- **WHEN** se hace POST `/recurrents` solo con `name` y `establishment`
- **THEN** el sistema devuelve 201 con `periodicity` null, `amount` 0.00, `units` null y `link` null

#### Scenario: Crear artículo sin nombre falla
- **WHEN** se hace POST `/recurrents` sin el campo `name`
- **THEN** el sistema devuelve 400

#### Scenario: Crear artículo sin establecimiento falla
- **WHEN** se hace POST `/recurrents` sin el campo `establishment`
- **THEN** el sistema devuelve 400

### Requirement: Listado de artículos recurrentes
El sistema SHALL devolver la lista de todos los artículos recurrentes del usuario autenticado, incluyendo el precio unitario actual y las unidades actuales.

#### Scenario: Listar artículos recurrentes
- **WHEN** se hace GET `/recurrents`
- **THEN** el sistema devuelve 200 con array de artículos, cada uno con `id`, `name`, `establishment`, `periodicity`, `amount`, `units`, `link`, `createdAt`, `updatedAt`

### Requirement: Actualización de artículo recurrente
El sistema SHALL permitir actualizar `name`, `establishment`, `periodicity` y `link` de un artículo recurrente. Los campos `amount` y `units` NO SHALL ser actualizables directamente vía PATCH; solo se modifican vía historial de precios.

#### Scenario: Actualizar campos permitidos
- **WHEN** se hace PATCH `/recurrents/{id}` con `name`, `establishment`, `periodicity` o `link`
- **THEN** el sistema devuelve 200 con el artículo actualizado

#### Scenario: Actualizar amount o units directamente es ignorado
- **WHEN** se hace PATCH `/recurrents/{id}` con el campo `amount` o `units`
- **THEN** el sistema ignora esos campos y devuelve 200 sin modificar el precio ni las unidades

#### Scenario: Actualizar artículo inexistente falla
- **WHEN** se hace PATCH `/recurrents/{id}` con un id que no existe
- **THEN** el sistema devuelve 404

## ADDED Requirements

### Requirement: Coste total en el listado
En el listado de artículos recurrentes, cuando un artículo tiene `units` indicadas (no null), el sistema/cliente SHALL poder presentar el **coste total** calculado como `amount × units`, manteniendo `amount` como precio unitario. Cuando `units` es null, no aplica coste total.

#### Scenario: Artículo con unidades muestra coste total
- **WHEN** un artículo tiene `amount = 3.00` y `units = 4`
- **THEN** la vista de tabla muestra "Precio actual" = 3,00 € (precio unitario) y "Coste total" = 12,00 €

#### Scenario: Artículo sin unidades no muestra coste total
- **WHEN** un artículo tiene `units` null
- **THEN** la vista de tabla muestra "Precio actual" y la celda de "Coste total" queda vacía (—)
