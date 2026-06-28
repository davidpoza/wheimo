## MODIFIED Requirements

### Requirement: Historial de precios mostrado con tabla de PrimeNG
El modal de historial de precios de un artículo recurrente SHALL mostrar las entradas usando el componente `p-table` de PrimeNG, con el mismo estilo compacto que el resto de tablas de la aplicación (`styleClass="p-datatable-sm"`) y resaltado de fila al pasar el cursor (`[rowHover]="true"`). La tabla SHALL incluir una columna de unidades.

#### Scenario: Mostrar entradas de precio
- **WHEN** el modal se abre para un artículo recurrente que tiene entradas de historial
- **THEN** se renderiza un `p-table` con columnas "Fecha" (formato `dd/MM/yyyy HH:mm`), "Precio" (formato moneda EUR) y "Unidades"
- **THEN** cada entrada del historial aparece como una fila de la tabla
- **THEN** las entradas sin unidades muestran "—" en la columna "Unidades"
- **THEN** al pasar el cursor sobre una fila esta se resalta

#### Scenario: Cabecera de la tabla
- **WHEN** el `p-table` se renderiza
- **THEN** muestra una fila de cabecera con los encabezados "Fecha", "Precio" y "Unidades"

### Requirement: Consistencia visual del modal
El layout del modal SHALL ser visualmente coherente con el resto de la aplicación, con un tamaño suficientemente amplio para mostrar tabla y gráfico sin desbordamiento horizontal, y un formulario de alta cuidado.

#### Scenario: La tabla cabe en el modal
- **WHEN** el modal se muestra con una o más entradas de precio
- **THEN** las columnas se muestran completas dentro del ancho del diálogo sin recorte ni scroll horizontal

#### Scenario: Tamaño ampliado del modal
- **WHEN** el modal se abre
- **THEN** el diálogo se muestra con un ancho mayor que el original (520px) para acomodar el gráfico y la tabla cómodamente

## ADDED Requirements

### Requirement: Registro de precio y unidades en el modal
El formulario de alta del modal SHALL permitir introducir el precio (obligatorio) y, opcionalmente, las unidades, además de la fecha, y enviarlos juntos al registrar la entrada.

#### Scenario: Registrar precio con unidades desde el modal
- **WHEN** el usuario rellena precio, unidades y (opcionalmente) fecha y pulsa "Guardar"
- **THEN** se envía la entrada con `amount`, `units` y `recordedAt` al backend
- **THEN** al completarse, el historial, el gráfico y el precio/unidades actuales del artículo se refrescan

#### Scenario: Registrar precio sin unidades desde el modal
- **WHEN** el usuario rellena solo el precio (deja unidades vacío) y pulsa "Guardar"
- **THEN** se envía la entrada con `units` ausente/null y se registra correctamente
