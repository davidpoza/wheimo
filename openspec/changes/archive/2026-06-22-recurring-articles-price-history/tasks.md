## 1. Base de datos (migraciones Flyway)

- [x] 1.1 Crear V11__alter_recurrents.sql: renombrar `emitter` → `establishment`, añadir `periodicity INT`, añadir `link TEXT`, eliminar `transaction_id`
- [x] 1.2 Crear V12__create_recurrent_price_entries.sql: tabla con `id`, `recurrent_id` (FK), `amount`, `recorded_at`

## 2. Backend — Entidad Recurrent

- [x] 2.1 Actualizar `Recurrent.java`: renombrar campo `emitter` → `establishment`, añadir `periodicity` (Integer), añadir `link` (String), eliminar relación `transaction`
- [x] 2.2 Actualizar `RecurrentDto.java`: reflejar los nuevos campos y eliminar `transactionId`

## 3. Backend — Entidad RecurrentPriceEntry

- [x] 3.1 Crear `RecurrentPriceEntry.java`: entidad JPA con `id`, `recurrent` (ManyToOne), `amount`, `recordedAt`
- [x] 3.2 Crear `RecurrentPriceEntryRepository.java`: con método `findByRecurrentIdOrderByRecordedAtDesc`
- [x] 3.3 Crear `RecurrentPriceEntryDto.java`: con `id`, `amount`, `recordedAt`

## 4. Backend — Servicio

- [x] 4.1 Actualizar `RecurrentService.java`: adaptar `create` y `updateById` a nuevos campos; bloquear edición directa de `amount`
- [x] 4.2 Añadir método `addPriceEntry(Long recurrentId, BigDecimal amount, OffsetDateTime recordedAt)` en `RecurrentService`: crea entrada y actualiza `recurrents.amount`
- [x] 4.3 Añadir método `getPriceHistory(Long recurrentId)` en `RecurrentService`: devuelve historial ordenado desc

## 5. Backend — Controlador

- [x] 5.1 Actualizar `RecurrentController.java`: adaptar `create` y `update` a nuevos campos (`establishment`, `periodicity`, `link`)
- [x] 5.2 Añadir endpoint `POST /recurrents/{id}/prices` en `RecurrentController`
- [x] 5.3 Añadir endpoint `GET /recurrents/{id}/prices` en `RecurrentController`

## 6. Frontend — Formulario de artículo recurrente

- [x] 6.1 Actualizar el formulario de creación/edición de recurrentes: sustituir campo `emitter` por `establishment`, añadir `periodicity` (número) y `link` (texto)
- [x] 6.2 Actualizar el servicio/modelo Angular de recurrentes para reflejar los nuevos campos
- [x] 6.3 Actualizar la vista de listado de recurrentes para mostrar `establishment`, `periodicity` y `link`

## 7. Frontend — Historial de precios

- [x] 7.1 Crear servicio Angular con métodos para `POST` y `GET` de `/recurrents/{id}/prices`
- [x] 7.2 Crear componente de diálogo/panel de historial de precios: tabla con columnas `Fecha` y `Precio`
- [x] 7.3 Añadir formulario para registrar nueva entrada de precio (campo `amount`, campo `recordedAt` opcional)
- [x] 7.4 Integrar el panel de historial en la vista de detalle/edición del artículo recurrente
