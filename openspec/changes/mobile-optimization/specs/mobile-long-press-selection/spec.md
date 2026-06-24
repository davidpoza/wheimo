## ADDED Requirements

### Requirement: Long tap activates selection mode on mobile
En móvil, mantener pulsada una fila durante ≥500ms SHALL activar el modo selección y añadir esa fila a la selección.

#### Scenario: Long tap enters selection mode
- **WHEN** el usuario mantiene pulsada una fila durante 500ms o más en móvil
- **THEN** el modo selección se activa, la fila queda seleccionada y se muestra el banner de selección

#### Scenario: Scroll does not trigger long press
- **WHEN** el usuario inicia un gesto de scroll sobre una fila
- **THEN** el long press no se activa aunque el dedo permanezca más de 500ms

### Requirement: Tap toggles row selection while in selection mode
Mientras el modo selección está activo, un tap SHALL añadir o eliminar la fila de la selección en lugar de abrir el detalle.

#### Scenario: Tap adds unselected row to selection
- **WHEN** el modo selección está activo y el usuario toca una fila no seleccionada
- **THEN** la fila se añade a la selección y muestra indicador visual

#### Scenario: Tap removes selected row from selection
- **WHEN** el modo selección está activo y el usuario toca una fila ya seleccionada
- **THEN** la fila se elimina de la selección

#### Scenario: Normal tap opens detail when not in selection mode
- **WHEN** el modo selección está inactivo y el usuario toca una fila en móvil
- **THEN** se abre el detalle de la transacción

### Requirement: Selection banner visible during selection mode
Mientras el modo selección está activo, SHALL mostrarse un banner con el número de filas seleccionadas y un botón para cancelar.

#### Scenario: Banner shows correct count
- **WHEN** el modo selección está activo con N filas seleccionadas
- **THEN** el banner muestra "N seleccionadas"

#### Scenario: Cancel button exits selection mode
- **WHEN** el usuario pulsa "Cancel" en el banner
- **THEN** se deseleccionan todas las filas y el modo selección se desactiva

### Requirement: Selection mode exits automatically when selection is empty
Si el usuario deselecciona todas las filas, el modo selección SHALL desactivarse automáticamente.

#### Scenario: Auto-exit when last row deselected
- **WHEN** el usuario deselecciona la última fila
- **THEN** el modo selección se desactiva y el banner desaparece

### Requirement: Selected rows have visual indicator on mobile
Las filas seleccionadas en móvil SHALL mostrar un fondo de acento mientras el modo selección está activo.

#### Scenario: Selected row has highlight background
- **WHEN** una fila está seleccionada en modo selección móvil
- **THEN** la fila muestra un fondo de color de acento distinto al resto
