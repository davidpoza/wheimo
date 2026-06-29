## Why

La tabla de tags carece de ordenación, lo que dificulta localizar un tag concreto cuando la lista crece. Habilitar la ordenación por nombre aporta la misma experiencia que ya existe en la pantalla de recurrentes.

## What Changes

- El endpoint `GET /tags` devolverá los registros ordenados por nombre ascendente por defecto.
- La cabecera de la columna "Nombre" en la tabla de tags será clicable para ordenar (ASC → DESC en clics sucesivos).
- La columna de acciones (botones editar/eliminar) no será ordenable.

## Capabilities

### New Capabilities

- `tags-table-sorting`: Ordenación de la tabla de tags por columna nombre (frontend) y orden por defecto name ASC en el backend.

### Modified Capabilities

<!-- ninguna -->

## Impact

- **Backend**: endpoint `GET /tags` (añadir `ORDER BY name ASC`).
- **Frontend**: `tags-grid.component.html` y `tags-grid.component.ts` — añadir `[sortable]` en la columna nombre de `p-table`.
- Sin cambios en modelos, rutas ni otros componentes.
