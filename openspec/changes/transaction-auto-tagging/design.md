## Context

El sistema ya tiene una implementación completa de reglas de etiquetado automático en el backend:
- `Rule` entity: campos `id`, `name`, `type` (`description`, `emitterName`, `receiverName`, etc.), `value` (regex o valor), `tags` (ManyToMany)
- `RuleService.applyTags()`: evalúa reglas y asigna tags a transacciones
- `TransactionService.processImportResult()`: ya llama a `ruleService.applyTags()` sobre cada transacción nueva al importar

En el frontend existe `TagRulesComponent` pero no está registrado en el router ni es accesible desde la navegación. Además tiene un bug: envía `type: 'regex'` pero el backend solo acepta `type: 'description'` para regex sobre el concepto.

## Goals / Non-Goals

**Goals:**
- Hacer accesible la pantalla de reglas de etiquetado registrando la ruta `/rules`
- Corregir el bug de tipo (`regex` → `description`) en el formulario del frontend
- Asegurar que la creación de regla con tags funcione (actualmente el backend no acepta tags en el POST /rules; hay que añadirlos en llamadas separadas)
- Añadir entrada de navegación para acceder a la pantalla

**Non-Goals:**
- Cambiar la arquitectura de reglas del backend (ya es correcta)
- Soportar más tipos de reglas desde esta pantalla (el backend ya los soporta; la pantalla puede limitarse a `description`)
- Reordenación de reglas por drag-and-drop

## Decisions

### D1: Pantalla enfocada en `description` (regex sobre concepto)

La pantalla expone solo reglas de tipo `description` aunque el backend soporte más tipos. La UX es más simple y cubre el 100% del caso de uso pedido. Si en el futuro se necesitan otros tipos se amplía el formulario.

**Alternativa descartada:** exponer todos los tipos en el selector — añade complejidad innecesaria y confusión.

### D2: Fix de creación con tags — llamadas secuenciales en frontend

El endpoint `POST /rules` acepta `{name, type, value}` pero no tags. Para crear una regla con tags el frontend debe: (1) crear la regla, (2) hacer `POST /rules/{id}/tags` por cada tag seleccionado. Esto se hace en el servicio front con `switchMap` / `forkJoin`, sin tocar el backend.

**Alternativa descartada:** modificar el backend para aceptar tags en el body del POST. Introduce complejidad sin beneficio real dado el volumen de uso esperado.

### D3: Ruta `/rules` en la raíz del layout autenticado

Se añade la ruta `rules` al hijo del layout protegido en `app.routes.ts`. La entrada de navegación se añade en el componente de layout existente.

## Risks / Trade-offs

- **[Risk] Reglas existentes con type `regex` en BD** → Al desplegar no hay migración porque el bug impide crear reglas en producción desde el frontend; las reglas existentes (si las hay) tendrían type incorrecto y no se evaluarían. Mitigación: verificar que no existen reglas con `type='regex'` antes de desplegar; no es necesaria migración si el entorno es de desarrollo.
- **[Trade-off] Llamadas N+1 al añadir tags** → Por cada tag seleccionado al crear una regla se hace una llamada HTTP. Aceptable dado el número bajo de tags por regla.

## Migration Plan

1. Desplegar sin cambios de BD (no hay modelo nuevo; la tabla `rules` ya existe)
2. Registrar ruta y añadir nav item
3. Corregir `type: 'regex'` → `type: 'description'` en el componente
4. Adaptar `createRule` en el servicio/componente para añadir tags tras la creación
5. Smoke test: crear una regla con regex y un tag, importar una transacción cuyo concepto haga match, verificar que recibe el tag automáticamente
