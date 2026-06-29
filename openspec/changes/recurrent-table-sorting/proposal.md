## Why

La tabla de pagos recurrentes no permite ordenar por columnas, lo que dificulta encontrar elementos cuando la lista crece. Además, el backend devuelve los registros sin orden garantizado, por lo que la lista cambia de posición en cada carga.

## What Changes

- El backend ordenará los recurrentes por `name ASC` por defecto en el endpoint `GET /recurrents`.
- La tabla frontend habilitará la ordenación interactiva por columnas (nombre, establecimiento, periodicidad, precio actual, coste total).
- Las columnas de acciones (link, botones) no serán ordenables.

## Capabilities

### New Capabilities

- `recurrent-table-sorting`: Ordenación interactiva de la tabla de recurrentes en frontend, con orden por defecto `name ASC` servido desde el backend.

### Modified Capabilities

<!-- No hay specs de requisitos existentes afectados -->

## Impact

- **Backend**: `RecurrentRepository` — añadir método con `ORDER BY name ASC`. `RecurrentService.findAll()` usa ese método.
- **Frontend**: `recurrents-list.component.html` — añadir `[sortField]`, `[sortOrder]` y atributos `pSortableColumn` + `<p-sortIcon>` en las cabeceras de la tabla `p-table`.
- Sin cambios en DTOs, modelos ni rutas de API.
