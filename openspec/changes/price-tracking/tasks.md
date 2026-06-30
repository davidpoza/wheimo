## 1. Base de datos (Flyway)

- [x] 1.1 Crear migración `V10__create_price_tracking.sql` con tabla `price_trackers` (id, name, fetcher_type, params JSONB, active, created_at)
- [x] 1.2 Añadir tabla `price_readings` (id, tracker_id FK, reading_date DATE, location_key VARCHAR, value DECIMAL) con UNIQUE CONSTRAINT `(tracker_id, reading_date, location_key)`

## 2. Dominio backend - entidades y repositorios

- [x] 2.1 Crear entidad JPA `PriceTracker` mapeada a `price_trackers`
- [x] 2.2 Crear entidad JPA `PriceReading` mapeada a `price_readings`
- [x] 2.3 Crear `PriceTrackerRepository` (JpaRepository) con método `findAllByActiveTrue()`
- [x] 2.4 Crear `PriceReadingRepository` con método `findByTrackerIdAndReadingDateBetween` y `existsByTrackerIdAndReadingDateAndLocationKey`

## 3. Interfaz PriceFetcher y resolución

- [x] 3.1 Crear interfaz `PriceFetcher` con métodos `getType(): String` y `fetch(PriceTracker tracker): List<PriceReading>`
- [x] 3.2 Crear `PriceFetcherRegistry` que recibe `List<PriceFetcher>` por inyección y resuelve por tipo
- [x] 3.3 Crear `PriceFetcherProperties` (`@ConfigurationProperties(prefix = "price-fetcher")`) con campo `minetur.apiKey`
- [x] 3.4 Documentar variable de entorno `PRICE_FETCHER_MINETUR_API_KEY` en README/application.yml

## 4. GasoilPriceFetcher (API MINETUR)

- [x] 4.1 Crear `GasoilPriceFetcher implements PriceFetcher` anotado con `@Component`
- [x] 4.2 Implementar llamada HTTP a `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestresMI/FiltroMunicipioProducto/{municipioId}/{productoId}` usando `RestTemplate` o `WebClient`
- [x] 4.3 Parsear respuesta JSON de MINETUR y extraer precios de estaciones (campo `PrecioProducto`)
- [x] 4.4 Aplicar agregación `min`/`avg`/`max` según `params.aggregation` del tracker
- [x] 4.5 Soportar múltiples municipios (`params.municipios` como lista, una lectura por municipio con su `locationKey`)
- [x] 4.6 Validar presencia de parámetros obligatorios (`municipioId`/`municipios`, `productoId`) al inicio de `fetch`
- [x] 4.7 Exponer catálogo de productos y param schema en un método `getParamSchema()` (para el endpoint `fetcher-types`)

## 5. Servicio y scheduler backend

- [x] 5.1 Crear `PriceTrackerService` con métodos CRUD (create, findAll, findById, update, delete) y `getReadings(id, from, to)`
- [x] 5.2 Implementar lógica de deduplicación en `PriceTrackerService.saveReadings` usando `existsByTrackerIdAndReadingDateAndLocationKey`
- [x] 5.3 Crear `PriceFetchScheduler` con `@Scheduled(cron = "0 0 7 * * *")` que itera trackers activos, resuelve fetcher, guarda lecturas y captura excepciones por tracker
- [x] 5.4 Implementar método `fetchAll()` y `fetchOne(trackerId)` en `PriceFetchScheduler` para disparo manual
- [x] 5.5 Añadir `@EnableScheduling` a la clase de configuración o aplicación principal

## 6. Controlador REST backend

- [x] 6.1 Crear `PriceTrackerController` con endpoints CRUD: `GET /api/price-trackers`, `POST`, `GET /{id}`, `PUT /{id}`, `DELETE /{id}`
- [x] 6.2 Añadir endpoint `GET /api/price-trackers/{id}/readings?from=&to=`
- [x] 6.3 Añadir endpoint `POST /api/price-trackers/fetch` (todos) y `POST /api/price-trackers/{id}/fetch` (uno)
- [x] 6.4 Añadir endpoint `GET /api/price-trackers/fetcher-types` que devuelve los tipos disponibles con su param schema
- [x] 6.5 Crear DTOs: `PriceTrackerDto`, `CreatePriceTrackerRequest`, `UpdatePriceTrackerRequest`, `PriceReadingDto`, `FetchResultDto`
- [x] 6.6 Registrar la ruta en `SecurityConfig` (permitir acceso autenticado)

## 7. Frontend - servicio y modelos

- [x] 7.1 Crear `PriceTrackingService` en Angular con métodos para cada endpoint REST
- [x] 7.2 Definir interfaces TypeScript: `PriceTracker`, `PriceReading`, `FetcherType`, `FetchResult`

## 8. Frontend - página de seguimiento de precios

- [x] 8.1 Crear componente `PriceTrackingPageComponent` en `features/price-tracking/`
- [x] 8.2 Añadir ruta `/price-tracking` en `app.routes.ts` con lazy loading
- [x] 8.3 Implementar tabs dinámicos con PrimeNG `TabsModule` (un tab por tracker activo)
- [x] 8.4 Implementar selector de periodo (botones 1M/3M/6M/1A/Todo) que filtra las lecturas
- [x] 8.5 Implementar gráfica de línea con `p-chart` (PrimeNG ChartModule): eje X = fechas, eje Y = precio; una serie por `locationKey` si hay varias
- [x] 8.6 Mostrar estado vacío cuando no hay trackers o no hay datos en el periodo
- [x] 8.7 Implementar botón "Actualizar precios" que llama al endpoint de fetch manual del tracker activo y recarga la gráfica

## 9. Frontend - panel de gestión de trackers

- [x] 9.1 Crear componente `PriceTrackerFormComponent` (modal/dialog) para crear y editar trackers
- [x] 9.2 Cargar tipos de fetcher disponibles desde `GET /api/price-trackers/fetcher-types` y mostrar dropdown
- [x] 9.3 Renderizar campos dinámicos según el tipo de fetcher seleccionado (municipio(s), producto, agregación para GASOIL)
- [x] 9.4 Implementar creación y edición via formulario reactivo Angular
- [x] 9.5 Implementar eliminación de tracker con diálogo de confirmación (reutilizar `delete-confirmation` existente si aplica)
- [x] 9.6 Actualizar la lista de tabs al crear/editar/eliminar un tracker

## 10. Menú lateral e i18n

- [x] 10.1 Añadir entrada "Seguimiento de Precios" en el componente de menú lateral (`app-layout`)
- [x] 10.2 Añadir claves de traducción para la nueva página en los ficheros i18n (es/en)
