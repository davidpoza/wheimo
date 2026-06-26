## Why

Los gastos recurrentes actualmente solo soportan una periodicidad en días, lo que no permite modelar gastos anuales (seguros, suscripciones anuales, etc.). Además, no existe una vista que muestre de forma proactiva qué gastos recurrentes requieren atención próxima, obligando al usuario a revisar manualmente toda la lista.

## What Changes

- Añadir soporte para periodicidad de tipo **anual** en gastos recurrentes, con selección de mes
- Añadir campo `periodicityType` al modelo de recurrente (`DAYS` | `ANNUAL`)
- Añadir campo `periodicityMonth` (1-12) para recurrentes de tipo anual
- Nueva pantalla **"Próximos gastos"** accesible desde el menú de navegación
- La pantalla filtra recurrentes según reglas de visibilidad temporal:
  - Tipo `ANNUAL`: visible si el mes actual coincide con `periodicityMonth`
  - Tipo `DAYS`: visible si hoy está dentro de una ventana de ±48h alrededor de la próxima fecha de pago

## Capabilities

### New Capabilities

- `proximos-gastos`: Pantalla que muestra los gastos recurrentes próximos según su tipo de periodicidad y ventana temporal

### Modified Capabilities

- `recurring-articles`: Extensión del modelo de recurrente para soportar dos tipos de periodicidad (días o anual con mes configurable), y actualización del formulario de creación/edición

## Impact

- **Backend**: Migración SQL para añadir `periodicity_type` y `periodicity_month` a la tabla `recurrents`. Actualización de entidad `Recurrent`, `RecurrentDto`, `RecurrentService` (lógica de `nextPredictedDate` y nuevo endpoint `/recurrents/upcoming`). Actualización de `RecurrentController`.
- **Frontend**: Modelo `Recurrent` actualizado. Componente `recurrents-list` actualizado (formulario con selector de tipo y mes). Nuevo componente `upcoming-recurrents`. Nuevo route `/upcoming`. Nuevo ítem en la navegación.
- **Base de datos**: Flyway migration V19.
