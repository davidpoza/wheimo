## Why

La fecha del próximo gasto de un recurrente de tipo `DAYS` se ancla hoy en la última transacción vinculada o, en su defecto, en `createdAt` (la fecha en que se dio de alta el recurrente). Esto impide modelar series cuya primera ocurrencia es distinta del día de alta (p. ej. una suscripción que empezó hace meses, o un pago que empezará en el futuro). El usuario necesita fijar explícitamente la **fecha de inicio** de la serie para que, conociendo la periodicidad, el sistema calcule correctamente el siguiente gasto.

## What Changes

- Añadir un campo opcional `startDate` (fecha) al modelo de recurrente como ancla de la serie.
- Cambiar el cálculo de `nextPredictedDate` para recurrentes de tipo `DAYS`:
  - La base de la serie pasa a ser, por orden de prioridad: la última transacción vinculada → `startDate` → `createdAt` (compatibilidad con registros existentes).
  - El siguiente gasto se calcula avanzando la base por la periodicidad de forma repetida hasta obtener la primera ocurrencia que cae hoy o en el futuro (en lugar de un único salto que podía quedar en el pasado).
- Exponer y aceptar `startDate` en la API (`POST /recurrents`, `PATCH /recurrents/{id}`, respuestas DTO).
- Añadir un selector de fecha de inicio al formulario de creación/edición de recurrentes en el frontend, visible solo para periodicidad de tipo `DAYS`.

## Capabilities

### New Capabilities
<!-- Ninguna capability nueva: se extiende la existente. -->

### Modified Capabilities

- `recurring-articles`: La entidad `Recurrent` incorpora `startDate` (opcional). El cálculo del próximo gasto (`nextPredictedDate`) para tipo `DAYS` usa la fecha de inicio como ancla y avanza por la periodicidad hasta la siguiente ocurrencia futura. La API de creación y actualización acepta `startDate`.

## Impact

- **Backend**: Migración Flyway (V25) que añade la columna `start_date DATE NULL` a `recurrents`. Entidad `Recurrent`, `RecurrentDto`, `RecurrentService` (`create`, `updateById`, `computeNextPredictedDate`, `toDto`) y `RecurrentController.create` actualizados.
- **Frontend**: Interfaz `Recurrent` (añadir `startDate`), `RecurrentsService`, y formulario en `recurrents-list.component.ts`/plantilla (selector de fecha condicionado a tipo `DAYS`). Nuevas literales i18n.
- **Base de datos**: Columna `start_date` nullable, sin impacto en registros existentes (mantienen el fallback a `createdAt`).
- **Compatibilidad**: No breaking. Los recurrentes sin `startDate` conservan el comportamiento actual.
