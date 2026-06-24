## Why

Al importar movimientos bancarios (XLS o sincronización), algunas cuentas solo deben aceptar entradas (ingresos) o solo salidas (gastos), pero actualmente se importan todos sin distinción. Añadir un tipo de movimiento por cuenta permite filtrar automáticamente los movimientos en la importación, evitando datos incorrectos.

## What Changes

- Las cuentas tendrán un nuevo campo `movementType` con tres valores: `INCOME` (entrada), `EXPENSE` (salida) o `BOTH` (ambos, valor por defecto).
- Al crear o editar una cuenta, el usuario podrá seleccionar el tipo de movimiento.
- Durante la importación (XLS y sync), los movimientos se filtrarán según el tipo configurado en la cuenta: solo se importarán los de signo positivo (`INCOME`), solo los negativos (`EXPENSE`), o todos (`BOTH`).

## Capabilities

### New Capabilities
- `account-movement-type`: Campo en la cuenta que define qué tipo de movimientos acepta (INCOME, EXPENSE, BOTH) y su uso como filtro durante la importación.

### Modified Capabilities

## Impact

- **Backend**: Migración de BD (nueva columna `movement_type` en `accounts`), entidad `Account`, DTOs (`AccountDto`, `CreateAccountRequest`, `UpdateAccountRequest`), `AccountService`, `TransactionService.processImportResult`.
- **Frontend**: Modelo `Account`, formulario de creación/edición de cuenta (`EditAccountDialogComponent`).
- **API**: Los endpoints de cuentas (create/update) aceptarán el nuevo campo; el endpoint de importación XLS filtrará según el tipo.
