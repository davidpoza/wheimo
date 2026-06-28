## ADDED Requirements

### Requirement: Gráfico de evolución de precio y unidades
El modal de historial de precios SHALL mostrar un gráfico de líneas (`p-chart` de PrimeNG, tipo `line`) que represente la evolución del precio y de las unidades del artículo recurrente a lo largo del tiempo en un único chart con doble eje Y.

#### Scenario: Mostrar ambas series en un solo chart
- **WHEN** el modal se abre para un artículo con al menos una entrada de historial
- **THEN** se renderiza un único `p-chart` de tipo línea con dos series: "Precio" y "Unidades"
- **THEN** el eje X representa la fecha de cada entrada (`recordedAt`) ordenada de más antigua a más reciente
- **THEN** la serie "Precio" se asocia a un eje Y y la serie "Unidades" a un segundo eje Y independiente

#### Scenario: Artículo sin unidades registradas
- **WHEN** el modal se abre para un artículo cuyas entradas no tienen unidades
- **THEN** el chart muestra únicamente la serie "Precio"
- **THEN** no se renderiza la serie "Unidades" ni su eje

#### Scenario: Historial vacío
- **WHEN** el modal se abre para un artículo sin entradas de historial
- **THEN** no se renderiza el gráfico (o se muestra un estado vacío) sin producir errores
