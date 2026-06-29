## 1. Servicio de transacciones

- [x] 1.1 Extraer los valores por defecto de filtros a una constante privada `DEFAULT_FILTERS` en `TransactionsService`
- [x] 1.2 Añadir método `resetFilters()` que reemplaza el signal con una copia de `DEFAULT_FILTERS`

## 2. Componente de filtros

- [x] 2.1 Actualizar `reset()` en `TransactionFilterComponent` para llamar `txService.resetFilters()` en lugar de `txService.setFilters({})`
