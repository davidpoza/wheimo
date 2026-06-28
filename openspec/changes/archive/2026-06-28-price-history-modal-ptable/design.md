## Context

El modal `PriceHistoryDialogComponent` muestra el historial con una `<table class="history-table">` HTML manual y un `@if` separado para el estado vacío. El resto de la app ya usa `p-table` de PrimeNG (ver `upcoming-recurrents.component.html`, `transaction-grid`, `tags-grid`...). Esta es una migración de presentación de UI, sin cambios de datos ni de API. La verificación visual se hará con el MCP de Chrome DevTools sobre la app en ejecución.

## Goals / Non-Goals

**Goals:**
- Sustituir la tabla manual por `p-table` con el mismo look&feel que el resto de la app.
- Mover el estado vacío a `pTemplate="empty"`.
- Verificar visualmente el resultado (espaciado, ancho, hover) con Chrome DevTools.

**Non-Goals:**
- No se añaden ordenación, paginación ni filtros (volumen de entradas pequeño).
- No se toca el formulario de "Registrar precio" ni la lógica de carga/guardado.
- No se modifica la API ni el modelo de datos.

## Decisions

- **Usar `p-table` con plantillas `header`/`body`/`empty`**, replicando el patrón de `upcoming-recurrents` (`styleClass="p-datatable-sm"`, `[rowHover]="true"`). Alternativa descartada: estilar la `<table>` manual con CSS propio — duplicaría estilos y seguiría divergiendo del sistema de diseño.
- **`[value]="history()"`** enlazando directamente al signal existente; las pipes `date` y `currency` se mantienen en celda. No se cambia el shape de `RecurrentPriceEntry`.
- **Estado vacío vía `pTemplate="empty"`** con `colspan` adecuado, eliminando el bloque `@if (history().length === 0)`.
- **Importar `TableModule`** en el componente y eliminar `DatePipe`/`CurrencyPipe` solo si dejaran de usarse (se siguen usando en celdas, así que se conservan).
- **Conservar `[style]="{ width: '520px' }"`** del diálogo salvo que la verificación visual indique que necesita ajuste para que la tabla respire.

## Risks / Trade-offs

- [Estilos PrimeNG no heredan dentro del `p-dialog`] → Verificar con Chrome DevTools que `p-datatable-sm` se aplica correctamente dentro del modal; ajustar contenedor si hay desbordamiento.
- [Regresión visual menor en espaciado] → Comparar antes/después con captura de pantalla del MCP antes de dar por cerrado.
