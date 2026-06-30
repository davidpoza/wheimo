## Context

La pantalla de budgets (`BudgetsComponent`) ya dispone de un dialog con un formulario reactivo de dos campos (`tagId`, `value`) que se usa para crear budgets. El servicio `BudgetsService` ya implementa el método `update(id, { value })` que llama a `PATCH /budgets/:id`. El backend acepta únicamente el campo `value` en la edición (el tag no es editable).

## Goals / Non-Goals

**Goals:**
- Añadir edición de budgets reutilizando el dialog/form existente.
- El tag se muestra en modo edición pero queda deshabilitado (solo se edita `value`).
- Mínima complejidad: un solo dialog, un signal para saber si estamos en modo editar.

**Non-Goals:**
- Cambiar el tag de un budget existente.
- Extraer el form a un componente propio (no es necesario con el alcance actual).
- Paginación o filtros en la lista de budgets.

## Decisions

### Un único dialog para crear y editar

**Decisión**: Usar el mismo `<p-dialog>` con un signal `editingBudget = signal<Budget | null>(null)`.  
**Alternativa descartada**: Crear un segundo dialog o un componente separado — añade complejidad innecesaria para un form de dos campos.  
**Rationale**: El form ya existe; solo hay que pre-rellenarlo y cambiar el handler del botón de guardar.

### Tag deshabilitado en modo edición

**Decisión**: En modo edición, deshabilitar el control `tagId` del form en lugar de ocultarlo.  
**Rationale**: Mostrar el tag da contexto al usuario sobre qué budget está editando. El backend no acepta cambios de tag, así que deshabilitar es la opción más segura.

### Señal `editingBudget` en lugar de flag booleano

**Decisión**: Usar `editingBudget = signal<Budget | null>(null)`. `null` = modo creación, valor = modo edición.  
**Rationale**: Contiene el id necesario para el `PATCH` y el tag name para mostrar, sin necesidad de signals adicionales.

## Risks / Trade-offs

- **[Riesgo] El usuario edita y cancela, dejando el form sucio**: Al cerrar el dialog (cancel o click fuera) se resetea el form y se limpia `editingBudget`. Mitigación incluida en la implementación.
- **[Trade-off] No se extrae el form a componente propio**: Aceptable dado el alcance; si la pantalla crece (ej. más campos), se puede extraer después.
