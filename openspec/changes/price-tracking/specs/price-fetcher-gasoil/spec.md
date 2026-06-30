## ADDED Requirements

### Requirement: Obtener precio de gasoil por municipio desde API MINETUR
El sistema SHALL implementar `GasoilPriceFetcher` que consulta la API pública de precios de carburantes del Ministerio de Industria (MINETUR) para obtener precios en un municipio dado. El fetcher usa los parámetros `municipioId`, `productoId` y `aggregation` del campo `params` del tracker.

#### Scenario: Fetch exitoso para municipio con estaciones
- **WHEN** el fetcher se invoca para un tracker con `{"municipioId": "4902", "productoId": "1", "aggregation": "min"}`
- **THEN** el fetcher llama a `GET https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestresMI/FiltroMunicipioProducto/4902/1`
- **THEN** extrae los precios de las estaciones devueltas
- **THEN** aplica la agregación indicada (`min`, `avg`, o `max`) sobre los precios
- **THEN** retorna una lista con un único `PriceReading` con `readingDate = today` y el valor agregado

#### Scenario: Municipio sin estaciones para el producto
- **WHEN** la API devuelve lista vacía para el municipio y producto dados
- **THEN** el fetcher retorna lista vacía (no se crea ninguna lectura)
- **THEN** el sistema registra un aviso en el log con el municipio y producto

#### Scenario: API MINETUR no disponible
- **WHEN** la llamada HTTP a MINETUR falla (timeout, 5xx, red)
- **THEN** el fetcher lanza una excepción que el scheduler captura y registra como error
- **THEN** no se genera ninguna lectura para ese tracker en esa ejecución

#### Scenario: Parámetros inválidos en el tracker
- **WHEN** el tracker tiene `params` sin `municipioId` o `productoId`
- **THEN** el fetcher lanza una excepción de validación con mensaje descriptivo

### Requirement: Múltiples localizaciones por tracker
El sistema SHALL permitir que un único tracker de gasoil monitorice N municipios, generando una lectura por municipio y día.

#### Scenario: Tracker con varios municipios
- **WHEN** el fetcher se invoca para un tracker con `{"municipios": [{"municipioId": "4902", "label": "Alcobendas"}, {"municipioId": "7040", "label": "Madrid"}], "productoId": "1", "aggregation": "min"}`
- **THEN** el fetcher llama a la API una vez por cada municipio
- **THEN** retorna una `PriceReading` por municipio con el valor agregado y el municipioId como `locationKey`

#### Scenario: Un municipio falla pero los demás siguen
- **WHEN** la llamada a MINETUR para uno de los municipios falla
- **THEN** el fetcher registra el error para ese municipio
- **THEN** retorna las lecturas de los municipios que sí respondieron correctamente

### Requirement: Credenciales de MINETUR via variables de entorno
El sistema SHALL leer las credenciales o configuración de la API MINETUR desde variables de entorno, de modo que no se hardcodeen en el código. Si la API no requiere clave, la variable puede estar vacía o ausente.

#### Scenario: Variable de entorno presente
- **WHEN** la variable `PRICE_FETCHER_MINETUR_API_KEY` está definida en el entorno
- **THEN** el fetcher la incluye en las peticiones HTTP (header o query param según requiera la API)

#### Scenario: Variable de entorno ausente para API pública
- **WHEN** `PRICE_FETCHER_MINETUR_API_KEY` no está definida
- **THEN** el fetcher funciona igualmente (la API MINETUR es pública y no requiere clave actualmente)

### Requirement: Tipos de producto de carburante soportados
El sistema SHALL reconocer los identificadores de producto de la API MINETUR para los carburantes más comunes, mostrando etiquetas legibles en la UI.

#### Scenario: Producto conocido muestra etiqueta legible
- **WHEN** se consulta el tipo de fetcher GASOIL con `productoId = "1"`
- **THEN** la UI muestra "Gasoleo A" como etiqueta del producto

#### Scenario: Catálogo de productos incluye los principales carburantes
- **WHEN** se obtiene el schema de parámetros del fetcher GASOIL
- **THEN** el catálogo incluye al menos: Gasoleo A (1), Gasolina 95 (3), Gasolina 98 (4), Gasoleo Premium (6)
