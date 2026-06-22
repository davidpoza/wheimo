## Context

El backend usa Spring Boot + JPA/Hibernate con PostgreSQL y migraciones Flyway. La entidad `Transaction` ya tiene tags, adjuntos y comentarios (`comments`). La entidad `Recurrent` tiene `amount`, `periodicity` (días) y `createdAt`. El frontend es Angular con Angular Material.

Actualmente no existe relación entre `recurrents` y `transactions`. El campo `search` en `TransactionFilterParams` ya filtra por `emitterName`, `receiverName` y `description`; se extenderá para incluir el nuevo campo `note`.

## Goals / Non-Goals

**Goals:**
- Vincular N recurrentes a una transacción (y una misma transacción puede cubrir varios recurrentes).
- Un mismo recurrente puede vincularse a distintas transacciones en diferentes periodos.
- Calcular la "próxima fecha predicha" del recurrente para prefijar el rango de búsqueda en el modal.
- Mostrar desglose de recurrentes en la pantalla de transacciones (importes, suma, diferencia).
- Añadir nota libre a cada transacción, indexada en el buscador.

**Non-Goals:**
- No se propone un sistema de reconciliación automática ni alertas de gastos no emparejados.
- No se trackea la divisa individual de cada recurrente vinculado (se asume que coincide con la transacción).
- No se implementa edición de importes en el modal (se usa el `amount` actual del recurrente en el momento del vínculo, snapshot).

## Decisions

### 1. Tabla de vínculo con snapshot de importe

Se crea la tabla `recurrent_transaction_links` con columnas `recurrent_id`, `transaction_id` y **`amount_snapshot`** (decimal).

**Rationale**: Al vincular, se captura el `amount` vigente del recurrente. Así el desglose histórico no varía si el precio cambia después. Alternativa descartada: referenciar siempre el `amount` actual del recurrente — rompe la coherencia histórica cuando el precio sube/baja.

### 2. Cálculo de la próxima fecha predicha

```
lastDate = MAX(fecha de asignación existente) o createdAt del recurrente
nextPredicted = lastDate + periodicity días
```

El endpoint `GET /recurrents` incluirá `nextPredictedDate` calculada en el servidor. Si `periodicity` es null, `nextPredictedDate` es null y el modal abre el datepicker sin rango por defecto.

**Rationale**: Calcular en backend evita duplicar lógica y asegura coherencia. El frontend simplemente lee el campo.

### 3. Búsqueda de transacciones para el modal: endpoint reutilizado

El modal usa el endpoint existente `GET /transactions` con los parámetros `from`, `to` y `search` (autocomplete por `emitterName`, `receiverName`, `description`). No se crea un endpoint específico para el autocompletado.

**Rationale**: Evita duplicación. El endpoint ya soporta paginación y filtros de fecha; el modal añade un datepicker para `from`/`to` que el usuario puede ajustar.

### 4. Nota en transacción

Se añade columna `note` (TEXT, nullable) a la tabla `transactions`. El campo `search` existente se extiende para hacer `ILIKE` sobre `note` además de los campos actuales.

**Rationale**: ILIKE es suficiente para el volumen esperado (transacciones personales). Si en el futuro se necesita búsqueda full-text con relevancia, se puede añadir un índice GIN sin cambiar la API.

### 5. Desglose en frontend: fila expandible

Las transacciones con recurrentes vinculados muestran un indicador (chip/icono) y son expandibles en la lista de transacciones. La expansión muestra una tabla simple con las filas de recurrentes, la suma y la diferencia (`transaction.amount - sum(recurrents.amount_snapshot)`).

**Rationale**: Patrón de tabla expandible de Angular Material (`matExpansionPanel` o `detail row`) ya conocido en el proyecto y no requiere nueva ruta.

## Risks / Trade-offs

- **[Riesgo] Snapshot de importe desincronizado del historial de precios** → El snapshot refleja el precio en el momento de la asignación, lo cual es el comportamiento correcto para auditoría. Documentar en la UI que el importe mostrado es el vigente cuando se realizó la asignación.
- **[Riesgo] Performance del buscador de transacciones en el modal** → El endpoint usa ILIKE sin índice sobre `note`. Mitigación: añadir índice funcional en PostgreSQL sobre `lower(note)` en la migración.
- **[Riesgo] Cálculo de `nextPredictedDate` sin historial de asignaciones** → Si un recurrente nunca se ha asignado, se usa `createdAt + periodicity`. Puede dar fechas pasadas si el recurrente lleva meses sin asignarse. Mitigación: en ese caso, el modal abre sin rango por defecto y el usuario ajusta manualmente.

## Migration Plan

1. **V13**: `ALTER TABLE transactions ADD COLUMN note TEXT` + índice funcional `lower(note)`.
2. **V14**: Crear tabla `recurrent_transaction_links (id BIGSERIAL PK, recurrent_id BIGINT FK, transaction_id BIGINT FK, amount_snapshot NUMERIC(19,4), created_at TIMESTAMPTZ)` con `UNIQUE(recurrent_id, transaction_id)`.
3. Deploy backend (compatible con frontend anterior: campos nuevos son nullables y aditivos).
4. Deploy frontend.

Rollback: los campos son aditivos; revertir el frontend es suficiente. Si se necesita rollback de BD, `DROP TABLE recurrent_transaction_links` y `ALTER TABLE transactions DROP COLUMN note`.

## Open Questions

- ¿Debe mostrarse la nota en el listado de transacciones (truncada) o solo en el modal de detalle?
- ¿Se permite desvincular un recurrente de una transacción desde la pantalla de transacciones, o solo desde la pantalla de recurrentes?
