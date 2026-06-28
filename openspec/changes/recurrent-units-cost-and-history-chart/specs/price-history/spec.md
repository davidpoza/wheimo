## MODIFIED Requirements

### Requirement: Registrar entrada de precio
El sistema SHALL permitir registrar una nueva entrada de precio para un artículo recurrente, con `amount` (obligatorio) y `units` (opcional). Al hacerlo, SHALL actualizar automáticamente el campo `amount` del artículo recurrente con el nuevo precio y, si se indica `units`, el campo `units` del artículo.

#### Scenario: Registrar precio de un artículo existente
- **WHEN** se hace POST `/recurrents/{id}/prices` con `amount` y opcionalmente `units` y `recordedAt`
- **THEN** el sistema devuelve 201 con la entrada creada (`id`, `amount`, `units`, `recordedAt`)
- **THEN** el campo `amount` del artículo recurrente queda actualizado al nuevo precio
- **THEN** si se indicó `units`, el campo `units` del artículo queda actualizado a ese valor

#### Scenario: Registrar precio sin unidades
- **WHEN** se hace POST `/recurrents/{id}/prices` con `amount` pero sin `units`
- **THEN** el sistema crea la entrada con `units` null y devuelve 201
- **THEN** el campo `units` del artículo no se modifica

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
El sistema SHALL devolver el historial de precios de un artículo recurrente ordenado por fecha descendente (más reciente primero), incluyendo las unidades de cada entrada cuando existan.

#### Scenario: Listar historial de precios
- **WHEN** se hace GET `/recurrents/{id}/prices`
- **THEN** el sistema devuelve 200 con array de entradas `[{id, amount, units, recordedAt}]` ordenadas por `recordedAt` desc

#### Scenario: Artículo sin historial devuelve array vacío
- **WHEN** se hace GET `/recurrents/{id}/prices` para un artículo sin entradas de precio
- **THEN** el sistema devuelve 200 con array vacío `[]`

#### Scenario: Historial de artículo inexistente falla
- **WHEN** se hace GET `/recurrents/{id}/prices` con un id que no existe
- **THEN** el sistema devuelve 404
