## Context

El modal `price-history-dialog` usa `p-dialog` de PrimeNG, que aplica `overflow: hidden` en su contenedor interior. El `p-datepicker` renderiza su calendario como un overlay hijo del elemento en el DOM, por lo que queda recortado por los límites del modal. Este mismo problema fue resuelto para `p-select` y `p-multiselect` en el change `modal-select-overflow`, aplicando `appendTo="body"`.

## Goals / Non-Goals

**Goals:**
- El calendario del `p-datepicker` se despliega completamente visible, por encima del modal y sin recortes.

**Non-Goals:**
- No se modifica el comportamiento del datepicker en ningún otro contexto.
- No se revisa el resto de componentes del modal.

## Decisions

**`appendTo="body"` en el datepicker**

PrimeNG `DatePicker` expone el atributo `appendTo` que mueve el overlay al elemento indicado (tipicamente `body`). Esto saca el calendario del flujo de `overflow: hidden` del dialog y lo renderiza sobre todo el contenido de la página.

Alternativas consideradas:
- `overflow: visible` en el dialog: rompería la apariencia del modal y no es configurable fácilmente en PrimeNG sin sobreescribir estilos globales.
- Portal personalizado: innecesario; `appendTo` es la solución oficial de PrimeNG para este caso.

## Risks / Trade-offs

- [Posicionamiento] El overlay anclado a `body` usa posicionamiento absoluto calculado por PrimeNG. En casos muy extremos (scroll del body, resize agresivo) puede desalinearse brevemente. → Riesgo aceptable; es el comportamiento estándar y ya funciona correctamente para los selects.
