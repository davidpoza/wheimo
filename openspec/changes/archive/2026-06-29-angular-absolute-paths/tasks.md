## 1. Configurar TypeScript path aliases

- [x] 1.1 Añadir `"baseUrl": "."` y `"paths"` en `frontend/tsconfig.json` bajo `compilerOptions` con los aliases: `@app/*`, `@core/*`, `@shared/*`, `@features/*`, `@env/*`
- [x] 1.2 Verificar que `ng build` (o `npx ng build`) compila sin errores tras el cambio de configuración

## 2. Migrar imports en core

- [x] 2.1 Actualizar imports en `src/app/core/guards/auth.guard.ts`
- [x] 2.2 Actualizar imports en `src/app/core/interceptors/auth.interceptor.ts`
- [x] 2.3 Actualizar imports en `src/app/core/interceptors/loader.interceptor.ts`
- [x] 2.4 Actualizar imports en `src/app/core/services/auth.service.ts`

## 3. Migrar imports en features/accounts

- [x] 3.1 Actualizar imports en `src/app/features/accounts/account-exceptions.service.ts`
- [x] 3.2 Actualizar imports en `src/app/features/accounts/accounts.service.ts`
- [x] 3.3 Actualizar imports en `src/app/features/accounts/accounts-list/accounts-list.component.ts`
- [x] 3.4 Actualizar imports en `src/app/features/accounts/edit-account-dialog/edit-account-dialog.component.ts`

## 4. Migrar imports en features/auth, budgets, charts, layout

- [x] 4.1 Actualizar imports en `src/app/features/auth/login/login.component.ts`
- [x] 4.2 Actualizar imports en `src/app/features/budgets/budgets.service.ts`
- [x] 4.3 Actualizar imports en `src/app/features/budgets/budgets/budgets.component.ts`
- [x] 4.4 Actualizar imports en `src/app/features/charts/charts.service.ts`
- [x] 4.5 Actualizar imports en `src/app/features/layout/app-layout/app-layout.component.ts`

## 5. Migrar imports en features/recurrents

- [x] 5.1 Actualizar imports en `src/app/features/recurrents/recurrents.service.ts`
- [x] 5.2 Actualizar imports en `src/app/features/recurrents/recurrents-list/recurrents-list.component.ts`
- [x] 5.3 Actualizar imports en `src/app/features/recurrents/assign-transaction-dialog/assign-transaction-dialog.component.ts`
- [x] 5.4 Actualizar imports en `src/app/features/recurrents/price-history-dialog/price-history-dialog.component.ts`
- [x] 5.5 Actualizar imports en `src/app/features/recurrents/upcoming-recurrents/upcoming-recurrents.component.ts`

## 6. Migrar imports en features/tags, transactions, user y shared

- [x] 6.1 Actualizar imports en `src/app/features/tags/tags.service.ts`
- [x] 6.2 Actualizar imports en `src/app/features/tags/tags-grid/tags-grid.component.ts`
- [x] 6.3 Actualizar imports en `src/app/features/transactions/transactions.service.ts`
- [x] 6.4 Actualizar imports en `src/app/features/transactions/attachment.service.ts`
- [x] 6.5 Actualizar imports en `src/app/features/transactions/transaction-details-dialog/transaction-details-dialog.component.ts`
- [x] 6.6 Actualizar imports en `src/app/features/transactions/transaction-filter/transaction-filter.component.ts`
- [x] 6.7 Actualizar imports en `src/app/features/transactions/transaction-grid/transaction-grid.component.ts`
- [x] 6.8 Actualizar imports en `src/app/features/user/user-profile/user-profile.component.ts`
- [x] 6.9 Actualizar imports en `src/app/shared/components/loader/loader.component.ts`
- [x] 6.10 Actualizar imports en `src/app/app.config.ts`

## 7. Verificación final

- [x] 7.1 Ejecutar `ng build` y confirmar que no hay errores de compilación TypeScript
- [x] 7.2 Verificar que no quedan imports cruzados con rutas relativas `../` entre capas
