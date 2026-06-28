## Context

El backend es Spring Boot (Java) con Flyway para migraciones y JPA/Hibernate. El frontend es Angular con PrimeNG. Las entidades actuales siguen un patrón consistente: entidad JPA → repositorio Spring Data → servicio → controlador REST → DTO → modelo Angular → servicio Angular → componente.

La importación de transacciones pasa por `XlsImportService` (y por el flujo de sync via Redis) que delegan en `TransactionService.processImportResult()`. Es en ese método donde se aplican los filtros actuales (`movementType`) y las reglas de tagging. Las excepciones deben evaluarse en el mismo lugar.

El modal actual `EditAccountDialogComponent` contiene el formulario de edición directamente en un `p-dialog`. Para introducir las pestañas hay que refactorizarlo para usar `p-tabView` de PrimeNG.

## Goals / Non-Goals

**Goals:**
- Nueva entidad `AccountException` (regex + descripción opcional) asociada a una `Account`.
- CRUD REST en `/accounts/{accountId}/exceptions`.
- Filtrado en `processImportResult`: descartar transacciones cuya `description` coincida con alguna excepción de la cuenta.
- UI: modal de cuenta con dos tabs (Detalle / Excepciones), `p-table` con CRUD inline de excepciones.

**Non-Goals:**
- Aplicar excepciones a transacciones ya importadas (solo afecta importaciones futuras).
- Soporte de campos de matching distintos a `description` (la description es el campo más representativo y es el que usan las Rules).
- Validación avanzada de regex en backend (la regex se evalúa en Java con `Pattern.compile`; errores de compilación se devuelven como 400).

## Decisions

### 1. Endpoint anidado bajo `/accounts/{accountId}/exceptions`

**Elegido**: REST anidado `GET/POST /accounts/{accountId}/exceptions`, `PATCH/DELETE /accounts/{accountId}/exceptions/{id}`.

**Alternativa**: endpoint raíz `/account-exceptions`. Descartado porque las excepciones son conceptualmente subordinadas a la cuenta y el anidamiento hace la autorización más natural (el `accountId` en la URL ya define el scope del usuario).

### 2. La entidad AccountException pertenece a Account (no a User directamente)

**Elegido**: `@ManyToOne` a `Account`. La cuenta ya pertenece a un usuario, por lo que la propiedad transitiva garantiza la autoización: siempre se verifica que `account.user.id == currentUserId`.

**Alternativa**: `@ManyToOne` a `User` más una FK a `Account`. Redundante y más propenso a incoherencias.

### 3. Filtrado con `java.util.regex.Pattern` en `processImportResult`

**Elegido**: en `TransactionService.processImportResult`, tras obtener las excepciones de la cuenta, se compilan los patrones y se descarta cada `ImportedTransaction` cuya `description` coincida con alguno. El filtro se aplica antes de persistir, igual que el filtro `movementType`.

**Alternativa**: filtrar en `XlsImportService` (más arriba en la cadena). Descartado porque `processImportResult` también sirve al flujo de sync automático vía Redis; centralizar aquí garantiza consistencia.

### 4. Modal con p-tabView

**Elegido**: añadir `p-tabView` con dos `p-tabPanel` en el `p-dialog` existente. La pestaña "Detalle" contiene el form actual intacto; la pestaña "Excepciones" contiene la tabla + CRUD.

**Alternativa**: dos modales separados. Descartado; añade complejidad de navegación sin beneficio real.

### 5. CRUD de excepciones con dialog inline (mismo patrón que tag-rules)

**Elegido**: un `p-dialog` dentro del modal de cuenta para crear/editar una excepción (igual que `tag-rules.component`). Botones de edición y borrado en cada fila de la tabla.

## Risks / Trade-offs

- [Regex maliciosa (ReDoS)] → Mitigación: compilar con timeout usando `Pattern.compile` estándar de Java; la longitud de la regex puede validarse (max 500 chars). El impacto es bajo porque el usuario solo define excepciones para sus propias cuentas.
- [Pestaña visible aunque la cuenta sea nueva] → Mitigación: la pestaña "Excepciones" solo se muestra en modo edición (cuando la cuenta ya tiene `id`). En creación solo se muestra el Detalle.

## Migration Plan

1. Crear migración Flyway `V20__create_account_exceptions.sql`.
2. Desplegar backend (sin cambios en API pública preexistente, solo nuevos endpoints y lógica interna).
3. Desplegar frontend.
4. Rollback: eliminar tabla `account_exceptions` con `V20_rollback` (manual); el código de filtrado sin excepciones equivale al comportamiento anterior.
