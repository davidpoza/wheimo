## Context

La app usa Angular 17+ con PrimeNG v17. El breakpoint mobile es `768px` de forma consistente en todos los cambios. Los componentes afectados usan `ViewEncapsulation.Emulated` (defecto Angular), por lo que los estilos de PrimeNG que se renderizan fuera del shadow del componente requieren `::ng-deep`.

Estado actual relevante:
- `transaction-grid`: tabla con 7 columnas, `[(selection)]="selected"` signal, `(click)="openDetail(tx)"` por fila.
- `transaction-filter`: `<p-drawer position="bottom" styleClass="mobile-filter-drawer">` con altura fija de PrimeNG.
- Cabeceras de vista: botones con `icon` + `label` sin adaptación móvil.

## Goals / Non-Goals

**Goals:**
- Amount siempre visible sin scroll horizontal en ≥320px.
- Faldón de filtros muestra todos sus campos en móvil.
- Descripción hasta 2 líneas en móvil con "…" al truncar.
- Selección múltiple usable en táctil sin necesidad de checkboxes.
- Botones de cabecera compactos en móvil.
- Desktop sin cambios.

**Non-Goals:**
- Rediseño de la tabla como tarjetas en móvil.
- Tooltips en botones icon-only.
- Gesture de swipe para selección de rango.
- Cambios en APIs o lógica de negocio.

## Decisions

### 1. Columnas ocultas en móvil via CSS (`display: none`)
Añadir clases semánticas (`checkbox-col`, `toggle-col`, `tags-col`) a `<th>` y `<td>` correspondientes y ocultarlas con una media query en el SCSS del componente. Sin lógica Angular de breakpoint. Las columnas ocultas no afectan el binding de `p-table`: `[(selection)]` sigue funcionando porque opera sobre la señal, no sobre el checkbox visible.

### 2. SCSS consolidado en un único bloque `@media (max-width: 768px)` por componente
Todas las reglas móvil de `transaction-grid` van en un solo bloque media query para evitar duplicaciones y facilitar el mantenimiento.

### 3. Altura del drawer via `::ng-deep`
```scss
::ng-deep .mobile-filter-drawer {
  height: auto;
  max-height: 90vh;
  .p-drawer-content { overflow-y: auto; }
}
```
Necesario porque PrimeNG renderiza el panel fuera del shadow del componente. Solución estándar mientras PrimeNG no exponga CSS custom properties para esta propiedad.

### 4. Line-clamp via `-webkit-line-clamp: 2`
En móvil, `.desc-col .desc-text` cambia de `white-space: nowrap` + `text-overflow: ellipsis` a `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden`. Soporte universal en navegadores modernos.

### 5. Long press via `touchstart`/`touchend`/`touchmove` + timer de 500ms
```
touchstart → iniciar setTimeout(500ms) → si dispara: enterSelectMode(tx)
touchend / touchmove → clearTimeout
```
`touchmove` cancela el timer para evitar activación en scroll. Sin dependencias externas. La señal `mobileSelectMode` controla si un tap abre detalle o alterna selección.

### 6. Clase utilitaria global `icon-only-mobile` en `styles.scss`
```scss
@media (max-width: 768px) {
  .icon-only-mobile .p-button-label { display: none; }
}
```
Una sola regla aplicable a cualquier botón de la app añadiendo `styleClass="icon-only-mobile"`. PrimeNG propaga `styleClass` al elemento host del botón.

## Risks / Trade-offs

- [`::ng-deep` deprecado en Angular] → Sigue siendo el patrón estándar con PrimeNG; bajo riesgo a corto plazo.
- [Ocultar tags/toggle en móvil reduce información visible] → Aceptable: ambos son accesibles desde el detalle de la transacción.
- [Long press puede interferir con scroll en algunos gestos] → Mitigado: `touchmove` cancela el timer.
- [Botones icon-only menos descriptivos] → El icono es autoexplicativo (pi-plus, pi-tags); se puede añadir `pTooltip` en una iteración posterior.
