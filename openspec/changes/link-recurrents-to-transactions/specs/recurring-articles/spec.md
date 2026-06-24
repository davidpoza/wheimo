## MODIFIED Requirements

### Requirement: Listado de artículos recurrentes
El sistema SHALL devolver la lista de todos los artículos recurrentes del usuario autenticado, incluyendo el precio actual y la próxima fecha predicha de cobro.

#### Scenario: Listar artículos recurrentes con nextPredictedDate
- **WHEN** se hace GET `/recurrents`
- **THEN** el sistema devuelve 200 con array de artículos, cada uno con `id`, `name`, `establishment`, `periodicity`, `amount`, `link`, `createdAt`, `updatedAt` y `nextPredictedDate`

#### Scenario: nextPredictedDate se calcula desde la última asignación
- **WHEN** el recurrente tiene al menos una transacción vinculada y `periodicity` no es null
- **THEN** `nextPredictedDate` es la fecha de la transacción vinculada más reciente más `periodicity` días

#### Scenario: nextPredictedDate se calcula desde createdAt si no hay asignaciones
- **WHEN** el recurrente no tiene transacciones vinculadas y `periodicity` no es null
- **THEN** `nextPredictedDate` es `createdAt + periodicity días`

#### Scenario: nextPredictedDate es null cuando periodicity es null
- **WHEN** el recurrente tiene `periodicity` null
- **THEN** `nextPredictedDate` es null
