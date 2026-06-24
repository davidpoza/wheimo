## Context

El frontend Angular usa `HttpInterceptorFn` (estilo funcional, Angular 15+) para añadir el token JWT a todas las peticiones. El `AuthService` ya expone un método `refresh()` que llama al endpoint `/auth/refresh` con la cookie `httpOnly` de refresh token y actualiza el access token en memoria. El interceptor actual no reacciona ante respuestas 401, por lo que un token expirado deja al usuario con errores de red hasta que recarga la página o el guard lo expulsa manualmente.

## Goals / Non-Goals

**Goals:**
- Interceptar respuestas HTTP 401 y ejecutar automáticamente el flujo de refresh.
- Reintentar la petición original con el nuevo token tras un refresh exitoso.
- Redirigir al login si el refresh falla (sesión totalmente expirada).
- No disparar refresh infinito en la propia petición de refresh.

**Non-Goals:**
- Cola de peticiones concurrentes durante el refresh (se asume tráfico no masivo; si se necesita en el futuro puede añadirse).
- Manejo de otros códigos de error (403, 429, 5xx) — fuera de alcance.
- Cambios en el backend o en la lógica de cookies de refresh token.

## Decisions

### 1. Usar `catchError` + `switchMap` sobre el observable de respuesta

El interceptor devuelve un `Observable`. La forma idiomática en RxJS de interceptar errores y reintentar con otro observable es `catchError` seguido de `switchMap` sobre el observable de refresh.

**Alternativa considerada:** promesas con `async/await` — Angular admite interceptores funcionales síncronos o que devuelvan observables; mezclar promesas añade complejidad innecesaria y rompe el modelo reactivo existente.

### 2. Evitar bucle infinito marcando la petición de refresh

La petición a `/auth/refresh` también pasa por el interceptor. Si devuelve 401, volvería a intentar refresh indefinidamente. La solución es comprobar si la URL de la petición contiene `/auth/refresh` y, en ese caso, no reintentar.

**Alternativa considerada:** un flag booleano en el servicio — introduce estado mutable compartido; la comprobación de URL es más simple y no tiene efectos secundarios.

### 3. Mantener el interceptor funcional (no convertir a clase)

Angular recomienda `HttpInterceptorFn` para aplicaciones standalone. Convertir a clase (`HttpInterceptor`) no aporta ventajas y requeriría cambios en `app.config.ts`.

## Risks / Trade-offs

- **[Riesgo] Peticiones concurrentes durante el refresh** → Si múltiples peticiones fallan con 401 simultáneamente, cada una dispara su propio refresh. En producción con pocas peticiones esto es aceptable; si se convierte en problema, se puede añadir un observable compartido con `shareReplay(1)`.
- **[Riesgo] Bucle si el backend devuelve 401 en respuestas no relacionadas con autenticación** → Mitigación: el reintento solo ocurre una vez (tras el refresh, si vuelve a fallar se propaga el error).

## Migration Plan

1. Modificar `auth.interceptor.ts` con la nueva lógica.
2. No se requieren cambios en `app.config.ts` ni en `AuthService`.
3. Despliegue directo sin rollback especial — si la lógica falla, el comportamiento degrada al estado actual (el usuario ve 401).
