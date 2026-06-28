## ADDED Requirements

### Requirement: Transloco está configurado en el arranque de la aplicación

La aplicación SHALL proveer Transloco a nivel raíz mediante `provideTransloco(...)` en `app.config.ts`, declarando el idioma por defecto, los idiomas disponibles, el modo de fallback y el flag `prodMode` ligado al entorno.

#### Scenario: Arranque con idioma por defecto

- **WHEN** la aplicación se inicializa
- **THEN** Transloco queda registrado como provider raíz con `es` como idioma activo por defecto
- **AND** cualquier componente puede inyectar `TranslocoService` o usar el pipe/directiva `transloco` sin configuración adicional

### Requirement: Las traducciones se cargan desde ficheros JSON vía HTTP

La aplicación SHALL cargar los catálogos de traducción mediante un `TranslocoLoader` que obtiene `public/i18n/<lang>.json` usando `HttpClient`.

#### Scenario: Carga del catálogo activo

- **WHEN** Transloco solicita el idioma activo
- **THEN** el loader realiza una petición HTTP a `/i18n/<lang>.json`
- **AND** las claves del JSON quedan disponibles para traducción en plantillas y clases

#### Scenario: Clave inexistente

- **WHEN** se solicita una clave que no existe en el catálogo activo
- **THEN** Transloco devuelve la clave (o el valor de fallback configurado) sin lanzar una excepción que rompa el render

### Requirement: La configuración es extensible a múltiples idiomas

La configuración SHALL permitir añadir nuevos idiomas únicamente agregando un fichero `public/i18n/<lang>.json` y registrando el código en `availableLangs`, sin cambios en componentes.

#### Scenario: Añadir un nuevo idioma

- **WHEN** se añade `public/i18n/en.json` y se registra `en` en `availableLangs`
- **THEN** el idioma queda disponible para activarse vía `TranslocoService.setActiveLang('en')` sin modificar plantillas ni clases
