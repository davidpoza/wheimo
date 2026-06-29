## ADDED Requirements

### Requirement: TypeScript path aliases configurados
El `tsconfig.json` del frontend SHALL definir `baseUrl` y `paths` con aliases para las capas principales de la aplicación: `@app/*`, `@core/*`, `@shared/*`, `@features/*` y `@env/*`.

#### Scenario: Build con alias de core
- **WHEN** un fichero de `features/` importa desde `@core/models/...`
- **THEN** el compilador TypeScript resuelve el import correctamente y la build no produce errores

#### Scenario: Build con alias de environments
- **WHEN** un fichero importa desde `@env/environment`
- **THEN** el compilador TypeScript resuelve al fichero `src/environments/environment.ts` correcto

#### Scenario: Build con alias de shared
- **WHEN** un fichero importa desde `@shared/components/...`
- **THEN** el compilador TypeScript resuelve el import correctamente sin errores

### Requirement: Imports entre capas usan aliases absolutos
Todos los imports que crucen capas arquitectónicas (core, features, shared, environments) SHALL usar los aliases absolutos definidos en lugar de rutas relativas con `../`.

#### Scenario: Import de core desde features
- **WHEN** un componente de `features/` necesita un servicio o modelo de `core/`
- **THEN** el import usa `@core/services/...` o `@core/models/...` en lugar de `../../core/...`

#### Scenario: Import de environments desde core o features
- **WHEN** un fichero de `core/` o `features/` necesita la variable `environment`
- **THEN** el import usa `@env/environment` en lugar de `../../../environments/environment`

### Requirement: Imports dentro de la misma feature permanecen relativos
Los imports entre ficheros de la misma feature o carpeta SHALL mantenerse como imports relativos.

#### Scenario: Import dentro de accounts feature
- **WHEN** un componente de `features/accounts/` importa un servicio del mismo directorio
- **THEN** el import usa `./accounts.service` (relativo) y no `@features/accounts/accounts.service`
