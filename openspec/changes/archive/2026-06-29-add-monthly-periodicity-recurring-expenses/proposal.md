## Why

Los gastos recurrentes actualmente solo soportan periodicidad por días o anual, pero muchos gastos reales son mensuales (cuotas, suscripciones, recibos). Añadir un tipo `MONTHLY` que especifique el día del mes permite modelar estos gastos correctamente y calcular sus próximas fechas en la pantalla "Upcoming".

## What Changes

- Nuevo valor de `periodicityType`: `MONTHLY`, que indica que el gasto ocurre una vez al mes en un día específico del mes (1-31).
- Nueva columna en BD: `periodicity_day` (integer, nullable) para almacenar el día del mes asociado al tipo `MONTHLY`.
- El backend calcula la próxima fecha de un recurrente `MONTHLY` como el próximo día-N del mes más cercano a hoy.
- La pantalla "Upcoming" muestra recurrentes `MONTHLY` cuando su próxima ocurrencia está dentro de una ventana de 7 días.
- El formulario de creación/edición de recurrentes muestra un selector de día del mes (1-31) cuando se elige tipo `MONTHLY`.
- Las etiquetas de periodicidad en la lista y en "Upcoming" muestran "Mensual (día X)" para el tipo `MONTHLY`.

## Capabilities

### New Capabilities

- `monthly-recurrent-periodicity`: Soporte de periodicidad mensual por día del mes en artículos recurrentes — creación, edición, cálculo de próxima fecha y visualización en Upcoming.

### Modified Capabilities

- `recurring-articles`: Se añade el tipo `MONTHLY` y campo `periodicityDay` al modelo de artículo recurrente, extendiendo los requisitos de creación, actualización y listado.

## Impact

- **Base de datos**: nueva migración Flyway (`V26__add_periodicity_day_to_recurrents.sql`) que añade la columna `periodicity_day INTEGER NULL` a la tabla `recurrents`.
- **Backend**: `Recurrent` entity, `RecurrentDto`, `RecurrentController`, `RecurrentService` (lógica de upcoming y nextPredictedDate para MONTHLY).
- **Frontend**: `recurrent.model.ts`, `recurrents-list.component` (formulario + tabla), `upcoming-recurrents.component` (etiqueta), i18n `es.json`.
- **Sin breaking changes en API**: el campo `periodicityDay` es nullable y los tipos existentes (`DAYS`, `ANNUAL`) no se modifican.
