## ADDED Requirements

### Requirement: Historial de precios mostrado con tabla de PrimeNG
El modal de historial de precios de un artículo recurrente SHALL mostrar las entradas usando el componente `p-table` de PrimeNG, con el mismo estilo compacto que el resto de tablas de la aplicación (`styleClass="p-datatable-sm"`) y resaltado de fila al pasar el cursor (`[rowHover]="true"`).

#### Scenario: Mostrar entradas de precio
- **WHEN** el modal se abre para un artículo recurrente que tiene entradas de historial
- **THEN** se renderiza un `p-table` con una columna "Fecha" (formato `dd/MM/yyyy HH:mm`) y una columna "Precio" (formato moneda EUR)
- **THEN** cada entrada del historial aparece como una fila de la tabla
- **THEN** al pasar el cursor sobre una fila esta se resalta

#### Scenario: Cabecera de la tabla
- **WHEN** el `p-table` se renderiza
- **THEN** muestra una fila de cabecera con los encabezados "Fecha" y "Precio"

### Requirement: Estado vacío del historial
El modal SHALL indicar de forma clara cuando un artículo recurrente no tiene entradas de historial, usando la plantilla de estado vacío del propio `p-table`.

#### Scenario: Artículo sin historial
- **WHEN** el modal se abre para un artículo recurrente sin entradas de historial
- **THEN** el `p-table` muestra el mensaje "Sin entradas de precio aún." mediante su plantilla `empty`
- **THEN** no se renderiza ninguna fila de datos

### Requirement: Consistencia visual del modal
El layout del modal SHALL ser visualmente coherente con el resto de la aplicación y la tabla SHALL disponer de suficiente espacio para mostrar fecha e importe sin desbordamiento horizontal.

#### Scenario: La tabla cabe en el modal
- **WHEN** el modal se muestra con una o más entradas de precio
- **THEN** las columnas "Fecha" y "Precio" se muestran completas dentro del ancho del diálogo sin recorte ni scroll horizontal
