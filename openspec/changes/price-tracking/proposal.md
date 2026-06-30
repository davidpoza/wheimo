## Why

El usuario necesita monitorizar la evolución de precios de productos del mundo real (como combustibles) para tomar decisiones informadas. Actualmente no existe ningún mecanismo automático para recopilar precios externos ni una interfaz para visualizar su evolución temporal.

## What Changes

- Nueva página **"Seguimiento de Precios"** con tabs dinámicos por producto/configuración.
- Gráfica de evolución de precio por tab con selector de periodo (1M, 3M, 6M, 1A, Siempre).
- Nueva entidad **PriceTracker** (configuración de seguimiento) que el usuario gestiona desde la UI: tipo de fetcher + parámetros (localización, tipo de carburante…).
- Interfaz `PriceFetcher` en backend con implementación inicial **GasoilPriceFetcher** usando la API REST oficial del MITECO (Ministerio para la Transición Ecológica).
- **Scheduler diario** que ejecuta todos los fetchers activos; también ejecutable manualmente desde la UI.
- Deduplicación en BD: no se insertan lecturas si ya existe un registro para el mismo tracker y fecha.
- Credenciales de APIs externas inyectadas via variables de entorno.

## Capabilities

### New Capabilities

- `price-tracker-config`: Gestión CRUD de configuraciones de seguimiento (PriceTracker): tipo de fetcher, parámetros, nombre visible. Persiste en BD.
- `price-fetch-scheduler`: Scheduler diario que invoca todos los PriceFetchers activos. Expone endpoint para disparo manual.
- `price-fetcher-gasoil`: Implementación de PriceFetcher que consulta la API REST del MITECO para obtener precios de gasoil en localizaciones configuradas.
- `price-tracking-page`: Página frontend con tabs dinámicos (uno por PriceTracker activo), gráfica de evolución de precios y selector de periodo.

### Modified Capabilities

<!-- No existing specs change requirements -->

## Impact

- **Backend**: Nuevo módulo `price-tracking` (NestJS). Nuevas entidades BD: `price_trackers`, `price_readings`. Scheduler (cron). Interfaz `PriceFetcher`. Dependencia en `@nestjs/schedule`.
- **Frontend**: Nueva ruta/página en Angular. Componente de tabs dinámicos. Componente de gráfica (reutiliza librería existente de charts). Llamadas a nuevos endpoints REST.
- **BD**: Dos nuevas tablas + índice único `(tracker_id, date)` para deduplicación.
- **Config**: Variables de entorno para API key MITECO (si aplica) y otras credenciales futuras.
- **Sin breaking changes** en funcionalidad existente.
