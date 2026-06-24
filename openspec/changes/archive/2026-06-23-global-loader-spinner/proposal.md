## Why

Las peticiones HTTP al backend no tienen ningún indicador visual de carga, lo que genera una experiencia de usuario pobre: el usuario no sabe si la aplicación está procesando algo. Además, sin un mecanismo centralizado, múltiples peticiones concurrentes podrían provocar condiciones de carrera donde el spinner desaparezca antes de que todas las peticiones finalicen.

## What Changes

- **Nueva capability**: `loader-service` — servicio singleton con contador atómico de peticiones activas que expone un signal reactivo `isLoading`.
- **Nueva capability**: `loader-interceptor` — interceptor HTTP que llama a `show()` al inicio y `hide()` al finalizar cada petición (éxito o error), integrándose con el interceptor existente.
- **Nueva capability**: `loader-component` — componente overlay que muestra un spinner de PrimeNG sobre toda la aplicación cuando `isLoading` es `true`.
- Registro del interceptor en `app.config.ts` y del componente en `app.html`.

## Capabilities

### New Capabilities

- `loader-service`: Servicio con contador de peticiones activas; expone `isLoading` como `Signal<boolean>`. Incrementa en `show()`, decrementa en `hide()` (nunca por debajo de 0). Solo `true` cuando el contador > 0.
- `loader-interceptor`: `HttpInterceptorFn` que invoca `loaderService.show()` antes de pasar la petición y `loaderService.hide()` en el `finalize()` del observable (garantiza ejecución en éxito y error).
- `loader-component`: Componente standalone que usa `ProgressSpinner` de PrimeNG, posicionado como overlay fixed sobre toda la pantalla, visible condicionalmente mediante `@if(loaderService.isLoading())`.

### Modified Capabilities

- (ninguna)

## Impact

- `frontend/src/app/core/services/` — nuevo `loader.service.ts`
- `frontend/src/app/core/interceptors/` — nuevo `loader.interceptor.ts`
- `frontend/src/app/shared/components/loader/` — nuevo componente `loader.component.ts` + `loader.component.html` + `loader.component.scss`
- `frontend/src/app/app.config.ts` — añadir `loaderInterceptor` a la cadena de interceptores
- `frontend/src/app/app.html` — añadir `<app-loader>` como primer hijo del template
- Dependencia: PrimeNG `ProgressSpinnerModule` (ya disponible en el proyecto)
