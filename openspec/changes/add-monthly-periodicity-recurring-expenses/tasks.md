## 1. Base de datos

- [x] 1.1 Crear migración `V26__add_periodicity_day_to_recurrents.sql` con `ALTER TABLE recurrents ADD COLUMN periodicity_day INTEGER NULL`

## 2. Backend — Modelo y DTO

- [x] 2.1 Añadir campo `periodicityDay` (Integer, nullable) a la entidad `Recurrent.java` con `@Column(name = "periodicity_day")`
- [x] 2.2 Añadir campo `periodicityDay` (Integer) a `RecurrentDto.java`

## 3. Backend — Lógica de servicio

- [x] 3.1 Actualizar `RecurrentService.create()` para aceptar y persistir `periodicityDay`
- [x] 3.2 Actualizar `RecurrentService.updateById()` para manejar el campo `periodicityDay` en el mapa de updates
- [x] 3.3 Implementar cálculo de `nextPredictedDate` para tipo `MONTHLY` en `computeNextPredictedDate()`: próximo día-N del mes con clamping al último día válido del mes
- [x] 3.4 Actualizar `RecurrentService.findUpcoming()` para incluir artículos `MONTHLY` cuya próxima ocurrencia esté dentro de los 7 días siguientes
- [x] 3.5 Actualizar `RecurrentService.toDto()` para incluir `periodicityDay` en el DTO devuelto

## 4. Backend — Controlador

- [x] 4.1 Actualizar `RecurrentController` (endpoint de creación) para aceptar `periodicityDay` en el body de la petición y pasarlo al servicio
- [x] 4.2 Verificar que el endpoint PATCH ya pasa el mapa de updates al servicio sin modificaciones adicionales (el campo `periodicityDay` debería fluir automáticamente)

## 5. Frontend — Modelo

- [x] 5.1 Añadir campo `periodicityDay: number | null` a la interfaz `Recurrent` en `recurrent.model.ts`

## 6. Frontend — Servicio

- [x] 6.1 Verificar que `RecurrentsService.create()` y `RecurrentsService.update()` incluyen `periodicityDay` en el payload enviado al backend

## 7. Frontend — Lista de recurrentes

- [x] 7.1 Añadir `MONTHLY` al getter `periodicityTypes` en `recurrents-list.component.ts` con etiqueta i18n `recurrents.list.periodicityType.monthly`
- [x] 7.2 Añadir control `periodicityDay` (null, número 1-31) al formulario reactivo en `recurrents-list.component.ts`
- [x] 7.3 Añadir validador de formulario `requireDayIfMonthly`: si `periodicityType === 'MONTHLY'` y `periodicityDay` es null → error `dayRequired`
- [x] 7.4 Añadir getter `isMonthly` en el componente para controlar visibilidad condicional en el template
- [x] 7.5 Actualizar `openEdit()` para parchear `periodicityDay` desde el recurrente editado
- [x] 7.6 Actualizar `save()`: cuando `periodicityType === 'MONTHLY'`, incluir `periodicityDay` y limpiar `periodicity`, `periodicityMonth` y `startDate`; para los otros tipos, limpiar `periodicityDay`
- [x] 7.7 Actualizar `periodicityLabel()` en `recurrents-list.component.ts` para devolver etiqueta "Mensual (día X)" cuando `periodicityType === 'MONTHLY'`
- [x] 7.8 Añadir en el template `recurrents-list.component.html` el bloque condicional `@if (isMonthly)` con un selector de día del mes (p-inputnumber, rango 1-31, formControlName="periodicityDay")
- [x] 7.9 Actualizar `openCreate()` para resetear también `periodicityDay` al abrir el diálogo de creación

## 8. Frontend — Upcoming

- [x] 8.1 Actualizar `periodicityLabel()` en `upcoming-recurrents.component.ts` para manejar tipo `MONTHLY` y devolver etiqueta "Mensual (día X)"
- [x] 8.2 Actualizar el template `upcoming-recurrents.component.html` para usar severidad distinta (`success` o `secondary`) en el tag de tipo `MONTHLY`

## 9. Internacionalización

- [x] 9.1 Añadir en `public/i18n/es.json` bajo `recurrents.list.periodicityType`: clave `monthly` con valor "Mensual"
- [x] 9.2 Añadir en `recurrents.list.form`: clave `paymentDay` ("Día del mes") y `selectDay` ("Selecciona un día")
- [x] 9.3 Añadir en `recurrents.list.periodicity`: clave `monthly` con valor "Mensual (día {{ day }})"
- [x] 9.4 Añadir en `recurrents.upcoming.periodicity`: clave `monthly` con valor "Mensual (día {{ day }})"
