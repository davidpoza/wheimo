## Context

`TagRulesComponent` tiene un único formulario reactivo (name, type, value, tagIds) embebido en un `p-dialog`. Actualmente solo sirve para crear reglas. La lógica de submit llama directamente a `createRule()`. La tabla muestra un botón de borrado por fila pero no de edición. `TagsService.updateRule()` ya existe y hace `PATCH /rules/:id`, pero la gestión de tags en edición requiere reconciliación (diff entre tags actuales y nuevos).

## Goals / Non-Goals

**Goals:**
- Modo dual en el mismo diálogo: crear (comportamiento actual) y editar (nuevo)
- Botón edit por fila en la tabla que abre el diálogo con los datos pre-cargados
- Al guardar en modo edit: actualizar datos de la regla + reconciliar tags (add/remove)
- Traducciones para el modo edición

**Non-Goals:**
- Extraer el formulario a un componente separado (reutilización inline es suficiente)
- Edición inline en tabla
- Cambios en el backend

## Decisions

### 1. Señal `editingRule` en lugar de un flag booleano separado

Usar `editingRule = signal<Rule | null>(null)`. Cuando es `null`, el diálogo está en modo creación; cuando tiene valor, está en modo edición. Un único signal reemplaza la necesidad de un flag `isEditing` y guarda la referencia a la regla original (necesaria para el diff de tags).

Alternativa descartada: flag `isEditing + selectedRuleId` separados → más estado que mantener sincronizado.

### 2. Método `updateRuleWithTags` en TagsService

Añadir un método que recibe `(id, data, newTagIds, currentTagIds)` y orquesta con `forkJoin` los `addTagToRule` / `removeTagFromRule` necesarios + el PATCH de datos. Centraliza la lógica de reconciliación fuera del componente.

Alternativa descartada: hacer la reconciliación en el componente → mezcla lógica de negocio con presentación.

### 3. Un único método `submitForm()` en el componente

Reemplazar `createRule()` por `submitForm()` que despacha a `createRule()` o `updateRuleWithTags()` según `editingRule()`. El HTML llama a `submitForm()` en ambos casos.

## Risks / Trade-offs

- [Reconciliación de tags] Si el PATCH de datos tiene éxito pero falla algún add/remove de tag, el estado queda parcialmente actualizado → Mitigación: recargar la lista de reglas (`loadRules()`) al finalizar la operación de edición, igual que hace `createRule` cuando hay tags.
- [UX] El diálogo usa el mismo formulario; el título y el botón de submit cambian dinámicamente → sin riesgo técnico, pero hay que asegurar el reset del formulario al cerrar en ambos modos.
