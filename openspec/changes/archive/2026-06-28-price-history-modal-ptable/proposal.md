## Why

El modal "Historial de precios" renderiza las entradas con una `<table>` HTML plana sin estilos de PrimeNG, lo que rompe la consistencia visual con el resto de la app (que usa `p-table`) y ofrece un layout pobre: sin hover, sin cabecera estilada, sin estado vacío coherente y con espaciado irregular. Unificarlo con `p-table` mejora la legibilidad y mantiene un único lenguaje visual.

## What Changes

- Reemplazar la `<table class="history-table">` del modal por un `p-table` de PrimeNG, siguiendo el patrón ya usado en `upcoming-recurrents` (`styleClass="p-datatable-sm"`, `[rowHover]="true"`, plantillas `header`/`body`/`empty`).
- Migrar el estado vacío ("Sin entradas de precio aún.") a la plantilla `pTemplate="empty"` del `p-table` en lugar de un `@if` separado.
- Importar `TableModule` en el componente y retirar el markup/estilos de la tabla manual.
- Ajustar el ancho/espaciado del `p-dialog` si hace falta para que la tabla respire, verificando el resultado visualmente con el MCP de Chrome DevTools.

## Capabilities

### New Capabilities
- `price-history-modal-ui`: Presentación del historial de precios dentro del modal de un artículo recurrente, usando el componente de tabla estándar de PrimeNG con cabecera, hover, formato de fecha/importe y estado vacío.

### Modified Capabilities
<!-- Ninguna: el comportamiento de la API (capability `price-history`) no cambia; esto es presentación de UI. -->

## Impact

- `frontend/src/app/features/recurrents/price-history-dialog/price-history-dialog.component.html`
- `frontend/src/app/features/recurrents/price-history-dialog/price-history-dialog.component.ts` (imports)
- Sin cambios de backend ni de API. Sin breaking changes.
