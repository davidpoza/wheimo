## 1. Database Migration

- [x] 1.1 Create `backend/src/main/resources/db/migration/V14__drop_transaction_note.sql` that drops the `idx_transactions_note` index and the `note` column from the `transactions` table

## 2. Backend - Entity and DTOs

- [x] 2.1 Remove the `note` field from `Transaction.java` entity
- [x] 2.2 Remove the `note` field from `TransactionDto.java`
- [x] 2.3 Remove the `note` field from `UpdateTransactionRequest.java`

## 3. Backend - Service

- [x] 3.1 Remove the `.note(t.getNote())` mapping in `TransactionService.java` (entity-to-DTO conversion)
- [x] 3.2 Remove the `note` search predicate from `TransactionService.java` full-text search (the `cb.like(cb.lower(cb.coalesce(root.get("note"), "")), like)` clause and its OR connector)

## 4. Frontend - Model

- [x] 4.1 Remove the `note: string | null` field from `transaction.model.ts`

## 5. Frontend - Service

- [x] 5.1 Remove the `updateNote(id, note)` method from `transactions.service.ts`

## 6. Frontend - Transaction Details Dialog

- [x] 6.1 Remove the `note = signal('')` field and its initialization/save logic from `transaction-details-dialog.component.ts`
- [x] 6.2 Remove the "Nota" `<div class="field">` block from `transaction-details-dialog.component.html`
