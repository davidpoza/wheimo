## 1. TagsService

- [x] 1.1 Añadir método `updateRuleWithTags(id, data, newTagIds, currentTagIds)` que hace PATCH de datos y reconcilia tags (forkJoin de add/remove) y recarga la lista al finalizar

## 2. TagRulesComponent — lógica

- [x] 2.1 Añadir signal `editingRule = signal<Rule | null>(null)`
- [x] 2.2 Añadir método `openEditDialog(rule: Rule)` que carga los datos en el formulario y activa modo edición
- [x] 2.3 Renombrar `createRule()` a `submitForm()` y delegar a `createRule` o `updateRuleWithTags` según `editingRule()`
- [x] 2.4 Actualizar `closeDialog()` (o el handler de `visibleChange`) para resetear formulario y `editingRule` a null

## 3. TagRulesComponent — template

- [x] 3.1 Hacer dinámico el header del diálogo según modo (create / edit)
- [x] 3.2 Hacer dinámico el label del botón de submit según modo
- [x] 3.3 Añadir botón edit (icono `pi pi-pencil`) por fila en la tabla que llame a `openEditDialog(rule)`
- [x] 3.4 Actualizar el handler `(onClick)` del botón submit para llamar `submitForm()`

## 4. Traducciones

- [x] 4.1 Añadir en `es.json` bajo `tags.rules`: claves `editRule`, `edit` y `toast.updated`
