## Context

El componente `TransactionFilterComponent` tiene un `draft: TransactionFilters` enlazado con `[(ngModel)]` en todos los campos. Actualmente el usuario rellena los campos y pulsa "Aplicar" para que `setFilters(draft)` y `loadAll()` sean invocados. El componente usa Angular standalone con señales.

## Goals / Non-Goals

**Goals:**
- Aplicar filtros en tiempo real sin botón "Aplicar".
- Mantener el botón "Resetear".
- Debounce en el campo de texto (300 ms) para evitar peticiones excesivas al backend.
- En móvil (drawer), cerrar el drawer automáticamente al aplicar un cambio en selector o fecha; cerrar tras el debounce en texto.

**Non-Goals:**
- Cambios en el backend o en `TransactionsService`.
- Paginación o caché de resultados.
- Cambiar el comportamiento del reseteo.

## Decisions

### Reactividad con `ngModelChange` + debounce manual

Se añade `(ngModelChange)="onFieldChange()"` en cada campo del template. En el componente, `onFieldChange()` llama directamente a `applyFilters()` para selectores y fechas. Para el campo de texto se usa `Subject<void>` + `debounceTime(300)` + `takeUntilDestroyed()`.

**Alternativa descartada**: Migrar a `ReactiveFormsModule` con `FormGroup` y `valueChanges`. Requeriría refactorizar todo el formulario y romper la estructura actual; la ganancia no justifica el coste para este cambio.

### Cierre automático del drawer móvil

Tras aplicar el filtro desde el drawer, se llama `drawerVisible.set(false)` en `applyFilters()`, igual que hacía el antiguo `apply()`.

## Risks / Trade-offs

- [Riesgo] Peticiones excesivas al backend al seleccionar múltiples tags rápidamente → Mitigación: el debounce de 300 ms se puede extender a todos los campos si fuera necesario en el futuro.
- [Trade-off] El drawer se cierra al seleccionar una fecha/cuenta desde móvil, lo que impide combinaciones de filtros sin reabrirlo → Aceptable dado que es el comportamiento más simple y consistente con el desktop.
