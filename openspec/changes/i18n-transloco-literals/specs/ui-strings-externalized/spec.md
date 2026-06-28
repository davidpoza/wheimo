## ADDED Requirements

### Requirement: Las cadenas de UI en plantillas se renderizan vía Transloco

Todas las cadenas de texto visibles para el usuario en plantillas HTML (texto entre etiquetas, `label`, `header`, `placeholder`, `pTooltip`, `text` y atributos análogos) SHALL renderizarse mediante el pipe `transloco` o la directiva estructural `*transloco`, referenciando una clave del catálogo en lugar de un literal.

#### Scenario: Etiqueta de botón traducida

- **WHEN** se renderiza un botón cuyo texto antes era un literal (p. ej. "Sign In")
- **THEN** el `label` se obtiene de una clave del catálogo (p. ej. `auth.login.submit`)
- **AND** el texto visible coincide con el valor de esa clave en el idioma activo

#### Scenario: Placeholder y cabecera traducidos

- **WHEN** se renderiza un input con `placeholder` o un diálogo con `header` que antes eran literales
- **THEN** ambos se resuelven desde claves del catálogo vía pipe/directiva `transloco`

### Requirement: Las cadenas de UI en clases de componentes se obtienen vía TranslocoService

Las cadenas de texto visibles generadas desde TypeScript (mensajes de `MessageService`, `header`/mensajes de `ConfirmationService`, y los `label` de arrays de opciones para selects/dropdowns) SHALL obtenerse mediante `TranslocoService.translate(<clave>)` en lugar de literales.

#### Scenario: Toast traducido

- **WHEN** una acción muestra un toast (p. ej. `summary: 'Tag created'`)
- **THEN** el `summary`/`detail` se obtiene de `TranslocoService.translate('tags.toast.created')`

#### Scenario: Opciones de select traducidas

- **WHEN** se construye un array de opciones con `label` (p. ej. tipos de regla, tipos de movimiento)
- **THEN** cada `label` se resuelve desde una clave del catálogo
- **AND** el `value` de cada opción permanece sin cambios

### Requirement: Las claves siguen una convención jerárquica por feature

Las claves del catálogo SHALL organizarse de forma jerárquica namespaciada por feature/componente (p. ej. `transactions.grid.*`, `auth.login.*`, `common.*`), agrupando en `common.*` las cadenas reutilizadas (acciones genéricas como Guardar/Cancelar/Eliminar).

#### Scenario: Cadena compartida reutilizada

- **WHEN** una misma cadena (p. ej. "Cancel") aparece en varios componentes
- **THEN** existe una única clave compartida bajo `common.*` referenciada por todos ellos

### Requirement: No se externalizan cadenas que no son de UI

El cambio SHALL preservar sin modificar los valores no destinados a presentación: claves/parámetros de API, valores de enum, `value` de opciones, rutas de router, atributos `id`/`formControlName`, severidades de PrimeNG (`'success'`, `'error'`) y nombres de clases CSS.

#### Scenario: Valores técnicos intactos

- **WHEN** se procesa un componente con opciones `{ label: 'Ambos', value: 'BOTH' }`
- **THEN** solo `label` se externaliza a una clave
- **AND** `value: 'BOTH'` permanece como literal sin cambios

#### Scenario: La app compila y funciona tras la extracción

- **WHEN** se completa la externalización y se ejecuta el build de producción
- **THEN** el build compila sin errores
- **AND** las vistas muestran el mismo texto que antes del cambio
