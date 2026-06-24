## Context

La pantalla `recurrents-list` muestra una tabla de artículos recurrentes usando un `<table>` HTML nativo con `@for` de Angular. El componente `transaction-grid` ya usa `p-table` de PrimeNG como referencia establecida en el proyecto. El cambio es puramente de capa de presentación.

## Goals / Non-Goals

**Goals:**
- Reemplazar `<table>` nativo por `<p-table>` en `recurrents-list.component.html`
- Usar los templates estándar de PrimeNG (`pTemplate="header"`, `pTemplate="body"`, `pTemplate="empty"`)
- Eliminar la lógica manual del estado vacío
- Mantener toda la funcionalidad existente: botones de acción, tooltips, link externo, formato de moneda

**Non-Goals:**
- No añadir paginación, ordenación ni filtrado (no los tiene ahora y no se piden)
- No modificar backend, modelos ni servicios
- No tocar los diálogos de edición, historial ni asignación de transacciones

## Decisions

### Usar `[value]` con signal directamente

`p-table` acepta `[value]="recurrents()"` directamente. No hace falta variable intermedia.

**Alternativa descartada:** Convertir el signal a observable — innecesario, p-table funciona con arrays.

### Sin paginación ni lazy loading

La lista de recurrentes es pequeña (decenas de items). No se necesita `[lazy]="true"` ni paginador como en `transaction-grid`.

### `styleClass="p-datatable-sm"`

Usar la misma clase que `transaction-grid` para mantener densidad visual consistente con el resto de la app.

### Limpiar estilos SCSS

El SCSS actual tiene reglas para `table`, `thead`, `tbody`, `tr`, `td` que dejan de aplicarse con `p-table`. Se revisarán y eliminarán para evitar residuos.

## Risks / Trade-offs

- [Estilos visuales] El aspecto puede cambiar ligeramente al pasar de tabla nativa a p-table → verificar en navegador tras implementar.
- [SCSS huérfano] Selectores de tabla nativa que queden en el SCSS no rompen nada pero ensucian el código → limpiar en la misma tarea.
