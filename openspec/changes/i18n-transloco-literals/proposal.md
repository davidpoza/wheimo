## Why

Los textos visibles de la interfaz están hardcodeados y dispersos por toda la aplicación: ~21 plantillas HTML y ~22 clases de componentes contienen cadenas literales (etiquetas de botones, cabeceras de diálogos, placeholders, mensajes de toast, opciones de selects, títulos de menú). Esto impide internacionalizar la app, dificulta mantener una redacción coherente y ha provocado una mezcla incoherente de inglés y español (p. ej. "Transactions"/"Próximos gastos", "Tag deleted"/"Vínculo eliminado"). Centralizar las cadenas en un fichero de traducción cargado con Transloco habilita la i18n y permite revisar y unificar la redacción desde un único sitio.

## What Changes

- Añadir **Transloco** (`@jsverse/transloco`) como dependencia y configurarlo en `app.config.ts` con un loader HTTP que carga ficheros JSON de traducción desde `public/i18n/`.
- Crear un fichero de traducción del idioma por defecto (`public/i18n/es.json`) con **todas** las cadenas de UI extraídas, organizadas por claves jerárquicas namespaciadas por feature (p. ej. `auth.login.title`, `transactions.toast.tagsApplied`).
- Reemplazar las cadenas literales en las **plantillas** por el pipe `transloco` (o directiva `*transloco`), incluyendo `label`, `header`, `placeholder`, texto entre etiquetas y `pTooltip`.
- Reemplazar las cadenas literales en las **clases de componentes** (mensajes de `MessageService`, cabeceras de `ConfirmationService`, `label`s de arrays de opciones para selects/dropdowns) usando `TranslocoService.translate(...)`.
- Las cadenas se extraen **tal cual están hoy** (preservando su redacción actual, mezcla de idiomas incluida); la normalización lingüística y la traducción a idiomas adicionales quedan **fuera de alcance** pero la configuración queda preparada para añadir más ficheros (`en.json`, etc.).
- No se modifican cadenas que no son UI (claves de API, valores de enum, rutas, `value` de opciones, atributos `id`/`formControlName`, clases CSS).

## Capabilities

### New Capabilities

- `i18n-transloco-setup`: Integración y configuración de Transloco en la app Angular (dependencia, provider raíz, loader HTTP de JSON, idioma por defecto y disponible, ubicación de los ficheros de traducción).
- `ui-strings-externalized`: Todas las cadenas de texto de UI en plantillas y clases de componentes se externalizan a ficheros de traducción JSON con claves jerárquicas y se renderizan vía Transloco (pipe/directiva en plantillas, `TranslocoService` en clases), sin alterar la redacción actual.

### Modified Capabilities

<!-- ninguna: no existen specs previos cuyos requisitos cambien -->

## Impact

- `frontend/package.json`: nueva dependencia `@jsverse/transloco`.
- `frontend/src/app/app.config.ts`: `provideTransloco(...)` con config y loader.
- `frontend/src/app/core/` (nuevo): `transloco-loader.ts` (loader HTTP) y configuración asociada; requiere `provideHttpClient` si no está ya presente.
- `frontend/public/i18n/es.json` (nuevo): catálogo de cadenas del idioma por defecto.
- ~21 plantillas `*.html` bajo `frontend/src/app/features/**` y `frontend/src/app/shared/**`: cadenas reemplazadas por `transloco`.
- ~22 clases `*.component.ts` bajo `frontend/src/app/features/**`: cadenas reemplazadas por `TranslocoService.translate(...)`.
- `angular.json`: los JSON de `public/` ya se sirven como assets (sin cambios de config necesarios).
