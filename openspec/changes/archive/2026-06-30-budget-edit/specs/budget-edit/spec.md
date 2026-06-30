## ADDED Requirements

### Requirement: Botón de edición en cada budget card
Cada tarjeta de budget SHALL mostrar un botón de edición (icono lápiz) junto al botón de eliminar.

#### Scenario: Botón visible en cada card
- **WHEN** hay budgets cargados en la pantalla
- **THEN** cada card muestra un botón con icono `pi-pencil` junto al botón de eliminar

### Requirement: Abrir dialog en modo edición
Al pulsar el botón de edición de un budget, el sistema SHALL abrir el dialog de formulario pre-rellenado con los datos del budget seleccionado.

#### Scenario: Dialog se abre con datos pre-rellenados
- **WHEN** el usuario pulsa el botón de edición de un budget
- **THEN** el dialog se abre con el campo `value` relleno con el importe actual del budget

#### Scenario: Campo tag deshabilitado en modo edición
- **WHEN** el dialog se abre en modo edición
- **THEN** el campo de tag muestra el tag del budget pero está deshabilitado (no editable)

#### Scenario: Título del dialog diferenciado
- **WHEN** el dialog se abre en modo edición
- **THEN** el título del dialog indica "Editar presupuesto" (o equivalente i18n) en lugar de "Nuevo presupuesto"

### Requirement: Guardar cambios de un budget
Al confirmar la edición, el sistema SHALL actualizar el budget con el nuevo importe.

#### Scenario: Actualización exitosa
- **WHEN** el usuario modifica el importe y pulsa el botón de guardar en modo edición
- **THEN** se llama a `PATCH /budgets/:id` con `{ value }` y la lista se refresca con los datos actualizados

#### Scenario: Toast de confirmación
- **WHEN** la actualización se completa con éxito
- **THEN** se muestra un toast de éxito

#### Scenario: Botón deshabilitado si form inválido
- **WHEN** el campo `value` está vacío o inválido en modo edición
- **THEN** el botón de guardar está deshabilitado

### Requirement: Cerrar dialog limpia el estado
Al cerrar el dialog (cancel, X, o click fuera), el sistema SHALL resetear el formulario y limpiar el estado de edición.

#### Scenario: Cancel limpia el estado
- **WHEN** el usuario pulsa "Cancelar" mientras el dialog está en modo edición
- **THEN** el dialog se cierra, el form se resetea y el próximo click en "Nuevo" abre el dialog en modo creación
