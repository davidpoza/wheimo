## ADDED Requirements

### Requirement: Reset de filtros limpia todos los filtros activos
Al pulsar "Reset" en el panel de filtros de transacciones, el sistema SHALL eliminar todos los filtros de usuario y recargar la lista con los valores por defecto (limit=50, offset=0, sort=date,desc).

#### Scenario: Reset con filtros activos
- **WHEN** el usuario tiene filtros activos (descripción, tags, fechas, etc.) y pulsa "Reset"
- **THEN** los filtros se limpian, el panel se cierra y la grid muestra los resultados sin filtrar

#### Scenario: Reset sin filtros activos
- **WHEN** el usuario pulsa "Reset" sin filtros activos
- **THEN** la grid se recarga con los valores por defecto (sin cambio visible en resultados)
