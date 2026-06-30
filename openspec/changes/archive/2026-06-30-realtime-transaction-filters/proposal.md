## Why

Los filtros de la pantalla de transacciones requieren pulsar "Aplicar" manualmente, lo que añade fricción innecesaria. Aplicarlos en tiempo real mejora la experiencia y acelera la exploración de datos.

## What Changes

- El campo de búsqueda de texto aplica el filtro con debounce mientras el usuario escribe (en lugar de requerir "Aplicar").
- Los selectores de cuenta, tags y tipo de operación aplican el filtro inmediatamente al cambiar.
- Los date pickers aplican el filtro inmediatamente al seleccionar una fecha.
- Se elimina el botón "Aplicar" (tanto en la barra de escritorio como en el drawer móvil).
- Se mantiene el botón "Resetear" en ambas vistas.
- En móvil, el drawer se cierra automáticamente cuando se aplican cambios en selectores/fechas, o tras un breve debounce en el campo de texto.

## Capabilities

### New Capabilities
- `realtime-transaction-filters`: Filtros que se aplican automáticamente en tiempo real sin necesidad de confirmación manual.

### Modified Capabilities
<!-- ninguna spec existente cambia sus requisitos -->

## Impact

- `transaction-filter.component.ts`: eliminar método `apply()`, añadir lógica de debounce y suscripciones reactivas a cambios de cada campo.
- `transaction-filter.component.html`: eliminar botón "Aplicar" en desktop y en drawer móvil; mantener botón "Resetear".
- No hay cambios en backend ni en el servicio de transacciones (se sigue llamando a `setFilters` + `loadAll`).
