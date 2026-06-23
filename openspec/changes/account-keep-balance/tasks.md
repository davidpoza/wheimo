## 1. Base de datos y entidad

- [x] 1.1 Crear migración `V16__add_account_keep_balance.sql` que añade columna `keep_balance BOOLEAN NOT NULL DEFAULT TRUE` a la tabla `accounts`
- [x] 1.2 Añadir campo `keepBalance` (boolean, default true) a la entidad `Account`

## 2. Backend — API

- [x] 2.1 Añadir `keepBalance` a `AccountDto`
- [x] 2.2 Añadir `keepBalance` a `CreateAccountRequest`
- [x] 2.3 Añadir `keepBalance` a `UpdateAccountRequest`
- [x] 2.4 Actualizar `AccountService` para mapear `keepBalance` en create y update

## 3. Backend — Lógica de importación

- [x] 3.1 En `TransactionService.create()`, añadir condición para solo actualizar `account.balance` cuando `account.isKeepBalance() == true`

## 4. Frontend — Modelo y formulario

- [x] 4.1 Añadir campo `keepBalance: boolean` al interface `Account` en `account.model.ts`
- [x] 4.2 Añadir checkbox `keepBalance` al formulario de `edit-account-dialog` (HTML + TS)

## 5. Frontend — Tarjeta de cuenta

- [x] 5.1 Envolver el bloque de balance en `accounts-list.component.html` con `@if (account.keepBalance)` para ocultarlo cuando no procede
