## Context

Los gastos recurrentes de tipo `DAYS` predicen la próxima fecha de pago (`nextPredictedDate`) sumando `periodicity` días a una base, que actualmente es la última transacción vinculada o, si no hay ninguna, `createdAt`. Esto fuerza a que la serie empiece el día en que se da de alta el recurrente, lo cual no siempre es cierto. Además, el cálculo hace un único salto, por lo que si la base está lejos en el pasado, `nextPredictedDate` también queda en el pasado.

Stack: Java/Spring Boot (backend), Angular + PrimeNG (frontend), PostgreSQL + Flyway (BBDD). El código relevante está en `RecurrentService.computeNextPredictedDate()`, la entidad `Recurrent`, `RecurrentDto`, `RecurrentController.create()` y el formulario en `recurrents-list.component.ts`.

## Goals / Non-Goals

**Goals:**
- Permitir configurar una `startDate` opcional por recurrente como ancla de la serie.
- Calcular `nextPredictedDate` (tipo `DAYS`) avanzando por la periodicidad desde la base hasta la primera ocurrencia presente/futura.
- Mantener compatibilidad total con recurrentes existentes (sin `startDate` → comportamiento actual con `createdAt`).

**Non-Goals:**
- Cambiar el comportamiento del tipo `ANNUAL` (no usa `nextPredictedDate`).
- Modificar la lógica de la pantalla "Próximos gastos" más allá de consumir el nuevo `nextPredictedDate`.
- Generar automáticamente transacciones a partir de la serie.

## Decisions

### 1. Tipo y almacenamiento de `startDate`
**Decisión**: Columna `start_date DATE NULL` en `recurrents` (Flyway V25). En la entidad se mapea como `java.time.LocalDate startDate` (es una fecha sin hora ni zona, a diferencia de `createdAt` que es `OffsetDateTime`).

**Alternativas**: usar `OffsetDateTime` para homogeneidad — descartado: la fecha de inicio es un día natural y no debe depender de zona horaria ni hora.

### 2. Orden de prioridad de la base
**Decisión**: La base para la serie es, por prioridad: (1) última transacción vinculada, (2) `startDate`, (3) `createdAt`. Registrar un pago real (vincular transacción) sigue "reseteando" la serie; `startDate` solo sustituye al fallback `createdAt`.

**Rationale**: Es el menor cambio de comportamiento y el más predecible; conserva el valor de vincular transacciones reales.

### 3. Avance por la periodicidad ("roll-forward")
**Decisión**: A partir de la base, calcular el número de periodos completos transcurridos hasta hoy y devolver la primera ocurrencia `>= hoy`. Implementación basada en aritmética de días para evitar bucles largos:
- `base` como `LocalDate` (si la base es `OffsetDateTime`, tomar su `toLocalDate()`).
- Si `base >= hoy`, `nextPredictedDate = base` (caso fecha de inicio futura).
- Si `base < hoy`, `n = ceil((hoy - base) / periodicity)` periodos, `nextPredictedDate = base + n·periodicity`.
- El resultado se expone como el mismo tipo que hoy usa el DTO (`OffsetDateTime` a medianoche UTC) para no romper consumidores existentes (pantalla "Próximos gastos" compara con ventanas en `OffsetDateTime`).

**Rationale**: La aritmética evita iterar día a día y produce siempre la siguiente ocurrencia presente o futura, que es lo que el usuario entiende por "el siguiente gasto de la serie".

### 4. Frontend
**Decisión**: Añadir un control `startDate` al `FormGroup`, renderizado con `p-datepicker` y visible solo cuando `periodicityType === 'DAYS'` (igual que el campo `periodicity`). Precargar en `openEdit()` y enviar en `save()` como `YYYY-MM-DD`.

## Risks / Trade-offs

- [Tipo de retorno de `nextPredictedDate`] Mantener `OffsetDateTime` a medianoche UTC evita romper la pantalla "Próximos gastos" y el frontend; el coste es una conversión `LocalDate` → `OffsetDateTime`. Aceptable.
- [Cambio de comportamiento del cálculo] El paso a "roll-forward" cambia resultados para recurrentes cuya base estaba en el pasado: ahora aparecerán con una fecha futura en vez de pasada. Es justamente la corrección buscada, pero conviene validarlo con la pantalla "Próximos gastos".
- [Periodicidad nula] Si `periodicity` es null el cálculo sigue devolviendo null (sin cambios), aunque haya `startDate`.
