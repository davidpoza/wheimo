## ADDED Requirements

### Requirement: Amount column fully visible without horizontal scroll on mobile
En pantallas de hasta 768px, la columna `amount` SHALL mostrarse completamente (símbolo de moneda, valor y decimales) sin scroll horizontal.

#### Scenario: Amount visible on standard phone
- **WHEN** el usuario visualiza la lista de transacciones en un dispositivo de 375px de ancho
- **THEN** el importe de cada transacción se muestra completo en su columna sin scroll horizontal

#### Scenario: Amount visible on small phone
- **WHEN** el usuario visualiza la lista de transacciones en un dispositivo de 320px de ancho
- **THEN** el importe de cada transacción se muestra completo sin scroll horizontal

### Requirement: Checkbox, Tags and Expand-toggle columns hidden on mobile
En pantallas de hasta 768px, las columnas de checkbox, tags y expand-toggle SHALL estar ocultas para liberar espacio horizontal.

#### Scenario: Hidden columns not rendered on mobile
- **WHEN** el usuario visualiza la lista de transacciones en un dispositivo de 768px o menos
- **THEN** las columnas de checkbox, tags y expand-toggle no son visibles en la tabla

### Requirement: Action buttons column has adequate width on mobile
En pantallas de hasta 768px, la columna de botones de acción (favorito + aplicar reglas) SHALL tener anchura suficiente para mostrar ambos botones sin comprimirse.

#### Scenario: Both action buttons visible and tappable
- **WHEN** el usuario visualiza la lista de transacciones en móvil
- **THEN** los botones de favorito y aplicar reglas son visibles con área de toque adecuada

### Requirement: Desktop layout unchanged
En pantallas mayores de 768px, la tabla SHALL mostrar todas las columnas con el mismo comportamiento actual.

#### Scenario: All columns visible on desktop
- **WHEN** el usuario visualiza la lista de transacciones en una pantalla mayor de 768px
- **THEN** todas las columnas son visibles y funcionales
