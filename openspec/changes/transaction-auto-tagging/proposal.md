## Why

Las transacciones se importan sin etiquetas, obligando al usuario a clasificarlas manualmente una a una. Con reglas de etiquetado basadas en regex sobre el concepto de la transacción, se puede automatizar la clasificación en el momento de la importación.

## What Changes

- Nueva pantalla de gestión de reglas de etiquetado automático (CRUD)
- Cada regla define una regex aplicada al concepto de la transacción y el tag que se asigna si hay match
- El fetcher aplica las reglas activas sobre cada transacción al importarla
- Las reglas se evalúan en orden de prioridad; se aplica la primera que hace match

## Capabilities

### New Capabilities

- `auto-tagging-rules`: CRUD de reglas de etiquetado automático (nombre, regex sobre concepto, tag a asignar, activa/inactiva, orden de prioridad)
- `transaction-import-tagging`: Proceso que aplica las reglas activas sobre cada transacción durante la importación en el fetcher

### Modified Capabilities

- `recurring-articles`: ningún cambio de requisitos

## Impact

- Backend: nuevo modelo `AutoTaggingRule`, nuevo endpoint REST para CRUD de reglas, modificación del fetcher para ejecutar el motor de reglas en cada transacción importada
- Frontend: nueva ruta/pantalla de configuración de reglas, integrada en el menú de ajustes o configuración
- Base de datos: nueva tabla `auto_tagging_rules`
- Sin breaking changes en la API existente
