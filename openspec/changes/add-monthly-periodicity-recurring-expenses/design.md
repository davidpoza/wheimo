## Context

Los artículos recurrentes soportan actualmente dos tipos de periodicidad:
- `DAYS`: el gasto se repite cada N días (campo `periodicity`). El backend calcula la próxima fecha proyectada usando el último pago vinculado o `startDate` como ancla.
- `ANNUAL`: el gasto ocurre una vez al año en el mes indicado por `periodicityMonth` (1-12). La pantalla Upcoming lo muestra durante los 7 días previos al 1 del mes objetivo.

La tabla `recurrents` ya tiene las columnas `periodicity_type` (VARCHAR) y `periodicity_month` (INTEGER), pero no existe un campo para el día del mes.

## Goals / Non-Goals

**Goals:**
- Añadir el tipo `MONTHLY` que representa un gasto mensual en un día concreto del mes (1-31).
- Calcular la próxima fecha de ocurrencia para `MONTHLY` (próximo día-N desde hoy).
- Mostrar los `MONTHLY` en la pantalla Upcoming cuando su próxima ocurrencia está dentro de 7 días.
- Actualizar formulario de creación/edición y etiquetas de periodicidad en frontend.

**Non-Goals:**
- Añadir otros tipos de periodicidad (semanal, trimestral, etc.).
- Modificar la lógica existente de `DAYS` o `ANNUAL`.
- Cambiar la ventana de upcoming para los tipos existentes.

## Decisions

### 1. Nueva columna `periodicity_day` en lugar de reutilizar `periodicity_month`

La columna `periodicity_month` almacena el mes del año (1-12) para el tipo `ANNUAL`. Reutilizarla para el día del mes del tipo `MONTHLY` mezclaría semánticas distintas bajo el mismo campo, dificultando queries y lecturas de código.

**Decisión**: Añadir nueva columna `periodicity_day INTEGER NULL` mediante migración Flyway `V26`.

**Alternativa descartada**: Reutilizar `periodicity_month` para ambos usos — rechazado por ambigüedad semántica.

### 2. Algoritmo de próxima fecha para MONTHLY

Dado el día del mes D y la fecha de hoy:
- Si hoy es anterior al día D del mes actual → próxima ocurrencia = día D del mes actual.
- Si hoy es el día D o posterior → próxima ocurrencia = día D del mes siguiente.
- Si el mes no tiene el día D (ej. febrero no tiene día 30) → usar el último día del mes (`YearMonth.lengthOfMonth()`).

**Ventana Upcoming**: mostrar cuando `hoy >= próximaFecha - 7 días` y `hoy < próximaFecha`. Coherente con la ventana usada para `ANNUAL`.

### 3. `nextPredictedDate` para MONTHLY en el DTO

El campo `nextPredictedDate` actualmente solo se calcula para `DAYS`. Se extiende para calcular también para `MONTHLY`, siguiendo el mismo patrón.

**Alternativa descartada**: Devolver null para MONTHLY en `nextPredictedDate` — rechazado porque el frontend puede usarlo para mostrar la fecha.

## Risks / Trade-offs

- **Días 29-31 en meses cortos** → Mitigación: usar `YearMonth.of(year, month).lengthOfMonth()` para clampar al último día válido del mes.
- **Recurrentes sin `periodicityDay` configurado** → Se filtran en la lógica de upcoming (se requiere campo no nulo para calcular próxima fecha). El formulario lo exige al seleccionar tipo MONTHLY.

## Migration Plan

1. Añadir migración `V26__add_periodicity_day_to_recurrents.sql` con `ALTER TABLE recurrents ADD COLUMN periodicity_day INTEGER NULL`.
2. Deploy backend (sin cambios breaking: columna nullable, tipos existentes sin modificar).
3. Deploy frontend (nuevo tipo disponible en formulario).
4. Rollback: si falla, revertir al tag anterior; la columna queda sin uso pero no rompe nada.

## Open Questions

_(ninguna — el alcance está claro)_
