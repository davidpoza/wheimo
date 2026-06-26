## Why

El `p-datepicker` dentro del modal de historial de precios queda recortado por el borde del diálogo al desplegarse, ya que `p-dialog` aplica `overflow: hidden` a su contenido. El mismo problema fue resuelto previamente para `p-select` y `p-multiselect` con `appendTo="body"`, y ahora debe extenderse al datepicker.

## What Changes

- Añadir `appendTo="body"` al `p-datepicker` en `price-history-dialog.component.html` para que el calendario se renderice en el documento raíz y no quede recortado por el modal.
- Extender el requirement `modal-select-overflow` para que cubra también componentes `p-datepicker`.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `modal-select-overflow`: Extender la especificación para incluir `p-datepicker` junto a `p-select` y `p-multiselect` como componentes que deben usar `appendTo="body"` dentro de modales.

## Impact

- `frontend/src/app/features/recurrents/price-history-dialog/price-history-dialog.component.html`: cambio de una línea (`appendTo="body"`).
- `openspec/specs/modal-select-overflow/spec.md`: nuevo scenario para el datepicker del modal de historial de precios.
