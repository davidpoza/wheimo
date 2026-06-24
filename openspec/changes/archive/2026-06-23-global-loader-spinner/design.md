## Context

La aplicación Angular (v19+) realiza peticiones HTTP al backend a través de `HttpClient`. Actualmente no existe ningún indicador visual de carga. El proyecto ya usa PrimeNG como librería de UI, tiene un interceptor de autenticación (`authInterceptor`) y sigue la arquitectura Angular standalone con signals reactivos. El nuevo sistema debe integrarse sin romper el flujo existente de refresh de tokens.

## Goals / Non-Goals

**Goals:**
- Mostrar un spinner overlay global mientras haya al menos una petición HTTP activa.
- Garantizar que múltiples peticiones concurrentes no provoquen race conditions (el spinner no desaparece hasta que *todas* las peticiones finalizan).
- El spinner desaparece correctamente también cuando una petición falla.
- Diseño mínimo, no invasivo: no requiere cambios en los componentes de feature.

**Non-Goals:**
- Filtrar peticiones específicas (p.ej. excluir polling, refresh de token, etc.) — puede añadirse después.
- Personalización del spinner por ruta o componente.
- Cancelación de peticiones en vuelo.

## Decisions

### 1. Contador atómico en lugar de booleano

**Decisión**: `LoaderService` mantiene un `WritableSignal<number>` (contador) en lugar de un `Signal<boolean>`.

**Rationale**: Con un booleano simple, si hay 3 peticiones en curso y la primera termina, el spinner desaparecería incorrectamente. El contador asegura que `isLoading` solo es `false` cuando el contador llega a 0.

**Alternativa descartada**: RxJS `BehaviorSubject<boolean>` — innecesario cuando Angular signals cubre el caso sin dependencia de RxJS en el servicio.

### 2. `finalize()` en el interceptor para el decremento

**Decisión**: Usar el operador `finalize()` de RxJS en el interceptor para llamar a `hide()`.

**Rationale**: `finalize()` se ejecuta tanto en `complete` como en `error`, garantizando que el contador siempre se decrementa incluso si la petición falla. Usar `tap({ error })` no cubre el caso de cancelación (`unsubscribe`).

**Alternativa descartada**: `catchError` + re-throw — no cubre el camino feliz de forma simétrica y añade complejidad.

### 3. Orden de interceptores: loader antes que auth

**Decisión**: Registrar `loaderInterceptor` *antes* que `authInterceptor` en `withInterceptors([loaderInterceptor, authInterceptor])`.

**Rationale**: El interceptor de auth puede hacer una segunda petición (refresh de token) que también debe contar en el loader. Al estar el loader primero en la cadena, captura tanto la petición original como el retry del auth.

**Alternativa descartada**: Loader después de auth — el retry de refresh podría no ser capturado si el loader no está en la cadena exterior.

### 4. Overlay con `position: fixed` y `z-index` alto

**Decisión**: El componente loader usa un div overlay `position: fixed; inset: 0` con `z-index: 9999` y fondo semitransparente.

**Rationale**: Garantiza que el spinner cubre toda la viewport independientemente del scroll o del stacking context de otros componentes. El fondo semitransparente mantiene contexto visual para el usuario.

### 5. `pointer-events: none` NO aplicado al overlay

**Decisión**: El overlay bloquea interacción del usuario mientras carga (`pointer-events: all`).

**Rationale**: Durante una carga, prevenir clics duplicados o navegación accidental mejora la integridad de los datos (p.ej. evitar enviar un formulario dos veces).

## Risks / Trade-offs

- **Contador nunca decrementa a negativo** → `hide()` tiene guardia `if (count > 0)` para evitar estados inconsistentes si algún consumer llama a `hide()` sin `show()`.
- **Spinner visible en refresh de token** → Aceptable: el refresh es una operación real que tarda; el usuario verá brevemente el spinner. Puede filtrarse en el futuro.
- **Sin timeout máximo** → Una petición colgada mantendría el spinner visible indefinidamente. Mitigación futura: añadir timeout en el interceptor o en el servicio.

## Migration Plan

1. Crear `LoaderService` y `loaderInterceptor`.
2. Crear `LoaderComponent` (standalone).
3. Registrar interceptor en `app.config.ts` (antes de `authInterceptor`).
4. Añadir `<app-loader>` en `app.html`.
5. Despliegue: sin cambios de backend, sin migración de datos. Rollback: eliminar los 4 puntos anteriores.
