## ADDED Requirements

### Requirement: Página de seguimiento de precios con tabs dinámicos
El sistema SHALL mostrar una página en la ruta `/price-tracking` con un tab por cada PriceTracker activo. Los tabs se generan dinámicamente cargando los trackers desde la API al entrar en la página.

#### Scenario: Página con trackers configurados
- **WHEN** el usuario navega a `/price-tracking`
- **THEN** la página carga los trackers activos desde `GET /api/price-trackers`
- **THEN** muestra un tab por cada tracker, usando el campo `name` como etiqueta del tab
- **THEN** el primer tab queda seleccionado por defecto

#### Scenario: Página sin trackers configurados
- **WHEN** el usuario navega a `/price-tracking` y no hay trackers
- **THEN** la página muestra un mensaje indicando que no hay seguimientos configurados y un botón para crear el primero

#### Scenario: Tab seleccionado carga su gráfica
- **WHEN** el usuario selecciona un tab
- **THEN** la página carga las lecturas de ese tracker con el periodo actualmente seleccionado
- **THEN** muestra la gráfica de evolución de precio (línea temporal)

### Requirement: Selector de periodo de tiempo para la gráfica
La página SHALL ofrecer un selector de periodo con opciones predefinidas que filtran el rango de datos mostrado en la gráfica del tab activo.

#### Scenario: Selección de periodo predefinido
- **WHEN** el usuario selecciona uno de los periodos: "1M", "3M", "6M", "1A", "Todo"
- **THEN** la gráfica se actualiza mostrando las lecturas del tracker en ese rango temporal
- **THEN** el periodo seleccionado queda resaltado visualmente

#### Scenario: Cambio de tab mantiene el periodo seleccionado
- **WHEN** el usuario cambia de tab
- **THEN** la gráfica del nuevo tab se carga con el mismo periodo que estaba activo

### Requirement: Gráfica de evolución de precio
Cada tab SHALL mostrar una gráfica de línea con la evolución temporal del precio para ese tracker en el periodo seleccionado.

#### Scenario: Gráfica con datos
- **WHEN** el tracker tiene lecturas en el periodo seleccionado
- **THEN** la gráfica muestra una línea con los puntos de precio ordenados cronológicamente
- **THEN** el eje X muestra fechas y el eje Y muestra el valor del precio con unidad (€/litro u otra según el tracker)

#### Scenario: Gráfica sin datos
- **WHEN** el tracker no tiene lecturas en el periodo seleccionado
- **THEN** la gráfica muestra un mensaje indicando que no hay datos disponibles para ese periodo

#### Scenario: Múltiples localizaciones en un tracker
- **WHEN** el tracker tiene lecturas con distintas `locationKey` (varios municipios)
- **THEN** la gráfica muestra una serie/línea por cada localización, identificadas por color y leyenda

### Requirement: Botón de fetch manual desde la UI
La página SHALL incluir un botón para disparar manualmente el fetch de todos los trackers o del tracker actualmente seleccionado.

#### Scenario: Fetch manual del tracker activo
- **WHEN** el usuario pulsa el botón "Actualizar precios" en el tab activo
- **THEN** la UI hace POST `/api/price-trackers/{id}/fetch`
- **THEN** muestra un indicador de carga durante la operación
- **THEN** al completarse, recarga las lecturas y actualiza la gráfica
- **THEN** muestra un mensaje de éxito o error según el resultado

#### Scenario: Fetch en curso desactiva el botón
- **WHEN** el fetch manual está en curso
- **THEN** el botón queda desactivado hasta que la operación completa

### Requirement: Panel de gestión de trackers
La página SHALL incluir acceso a un panel (modal o sección) para crear, editar y eliminar trackers sin salir de la página.

#### Scenario: Crear nuevo tracker desde la UI
- **WHEN** el usuario pulsa "Añadir seguimiento" y completa el formulario (nombre, tipo de fetcher, parámetros dinámicos según tipo)
- **THEN** la UI hace POST `/api/price-trackers`
- **THEN** al crearse, aparece un nuevo tab para el tracker creado

#### Scenario: Formulario dinámico según tipo de fetcher
- **WHEN** el usuario selecciona el tipo de fetcher "GASOIL" en el formulario de creación
- **THEN** aparecen los campos específicos del fetcher: municipio(s), tipo de carburante (dropdown con los productos disponibles), tipo de agregación (min/avg/max)

#### Scenario: Editar tracker existente
- **WHEN** el usuario pulsa el icono de edición en un tab y modifica los datos
- **THEN** la UI hace PUT `/api/price-trackers/{id}` con los cambios
- **THEN** el tab se actualiza con el nuevo nombre si cambió

#### Scenario: Eliminar tracker
- **WHEN** el usuario confirma la eliminación de un tracker
- **THEN** la UI hace DELETE `/api/price-trackers/{id}`
- **THEN** el tab desaparece y se selecciona el tab anterior (o se muestra el estado vacío si no quedan tabs)

### Requirement: Navegación a la página desde el menú lateral
La ruta `/price-tracking` SHALL estar accesible desde el menú lateral de la aplicación con la etiqueta "Seguimiento de Precios".

#### Scenario: Enlace en el menú lateral
- **WHEN** el usuario está autenticado
- **THEN** el menú lateral muestra una entrada "Seguimiento de Precios" que navega a `/price-tracking`
