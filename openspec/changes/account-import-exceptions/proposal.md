## Why

Durante la importación de transacciones bancarias, ciertas transacciones (comisiones internas, movimientos de ajuste, etc.) no deben ser importadas a una cuenta concreta. Actualmente no existe ningún mecanismo para filtrarlas, por lo que el usuario debe borrarlas manualmente después de cada importación. Las excepciones por cuenta permiten definir patrones regex que excluyen automáticamente esas transacciones en el momento de la importación.

## What Changes

- Nueva entidad `AccountException` con campos: `id`, `accountId`, `regex`, `description`, y `createdAt`.
- Endpoint REST completo (CRUD) para gestionar las excepciones de una cuenta.
- La lógica de importación aplica las excepciones activas de la cuenta antes de persistir transacciones.
- El modal de detalle de cuenta pasa a tener dos pestañas: **Detalle** (contenido actual) y **Excepciones** (tabla con CRUD inline).

## Capabilities

### New Capabilities

- `account-exceptions`: CRUD de excepciones por cuenta (backend + frontend). Incluye la entidad, los endpoints REST, la aplicación del filtro en la importación y la UI en el modal de la cuenta.

### Modified Capabilities

- (ninguna)

## Impact

- **Backend**: nueva tabla `account_exceptions`, nuevo módulo/servicio/controlador para `AccountException`, modificación del servicio de importación para evaluar las regex antes de insertar transacciones.
- **Frontend**: modal de cuenta refactorizado con `p-tabView`; nuevo componente o sección para listar, crear, editar y borrar excepciones (`p-table` + dialogs).
- **Base de datos**: migración para crear `account_exceptions`.
- **Sin breaking changes** hacia otros flujos existentes.
