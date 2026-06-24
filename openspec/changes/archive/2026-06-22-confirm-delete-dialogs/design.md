## Context

Hay 4 componentes con botones de eliminar que ejecutan el borrado directamente sin confirmación:

- `tags-grid` → `deleteTag(tag)`
- `tag-rules` → `deleteRule(rule.id)`
- `accounts-list` → `delete(account)`
- `budgets` → `deleteBudget(status.budget.id)`

Todos usan PrimeNG (`p-button`, `MessageService`). Ninguno usa aún `ConfirmationService`.

## Goals / Non-Goals

**Goals:**
- Mostrar un `<p-confirmDialog>` de PrimeNG antes de cualquier operación de borrado
- Reutilizar el patrón `ConfirmationService.confirm()` de PrimeNG de forma consistente en los 4 componentes

**Non-Goals:**
- No se crea un servicio wrapper propio ni un componente shared
- No se cambia ninguna lógica de negocio ni llamadas al backend
- No se añade confirmación a acciones que no sean destructivas

## Decisions

### Usar `ConfirmationService` directamente en cada componente

PrimeNG provee `ConfirmationService` + `<p-confirmDialog>` como el mecanismo estándar para confirmaciones imperativas. Cada componente inyectará el servicio, añadirá `ConfirmDialogModule` a sus imports y el tag `<p-confirmDialog>` a su template.

**Alternativa descartada**: crear un servicio wrapper propio — innecesario, PrimeNG ya es la abstracción.

**Alternativa descartada**: usar `p-dialog` genérico con variable booleana de visibilidad — más verboso y menos idiomático que `ConfirmationService`.

### Mensaje de confirmación contextual por entidad

Cada diálogo mostrará el nombre/tipo del elemento a borrar para dar contexto al usuario (e.g., "¿Eliminar tag «Alimentación»?").

## Risks / Trade-offs

- `<p-confirmDialog>` debe declararse en el template de cada componente; si se olvida, el diálogo no aparece sin error visible → se cubre en los tests manuales.
- `ConfirmationService` debe añadirse a `providers` de cada componente standalone.
