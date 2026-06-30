## ADDED Requirements

### Requirement: Filtros en tiempo real para transacciones
El sistema SHALL aplicar los filtros de transacciones automáticamente conforme el usuario interactúa con los campos, sin necesidad de pulsar un botón de confirmación. El botón "Aplicar" SHALL ser eliminado de todas las vistas.

#### Scenario: Búsqueda por texto con debounce
- **WHEN** el usuario escribe en el campo de búsqueda de texto
- **THEN** el sistema espera 300 ms sin actividad y aplica el filtro automáticamente

#### Scenario: Selección de cuenta aplica filtro inmediatamente
- **WHEN** el usuario selecciona o limpia una cuenta en el selector de cuenta
- **THEN** el sistema aplica el filtro de inmediato sin necesidad de confirmación

#### Scenario: Selección de tags aplica filtro inmediatamente
- **WHEN** el usuario selecciona o deselecciona tags en el multiselect
- **THEN** el sistema aplica el filtro de inmediato

#### Scenario: Selección de fecha aplica filtro inmediatamente
- **WHEN** el usuario selecciona una fecha en los campos "Desde" o "Hasta"
- **THEN** el sistema aplica el filtro de inmediato

#### Scenario: Selección de tipo de operación aplica filtro inmediatamente
- **WHEN** el usuario cambia el tipo de operación (gasto/ingreso/todos)
- **THEN** el sistema aplica el filtro de inmediato

### Requirement: Botón Resetear se mantiene
El sistema SHALL mantener el botón "Resetear" en todas las vistas (desktop y drawer móvil) para que el usuario pueda limpiar todos los filtros de una vez.

#### Scenario: Resetear limpia todos los filtros
- **WHEN** el usuario pulsa el botón "Resetear"
- **THEN** el sistema limpia todos los filtros y recarga las transacciones sin filtros activos

### Requirement: Cierre automático del drawer móvil al aplicar filtro
El sistema SHALL cerrar el drawer móvil automáticamente cuando se aplique un filtro (por cambio en selector, fecha o tras debounce de texto).

#### Scenario: Drawer se cierra tras seleccionar un filtro
- **WHEN** el usuario selecciona una opción en cualquier selector dentro del drawer
- **THEN** el drawer se cierra automáticamente después de aplicar el filtro

#### Scenario: Drawer se cierra tras el debounce de texto
- **WHEN** el usuario escribe en el campo de búsqueda dentro del drawer y se cumple el debounce de 300 ms
- **THEN** el drawer se cierra automáticamente después de aplicar el filtro
