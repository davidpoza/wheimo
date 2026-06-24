## Why

La aplicación no está adaptada para uso en dispositivos móviles: la tabla de transacciones desborda el ancho de pantalla, el importe queda cortado, el faldón de filtros no muestra todos sus campos, la selección múltiple requiere checkboxes incómodos de pulsar y los botones de cabecera desperdician espacio con texto innecesario. Este cambio agrupa todas las mejoras de UX móvil en un único bloque cohesivo.

## What Changes

- **Columnas de la tabla de transacciones en móvil**: ocultar columnas Tags, Expand-toggle y Checkbox para que el importe (amount) sea siempre completamente visible sin scroll horizontal. La columna de descripción muestra hasta 2 líneas antes de truncar. Los anchos de amount y botones de acción se fijan para garantizar legibilidad.
- **Faldón de filtros adaptativo**: el `p-drawer` de filtros adopta su altura al contenido (hasta `90vh`) con scroll interno, evitando que los campos queden fuera de la vista.
- **Selección múltiple por long tap**: en móvil, mantener pulsada una fila 500ms activa el modo selección. Tap en modo selección alterna la fila. Banner con contador y botón Cancel. Al salir del modo selección los checkboxes (ocultos) siguen coordinados con la señal `selected` para que "Tag Selected" siga funcionando.
- **Botones de cabecera icon-only**: los botones de acción de las cabeceras de vista (New, Add Account, Nuevo artículo, New Budget, Tag Selected) muestran solo el icono en móvil.
- En escritorio todos los comportamientos actuales permanecen sin cambios.

## Capabilities

### New Capabilities

- `mobile-transaction-column-widths`: Layout de columnas adaptado para móvil; amount siempre visible sin scroll horizontal.
- `mobile-filter-drawer-adaptive-height`: Faldón de filtros con altura adaptativa al contenido.
- `mobile-description-two-line-clamp`: Descripción de transacción truncada a 2 líneas en móvil.
- `mobile-long-press-selection`: Modo selección múltiple activado por long tap, con banner de estado.
- `mobile-header-buttons-icon-only`: Botones de cabecera de vista muestran solo icono en móvil.

### Modified Capabilities

<!-- ninguna -->

## Impact

- `frontend/src/styles.scss`: clase utilitaria `.icon-only-mobile`.
- `frontend/src/app/features/transactions/transaction-grid/transaction-grid.component.html`: clases en columnas, eventos touch, banner de selección, `styleClass` en botones de cabecera.
- `frontend/src/app/features/transactions/transaction-grid/transaction-grid.component.ts`: señal `mobileSelectMode`, lógica long press, helpers de selección.
- `frontend/src/app/features/transactions/transaction-grid/transaction-grid.component.scss`: media query consolidada con columnas ocultas, anchos fijos, line-clamp, estilos de selección y banner.
- `frontend/src/app/features/transactions/transaction-filter/transaction-filter.component.scss`: altura adaptativa del drawer.
- `frontend/src/app/features/accounts/accounts-list/accounts-list.component.html`: `styleClass` en botón Add Account.
- `frontend/src/app/features/recurrents/recurrents-list/recurrents-list.component.html`: `styleClass` en botón Nuevo artículo.
- `frontend/src/app/features/budgets/budgets/budgets.component.html`: `styleClass` en botón New Budget.
