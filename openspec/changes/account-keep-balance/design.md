## Context

Actualmente todas las cuentas sincronizan su balance cuando se importan o crean movimientos (`TransactionService` actualiza `account.balance` en cada `create`). El balance siempre se muestra en la tarjeta de la cuenta en el frontend.

Esto no es deseable para cuentas de inversión, préstamos o cualquier cuenta cuyo saldo no venga determinado por la suma de movimientos importados.

## Goals / Non-Goals

**Goals:**
- Añadir flag `keepBalance` a `Account` que controle si el balance se sincroniza durante la importación.
- Ocultar el balance en la tarjeta cuando `keepBalance = false`.
- Mantener retrocompatibilidad: cuentas existentes con `keepBalance = true` por defecto.

**Non-Goals:**
- Recalcular el balance histórico de cuentas al activar/desactivar el flag.
- Cambiar el comportamiento de edición manual del balance.

## Decisions

### 1. Default `keepBalance = true`
Las cuentas existentes deben seguir comportándose igual. La migración añade la columna con `DEFAULT TRUE`, así todas las cuentas actuales la tienen activa sin intervención.

*Alternativa descartada*: default `false` obligaría a migrar manualmente cada cuenta existente.

### 2. La lógica de sincronización vive en `TransactionService`
El único punto donde se actualiza `account.balance` es en `TransactionService.create()` (línea ~82). Se añade una condición: `if (!req.isDraft() && req.getBalance() == null && account.isKeepBalance())`.

*Alternativa descartada*: hacer la comprobación en el importador de XLS. Pero el importador ya pasa por `TransactionService.create()`, así que centralizar la lógica ahí es más robusto.

### 3. El ocultamiento del balance es solo en el frontend
El campo `balance` sigue existiendo en el DTO y la API; simplemente el frontend no lo renderiza cuando `keepBalance = false`. Esto evita cambios en contratos de API y permite que herramientas externas sigan accediendo al valor.

### 4. Checkbox en el formulario de edición/creación
Se añade un `p-checkbox` / `pCheckbox` en el `edit-account-dialog`. El valor se mapea al DTO de la misma forma que los campos existentes (`movementType`, etc.).

## Risks / Trade-offs

- **Balance inconsistente al desactivar keepBalance**: Si una cuenta tenía `keepBalance = true` y se desactiva, el `balance` almacenado queda con el último valor calculado. No es un error funcional (simplemente deja de actualizarse y de mostrarse), pero puede confundir. → Aceptado como scope fuera de este cambio.
- **Sin migración de datos**: Cuentas existentes arrancan con `keepBalance = true`, lo cual es el comportamiento actual. Sin riesgo de regresión.
