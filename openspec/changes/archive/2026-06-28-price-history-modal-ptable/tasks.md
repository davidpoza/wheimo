## 1. Componente (TS)

- [x] 1.1 Importar `TableModule` de `primeng/table` y añadirlo al array `imports` de `PriceHistoryDialogComponent`.
- [x] 1.2 Verificar que `CurrencyPipe` y `DatePipe` siguen necesarios (se usan en celdas) y mantenerlos.

## 2. Plantilla (HTML)

- [x] 2.1 Reemplazar la `<table class="history-table">` por un `<p-table [value]="history()" styleClass="p-datatable-sm" [rowHover]="true">`.
- [x] 2.2 Añadir `ng-template pTemplate="header"` con las columnas "Fecha" y "Precio".
- [x] 2.3 Añadir `ng-template pTemplate="body" let-entry` con celdas `{{ entry.recordedAt | date: 'dd/MM/yyyy HH:mm' }}` y `{{ entry.amount | currency: 'EUR' }}` (clase `amount` en la de precio).
- [x] 2.4 Mover el estado vacío a `ng-template pTemplate="emptymessage"` con el mensaje "Sin entradas de precio aún." y `colspan="2"`, eliminando el bloque `@if (history().length === 0)`. (Nota: en PrimeNG 21 el token correcto es `emptymessage`, no `empty`; el `empty` que usan otros componentes del repo se ignora silenciosamente.)
- [x] 2.5 Eliminar el markup de la tabla manual y cualquier estilo `.history-table` que quede huérfano (no había estilos `.history-table`; el componente no tiene `styleUrl`).

## 3. Verificación visual (Chrome DevTools MCP)

- [x] 3.1 Levantar el frontend y abrir el modal de historial de precios de un artículo recurrente con entradas.
- [x] 3.2 Con el MCP de Chrome DevTools, capturar pantalla y comprobar: cabecera estilada, hover de fila, sin desbordamiento horizontal y ancho del diálogo adecuado.
- [x] 3.3 Abrir el modal de un artículo sin entradas y verificar que se muestra el estado vacío vía `pTemplate="emptymessage"`.
- [x] 3.4 Ajustar `[style]` del `p-dialog` o el contenedor solo si la verificación detecta problemas de espacio. (No fue necesario: 520px es suficiente, sin desbordamiento.)

## 4. Cierre

- [x] 4.1 Ejecutar el build/lint del frontend y confirmar que no hay errores. (`ng build` OK, 5.4s, sin errores.)
