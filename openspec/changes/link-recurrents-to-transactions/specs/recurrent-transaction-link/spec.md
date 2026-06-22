## ADDED Requirements

### Requirement: Vincular recurrentes a una transacción
El sistema SHALL permitir asignar uno o varios artículos recurrentes a una transacción bancaria existente. Cada vínculo SHALL almacenar un snapshot del `amount` vigente del recurrente en el momento de la asignación.

#### Scenario: Asignar un recurrente a una transacción
- **WHEN** se hace POST `/recurrents/{recurrentId}/transactions/{transactionId}`
- **THEN** el sistema devuelve 201 con `{ recurrentId, transactionId, amountSnapshot, createdAt }`
- **THEN** el vínculo queda almacenado en `recurrent_transaction_links`

#### Scenario: Asignar el mismo par recurrente-transacción dos veces falla
- **WHEN** se hace POST `/recurrents/{recurrentId}/transactions/{transactionId}` y ya existe ese vínculo
- **THEN** el sistema devuelve 409

#### Scenario: Asignar a un recurrente inexistente falla
- **WHEN** se hace POST `/recurrents/{recurrentId}/transactions/{transactionId}` con un `recurrentId` que no existe
- **THEN** el sistema devuelve 404

#### Scenario: Asignar a una transacción inexistente falla
- **WHEN** se hace POST `/recurrents/{recurrentId}/transactions/{transactionId}` con un `transactionId` que no existe
- **THEN** el sistema devuelve 404

### Requirement: Desvincular un recurrente de una transacción
El sistema SHALL permitir eliminar el vínculo entre un artículo recurrente y una transacción.

#### Scenario: Desvincular un par existente
- **WHEN** se hace DELETE `/recurrents/{recurrentId}/transactions/{transactionId}`
- **THEN** el sistema devuelve 204 y el vínculo desaparece

#### Scenario: Desvincular un par inexistente falla
- **WHEN** se hace DELETE `/recurrents/{recurrentId}/transactions/{transactionId}` y el vínculo no existe
- **THEN** el sistema devuelve 404

### Requirement: Ver transacciones vinculadas a un recurrente
El sistema SHALL devolver la lista de transacciones vinculadas a un recurrente, ordenadas por fecha descendente.

#### Scenario: Listar transacciones de un recurrente
- **WHEN** se hace GET `/recurrents/{recurrentId}/transactions`
- **THEN** el sistema devuelve 200 con array de `{ transactionId, transactionDate, transactionAmount, amountSnapshot, ... }` ordenado por `transactionDate` desc

#### Scenario: Recurrente sin transacciones devuelve array vacío
- **WHEN** se hace GET `/recurrents/{recurrentId}/transactions` y no hay vínculos
- **THEN** el sistema devuelve 200 con `[]`

### Requirement: Desglose de recurrentes en transacción
El endpoint de transacciones SHALL incluir en cada transacción la lista de recurrentes vinculados con su `amountSnapshot`, la suma total y la diferencia respecto al `amount` de la transacción.

#### Scenario: Transacción con recurrentes devuelve desglose
- **WHEN** se hace GET `/transactions` o GET `/transactions/{id}`
- **THEN** cada transacción incluye `recurrents: [{ recurrentId, name, establishment, amountSnapshot }]`, `recurrentsTotal` (suma de snapshots) y `recurrentsDiff` (`amount - recurrentsTotal`)

#### Scenario: Transacción sin recurrentes devuelve arrays vacíos
- **WHEN** se hace GET `/transactions` o GET `/transactions/{id}` para una transacción sin vínculos
- **THEN** `recurrents` es `[]`, `recurrentsTotal` es `0.00` y `recurrentsDiff` es igual a `amount`

### Requirement: Eliminación en cascada de vínculos
Cuando se elimina un artículo recurrente o una transacción, el sistema SHALL eliminar automáticamente todos sus vínculos en `recurrent_transaction_links`.

#### Scenario: Borrar recurrente elimina sus vínculos
- **WHEN** se elimina un artículo recurrente que tiene vínculos con transacciones
- **THEN** los registros de `recurrent_transaction_links` con ese `recurrent_id` son eliminados

#### Scenario: Borrar transacción elimina sus vínculos
- **WHEN** se elimina una transacción que tiene vínculos con recurrentes
- **THEN** los registros de `recurrent_transaction_links` con ese `transaction_id` son eliminados

### Requirement: Modal de asignación con búsqueda y rango de fechas
La pantalla "Recurrentes" SHALL proporcionar un modal para asignar transacciones a un recurrente. El modal SHALL incluir un campo de autocompletado para buscar transacciones y un datepicker de rango de fechas (desde/hasta). El rango por defecto SHALL ser `[nextPredictedDate - 48h, nextPredictedDate + 48h]`. Si `nextPredictedDate` es null, el datepicker abre sin rango por defecto.

#### Scenario: Modal se abre con rango por defecto cuando hay periodicity
- **WHEN** el usuario abre el modal de asignación para un recurrente con `periodicity` definido
- **THEN** el datepicker muestra por defecto `from = nextPredictedDate - 48h` y `to = nextPredictedDate + 48h`

#### Scenario: Modal se abre sin rango por defecto cuando periodicity es null
- **WHEN** el usuario abre el modal de asignación para un recurrente con `periodicity` null
- **THEN** el datepicker no tiene rango por defecto

#### Scenario: Autocomplete filtra transacciones por texto y rango de fechas
- **WHEN** el usuario escribe en el campo de búsqueda del modal
- **THEN** se muestran transacciones que coincidan con el texto en `emitterName`, `receiverName` o `description`, filtradas al rango de fechas seleccionado

#### Scenario: Seleccionar transacción y confirmar crea el vínculo
- **WHEN** el usuario selecciona una transacción del autocomplete y pulsa "Asignar"
- **THEN** se llama al endpoint de asignación y el modal se cierra

### Requirement: Desglose expandible en pantalla de transacciones
La pantalla "Transacciones" SHALL mostrar un indicador visual en las filas que tengan recurrentes vinculados y SHALL permitir expandir la fila para ver el desglose: nombre y establecimiento de cada recurrente, su `amountSnapshot`, la suma total y la diferencia con el importe de la transacción.

#### Scenario: Transacción con recurrentes muestra indicador y es expandible
- **WHEN** una transacción tiene al menos un recurrente vinculado
- **THEN** la fila muestra un indicador (chip o icono) y un control de expansión

#### Scenario: Expansión muestra desglose completo
- **WHEN** el usuario expande una transacción con recurrentes
- **THEN** se muestran filas con `name`, `establishment` y `amountSnapshot` de cada recurrente, más la fila de total y la fila de diferencia

#### Scenario: Transacción sin recurrentes no tiene control de expansión
- **WHEN** una transacción no tiene recurrentes vinculados
- **THEN** la fila no muestra indicador ni control de expansión
