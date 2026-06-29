## 1. Backend — endpoint to fetch all matching IDs

- [x] 1.1 Add `findAllIds(Long userId, TransactionFilterParams params)` method to `TransactionService` — reuse `buildSpec()` + `transactionRepository.findAll(spec, sort)` but return `List<Long>` (IDs only, no pagination)
- [x] 1.2 Add `GET /transactions/ids` endpoint in `TransactionController` — same filter params as the list endpoint (excluding `limit`/`offset`), calls `transactionService.findAllIds()`, returns `ResponseEntity<List<Long>>`

## 2. Frontend service — getAllIds method

- [x] 2.1 Add `getAllIds()` method to `TransactionsService` (`frontend/src/app/features/transactions/transactions.service.ts`) — builds params from `this.filters()` (omitting `limit`/`offset`) and calls `GET /transactions/ids`, returns `Observable<number[]>`

## 3. Frontend component — state and logic

- [x] 3.1 Add `selectAllActive = signal(false)` and `allSelectedIds = signal<number[]>([])` signals to `TransactionGridComponent`
- [x] 3.2 Add computed `effectiveIds()`: returns `this.allSelectedIds()` when `selectAllActive()` is true, otherwise `this.selected().map(t => t.id)`
- [x] 3.3 Add `selectAll()` method: calls `txService.getAllIds()`, stores IDs in `allSelectedIds`, sets `selectAllActive(true)`
- [x] 3.4 Add `cancelAllSelection()` method: resets `selectAllActive(false)`, clears `allSelectedIds([])`, clears `selected([])`, sets `mobileSelectMode(false)`
- [x] 3.5 Update `cancelMobileSelection()` to also reset `selectAllActive` and `allSelectedIds`
- [x] 3.6 Update `onTaggingDone()` to call `cancelAllSelection()` instead of manually resetting signals
- [x] 3.7 Update `deleteSelected()` to use `effectiveIds()` instead of `selected().map(tx => tx.id)` for the delete call and confirmation message count
- [x] 3.8 Update the tagging dialog binding in the template to pass `effectiveIds()` instead of `selected().map(t => t.id)`

## 4. Frontend template — UI elements

- [x] 4.1 Add "Seleccionar todos ({{ total() }})" button inside `mobile-select-banner` — shown only when `mobileSelectMode() && !selectAllActive()`; clicking calls `selectAll()`
- [x] 4.2 Add the all-selected chip inside `mobile-select-banner` — shown only when `selectAllActive()`; displays `allSelectedIds().length` + dismiss button (✕) that calls `cancelAllSelection()`

## 5. i18n keys

- [x] 5.1 Add to `frontend/public/i18n/es.json` under `transactions.grid`:
  - `"selectAll": "Seleccionar todos ({{ count }})"` 
  - `"allSelected": "{{ count }} transacciones seleccionadas"`
