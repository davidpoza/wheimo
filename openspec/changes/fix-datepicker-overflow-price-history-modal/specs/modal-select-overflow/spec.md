## ADDED Requirements

### Requirement: El datepicker en modales muestra su calendario completo
El componente `p-datepicker` dentro de `p-dialog` SHALL mostrar su calendario desplegable completo sin que el borde del diálogo lo recorte, usando `appendTo="body"` para renderizar el overlay en el documento raíz.

#### Scenario: Abrir datepicker de fecha en price-history-dialog
- **WHEN** el usuario abre el modal de historial de precios, activa el formulario de añadir precio y hace clic en el campo de fecha
- **THEN** el calendario se despliega completamente visible, por encima del modal y sin quedar recortado por sus bordes
