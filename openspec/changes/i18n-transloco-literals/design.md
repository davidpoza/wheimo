## Context

El frontend es una app Angular 21 standalone (sin NgModules), con PrimeNG como librería de UI y `provideHttpClient(withFetch(), ...)` ya configurado en `app.config.ts`. No existe ninguna solución de i18n. Las cadenas de UI están hardcodeadas en ~21 plantillas y ~22 clases de componentes, con una mezcla de inglés y español. Los assets se sirven desde la carpeta `public/` (config `angular.json`).

El objetivo de este cambio es puramente de infraestructura/refactor: extraer las cadenas existentes a un catálogo JSON y cargarlas con Transloco, sin cambiar el comportamiento ni la redacción visible.

## Goals / Non-Goals

**Goals:**
- Integrar Transloco como capa de i18n con el menor acoplamiento posible (provider raíz + loader HTTP).
- Externalizar el 100% de las cadenas de UI (plantillas y clases) a `public/i18n/es.json` con claves jerárquicas.
- Mantener el texto visible idéntico al actual (sin regresiones de copy).
- Dejar la base lista para añadir idiomas sin tocar componentes.

**Non-Goals:**
- Traducir a idiomas adicionales o crear `en.json` poblado (solo se deja la puerta abierta).
- Normalizar/unificar la redacción mezclada inglés/español (se preserva tal cual).
- Selector de idioma en la UI ni persistencia de preferencia de idioma.
- Externalizar valores no-UI (claves de API, `value` de enums, rutas, severidades, clases CSS).
- Localización de fechas/números/monedas (queda con los pipes actuales de Angular/PrimeNG).

## Decisions

### Decisión 1: Librería — `@jsverse/transloco`
El usuario pidió Transloco explícitamente. Se usa `@jsverse/transloco` (el paquete mantenido actualmente, sucesor de `@ngneat/transloco`), instalando la versión compatible con Angular 21. Se preferirá el schematic oficial (`ng add @jsverse/transloco`) si genera config compatible standalone; si no, se configura manualmente.

*Alternativa considerada:* `@angular/localize` (i18n nativo). Descartada porque trabaja con XLIFF y build-time locales (un bundle por idioma), no con JSON cargado en runtime, y el usuario pidió "un json" + Transloco.

### Decisión 2: Loader — HTTP JSON desde `public/i18n/`
Un `TranslocoHttpLoader` (clase con `HttpClient`) carga `/i18n/<lang>.json`. Se ubican los JSON en `public/i18n/` porque `angular.json` ya sirve `public/**/*` como assets, evitando tocar la config de build.

*Alternativa considerada:* importar el JSON estáticamente vía `provideTranslocoScope`/inline. Descartada: cargar por HTTP mantiene los catálogos fuera del bundle inicial y es el patrón estándar de Transloco.

### Decisión 3: Estructura de claves — jerárquica por feature + `common`
Claves namespaciadas: `<feature>.<componente|sección>.<clave>` (p. ej. `auth.login.title`, `transactions.toast.tagsApplied`, `accounts.dialog.confirmDelete`). Las cadenas genéricas reutilizadas (Cancel, Save, Delete, Confirmar) van a `common.*`. Un único fichero por idioma (`es.json`) en lugar de scopes por feature, para simplicidad dado el tamaño del catálogo (~150 cadenas).

*Alternativa considerada:* claves planas o scopes lazy por feature. Plano dificulta el mantenimiento; scopes lazy añaden complejidad innecesaria para este volumen.

### Decisión 4: Uso en plantillas — pipe `transloco`; preferir directiva en bloques densos
- Para atributos sueltos (`label`, `placeholder`, `header`, `pTooltip`, `[text]`): pipe `{{ 'clave' | transloco }}` o binding `[label]="'clave' | transloco"`.
- Para plantillas con muchas cadenas: directiva estructural `*transloco="let t"` y `t('clave')`, que evita múltiples suscripciones y es más legible.
Cada componente standalone importa `TranslocoModule`/`TranslocoDirective`/`TranslocoPipe` según necesite.

### Decisión 5: Uso en clases — `TranslocoService.translate()`
Para cadenas generadas en TS (toasts, confirmaciones, `label` de arrays de opciones) se inyecta `TranslocoService` y se usa `.translate('clave')`. Los arrays de opciones que hoy son constantes a nivel de módulo se convierten en getters/campos calculados dentro del componente (o se construyen en el constructor) para poder traducir sus `label`.

### Decisión 6: Idioma por defecto `es`
`defaultLang: 'es'`, `availableLangs: ['es']`, `fallbackLang: 'es'`, `reRenderOnLangChange: true`, `prodMode` ligado a `environment.production`. Se elige `es` como base por el contexto del proyecto; las cadenas se vuelcan con su texto actual exacto independientemente del idioma original.

## Risks / Trade-offs

- **Cobertura incompleta de cadenas** (alguna queda hardcodeada) → Mitigación: barrido sistemático por feature con greps (`label=`, `header:`, `placeholder=`, `summary:`, `detail:`, texto entre `>...<`) y checklist por componente en `tasks.md`; revisión visual del build.
- **Cambios de redacción accidentales al extraer** → Mitigación: copiar el literal exacto a la clave (copy/paste literal), no reescribir.
- **Arrays de opciones a nivel de módulo no pueden traducir en carga** → Mitigación: moverlos dentro del componente con acceso a `TranslocoService`.
- **Parpadeo/clave visible antes de cargar el JSON** (FOUC) → Mitigación: el catálogo es pequeño y se sirve local; `reRenderOnLangChange` y fallback evitan textos rotos. Aceptable para una SPA tras login.
- **Versión de Transloco incompatible con Angular 21** → Mitigación: fijar la versión peer-compatible; validar con `npm run build` antes de continuar.
- **Incremento de dependencias** → Trade-off aceptado: Transloco es ligero y era requisito explícito.

## Migration Plan

1. Instalar `@jsverse/transloco` y configurar provider + loader (capability `i18n-transloco-setup`).
2. Crear `public/i18n/es.json` vacío y verificar que la app arranca con Transloco activo.
3. Migrar feature por feature: extraer cadenas → añadir claves al JSON → reemplazar en plantilla y clase → verificar visualmente.
4. Build de producción + revisión visual de todas las vistas.

Rollback: revertir el commit; al ser aditivo (nueva dep + refactor de strings) no hay migración de datos ni cambios de API.

## Open Questions

- ¿Se desea ya un `en.json` poblado o basta con dejar la infraestructura lista? (Asunción actual: solo infraestructura, `es.json` poblado.)
- ¿Conviene unificar la mezcla ES/EN de copy en un cambio posterior dedicado? (Fuera de alcance aquí.)
