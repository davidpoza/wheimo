## ADDED Requirements

### Requirement: Header action buttons show icon only on mobile
En pantallas de hasta 768px, los botones de acción de las cabeceras de vista SHALL mostrar únicamente el icono, ocultando la etiqueta de texto.

#### Scenario: Transactions New button icon only on mobile
- **WHEN** el usuario visualiza la vista Transactions en móvil
- **THEN** el botón "New" muestra solo el icono pi-plus sin texto

#### Scenario: Transactions Tag Selected button icon only on mobile
- **WHEN** hay transacciones seleccionadas y el usuario está en móvil
- **THEN** el botón "Tag Selected" muestra solo el icono pi-tags sin texto

#### Scenario: Accounts Add Account button icon only on mobile
- **WHEN** el usuario visualiza la vista Accounts en móvil
- **THEN** el botón "Add Account" muestra solo el icono pi-plus sin texto

#### Scenario: Recurrents Nuevo artículo button icon only on mobile
- **WHEN** el usuario visualiza la vista Recurrents en móvil
- **THEN** el botón "Nuevo artículo" muestra solo el icono pi-plus sin texto

#### Scenario: Budgets New Budget button icon only on mobile
- **WHEN** el usuario visualiza la vista Budgets en móvil
- **THEN** el botón "New Budget" muestra solo el icono pi-plus sin texto

### Requirement: Header buttons show full label on desktop
En pantallas mayores de 768px, los botones de cabecera SHALL mostrar icono y etiqueta de texto sin cambios.

#### Scenario: Buttons show full label on desktop
- **WHEN** el usuario visualiza cualquier vista en pantalla mayor de 768px
- **THEN** los botones de cabecera muestran icono y texto completo
