## Why

La pantalla de recurrentes permite gestionar gastos periódicos (suscripciones, recibos, etc.), pero actualmente no hay forma de vincularlos a las transacciones reales del banco. Esto hace imposible saber si un gasto recurrente ya fue cobrado, cuándo, y si el importe coincide. Además, las transacciones carecen de notas, lo que impide anotar contexto sobre importes inusuales o gastos puntuales.

## What Changes

- **Nueva funcionalidad**: Modal en la pantalla "Recurrentes" para asignar uno o varios gastos recurrentes a una transacción bancaria existente, con buscador autocomplete y filtro de rango de fechas (por defecto ±48h alrededor de la próxima fecha predicha del recurrente).
- **Nueva funcionalidad**: Desglose de gastos recurrentes en la pantalla "Transacciones" — las transacciones con recurrentes asociados son expandibles y muestran el detalle de cada recurrente, la suma y la diferencia con el importe total.
- **Nueva funcionalidad**: Campo de nota en cada transacción, indexado para búsqueda, visible en la pantalla "Transacciones" y en el buscador.

## Capabilities

### New Capabilities

- `recurrent-transaction-link`: Vinculación de artículos recurrentes a transacciones bancarias. Cubre el modal de asignación (buscador autocomplete + datepicker ±48h), el modelo de datos many-to-many, y el desglose de recurrentes en la vista de transacciones (importes, suma y diferencia).
- `transaction-notes`: Campo de nota libre en transacciones, persistido, indexado para búsqueda de texto completo y visible tanto en el detalle de la transacción como al filtrar en el listado.

### Modified Capabilities

- `recurring-articles`: El artículo recurrente necesita exponer la "próxima fecha predicha" (calculada a partir de `periodicity` y la última asignación o `createdAt`), usada por el modal de asignación para prefijar el rango de fechas.

## Impact

- **Backend**: Nueva tabla `recurrent_transaction_links` (relación N-N entre `recurrents` y `transactions`). Nuevo campo `note` en la tabla `transactions`. Endpoint para asignar/desasignar recurrentes a una transacción. Endpoint de transacciones devuelve los recurrentes vinculados y la nota. La búsqueda de transacciones incluye el campo `note` en el índice.
- **Frontend**: Nuevo modal en la pantalla Recurrentes con `MatAutocomplete` + `MatDateRangePicker`. Componente de desglose expandible en la lista de transacciones. Campo de nota editable en el detalle de la transacción.
- **Base de datos**: Migración para añadir tabla `recurrent_transaction_links` y columna `note` en `transactions`.
