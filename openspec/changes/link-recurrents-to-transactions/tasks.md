## 1. Base de datos (migraciones)

- [x] 1.1 Crear migración V13: añadir columna `note TEXT` a `transactions` + índice funcional `lower(note)`
- [x] 1.2 Crear migración V14: crear tabla `recurrent_transaction_links` con columnas `id`, `recurrent_id` (FK), `transaction_id` (FK), `amount_snapshot`, `created_at` y constraint `UNIQUE(recurrent_id, transaction_id)` con ON DELETE CASCADE en ambas FK

## 2. Backend — Entidades y repositorios

- [x] 2.1 Añadir campo `note` (String) a la entidad `Transaction` y al DTO `TransactionDto`
- [x] 2.2 Crear entidad JPA `RecurrentTransactionLink` mapeada a `recurrent_transaction_links`
- [x] 2.3 Crear `RecurrentTransactionLinkRepository` con métodos `findByRecurrentId`, `findByTransactionId` y `deleteByRecurrentIdAndTransactionId`
- [x] 2.4 Actualizar `UpdateTransactionRequest` para incluir campo `note` (nullable)

## 3. Backend — Lógica de negocio

- [x] 3.1 En `RecurrentService`: añadir método `assignTransaction(recurrentId, transactionId)` que guarda el vínculo con snapshot del `amount` actual
- [x] 3.2 En `RecurrentService`: añadir método `unassignTransaction(recurrentId, transactionId)`
- [x] 3.3 En `RecurrentService`: añadir método `getLinkedTransactions(recurrentId)` devolviendo lista ordenada por fecha desc
- [x] 3.4 En `RecurrentService`: calcular `nextPredictedDate` en el listado (fecha de última transacción vinculada + periodicity, o `createdAt` + periodicity si no hay vínculos; null si `periodicity` es null)
- [x] 3.5 En `TransactionService` (o `TransactionMapper`): al mapear una transacción a DTO, incluir `recurrents`, `recurrentsTotal` y `recurrentsDiff`
- [x] 3.6 Extender la búsqueda de transacciones (`search` filter) para incluir el campo `note` (ILIKE)

## 4. Backend — Controladores y DTOs

- [x] 4.1 Añadir campo `nextPredictedDate` a `RecurrentDto`
- [x] 4.2 Añadir campos `recurrents` (lista de `RecurrentLinkDto`), `recurrentsTotal` y `recurrentsDiff` a `TransactionDto`
- [x] 4.3 Crear `RecurrentLinkDto` con `recurrentId`, `name`, `establishment`, `amountSnapshot`
- [x] 4.4 Añadir endpoints en `RecurrentController`: `POST /recurrents/{id}/transactions/{txId}`, `DELETE /recurrents/{id}/transactions/{txId}`, `GET /recurrents/{id}/transactions`

## 5. Frontend — Modelo y servicio

- [x] 5.1 Actualizar el modelo `Recurrent` en Angular para incluir `nextPredictedDate`
- [x] 5.2 Actualizar el modelo `Transaction` para incluir `recurrents`, `recurrentsTotal`, `recurrentsDiff` y `note`
- [x] 5.3 Añadir métodos en el servicio de recurrentes: `assignTransaction(recurrentId, transactionId)`, `unassignTransaction(recurrentId, transactionId)`, `getLinkedTransactions(recurrentId)`
- [x] 5.4 Añadir método en el servicio de transacciones: `updateNote(transactionId, note)`

## 6. Frontend — Modal de asignación en pantalla Recurrentes

- [x] 6.1 Crear componente `AssignTransactionDialogComponent` con `MatDialog`
- [x] 6.2 Implementar `MatDateRangePicker` con rango por defecto `[nextPredictedDate - 48h, nextPredictedDate + 48h]` (sin defecto si `nextPredictedDate` es null)
- [x] 6.3 Implementar `MatAutocomplete` para buscar transacciones: llama a `GET /transactions?from=&to=&search=` con debounce
- [x] 6.4 Al seleccionar una transacción y pulsar "Asignar", llama al endpoint de asignación y cierra el modal
- [x] 6.5 Integrar el botón de apertura del modal en el listado de la pantalla Recurrentes (por cada item)
- [x] 6.6 Mostrar las transacciones ya vinculadas al recurrente dentro del modal (lista debajo del buscador) con opción de desvincular

## 7. Frontend — Desglose expandible en pantalla Transacciones

- [x] 7.1 Actualizar el componente de lista de transacciones para mostrar chip/icono cuando `recurrents.length > 0`
- [x] 7.2 Implementar fila expandible (Angular Material expansion panel o detail row) que muestre el desglose de recurrentes
- [x] 7.3 En la fila expandida mostrar: tabla con `name`, `establishment`, `amountSnapshot` por recurrente; fila de total (`recurrentsTotal`); fila de diferencia (`recurrentsDiff`) con estilo destacado si es negativo
- [x] 7.4 Añadir botón de desvincular recurrente dentro del desglose expandido

## 8. Frontend — Nota en detalle de transacción

- [x] 8.1 Añadir campo `note` (textarea editable) en el modal/panel de detalle de transacción
- [x] 8.2 Al perder el foco o pulsar guardar, llamar a PATCH `/transactions/{id}` con la nueva nota
- [x] 8.3 Asegurar que la búsqueda en el listado de transacciones (caja de búsqueda) pasa el texto como parámetro `search` (ya existente) — el backend ya incluirá la nota en el índice tras el paso 3.6
