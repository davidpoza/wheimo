## ADDED Requirements

### Requirement: Registrar entrada de precio
El sistema SHALL permitir registrar una nueva entrada de precio para un artículo recurrente. Al hacerlo, SHALL actualizar automáticamente el campo `amount` del artículo recurrente con el nuevo valor.

#### Scenario: Registrar precio de un artículo existente
- **WHEN** se hace POST `/recurrents/{id}/prices` con `amount` y opcionalmente `recordedAt`
- **THEN** el sistema devuelve 201 con la entrada creada (`id`, `amount`, `recordedAt`)
- **THEN** el campo `amount` del artículo recurrente queda actualizado al nuevo valor

#### Scenario: Registrar precio sin indicar fecha usa la fecha actual
- **WHEN** se hace POST `/recurrents/{id}/prices` con `amount` pero sin `recordedAt`
- **THEN** el sistema asigna `recordedAt = now()` y devuelve 201

#### Scenario: Registrar precio para artículo inexistente falla
- **WHEN** se hace POST `/recurrents/{id}/prices` con un id de recurrente que no existe
- **THEN** el sistema devuelve 404

#### Scenario: Registrar precio sin amount falla
- **WHEN** se hace POST `/recurrents/{id}/prices` sin el campo `amount`
- **THEN** el sistema devuelve 400

### Requirement: Consultar historial de precios
El sistema SHALL devolver el historial de precios de un artículo recurrente ordenado por fecha descendente (más reciente primero).

#### Scenario: Listar historial de precios
- **WHEN** se hace GET `/recurrents/{id}/prices`
- **THEN** el sistema devuelve 200 con array de entradas `[{id, amount, recordedAt}]` ordenadas por `recordedAt` desc

#### Scenario: Artículo sin historial devuelve array vacío
- **WHEN** se hace GET `/recurrents/{id}/prices` para un artículo sin entradas de precio
- **THEN** el sistema devuelve 200 con array vacío `[]`

#### Scenario: Historial de artículo inexistente falla
- **WHEN** se hace GET `/recurrents/{id}/prices` con un id que no existe
- **THEN** el sistema devuelve 404

### Requirement: Eliminación en cascada del historial
Cuando un artículo recurrente es eliminado, el sistema SHALL eliminar todas sus entradas de historial de precios automáticamente.

#### Scenario: Borrar artículo borra su historial
- **WHEN** se elimina un artículo recurrente que tiene entradas de historial de precios
- **THEN** las entradas de `recurrent_price_entries` asociadas son eliminadas de la base de datos
