## ADDED Requirements

### Requirement: Crear tracker de precio
El sistema SHALL permitir crear una nueva configuración de seguimiento de precios (PriceTracker), especificando nombre, tipo de fetcher y parámetros específicos del fetcher (en formato JSON). El tracker queda activo por defecto.

#### Scenario: Crear tracker gasoil correctamente
- **WHEN** se hace POST `/api/price-trackers` con `{"name": "Gasoil Madrid", "fetcherType": "GASOIL", "params": {"municipioId": "4902", "productoId": "1", "aggregation": "min"}}`
- **THEN** el sistema devuelve 201 con `{id, name, fetcherType, params, active: true, createdAt}`

#### Scenario: Crear tracker con nombre duplicado falla
- **WHEN** se hace POST `/api/price-trackers` con un nombre que ya existe
- **THEN** el sistema devuelve 409

#### Scenario: Crear tracker con fetcherType inválido falla
- **WHEN** se hace POST `/api/price-trackers` con `fetcherType` desconocido
- **THEN** el sistema devuelve 400

#### Scenario: Crear tracker sin nombre falla
- **WHEN** se hace POST `/api/price-trackers` sin campo `name`
- **THEN** el sistema devuelve 400

### Requirement: Listar trackers de precio
El sistema SHALL devolver la lista de todos los trackers de precio configurados, ordenados por nombre.

#### Scenario: Listar trackers existentes
- **WHEN** se hace GET `/api/price-trackers`
- **THEN** el sistema devuelve 200 con array `[{id, name, fetcherType, params, active, createdAt}]` ordenado por nombre

#### Scenario: Sin trackers devuelve array vacío
- **WHEN** se hace GET `/api/price-trackers` y no hay ninguno configurado
- **THEN** el sistema devuelve 200 con `[]`

### Requirement: Obtener tracker por ID
El sistema SHALL devolver el detalle de un tracker específico por su ID.

#### Scenario: Tracker existente
- **WHEN** se hace GET `/api/price-trackers/{id}` con un id válido
- **THEN** el sistema devuelve 200 con `{id, name, fetcherType, params, active, createdAt}`

#### Scenario: Tracker inexistente
- **WHEN** se hace GET `/api/price-trackers/{id}` con un id que no existe
- **THEN** el sistema devuelve 404

### Requirement: Actualizar tracker de precio
El sistema SHALL permitir modificar el nombre, parámetros o estado activo de un tracker existente.

#### Scenario: Actualizar nombre y parámetros
- **WHEN** se hace PUT `/api/price-trackers/{id}` con nuevos valores de `name` y/o `params`
- **THEN** el sistema devuelve 200 con el tracker actualizado

#### Scenario: Desactivar tracker
- **WHEN** se hace PUT `/api/price-trackers/{id}` con `{"active": false}`
- **THEN** el sistema devuelve 200 con `active: false` y el scheduler omite ese tracker en futuras ejecuciones

#### Scenario: Actualizar tracker inexistente
- **WHEN** se hace PUT `/api/price-trackers/{id}` con un id que no existe
- **THEN** el sistema devuelve 404

### Requirement: Eliminar tracker de precio
El sistema SHALL permitir eliminar un tracker y todas sus lecturas de precio asociadas en cascada.

#### Scenario: Eliminar tracker existente
- **WHEN** se hace DELETE `/api/price-trackers/{id}`
- **THEN** el sistema devuelve 204 y elimina el tracker y todas sus `price_readings`

#### Scenario: Eliminar tracker inexistente
- **WHEN** se hace DELETE `/api/price-trackers/{id}` con un id que no existe
- **THEN** el sistema devuelve 404

### Requirement: Consultar lecturas de precio de un tracker
El sistema SHALL devolver el historial de lecturas de precio de un tracker dentro de un rango de fechas opcional.

#### Scenario: Lecturas en rango de fechas
- **WHEN** se hace GET `/api/price-trackers/{id}/readings?from=2024-01-01&to=2024-12-31`
- **THEN** el sistema devuelve 200 con array `[{id, readingDate, value}]` ordenado por `readingDate` ascendente

#### Scenario: Lecturas sin filtro de fecha
- **WHEN** se hace GET `/api/price-trackers/{id}/readings` sin parámetros
- **THEN** el sistema devuelve 200 con todas las lecturas del tracker ordenadas por `readingDate` ascendente

#### Scenario: Sin lecturas devuelve array vacío
- **WHEN** se hace GET `/api/price-trackers/{id}/readings` para un tracker sin lecturas
- **THEN** el sistema devuelve 200 con `[]`

### Requirement: Tipos de fetcher disponibles
El sistema SHALL exponer la lista de tipos de fetcher disponibles con sus parámetros requeridos, para que la UI pueda construir el formulario dinámico.

#### Scenario: Listar tipos de fetcher
- **WHEN** se hace GET `/api/price-trackers/fetcher-types`
- **THEN** el sistema devuelve 200 con array `[{type: "GASOIL", label: "Gasoil (MINETUR)", paramSchema: {...}}]`
