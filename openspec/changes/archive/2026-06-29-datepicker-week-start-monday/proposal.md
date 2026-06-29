## Why

Los datepickers de la aplicación muestran la semana empezando en domingo (comportamiento por defecto de PrimeNG), lo cual no es el estándar en España/Europa donde la semana empieza el lunes. Esto genera confusión al seleccionar fechas.

## What Changes

- Añadir `[firstDayOfWeek]="1"` a todos los componentes `<p-datepicker>` de la aplicación.
- Afecta a 9 instancias de `p-datepicker` repartidas en 5 ficheros HTML.

## Capabilities

### New Capabilities

*(ninguna — solo corrección de configuración)*

### Modified Capabilities

*(ninguna — no hay cambio en requisitos de negocio, solo corrección visual)*

## Impact

Ficheros HTML afectados:
- `frontend/src/app/features/transactions/create-transaction-dialog/create-transaction-dialog.component.html` (2 datepickers)
- `frontend/src/app/features/transactions/transaction-filter/transaction-filter.component.html` (4 datepickers)
- `frontend/src/app/features/recurrents/assign-transaction-dialog/assign-transaction-dialog.component.html` (1 datepicker)
- `frontend/src/app/features/recurrents/price-history-dialog/price-history-dialog.component.html` (1 datepicker)
- `frontend/src/app/features/recurrents/recurrents-list/recurrents-list.component.html` (1 datepicker)

Sin cambios en TypeScript, tests ni APIs.
