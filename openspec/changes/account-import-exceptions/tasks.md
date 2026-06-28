## 1. Base de datos

- [x] 1.1 Crear migración `V20__create_account_exceptions.sql` con tabla `account_exceptions` (id, account_id FK cascade, regex VARCHAR(500) NOT NULL, description VARCHAR(255), created_at TIMESTAMPTZ)

## 2. Backend — entidad y repositorio

- [x] 2.1 Crear entidad JPA `AccountException` en `com.wheimo.api.domain.entity` con los campos de la migración y `@PrePersist` para `createdAt`
- [x] 2.2 Crear `AccountExceptionRepository` (Spring Data JPA) con método `findByAccountId(Long accountId)`
- [x] 2.3 Crear DTO `AccountExceptionDto` en `com.wheimo.api.domain.dto`

## 3. Backend — servicio

- [x] 3.1 Crear `AccountExceptionService` con métodos: `findAll(accountId, userId)`, `create(accountId, userId, regex, description)`, `update(id, accountId, userId, regex, description)`, `delete(id, accountId, userId)`. Verificar siempre que la cuenta pertenece al usuario.
- [x] 3.2 Añadir validación de regex en `create` y `update`: compilar con `Pattern.compile`; lanzar `IllegalArgumentException` (→ 400) si es inválida

## 4. Backend — controlador

- [x] 4.1 Crear `AccountExceptionController` con rutas `GET /accounts/{accountId}/exceptions`, `POST /accounts/{accountId}/exceptions`, `PATCH /accounts/{accountId}/exceptions/{id}`, `DELETE /accounts/{accountId}/exceptions/{id}`

## 5. Backend — filtrado en importación

- [x] 5.1 En `TransactionService.processImportResult`, inyectar `AccountExceptionRepository` y, antes del bucle de persistencia, cargar las excepciones de la cuenta y compilar sus patrones
- [x] 5.2 En el bucle de `processImportResult`, descartar cada `ImportedTransaction` cuya `description` coincida con alguno de los patrones compilados

## 6. Frontend — modelo y servicio

- [x] 6.1 Crear interfaz `AccountException` en `frontend/src/app/core/models/account-exception.model.ts` con campos `id`, `accountId`, `regex`, `description`, `createdAt`
- [x] 6.2 Crear `AccountExceptionsService` en `frontend/src/app/features/accounts/` con métodos CRUD que llamen a `/accounts/{accountId}/exceptions`

## 7. Frontend — UI en modal de cuenta

- [x] 7.1 Refactorizar `edit-account-dialog.component.html` para envolver el contenido en un `p-tabView` con dos `p-tabPanel`: "Detalle" (form actual) y "Excepciones" (solo visible en modo edición)
- [x] 7.2 Añadir importación de `TabsModule` (o `TabViewModule`) de PrimeNG en `edit-account-dialog.component.ts`
- [x] 7.3 Implementar la pestaña "Excepciones": `p-table` con columnas Regex, Descripción y Acciones (botones editar/borrar por fila), y botón "New account exception" sobre la tabla
- [x] 7.4 Implementar dialog de creación/edición de excepción (dentro del mismo componente o como componente hijo) con campos `regex` (required, con validación de regex JS) y `description` (optional)
- [x] 7.5 Conectar las acciones del CRUD de excepciones con `AccountExceptionsService` y refrescar la tabla tras cada operación
- [x] 7.6 Añadir dialog de confirmación de borrado (usando `p-confirmDialog` o `p-dialog` propio)
