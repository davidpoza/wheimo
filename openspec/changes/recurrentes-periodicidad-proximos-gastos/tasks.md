## 1. Base de datos

- [ ] 1.1 Crear migración Flyway V19 que añada `periodicity_type VARCHAR(10) NOT NULL DEFAULT 'DAYS'` y `periodicity_month INTEGER NULL` a la tabla `recurrents`

## 2. Backend — Modelo y DTO

- [ ] 2.1 Añadir campo `periodicityType` (String o enum `PeriodicityType`) y `periodicityMonth` (Integer) a la entidad `Recurrent`
- [ ] 2.2 Añadir `periodicityType` y `periodicityMonth` al `RecurrentDto`
- [ ] 2.3 Actualizar `RecurrentService.create()` para aceptar y persistir `periodicityType` y `periodicityMonth`
- [ ] 2.4 Actualizar `RecurrentService.updateById()` para permitir actualizar `periodicityType` y `periodicityMonth`
- [ ] 2.5 Actualizar `RecurrentService.toDto()` para mapear los nuevos campos
- [ ] 2.6 Actualizar `RecurrentController.create()` para leer `periodicityType` y `periodicityMonth` del body

## 3. Backend — Lógica de próximos gastos

- [ ] 3.1 Actualizar `RecurrentService.computeNextPredictedDate()` para devolver null si `periodicityType = ANNUAL`
- [ ] 3.2 Implementar método `RecurrentService.findUpcoming()` que filtra recurrentes según tipo y ventana temporal
- [ ] 3.3 Añadir endpoint `GET /recurrents/upcoming` en `RecurrentController` que llama a `findUpcoming()`

## 4. Frontend — Modelo y servicio

- [ ] 4.1 Actualizar interfaz `Recurrent` en `recurrent.model.ts` para incluir `periodicityType`, `periodicityMonth`
- [ ] 4.2 Añadir método `getUpcoming()` en `RecurrentsService` que llama a `GET /recurrents/upcoming`

## 5. Frontend — Formulario de creación/edición

- [ ] 5.1 Añadir controles `periodicityType` y `periodicityMonth` al `FormGroup` en `recurrents-list.component.ts`
- [ ] 5.2 Actualizar `openEdit()` para precargar `periodicityType` y `periodicityMonth`
- [ ] 5.3 Actualizar `save()` para enviar `periodicityType` y `periodicityMonth`
- [ ] 5.4 Actualizar la plantilla HTML del formulario: añadir selector de tipo (`p-select`) y selector de mes condicional (`p-select` con meses en español), ocultando/mostrando el campo `periodicity` según el tipo seleccionado

## 6. Frontend — Pantalla Próximos Gastos

- [ ] 6.1 Crear componente `upcoming-recurrents` en `frontend/src/app/features/recurrents/upcoming-recurrents/`
- [ ] 6.2 Implementar la lógica del componente: llamar a `getUpcoming()` en `ngOnInit` y mostrar la lista
- [ ] 6.3 Crear la plantilla HTML del componente con la lista de recurrentes próximos (nombre, establecimiento, importe, tipo) y mensaje de vacío
- [ ] 6.4 Añadir ruta `/upcoming` en `app.routes.ts` apuntando al nuevo componente
- [ ] 6.5 Añadir ítem "Próximos gastos" (icono `pi pi-clock`) al array `navItems` en `app-layout.component.ts`
