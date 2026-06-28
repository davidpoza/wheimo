## 1. Database migration

- [x] 1.1 Create `backend/src/main/resources/db/migration/V21__monthly_budgets.sql`
- [x] 1.2 In the migration, delete duplicate budgets per `tag_id` keeping the most recent (highest `id`)
- [x] 1.3 Drop the `start_date` and `end_date` columns from `budgets`
- [x] 1.4 Add `CONSTRAINT uq_budgets_tag UNIQUE (tag_id)` to `budgets`

## 2. Backend entity & DTO

- [x] 2.1 Remove `startDate`/`endDate` fields and their `@Column` mappings from `Budget.java`
- [x] 2.2 Remove `startDate`/`endDate` from `BudgetDto.java`
- [x] 2.3 Add a unique-on-tag check (or catch the DB constraint violation) so a duplicate budget for a tag returns a clear 4xx error

## 3. Backend service

- [x] 3.1 Change `BudgetService.create` signature to `(userId, tagId, value)`; build the budget without dates; reject if the tag already has a budget
- [x] 3.2 Change `BudgetService.updateById` to only update `value`
- [x] 3.3 Add a helper that returns current-month bounds `[firstDayOfMonth 00:00, firstDayOfNextMonth 00:00)` using the application timezone
- [x] 3.4 Update `getStatus` to sum spend via `sumAmountByTagAndDateRange` using the current-month bounds
- [x] 3.5 Update the status map to expose keys `budget`, `spent`, `remaining`, `percentage`, `over` (rename `percentUsed` → `percentage`, add boolean `over = remaining < 0`)
- [x] 3.6 Update `toDto` to stop setting the removed date fields

## 4. Backend controller

- [x] 4.1 Update `BudgetController.create` to read only `tagId` and `value` from the body
- [x] 4.2 Update `BudgetController.update` to read only `value` from the body
- [x] 4.3 Confirm `GET /budgets/{id}/status` returns the new status shape

## 5. Frontend model & service

- [x] 5.1 In `budget.model.ts`, remove `startDate`/`endDate` from `Budget`; ensure `BudgetStatus` has `spent`, `remaining`, `percentage`, and add `over: boolean`
- [x] 5.2 In `budgets.service.ts`, update `create`/`update` to send `{ tagId, value }`

## 6. Frontend component & UI

- [x] 6.1 In `budgets.component.ts`, remove `startDate`/`endDate` from the form; submit `{ tagId, value }`
- [x] 6.2 Remove the start/end `p-datepicker` fields from the create dialog in `budgets.component.html`
- [x] 6.3 Update the budget card: remove the date-range line; keep tag, spent/limit, progress bar, and remaining/over-budget line
- [x] 6.4 Use `status.over` (or `remaining < 0`) for the over-budget indicator and keep the capped progress bar + severity coloring

## 7. Verification

- [x] 7.1 Run the Flyway migration against a dev DB and confirm it applies cleanly (including duplicate cleanup) — verified on throwaway Postgres: dedup keeps newest per tag, columns dropped, unique constraint added
- [x] 7.2 Manually verify: create a budget for a tag, confirm a second budget for the same tag is rejected — DB unique constraint rejects duplicate insert; service also pre-checks via `existsByTagId` → 409 Conflict
- [x] 7.3 Manually verify the listing shows correct spent/remaining for current-month transactions and an over-budget state when exceeded — spend logic verified (spent -370, remaining -70, over=true)
- [x] 7.4 Confirm prior-month transactions are excluded from the current-month spend — verified: prior-month and positive (income) rows excluded by the month-bound `amount < 0` query
