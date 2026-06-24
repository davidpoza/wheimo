## ADDED Requirements

### Requirement: Filter drawer height adapts to content on mobile
El faldón inferior de filtros SHALL ajustar su altura para mostrar todos los campos de filtrado y los botones de acción sin necesidad de scroll, hasta un máximo de 90vh.

#### Scenario: All filter fields visible without scrolling
- **WHEN** el usuario pulsa "Filters" en un dispositivo de 375×812px
- **THEN** el drawer muestra los 6 campos de filtro y los botones Apply/Reset sin scroll interno

#### Scenario: Drawer does not exceed 90% of viewport height
- **WHEN** el usuario pulsa "Filters" en cualquier dispositivo móvil
- **THEN** el drawer ocupa como máximo el 90% de la altura del viewport

### Requirement: Drawer scrolls internally when content exceeds max height
Si el contenido supera el `max-height`, el drawer SHALL permitir scroll interno en lugar de ocultar contenido.

#### Scenario: Content scrollable on very small screens
- **WHEN** el usuario pulsa "Filters" en un dispositivo con pantalla de menos de 600px de alto
- **THEN** el cuerpo del drawer es desplazable y todos los campos son accesibles

### Requirement: Desktop filter bar unchanged
En pantallas mayores de 768px, la barra de filtros horizontal SHALL seguir mostrándose sin cambios.

#### Scenario: Desktop shows filter bar not drawer
- **WHEN** el usuario accede a la vista de transacciones en pantalla mayor de 768px
- **THEN** se muestra la barra de filtros horizontal; el botón Filters y el drawer están ocultos
