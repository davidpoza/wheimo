## 1. Lógica del componente TypeScript

- [x] 1.1 Importar `Subject`, `debounceTime`, `takeUntilDestroyed` de RxJS y `DestroyRef` de Angular core
- [x] 1.2 Añadir `Subject<void>` para el debounce del campo de texto y configurar la suscripción con `debounceTime(300)` en `ngOnInit`
- [x] 1.3 Extraer método `applyFilters()` que llama a `setFilters(draft)`, `loadAll()` y `drawerVisible.set(false)`
- [x] 1.4 Añadir método `onSelectChange()` que llama directamente a `applyFilters()` (para selectores y fechas)
- [x] 1.5 Añadir método `onSearchChange()` que emite en el Subject del debounce
- [x] 1.6 Eliminar el método `apply()` y actualizar `reset()` para cerrar el drawer si estuviera abierto

## 2. Template HTML — vista desktop

- [x] 2.1 Reemplazar `[(ngModel)]` del campo de texto por `[ngModel]` + `(ngModelChange)="onSearchChange()"` y `(ngModelChange)` que actualice `draft.search`
- [x] 2.2 Añadir `(ngModelChange)="onSelectChange()"` a `p-select` de cuenta
- [x] 2.3 Añadir `(ngModelChange)="onSelectChange()"` a `p-multiselect` de tags
- [x] 2.4 Añadir `(ngModelChange)="onSelectChange()"` a ambos `p-datepicker` (from/to)
- [x] 2.5 Añadir `(ngModelChange)="onSelectChange()"` a `p-select` de tipo de operación
- [x] 2.6 Eliminar el botón "Aplicar" de la barra de filtros desktop

## 3. Template HTML — drawer móvil

- [x] 3.1 Aplicar los mismos event bindings `(ngModelChange)` en todos los campos del drawer
- [x] 3.2 Eliminar el botón "Aplicar" del footer del drawer
- [x] 3.3 Mantener el botón "Resetear" en el footer del drawer
