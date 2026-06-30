## Why

La pantalla de presupuestos permite crear y eliminar budgets, pero no editarlos. Si el usuario quiere cambiar el importe mensual de un budget existente, tiene que eliminarlo y volver a crearlo, lo que es innecesariamente tedioso.

## What Changes

- Añadir un botón de edición (icono lápiz) en cada tarjeta de budget, junto al botón de eliminar.
- Reutilizar el dialog/formulario de creación para editar un budget existente, pre-rellenado con los datos actuales.
- En modo edición, el campo de tag queda deshabilitado (el tag es el identificador del budget; cambiarlo equivale a crear uno nuevo).
- Al guardar en modo edición, se llama a `PATCH /budgets/:id` con el nuevo valor.
- El servicio ya tiene el método `update(id, { value })` implementado.

## Capabilities

### New Capabilities
- `budget-edit`: Editar el importe de un budget existente desde la pantalla de budgets, reutilizando el dialog de creación en modo edición.

### Modified Capabilities

## Impact

- `budgets.component.ts`: lógica para abrir el dialog en modo edición y manejar el submit.
- `budgets.component.html`: añadir botón de edición en cada card; actualizar el dialog para soportar ambos modos.
- `i18n/es.json` (y otros idiomas si aplica): nuevas claves de traducción para el modo edición.
