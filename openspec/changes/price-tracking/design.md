## Context

Wheimo es un backend Spring Boot (Java, JPA/Flyway/PostgreSQL/Redis) con frontend Angular (PrimeNG, Transloco). El proyecto ya tiene soporte para historial de precios manual de artículos recurrentes (`recurrent_price_entries`). Este cambio añade un sistema independiente de seguimiento automático de precios de productos externos (gasoil u otros futuros) con scheduler, interfaz extensible (`PriceFetcher`) y página de visualización configurable.

La API pública de precios de carburantes pertenece al Ministerio de Industria (MINETUR), accesible en `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/` sin autenticación. El usuario lo denomina "API MITECO" refiriéndose al organismo de energía.

## Goals / Non-Goals

**Goals:**
- Interfaz `PriceFetcher` extensible para múltiples fuentes de precios.
- Scheduler diario que ejecuta todos los fetchers activos; también disparable manualmente desde la UI.
- Deduplicación: evitar insertar una lectura si ya existe para el mismo tracker y fecha.
- Configuración dinámica de trackers (qué seguir, con qué parámetros) persistida en BD y gestionable desde la UI.
- Primera implementación: `GasoilPriceFetcher` usando API MINETUR por localización y tipo de carburante.
- Variables de entorno para credenciales (preparado para futuras fuentes que sí requieran API key).
- Página Angular `/price-tracking` con tabs dinámicos y gráfica de evolución de precio.

**Non-Goals:**
- Multi-usuario/tenant por ahora: los trackers son globales.
- Notificaciones push cuando el precio supera un umbral.
- Histórico de auditoría de cambios de configuración.
- Fusión con el historial manual de `recurrent_price_entries`.

## Decisions

### D1: PriceFetcher como interfaz Java con Spring autowiring

`PriceFetcher` es una interfaz Java (`interface PriceFetcher`) con método `fetch(PriceTrackerEntity tracker): List<PriceReading>`. Spring recoge todas las implementaciones mediante `List<PriceFetcher>` inyectado. El `PriceFetchScheduler` itera sobre los trackers activos, resuelve el fetcher por el campo `fetcher_type` (string enum), y llama a `fetch`.

**Alternativa descartada**: registro manual en un Map. Spring autowiring es más simple y no requiere código de registro.

### D2: Parámetros de fetcher como JSONB en BD

La tabla `price_trackers` almacena los parámetros del fetcher (municipio, tipo de carburante…) en una columna `params JSONB`. El fetcher deserializa los parámetros que necesita.

**Alternativa descartada**: columnas separadas por tipo de fetcher. Inviable al añadir nuevos fetchers sin migraciones; JSONB es flexible y la validación ocurre en la capa de servicio.

### D3: Deduplicación con constraint único `(tracker_id, reading_date)`

La tabla `price_readings` tiene un UNIQUE CONSTRAINT sobre `(tracker_id, reading_date)`. El servicio comprueba existencia antes de insertar (o usa `INSERT ... ON CONFLICT DO NOTHING`).

**Alternativa descartada**: deduplicar solo en capa de aplicación. La constraint de BD garantiza consistencia aunque se llame al fetcher múltiples veces (ej: disparo manual + scheduler el mismo día).

### D4: `reading_date` es DATE, no TIMESTAMP

Se registra la fecha del día (sin hora) como clave de deduplicación. Un tracker tiene como máximo un valor por día, que es la semántica correcta para datos de precio diario.

### D5: Scheduler con `@Scheduled` de Spring

Se usa `@EnableScheduling` + `@Scheduled(cron = "0 0 7 * * *")` en un `PriceFetchScheduler`. No se añade Quartz: la sencillez de Spring Scheduling es suficiente para este caso de uso.

**Alternativa descartada**: Quartz. Overkill para un job diario sin persistencia de estado del job.

### D6: Credenciales con `@ConfigurationProperties`

Se añade un `PriceFetcherProperties` bean con propiedades `miteco.api-key` (vacío por defecto; la API es pública). Las variables de entorno (`PRICE_FETCHER_MITECO_API_KEY`) se mapean vía Spring Boot. Cada futuro fetcher añade su sección de propiedades.

### D7: API MINETUR para gasoil

Endpoint usado: `GET /EstacionesTerrestresMI/FiltroMunicipioProducto/{idMunicipio}/{idProducto}`  
Devuelve una lista de estaciones con su precio; se calcula la media o el mínimo según parámetro de configuración del tracker.

El campo `idMunicipio` y `idProducto` son parámetros del tracker en `params` JSONB.  
Ejemplo params: `{"municipioId": "4902", "productoId": "1", "aggregation": "min"}` (1 = Gasoleo A).

### D8: Frontend - tabs dinámicos con PrimeNG `p-tabs`

La página `/price-tracking` carga los trackers activos desde la API y genera un tab por tracker. PrimeNG `TabsModule` (o `TabViewModule` según versión instalada). La gráfica reutiliza `p-chart` de PrimeNG (ya presente en el proyecto).

El selector de periodo usa el mismo patrón que `balance-evolution.component.ts` (presets: 1M, 3M, 6M, 1Y, Todo).

### D9: Panel de configuración de trackers en la misma página

Una sección colapsable o modal en `/price-tracking` permite crear/editar/eliminar trackers. Al elegir tipo de fetcher (dropdown), aparecen campos dinámicos específicos (formulario dirigido por esquema o por tipo hardcoded al principio).

## Risks / Trade-offs

- **API MINETUR puede cambiar o tener downtime** → El fetcher captura excepciones y las registra con un log de error. El scheduler no falla globalmente si un fetcher individual falla.
- **JSONB params sin schema fijo**: errores de configuración solo se detectan al ejecutar el fetcher → Mitigation: validar params al crear/editar tracker en la capa de servicio (DTOs con validación por tipo de fetcher).
- **Scheduler en instancia única**: si hay varias instancias del backend, el job corre en paralelo → Mitigation: el constraint único en BD protege de duplicados; como esta app es single-instance por ahora, es aceptable.
- **Volumen de datos**: un tracker con lectura diaria genera ~365 filas/año. Trivial para PostgreSQL.

## Migration Plan

1. Flyway migration `V10__create_price_tracking.sql`: crea `price_trackers` y `price_readings`.
2. Deploy backend (scheduler inactivo si no hay trackers). No breaking changes.
3. Deploy frontend con nueva ruta `/price-tracking`.
4. Usuario configura trackers desde la UI; scheduler corre la siguiente madrugada.

**Rollback**: revert deploy + ejecutar `DROP TABLE price_readings, price_trackers` (sin FK desde otras tablas).

## Open Questions

- ¿Se quiere promedio o mínimo por defecto al agregar precios de múltiples estaciones en un municipio? → Configurable por tracker en `params.aggregation`.
- ¿Acceso restringido por usuario o global para todos? → Global por ahora.
