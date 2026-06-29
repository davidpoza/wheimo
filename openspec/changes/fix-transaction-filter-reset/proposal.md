## Why

El botón de reset de filtros en la pantalla de transacciones no limpia los filtros activos ni refresca los resultados. Al llamar `setFilters({})` con un objeto vacío, el método hace un merge con los filtros existentes (no los reemplaza), dejando los filtros activos intactos.

## What Changes

- Añadir método `resetFilters()` en `TransactionsService` que reemplaza el estado de filtros con los valores por defecto.
- Actualizar el método `reset()` de `TransactionFilterComponent` para usar el nuevo método y asegurar que la búsqueda se refresque correctamente.

## Capabilities

### New Capabilities
- Ninguna nueva capability funcional.

### Modified Capabilities
- Ningún spec de nivel de requisitos cambia; es un bug fix de implementación.

## Impact

- `frontend/src/app/features/transactions/transactions.service.ts`: nuevo método `resetFilters()`
- `frontend/src/app/features/transactions/transaction-filter/transaction-filter.component.ts`: `reset()` usa `resetFilters()` en lugar de `setFilters({})`
