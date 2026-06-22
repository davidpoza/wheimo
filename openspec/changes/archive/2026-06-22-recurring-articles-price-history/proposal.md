## Why

La entidad `Recurrent` existente es demasiado básica: le faltan campos clave (periodicidad, link, establecimiento) y no permite hacer seguimiento de la evolución del precio en el tiempo. Necesitamos enriquecerla y añadir un historial de precios para poder detectar subidas y bajadas de artículos recurrentes.

## What Changes

- Ampliar la entidad `Recurrent` con los campos `periodicity` (días), `link` (URL), y renombrar `emitter` → `establishment`
- Eliminar la columna `transaction_id` de `Recurrent` (era un acoplamiento innecesario con transactions)
- Crear la entidad `RecurrentPriceEntry` para registrar cada cambio de precio de un artículo recurrente, con `amount` y `recorded_at`
- Exponer endpoints REST para gestionar el historial de precios de un recurrente
- Actualizar DTOs, servicio y migraciones de base de datos

## Capabilities

### New Capabilities
- `recurring-articles`: Entidad artículo recurrente con nombre, periodicidad en días, importe, link y establecimiento. CRUD completo vía REST.
- `price-history`: Historial de precios asociado a un artículo recurrente, con endpoint para registrar nuevas entradas y consultar la evolución en el tiempo.

### Modified Capabilities

## Impact

- **Backend**: migración Flyway (ALTER TABLE recurrents + CREATE TABLE recurrent_price_entries), entidad JPA, DTO, repositorio, servicio y controlador REST
- **Frontend**: actualizar formulario de creación/edición de recurrentes con los nuevos campos; añadir vista de evolución de precios
- **BD**: columna `transaction_id` eliminada, nuevas columnas en `recurrents`, nueva tabla `recurrent_price_entries`
