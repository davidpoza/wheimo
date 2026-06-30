## Why

Las reglas de etiquetado solo permiten creación y eliminación, pero no edición. Corregir una regla existente obliga al usuario a eliminarla y crearla de nuevo, lo que es innecesariamente costoso.

## What Changes

- Añadir botón de edición por fila en la tabla de reglas
- Reutilizar el diálogo/formulario de creación para la edición (modo dual: create / edit)
- Al confirmar la edición, actualizar la regla via `PATCH /rules/:id` y reconciliar los tags (añadir nuevos, eliminar los eliminados)
- Añadir claves de traducción para el modo edición (`edit`, `toast.updated`, título del diálogo)

## Capabilities

### New Capabilities

- `rule-edit`: Edición de una regla existente reutilizando el formulario de creación

### Modified Capabilities

<!-- ninguna -->

## Impact

- `frontend/src/app/features/tags/tag-rules/tag-rules.component.ts` — lógica de modo edit/create y reconciliación de tags
- `frontend/src/app/features/tags/tag-rules/tag-rules.component.html` — botón edit en la tabla, título y botón del diálogo dinámicos
- `frontend/src/app/features/tags/tags.service.ts` — posible método helper para reconciliar tags de una regla
- `frontend/public/i18n/es.json` — claves `tags.rules.edit`, `tags.rules.editRule`, `tags.rules.toast.updated`
