## Why

The `Transaction` entity has two overlapping text fields: `comments` (original, populated from bank imports) and `note` (added later via migration V13 as a user-editable annotation). Having both fields creates confusion about which one to use for user notes, duplicates UI surface, and adds unnecessary complexity to the data model.

## What Changes

- **BREAKING** Remove the `note` field from the `Transaction` entity, DTOs (`TransactionDto`, `UpdateTransactionRequest`), and frontend model
- Remove the "Nota" text area from the transaction details dialog UI
- Remove the `updateNote` dedicated method from the frontend `TransactionsService`
- Remove `note` from the full-text search predicate in `TransactionService.java`
- Add a database migration to drop the `note` column and its index from the `transactions` table

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `transaction-note`: Remove the `note` field from transactions — the `comments` field already serves as the user-editable annotation; `note` is redundant

## Impact

- **Backend**: `Transaction.java`, `TransactionDto.java`, `UpdateTransactionRequest.java`, `TransactionService.java` (entity mapping and search predicate)
- **Database**: New migration to drop `note` column and `idx_transactions_note` index
- **Frontend**: `transaction.model.ts`, `transaction-details-dialog.component.ts`, `transaction-details-dialog.component.html`, `transactions.service.ts`
- **Breaking**: Any API clients sending `note` in PATCH requests will have the field silently ignored after the change
