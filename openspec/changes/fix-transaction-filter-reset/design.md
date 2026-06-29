## Context

`TransactionsService.setFilters(f)` hace merge de `f` sobre los filtros actuales: `{ ...this.filters(), ...f, offset: 0 }`. Al llamar `setFilters({})` para resetear, el objeto vacío no sobreescribe ningún campo existente, por lo que los filtros de usuario (descripción, tags, cuentas, fechas, tipo) quedan activos. La llamada posterior a `loadAll()` devuelve resultados filtrados en lugar de todos los resultados.

## Goals / Non-Goals

**Goals:**
- Al pulsar "Reset" en el panel de filtros, los filtros vuelven a los valores por defecto y la grid se recarga sin filtros.
- Mínimo cambio de código: no se altera la API pública de `setFilters` para no romper otros usos.

**Non-Goals:**
- No se cambia la lógica de paginación, ordenación ni ningún otro comportamiento de filtros.
- No se añade persistencia de filtros en URL ni localStorage.

## Decisions

**Añadir `resetFilters()` en el servicio en lugar de modificar `setFilters`**

`setFilters` es usado en varios sitios (paginación, ordenación) y su semántica de merge es correcta en esos contextos. Cambiarla rompería esos flujos. La alternativa más limpia es un método dedicado que reemplaza el signal con los valores por defecto:

```typescript
private readonly DEFAULT_FILTERS: TransactionFilters = { limit: 50, offset: 0, sort: 'date,desc' };

resetFilters() {
  this.filters.set({ ...this.DEFAULT_FILTERS });
}
```

`TransactionFilterComponent.reset()` llama `resetFilters()` en lugar de `setFilters({})`. El `loadAll()` posterior usará los filtros por defecto correctamente.

## Risks / Trade-offs

- [Duplicación del objeto de defaults] → Se define como constante privada en el servicio, compartida con el inicializador del signal.
