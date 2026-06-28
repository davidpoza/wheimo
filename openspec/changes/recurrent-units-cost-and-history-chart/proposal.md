## Why

Hoy un artículo recurrente solo registra un precio. Para gastos que se compran por cantidad (p. ej. varias unidades de un producto, packs, litros), el usuario necesita conocer el **coste total** (precio unitario × unidades) y no solo el precio por unidad. Además, tanto el precio como las unidades cambian con el tiempo y deben quedar registrados juntos para poder analizar su evolución.

## What Changes

- Un artículo recurrente puede tener un **número de unidades opcional**. El número de unidades, igual que el precio, varía en el tiempo y se registra como parte de cada entrada del historial.
- En la tabla de artículos recurrentes, la columna **"Precio actual"** pasa a interpretarse como **precio unitario** y se añade una columna **"Coste total"** (precio × unidades) que solo se muestra/calcula cuando el artículo tiene unidades indicadas. Sin unidades, el comportamiento es el actual.
- El **modal de historial de precios** permite registrar precio **y** unidades en la misma operación, y muestra ambas columnas en la tabla del historial.
- El modal incorpora un **gráfico de líneas** que representa la evolución de **precio y unidades** en un único chart (doble eje Y).
- Mejoras de UX en el modal: tamaño mayor y un layout más cuidado.

## Capabilities

### New Capabilities
- `price-history-chart`: gráfico de líneas dentro del modal de historial que muestra la evolución conjunta de precio y unidades a lo largo del tiempo en un solo chart con doble eje.

### Modified Capabilities
- `recurring-articles`: la entidad `Recurrent` añade el campo opcional `units` (unidades actuales); el listado expone `units` y permite calcular el coste total.
- `price-history`: cada entrada de precio puede incluir `units` (opcional); al registrar una entrada se actualiza el `amount` y las `units` actuales del artículo; el historial devuelve `units` por entrada.
- `price-history-modal-ui`: el modal registra y muestra unidades además del precio, calcula coste total, es de mayor tamaño y tiene un layout mejorado.

## Impact

- **Base de datos**: nueva migración Flyway que añade `units` a `recurrents` y a `recurrent_price_entries` (ambas nullable).
- **Backend**: `Recurrent`, `RecurrentPriceEntry`, `RecurrentDto`, `RecurrentPriceEntryDto`, `RecurrentService`, `RecurrentController`.
- **Frontend**: `recurrent.model.ts`, `recurrents.service.ts`, `recurrents-list` (columna coste total), `price-history-dialog` (form con unidades, tabla con unidades, chart, tamaño/layout).
- **Compatibilidad**: cambio retrocompatible; los artículos y entradas sin unidades siguen funcionando exactamente igual.
