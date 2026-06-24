### Requirement: Los selectores en modales muestran todas sus opciones
Los componentes `p-select` y `p-multiselect` dentro de `p-dialog` SHALL mostrar su panel desplegable completo sin que el borde del diálogo lo recorte, usando `appendTo="body"` para renderizar el overlay en el documento raíz.

#### Scenario: Abrir selector de banco en edit-account-dialog
- **WHEN** el usuario abre el diálogo de edición de cuenta y hace clic en el selector de Bank
- **THEN** el panel desplegable se muestra completo con todas las opciones visibles, incluso si sobresale del borde del modal

#### Scenario: Abrir multiselect de tags en tagging-dialog
- **WHEN** el usuario abre el diálogo de etiquetado masivo y hace clic en el multiselect de tags
- **THEN** el panel desplegable se muestra completo con todos los tags disponibles visibles

#### Scenario: Abrir multiselect de tags en transaction-details-dialog
- **WHEN** el usuario abre el detalle de una transacción y hace clic en el multiselect de tags
- **THEN** el panel desplegable se muestra completo sin quedar recortado por el modal

#### Scenario: Abrir selector de cuenta en create-transaction-dialog
- **WHEN** el usuario abre el diálogo de nueva transacción y hace clic en el selector de Account
- **THEN** el panel desplegable se muestra completo con todas las cuentas disponibles visibles
