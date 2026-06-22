## Context

Existe una entidad `Recurrent` rudimentaria (tabla `recurrents`) con campos básicos: `name`, `amount`, `emitter`, `transaction_id`. No tiene periodicidad ni link, el campo `emitter` semánticamente es un establecimiento, y el acoplamiento con `transaction_id` no aporta valor en este modelo. No existe ningún mecanismo de historial de precios.

La base de datos está en V10 de Flyway. El backend es Spring Boot 3 + JPA/Hibernate. El frontend es Angular.

## Goals / Non-Goals

**Goals:**
- Enriquecer `Recurrent` con `periodicity` (int, días), `link` (text nullable), `establishment` (renombrar `emitter`)
- Eliminar `transaction_id` de `Recurrent`
- Crear `RecurrentPriceEntry` para registrar entradas de precio con `amount` y `recorded_at`
- API REST para crear/listar entradas de precio de un recurrente (`/recurrents/{id}/prices`)
- El importe actual en `Recurrent.amount` se actualiza automáticamente al añadir una nueva entrada de precio

**Non-Goals:**
- Alertas o notificaciones de cambio de precio
- Integración con scrapers externos para obtener precios automáticamente
- Gráficos en el frontend (solo la vista de datos tabulares)

## Decisions

### 1. Renombrar `emitter` → `establishment` con migración Flyway
Flyway requiere migraciones incrementales. Se usa `ALTER TABLE recurrents RENAME COLUMN emitter TO establishment` en V11. No se hace recreación de tabla para preservar datos existentes.

**Alternativa descartada**: añadir nueva columna y deprecar `emitter` — innecesariamente complejo para un rename limpio.

### 2. Eliminar `transaction_id` en la misma migración V11
El vínculo recurrente-transacción no tiene casos de uso definidos en el producto actual. Se elimina en la misma migración de alteración de `recurrents`.

### 3. `RecurrentPriceEntry` como tabla separada (no JSON en columna)
Permite consultas, ordenación y filtrado SQL nativo sobre el historial. Facilita futuros análisis.

**Alternativa descartada**: columna JSONB en `recurrents` — dificulta queries y operaciones de agregación.

### 4. `amount` en `Recurrent` como "precio actual"
Al registrar una nueva `RecurrentPriceEntry`, el servicio actualiza `recurrents.amount` automáticamente al valor más reciente. Esto evita tener que hacer JOIN en el listado de recurrentes para mostrar el precio actual.

### 5. Endpoint anidado `/recurrents/{id}/prices`
Semánticamente correcto (historial es recurso hijo). Operaciones: `POST` (añadir entrada) y `GET` (listar historial ordenado por fecha desc).

## Risks / Trade-offs

- **Datos existentes con `emitter` no nulo**: el rename es transparente para datos, pero el frontend/API deberá actualizar el campo key de `emitter` a `establishment` — riesgo de rotura si hay clientes no actualizados → se actualiza frontend en el mismo PR.
- **`amount` duplicado** (en `recurrents` y en `recurrent_price_entries`): inconsistencia si alguien edita `amount` directamente sin añadir entrada de historial → el servicio de update de recurrente NO debe permitir editar `amount` directamente; solo vía endpoint de precios.

## Migration Plan

1. **V11**: `ALTER TABLE recurrents` — rename `emitter`→`establishment`, add `periodicity INT NOT NULL DEFAULT 0`, add `link TEXT`, drop `transaction_id`
2. **V12**: `CREATE TABLE recurrent_price_entries`
3. Deploy backend con nuevas entidades y endpoints
4. Deploy frontend con formularios actualizados

**Rollback**: revertir migraciones hacia atrás no es posible con Flyway en producción sin restaurar backup — el riesgo es bajo dado que son cambios aditivos salvo el drop de `transaction_id` (columna sin uso real).

## Open Questions

- ¿El frontend debe mostrar la evolución de precios como tabla o como gráfico de líneas? (por ahora: tabla, gráfico fuera de scope)
- ¿`periodicity = 0` significa "sin periodicidad definida" o debería ser nullable? → se usará `nullable = true` para claridad semántica
