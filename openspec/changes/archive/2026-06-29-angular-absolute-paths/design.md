## Context

El frontend Angular (`frontend/`) usa actualmente imports relativos para cruzar capas (e.g., `../../../core/models/account.model`). Hay ~86 imports relativos entre ficheros de la aplicación. El `tsconfig.json` base no define `baseUrl` ni `paths`.

La estructura de directorios es:
```
frontend/src/
  app/
    core/       (guards, interceptors, models, services)
    features/   (accounts, auth, budgets, charts, layout, recurrents, tags, transactions, user)
    shared/     (components)
  environments/
```

## Goals / Non-Goals

**Goals:**
- Configurar `baseUrl` y `paths` en `frontend/tsconfig.json` para habilitar aliases absolutos
- Definir aliases: `@core/*`, `@shared/*`, `@features/*`, `@env/*` y `@app/*`
- Migrar los 86 imports relativos entre capas a los nuevos aliases

**Non-Goals:**
- No cambiar imports dentro de la misma carpeta/feature (e.g., `./accounts.service` desde un componente de la misma feature es aceptable)
- No modificar imports de librerías externas ni de `node_modules`

## Decisions

### Aliases a configurar

| Alias | Mapea a |
|---|---|
| `@app/*` | `src/app/*` |
| `@core/*` | `src/app/core/*` |
| `@shared/*` | `src/app/shared/*` |
| `@features/*` | `src/app/features/*` |
| `@env/*` | `src/environments/*` |

**Rationale**: Aliases semánticos por capa arquitectónica. `@env/*` resuelve los frecuentes `../../../environments/environment` que aparecen en core y features. `@app/*` como fallback genérico.

### Dónde declarar los paths

Los `paths` se añaden al `compilerOptions` del `tsconfig.json` raíz del frontend junto con `"baseUrl": "."` (relativo a `frontend/`). Los `tsconfig.app.json` y `tsconfig.spec.json` heredan de este y no requieren cambios adicionales.

**Alternativa descartada**: Declarar los paths solo en `tsconfig.app.json` — no cubriría los tests.

### Estrategia de migración de imports

Migración manual fichero a fichero usando las reglas:
- Imports que atraviesan capas (de `features/` a `core/`, de `core/` a `environments/`, etc.) → sustituir por alias
- Imports dentro de la misma feature o carpeta → mantener relativos

## Risks / Trade-offs

- **IDE autocomplete**: VS Code y WebStorm resuelven `paths` de TypeScript correctamente; no hay riesgo conocido.
- **Angular build**: El Angular CLI respeta el `tsconfig.json` estándar con `paths`; compatible sin configuración adicional.
- **Imports omitidos**: [Riesgo] Un import relativo puede quedar sin migrar → La build TypeScript seguirá compilando igualmente (los imports relativos siguen siendo válidos). Solo se detectaría por revisión manual o linting.
