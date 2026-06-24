## Why

El interceptor HTTP de autenticación actual inyecta el token JWT en las cabeceras pero no gestiona los errores 401 (token expirado). Esto provoca que el usuario vea errores de red o sea redirigido al login sin intentar renovar la sesión, degradando la experiencia de usuario.

## What Changes

- **Enhance `authInterceptor`** para interceptar respuestas con código 401 y ejecutar el flujo de refresh automático antes de reintentar la petición original.
- El interceptor llamará a `AuthService.refresh()` cuando detecte un 401, actualizará el token en memoria y reintentará la petición fallida con el nuevo token.
- Si el refresh falla (sesión expirada definitivamente), redirigirá al login.
- Se evitarán bucles infinitos de refresh (p.ej. la propia petición de refresh no debe disparar otro refresh).

## Capabilities

### New Capabilities
- `jwt-401-auto-refresh`: Manejo automático de respuestas 401 en el interceptor HTTP: refresca el token y reintenta la petición original de forma transparente al usuario.

### Modified Capabilities

## Impact

- `frontend/src/app/core/interceptors/auth.interceptor.ts` — lógica principal del cambio
- `frontend/src/app/core/services/auth.service.ts` — se utiliza el método `refresh()` ya existente
- No hay cambios en `app.config.ts` (el interceptor ya está registrado)
- No afecta a APIs del backend ni a modelos de datos
