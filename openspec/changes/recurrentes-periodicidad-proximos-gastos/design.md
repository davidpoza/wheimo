## Context

Los gastos recurrentes modelan suscripciones, seguros y otros pagos periódicos. Actualmente la periodicidad se almacena como un único entero (`periodicity` = número de días), lo que es válido para pagos mensuales o semanales pero no permite expresar "anual en el mes de octubre". Se necesita añadir un segundo tipo de periodicidad y una nueva pantalla de visión rápida.

Stack: Java/Spring Boot (backend), Angular + PrimeNG (frontend), PostgreSQL + Flyway (BBDD).

## Goals / Non-Goals

**Goals:**
- Añadir `periodicityType` (`DAYS` | `ANNUAL`) y `periodicityMonth` (1-12) al modelo de recurrente
- Actualizar el formulario de edición/creación para soportar ambos tipos
- Mantener la lógica de `nextPredictedDate` solo para tipo `DAYS`
- Nuevo endpoint `GET /recurrents/upcoming` que filtra recurrentes según ventana temporal
- Nueva pantalla `/upcoming` en el frontend

**Non-Goals:**
- Periodicidades más complejas (mensual en día X, semanal, etc.)
- Notificaciones push o alertas automáticas
- Modificar la lógica de vinculación de transacciones

## Decisions

### 1. Representación del tipo de periodicidad

**Decisión**: Añadir columna `periodicity_type` (VARCHAR, valores `DAYS`/`ANNUAL`) y `periodicity_month` (INTEGER, 1-12, nullable) a la tabla `recurrents`. El campo `periodicity` existente se mantiene para tipo `DAYS`.

**Alternativas consideradas**:
- Usar un único campo con valor negativo para indicar "mes X del año": descartado por ser opaco y propenso a errores.
- Tabla separada de configuración de periodicidad: innecesariamente complejo para solo dos tipos.

**Valor por defecto**: `periodicity_type = 'DAYS'` para compatibilidad con registros existentes.

### 2. Lógica de "próximos gastos" en el backend

**Decisión**: Nuevo endpoint `GET /recurrents/upcoming` en el backend que aplica el filtrado. El frontend no calcula la ventana temporal.

**Alternativas consideradas**:
- Filtrar en frontend usando la lista completa: más simple pero expone todos los datos y no escala.
- Endpoint único con parámetro query: optamos por ruta dedicada para claridad semántica.

**Reglas aplicadas por el backend**:
- `ANNUAL`: incluir si `MONTH(NOW()) == periodicityMonth`
- `DAYS`: calcular `nextPredictedDate` (última transacción vinculada + periodicity días, o createdAt + periodicity). Incluir si `NOW()` está entre `nextPredictedDate - 48h` y `nextPredictedDate + 48h`. Si no hay `nextPredictedDate` (periodicity null), excluir.

### 3. Selector de mes en el frontend

**Decisión**: Usar un `<p-select>` (dropdown PrimeNG) con los 12 meses en español para `periodicityMonth`. El campo `periodicity` (días) se oculta cuando el tipo es `ANNUAL`.

## Risks / Trade-offs

- [Compatibilidad] Registros existentes sin `periodicity_type` recibirán el valor por defecto `DAYS` vía migration → sin impacto en comportamiento actual
- [Ventana ±48h] Si un gasto tiene `nextPredictedDate` muy en el pasado (muchos días sin registrar), no aparecerá en "Próximos". El usuario deberá vincular una transacción para resetear el contador → aceptable por diseño
- [Tipo ANNUAL sin transacciones vinculadas] La lógica de próximos para `ANNUAL` no depende de transacciones, solo del mes actual → comportamiento predecible

## Migration Plan

1. Deploy backend con Flyway V19 (añade columnas, default `DAYS`)
2. Sin downtime: columnas son nullable con default, no hay cambios breaking en API existente
3. Deploy frontend con nuevo formulario y nueva ruta
4. Rollback: revertir frontend primero (UI sin breaking), luego eliminar columnas con V20 si fuera necesario

## Open Questions

- ¿Debe la pantalla "Próximos gastos" ser la página de inicio por defecto? Por ahora se añade como ítem de navegación independiente.
