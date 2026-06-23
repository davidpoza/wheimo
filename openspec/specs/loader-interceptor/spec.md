### Requirement: Activar loader al inicio de cada petición HTTP
El interceptor `loaderInterceptor` SHALL llamar a `LoaderService.show()` antes de pasar cada petición al siguiente manejador.

#### Scenario: show() llamado al inicio
- **WHEN** el cliente HTTP inicia cualquier petición
- **THEN** `LoaderService.show()` es invocado exactamente una vez antes de que la petición continúe

### Requirement: Desactivar loader al finalizar cada petición HTTP
El interceptor SHALL llamar a `LoaderService.hide()` cuando la petición finaliza, tanto en caso de éxito como de error o cancelación. MUST usar el operador `finalize()` de RxJS.

#### Scenario: hide() llamado en éxito
- **WHEN** la petición HTTP completa con respuesta exitosa
- **THEN** `LoaderService.hide()` es invocado exactamente una vez

#### Scenario: hide() llamado en error
- **WHEN** la petición HTTP falla con cualquier código de error HTTP
- **THEN** `LoaderService.hide()` es invocado exactamente una vez

#### Scenario: hide() llamado al cancelar
- **WHEN** la suscripción al observable de la petición es cancelada antes de completar
- **THEN** `LoaderService.hide()` es invocado exactamente una vez via `finalize()`

### Requirement: No interferir con otros interceptores
El interceptor SHALL ser una `HttpInterceptorFn` pura que solo gestiona el contador y propaga la petición sin modificarla.

#### Scenario: Petición pasa sin modificación
- **WHEN** el interceptor procesa una petición
- **THEN** la petición llega al siguiente manejador sin cambios en headers, body ni URL
