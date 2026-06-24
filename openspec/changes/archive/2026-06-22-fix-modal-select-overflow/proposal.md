## Why

Los selectores (`p-select`, `p-multiselect`) dentro de los diálogos PrimeNG quedan recortados por el `overflow` del modal, impidiendo visualizar todas las opciones del desplegable. Esto afecta a la usabilidad en varias pantallas clave.

## What Changes

- Añadir `[appendTo]="'body'"` en todos los `p-select` y `p-multiselect` dentro de diálogos, para que el panel del dropdown se renderice en el body y sobresalga del modal sin ser recortado.
- Diálogos afectados:
  - `edit-account-dialog`: `p-select` de Bank
  - `tagging-dialog`: `p-multiselect` de Tags
  - `transaction-details-dialog`: `p-multiselect` de Tags
  - `create-transaction-dialog`: `p-select` de Account

## Capabilities

### New Capabilities
<!-- No hay nuevas capacidades funcionales -->

### Modified Capabilities
<!-- Solo es un fix de UI/CSS, sin cambios en requisitos de negocio -->

## Impact

- 4 archivos HTML/TS de componentes de diálogo en `frontend/src/app/features/`
- Sin cambios en backend, APIs ni dependencias
- Sin breaking changes
