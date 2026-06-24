## ADDED Requirements

### Requirement: Description column allows up to two lines on mobile
En pantallas de hasta 768px, la celda de descripción SHALL mostrar el texto en hasta 2 líneas antes de truncar con "…".

#### Scenario: Short description fits in one line
- **WHEN** la descripción de una transacción cabe en una línea en móvil
- **THEN** se muestra en una línea sin truncado

#### Scenario: Long description clamped to two lines with ellipsis
- **WHEN** la descripción supera las 2 líneas en móvil
- **THEN** el texto se trunca al final de la segunda línea con "…"

### Requirement: Desktop description remains single-line
En pantallas mayores de 768px, la descripción SHALL seguir mostrándose en una sola línea con truncado.

#### Scenario: Desktop description single-line unchanged
- **WHEN** el usuario visualiza la tabla en pantalla mayor de 768px
- **THEN** la descripción se muestra en una línea con truncado, igual que antes del cambio
