## 1. CSS Global

- [x] 1.1 Añadir en `frontend/src/styles.scss` la regla `@media (max-width: 768px) { .icon-only-mobile .p-button-label { display: none; } }`

## 2. transaction-grid — HTML

- [x] 2.1 Añadir clase `checkbox-col` al `<th>` y `<td>` de la columna de checkboxes
- [x] 2.2 Añadir clase `toggle-col` al `<th>` y `<td>` de la columna expand-toggle
- [x] 2.3 Añadir clase `tags-col` al `<th>` y `<td>` de la columna de tags
- [x] 2.4 Añadir clase `actions-col` al `<th>` y `<td>` de la columna de botones de acción (fav + apply tags)
- [x] 2.5 Añadir `[class.selected-row]="isSelected(tx)"` al `<tr>` de cada fila
- [x] 2.6 Añadir eventos `(touchstart)="onTouchStart($event, tx)"`, `(touchend)="onTouchEnd()"`, `(touchmove)="onTouchMove()"` al `<tr>` de la fila
- [x] 2.7 Añadir banner de selección móvil justo antes de `<p-table>`: `@if (mobileSelectMode()) { <div class="mobile-select-banner">...</div> }`; incluir contador y botón Cancel que llama a `cancelMobileSelection()`
- [x] 2.8 Añadir `styleClass="icon-only-mobile"` a los botones "New" y "Tag Selected" en la cabecera

## 3. transaction-grid — TypeScript

- [x] 3.1 Añadir `mobileSelectMode = signal<boolean>(false)`
- [x] 3.2 Añadir `private longPressTimer: ReturnType<typeof setTimeout> | null = null`
- [x] 3.3 Implementar `onTouchStart(event: TouchEvent, tx: Transaction)`: inicia timer 500ms → `enterSelectMode(tx)`
- [x] 3.4 Implementar `onTouchEnd()` y `onTouchMove()`: cancelan el timer
- [x] 3.5 Implementar `enterSelectMode(tx: Transaction)`: activa `mobileSelectMode`, añade `tx` a `selected`
- [x] 3.6 Modificar `openDetail(tx)`: si `mobileSelectMode()` activo, llamar `toggleMobileSelection(tx)` en lugar de abrir detalle
- [x] 3.7 Implementar `toggleMobileSelection(tx: Transaction)`: alterna `tx` en `selected`; si `selected` queda vacío, desactiva `mobileSelectMode`
- [x] 3.8 Implementar `cancelMobileSelection()`: vacía `selected` y desactiva `mobileSelectMode`
- [x] 3.9 Implementar `isSelected(tx: Transaction): boolean`

## 4. transaction-grid — SCSS

- [x] 4.1 Añadir bloque `@media (max-width: 768px)` con `display: none` para `.checkbox-col`, `.toggle-col` y `.tags-col`
- [x] 4.2 Dentro de la misma media query: fijar `width: 6rem; min-width: 6rem` en `.amount-col` (vía `<th>` o clase `amount-header`)
- [x] 4.3 Dentro de la misma media query: fijar `width: 5.5rem; min-width: 5.5rem` en `.actions-col`
- [x] 4.4 Dentro de la misma media query: sobreescribir `.desc-col .desc-text` eliminando `white-space: nowrap` y aplicando `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden`
- [x] 4.5 Añadir estilos para `.selected-row` en móvil: fondo de acento suave (`var(--p-primary-100)` o equivalente del tema)
- [x] 4.6 Añadir estilos para `.mobile-select-banner`: flex row, fondo de superficie, padding, contador a la izquierda, botón Cancel a la derecha; visible solo en móvil

## 5. transaction-filter — SCSS

- [x] 5.1 Añadir bloque `::ng-deep .mobile-filter-drawer { height: auto; max-height: 90vh; .p-drawer-content { overflow-y: auto; } }` en `transaction-filter.component.scss`

## 6. Otras vistas — HTML (botones icon-only)

- [x] 6.1 En `accounts-list.component.html`: añadir `styleClass="icon-only-mobile"` al botón "Add Account"
- [x] 6.2 En `recurrents-list.component.html`: añadir `styleClass="icon-only-mobile"` al botón "Nuevo artículo"
- [x] 6.3 En `budgets.component.html`: añadir `styleClass="icon-only-mobile"` al botón "New Budget"

## 7. Verificación

- [x] 7.1 Comprobar en 375px que el importe se muestra completo sin scroll horizontal
- [x] 7.2 Comprobar en 320px que el importe sigue siendo visible
- [x] 7.3 Verificar que checkbox, tags y toggle no aparecen en móvil; que sí aparecen en desktop
- [x] 7.4 Comprobar que pulsar "Filters" en móvil muestra el drawer con todos los campos sin scroll
- [x] 7.5 Comprobar que una descripción larga muestra 2 líneas con "…" en móvil; 1 línea en desktop
- [x] 7.6 Comprobar que long tap (500ms) activa modo selección y selecciona la fila
- [x] 7.7 Comprobar que el scroll no activa el long press
- [x] 7.8 Comprobar que en modo selección tap alterna filas y Cancel vacía la selección
- [x] 7.9 Comprobar que "Tag Selected" sigue funcionando con las filas seleccionadas vía long tap
- [x] 7.10 Comprobar que todos los botones de cabecera muestran solo icono en móvil e icono+texto en desktop
