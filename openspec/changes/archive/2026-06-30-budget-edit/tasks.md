## 1. Lógica del componente

- [x] 1.1 Añadir `editingBudget = signal<Budget | null>(null)` en `BudgetsComponent`
- [x] 1.2 Añadir método `openEdit(budget: Budget)` que deshabilite el control `tagId`, pre-rellene el form con los datos del budget y abra el dialog
- [x] 1.3 Añadir método `saveBudget()` que en modo edición llame a `budgetsService.update(id, { value })` y en modo creación llame al `createBudget()` existente
- [x] 1.4 Extraer la lógica de cierre del dialog a un método `closeDialog()` que resetee el form, habilite el control `tagId` y limpie `editingBudget`

## 2. Template HTML

- [x] 2.1 Añadir botón con `icon="pi pi-pencil"` en cada budget card (junto al botón de eliminar), que llame a `openEdit(status.budget)`
- [x] 2.2 Actualizar el `[header]` del dialog para que muestre "Editar presupuesto" o "Nuevo presupuesto" según `editingBudget()`
- [x] 2.3 Actualizar el botón de submit del dialog footer para que llame a `saveBudget()` con la etiqueta correcta según el modo
- [x] 2.4 Enlazar el evento `(visibleChange)` / `(onHide)` del dialog al método `closeDialog()`

## 3. Traducciones

- [x] 3.1 Añadir clave `budgets.edit` (título del dialog en modo edición) en `es.json`
- [x] 3.2 Añadir clave `budgets.save` (label del botón guardar en modo edición) en `es.json`
- [x] 3.3 Añadir clave `budgets.toast.updated` (mensaje toast tras edición exitosa) en `es.json`
