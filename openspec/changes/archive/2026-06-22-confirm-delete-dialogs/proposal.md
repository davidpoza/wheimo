## Why

Actualmente todos los botones de eliminar (tags, reglas, cuentas, presupuestos) ejecutan el borrado de forma inmediata sin pedir confirmación, lo que puede provocar pérdidas de datos accidentales. Añadir un diálogo de confirmación de PrimeNG protege al usuario de acciones irreversibles.

## What Changes

- Los botones `pi-trash` en tags, reglas de tags, cuentas y presupuestos mostrarán un `<p-confirmDialog>` de PrimeNG antes de ejecutar la operación de borrado.
- Se usará el servicio `ConfirmationService` de PrimeNG para disparar los diálogos.
- No se cambia ninguna lógica de negocio ni llamada al backend.

## Capabilities

### New Capabilities

- `delete-confirmation`: Diálogo de confirmación reutilizable con PrimeNG `ConfirmationService` aplicado a todos los puntos de eliminación de la app.

### Modified Capabilities

<!-- ninguna -->

## Impact

- **Componentes afectados**: `tags-grid`, `tag-rules`, `accounts-list`, `budgets`
- **Dependencias**: `primeng/confirmdialog`, `ConfirmationService` (ya disponible en PrimeNG)
- **Sin cambios en API ni backend**
