## Context

El proyecto Wheimo permite importar movimientos bancarios en cuentas mediante ficheros XLS o sincronización automática. Actualmente no hay restricción sobre el tipo de movimiento (entrada/salida) que puede asociarse a una cuenta, lo que puede generar duplicidades o datos incorrectos cuando un banco exporta tanto cargos como abonos en el mismo fichero y la cuenta solo debería registrar uno de los dos tipos.

Stack: Spring Boot (backend), Angular + PrimeNG (frontend), PostgreSQL (BD), Flyway (migraciones).

## Goals / Non-Goals

**Goals:**
- Añadir un campo `movementType` (`INCOME` | `EXPENSE` | `BOTH`) a la entidad `Account`.
- Filtrar los movimientos durante `processImportResult` (usado tanto por XLS como por sync) según el tipo configurado.
- Exponer el campo en los DTOs y endpoints de cuenta.
- Permitir al usuario configurarlo desde el formulario de creación/edición de cuenta.

**Non-Goals:**
- Re-procesar movimientos ya importados que no coincidan con el nuevo tipo.
- Filtrado en endpoints de consulta de transacciones (solo afecta a la importación).
- Validaciones de signo en la creación manual de transacciones.

## Decisions

### Enum vs. String
Se usa una columna `VARCHAR(10)` con valores `INCOME`, `EXPENSE`, `BOTH` en base de datos, y un enum Java `MovementType` en la entidad. Alternativa descartada: columna booleana doble (`allowIncome`, `allowExpense`) — menos legible y más difícil de validar.

### Valor por defecto `BOTH`
Las cuentas existentes no tienen restricción, por lo que el valor por defecto es `BOTH`. Esto garantiza retrocompatibilidad sin cambio de comportamiento para cuentas ya creadas.

### Filtrado en `processImportResult`
El filtrado se aplica en `TransactionService.processImportResult`, que es el punto común para importaciones XLS y sync. No se filtra en `FetcherClient` (que es externo) para mantener la lógica de negocio en el API. La regla:
- `INCOME`: solo se importan movimientos con `amount > 0`
- `EXPENSE`: solo se importan movimientos con `amount < 0`
- `BOTH`: se importan todos (comportamiento actual)

## Risks / Trade-offs

- [Cuentas existentes] Al aplicar la migración con `DEFAULT 'BOTH'`, todas las cuentas existentes mantendrán el comportamiento actual. Sin riesgo.
- [Importaciones en curso] Si durante el despliegue hay una importación en vuelo, podría fallar si la columna aún no existe. Mitigación: el cambio es aditivo y la migración de Flyway se ejecuta al arrancar el API.

## Migration Plan

1. Flyway V15: `ALTER TABLE accounts ADD COLUMN movement_type VARCHAR(10) NOT NULL DEFAULT 'BOTH'`.
2. Desplegar backend (Spring Boot lee el nuevo campo; DTOs actualizados).
3. Desplegar frontend (nuevo selector en el formulario de cuenta).
4. Sin rollback complejo: si se revierte, la columna queda sin uso pero no rompe nada.
