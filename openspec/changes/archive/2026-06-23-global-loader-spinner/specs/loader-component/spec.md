## ADDED Requirements

### Requirement: Overlay spinner visible cuando hay peticiones activas
El componente `LoaderComponent` SHALL mostrar un overlay con spinner de PrimeNG `p-progress-spinner` cuando `LoaderService.isLoading()` sea `true`.

#### Scenario: Spinner visible durante carga
- **WHEN** `LoaderService.isLoading()` retorna `true`
- **THEN** el overlay con el spinner es visible en la pantalla

#### Scenario: Spinner oculto sin peticiones activas
- **WHEN** `LoaderService.isLoading()` retorna `false`
- **THEN** el overlay no está presente en el DOM (usando `@if`)

### Requirement: Overlay de pantalla completa que bloquea interacción
El overlay SHALL cubrir toda la viewport con `position: fixed; inset: 0` y un `z-index` suficientemente alto (≥ 9999) para situarse sobre todos los demás elementos. MUST bloquear eventos de puntero (`pointer-events: all`) para prevenir clics accidentales durante la carga.

#### Scenario: Overlay cubre toda la pantalla
- **WHEN** el spinner está visible
- **THEN** el overlay ocupa toda la viewport independientemente de la posición de scroll

#### Scenario: Overlay bloquea interacción de usuario
- **WHEN** el spinner está visible
- **THEN** los clicks del usuario sobre el contenido subyacente no producen efecto

### Requirement: Componente standalone integrado en app root
El componente SHALL ser standalone y añadirse directamente en `app.html` como hijo directo del componente raíz, fuera de cualquier router outlet, para que sea visible en toda la aplicación.

#### Scenario: Visible en cualquier ruta
- **WHEN** el spinner se activa mientras el usuario navega en cualquier ruta de la aplicación
- **THEN** el overlay es visible independientemente de la ruta actual
