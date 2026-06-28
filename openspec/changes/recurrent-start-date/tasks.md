## 1. Base de datos

- [x] 1.1 Crear migración Flyway `V25__add_recurrent_start_date.sql` que añada `start_date DATE NULL` a la tabla `recurrents`

## 2. Backend — Modelo y DTO

- [x] 2.1 Añadir campo `LocalDate startDate` (columna `start_date`) a la entidad `Recurrent`
- [x] 2.2 Añadir `LocalDate startDate` al `RecurrentDto`
- [x] 2.3 Actualizar `RecurrentService.create()` para aceptar y persistir `startDate` (nuevo parámetro)
- [x] 2.4 Actualizar `RecurrentService.updateById()` para permitir actualizar `startDate` (parsear `String` → `LocalDate`, admitir null)
- [x] 2.5 Actualizar `RecurrentService.toDto()` para mapear `startDate`
- [x] 2.6 Actualizar `RecurrentController.create()` para leer `startDate` del body (parsear `LocalDate.parse(...)` si presente)

## 3. Backend — Lógica del siguiente gasto

- [x] 3.1 Refactorizar `RecurrentService.computeNextPredictedDate()`: base por prioridad última transacción vinculada → `startDate` → `createdAt`; convertir la base a `LocalDate`
- [x] 3.2 Implementar el "roll-forward": si `base >= hoy` devolver `base`; si no, `n = ceil((hoy - base) / periodicity)` y devolver `base + n·periodicity`
- [x] 3.3 Devolver el resultado como `OffsetDateTime` a medianoche UTC para no romper la pantalla "Próximos gastos" ni el frontend; mantener null si `periodicity` es null o el tipo no es `DAYS`

## 4. Frontend — Modelo y servicio

- [x] 4.1 Añadir `startDate: string | null` a la interfaz `Recurrent` en `recurrent.model.ts`
- [x] 4.2 Verificar/actualizar `RecurrentsService` para enviar `startDate` en create y update

## 5. Frontend — Formulario de creación/edición

- [x] 5.1 Añadir control `startDate` al `FormGroup` en `recurrents-list.component.ts`
- [x] 5.2 Actualizar `openEdit()` para precargar `startDate`
- [x] 5.3 Actualizar `save()` para enviar `startDate` como `YYYY-MM-DD` (solo cuando el tipo es `DAYS`), admitiendo vacío/null
- [x] 5.4 Añadir un `p-datepicker` de fecha de inicio en la plantilla, visible solo cuando `periodicityType === 'DAYS'`
- [x] 5.5 Añadir las literales i18n necesarias (label/placeholder de fecha de inicio) en los archivos de traducción

## 6. Verificación

- [ ] 6.1 Probar: crear recurrente `DAYS` con `startDate` en el pasado → `nextPredictedDate` es la primera ocurrencia futura
- [ ] 6.2 Probar: `startDate` en el futuro → `nextPredictedDate` igual a `startDate`
- [ ] 6.3 Probar: recurrente con transacción vinculada → la base sigue siendo la transacción, no `startDate`
- [ ] 6.4 Probar: recurrente sin `startDate` → comportamiento previo (base `createdAt`)
