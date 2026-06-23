## Why

Las cuentas de tipo inversión o deuda no necesitan llevar un balance actualizado por movimientos, ya que su saldo se gestiona de otra forma. Sin embargo, para cuentas corrientes o de ahorro, es útil sincronizar el balance automáticamente durante la importación y mostrar el saldo actualizado en la tarjeta.

## What Changes

- Se añade un campo booleano `keepBalance` a la entidad `Account`.
- Durante la importación de movimientos, solo se actualiza el balance de cuentas que tienen `keepBalance = true`.
- La tarjeta de cuenta solo muestra el balance si `keepBalance = true`; de lo contrario, el balance queda oculto.
- El formulario de creación/edición de cuenta incluye el nuevo checkbox `keepBalance`.

## Capabilities

### New Capabilities

- `account-keep-balance`: Controla si una cuenta sincroniza y muestra su balance. Incluye el campo en el modelo, la lógica de importación y la visualización en la tarjeta.

### Modified Capabilities

<!-- No hay specs existentes afectadas con cambio de requisitos -->

## Impact

- **Backend**: Entidad `Account`, migración de base de datos, lógica de importación de movimientos en `TransactionService` / servicio de importación.
- **Frontend**: Modelo `Account`, formulario de edición/creación de cuenta, tarjeta de cuenta (ocultamiento del balance).
- **API**: DTO `AccountDto`, `CreateAccountRequest`, `UpdateAccountRequest`.
