## Why

Los imports relativos en el proyecto Angular (`../../core/services/...`) son frágiles al reorganizar archivos y dificultan la lectura. Configurar path aliases en TypeScript permite usar imports absolutos y semánticos (`@core/services/...`) en todo el frontend.

## What Changes

- Añadir `paths` en `tsconfig.json` del frontend con aliases para los directorios principales
- Migrar todos los imports relativos existentes a imports absolutos usando los nuevos aliases

## Capabilities

### New Capabilities
- `ts-path-aliases`: Configuración de aliases de paths TypeScript (`@core`, `@shared`, `@features`, `@app`) en el `tsconfig.json` del frontend y migración de imports existentes

### Modified Capabilities

## Impact

- `frontend/tsconfig.json`: añadir `baseUrl` y `paths` en `compilerOptions`
- `frontend/src/app/**/*.ts`: todos los ficheros con imports relativos entre capas serán actualizados
- No hay cambios en la API ni en dependencias externas
