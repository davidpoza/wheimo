## 1. Setup de Transloco

- [x] 1.1 Instalar `@jsverse/transloco` con la versión compatible con Angular 21 (`npm i @jsverse/transloco`), verificando peer-deps.
- [x] 1.2 Crear `src/app/core/transloco-loader.ts` con un `TranslocoLoader` que cargue `/i18n/${lang}.json` vía `HttpClient`.
- [x] 1.3 Añadir `provideTransloco({ config: { availableLangs: ['es'], defaultLang: 'es', fallbackLang: 'es', reRenderOnLangChange: true, prodMode: environment.production }, loader: TranslocoHttpLoader })` a `app.config.ts`.
- [x] 1.4 Crear `public/i18n/es.json` con un objeto vacío inicial y verificar que `npm run build` y el arranque funcionan con Transloco activo.

## 2. Catálogo de claves (es.json)

- [x] 2.1 Definir el namespace `common.*` con acciones genéricas reutilizadas (Cancel, Save, Delete, Confirmar, etc.).
- [x] 2.2 Ir poblando `es.json` con cada feature a medida que se migra (secciones 3–6), preservando el texto literal actual.

## 3. Migración — features de transacciones

- [x] 3.1 `transaction-grid` (.html + .ts): columnas, botones de cabecera, toasts (`Error applying tags`, `Vínculo eliminado`), confirmaciones → claves `transactions.grid.*`.
- [x] 3.2 `transaction-filter` (.html + .ts): labels, placeholders del faldón de filtros → `transactions.filter.*`.
- [x] 3.3 `transaction-details-dialog` (.html + .ts): cabecera y etiquetas → `transactions.details.*`.
- [x] 3.4 `create-transaction-dialog` (.html + .ts): cabecera, labels de formulario, placeholders → `transactions.create.*`.
- [x] 3.5 `tagging-dialog` (.ts): `placeholder="Select tags"` y demás → `transactions.tagging.*`.

## 4. Migración — recurrentes, tags y cuentas

- [x] 4.1 `recurrents-list`, `upcoming-recurrents`, `assign-transaction-dialog`, `price-history-dialog` (.html + .ts) → `recurrents.*`.
- [x] 4.2 `tags-grid` (.html + .ts): toasts (`Tag created/updated/deleted`), `header: 'Confirmar eliminación'` → `tags.grid.*`.
- [x] 4.3 `tag-rules` (.html + .ts): array de opciones de tipos de regla (`Regex (description)`, `Equality`, `Amount >`, ...), toasts → `tags.rules.*`; mover el array de opciones dentro del componente para traducir `label`.
- [x] 4.4 `accounts-list` (.html + .ts): toasts (`Sync started`), botón Add Account → `accounts.list.*`.
- [x] 4.5 `edit-account-dialog` (.html + .ts): arrays de opciones (provider, `MOVEMENT_TYPE_OPTIONS`: Ambos/Entrada/Salida), `header: 'Confirmar'` → `accounts.edit.*`; mover arrays dentro del componente.

## 5. Migración — charts, budgets, auth, user, layout, shared

- [x] 5.1 `balance-evolution`, `heatmap`, `statistics`, `tag-expenses-chart` (.html + .ts): títulos, labels de dataset (`Balance`), leyendas → `charts.*`.
- [x] 5.2 `budgets` (.html + .ts): botón New Budget, labels, mensajes → `budgets.*`.
- [x] 5.3 `login` (.html + .ts): título/subtítulo, labels Email/Password, placeholders, `Sign In`, `Enter a valid email`, errores → `auth.login.*`.
- [x] 5.4 `user-profile` (.html + .ts) → `user.profile.*`.
- [x] 5.5 `app-layout` (.html + .ts): array de items de menú (`Próximos gastos`, `Transactions`, `Accounts`, `Tags`, `Charts`, `Budgets`, `Recurrentes`, `Reglas`), Logout → `layout.menu.*`; traducir `label` de los items vía `TranslocoService`.
- [x] 5.6 `shared/components/loader` (.html + .ts): sin texto visible (solo spinner); no requiere cambios.

## 6. Verificación

- [x] 6.1 Barrido final con grep (`label=`, `header:`, `placeholder=`, `summary:`, `detail:`, `pTooltip`, texto entre `>...<`) para confirmar que no quedan literales de UI sin migrar. (Único restante: `aria-label` en `src/app/app.html`, que es el placeholder por defecto de Angular no usado — root usa template inline.)
- [x] 6.2 Confirmar que NO se han tocado valores no-UI (`value` de opciones, severidades, rutas, `id`/`formControlName`, clases CSS, claves de API).
- [x] 6.3 `npm run build` sin errores.
- [x] 6.4 Revisión visual en navegador (login, Transactions, Recurrentes, Reglas + diálogo New Rule): textos traducidos correctos, sin claves crudas, consola sin errores. Se detectó y corrigió un NG0600 (carga perezosa de Transloco durante el render) añadiendo `provideAppInitializer` que precarga el idioma activo antes de renderizar.
