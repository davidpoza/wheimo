## Why

La pantalla de artículos recurrentes usa una tabla HTML nativa mientras que el resto de la app (ej. `transaction-grid`) ya utiliza `p-table` de PrimeNG. Unificar el componente mejora la consistencia visual y aprovecha funcionalidades nativas de PrimeNG como el estado vacío integrado, estilos cohesivos y mejor mantenibilidad.

## What Changes

- Reemplazar el `<table>` nativo en `recurrents-list.component.html` por `<p-table>`
- Añadir `TableModule` de PrimeNG a los imports del componente
- Eliminar el bloque `@if (recurrents().length === 0)` manual; usar `pTemplate="empty"` de p-table
- Adaptar las filas y columnas al formato de templates de PrimeNG (`pTemplate="header"`, `pTemplate="body"`)
- Ajustar estilos SCSS para alinearse con la nueva estructura de p-table

## Capabilities

### New Capabilities
<!-- ninguna nueva capacidad de negocio -->

### Modified Capabilities
<!-- ningún cambio en requisitos de negocio; es un cambio puramente de implementación UI -->

## Impact

- `frontend/src/app/features/recurrents/recurrents-list/recurrents-list.component.html` — sustitución del marcado de tabla
- `frontend/src/app/features/recurrents/recurrents-list/recurrents-list.component.ts` — añadir `TableModule` a imports
- `frontend/src/app/features/recurrents/recurrents-list/recurrents-list.component.scss` — revisión/limpieza de estilos de tabla
- Sin cambios en backend, API, modelos ni otras pantallas
