## Context

Budgets already exist end-to-end but are modeled as arbitrary `start_date`/`end_date` ranges and are currently non-functional due to frontend/backend contract drift:

- `BudgetController.create` reads `tagId`, `start`, `end`; the Angular `budgets.component.ts` sends `tag: {id}`, `startDate`, `endDate`. The tag and dates never bind.
- `BudgetService.getStatus` returns a key `percentUsed`; the UI reads `status.percentage`. The progress bar and severity coloring never render.

Per product direction, a budget is a recurring **monthly** cap per tag, evaluated against the **current calendar month**, with **one budget per tag**. The stack is Spring Boot (Java, Flyway, Postgres) + Angular (signals, PrimeNG). Transactions carry amounts where spend is negative (the existing status code already treats `spent` as negative).

## Goals / Non-Goals

**Goals:**
- A budget = tag + monthly limit, no user-entered dates.
- One budget per tag, enforced by a DB unique constraint.
- Status computed server-side against the current calendar month.
- A consistent API contract the frontend and backend both honor.
- Listing clearly shows remaining-to-spend or amount-over-budget plus a severity-colored progress bar.

**Non-Goals:**
- Month navigation / historical month review (current month only).
- Multiple budgets per tag or budgets spanning multiple tags.
- Budgets on accounts, sub-tags, or rollover of unused budget between months.
- Notifications/alerts when a budget is exceeded.

## Decisions

- **Drop `start_date`/`end_date`; compute the window server-side.** The current month is derived in `BudgetService` (`YearMonth.now(zone)` → start = first day 00:00, end = first day of next month). Rationale: keeps the "monthly" semantics authoritative on the server and out of client input. Alternative considered: keep nullable date columns defaulting to month bounds — rejected as redundant state that can drift.
- **One budget per tag via `UNIQUE(tag_id)`.** Enforced in DB and surfaced as a clear error on duplicate create. Alternative: app-level check only — rejected; DB constraint is the durable guarantee.
- **Reuse the negative-spend convention.** `remaining = value + spent` (spent ≤ 0), `over = remaining < 0`. Keeps consistency with existing transaction sign handling.
- **Standardize the status payload key as `percentage`** (matching the existing frontend model) and include `spent`, `remaining`, `percentage`, `over`. Fixes the silent UI bug. Alternative: rename the frontend to `percentUsed` — chosen `percentage` because the frontend model and template already use it, minimizing UI churn.
- **Align create/update contract on `tagId` + `value` only.** Controller and Angular service both use these names; dates are removed from the request entirely.
- **New current-month sum query.** Add a `TransactionRepository` method summing amounts for a tag within `[start, end)` for the user, or reuse the existing `sumAmountByTagAndDateRange` by passing computed month bounds. Prefer reusing the existing range query to limit surface area.

## Risks / Trade-offs

- **Existing rows violate `UNIQUE(tag_id)`** → Migration must deduplicate before adding the constraint (keep the most recent budget per tag, delete the rest) and drop the date columns in the same migration. Given this is a single-user/early app, dropping duplicates is acceptable.
- **Timezone boundary correctness** → Compute month bounds with the application's configured zone (consistent with how transaction dates are stored as `TIMESTAMPTZ`); document the zone used so month rollover is predictable.
- **BREAKING API change** → Frontend and backend ship together; no external API consumers exist, so coordinated deploy mitigates this.
- **N+1 status calls** → The listing fetches `/budgets` then one `/status` per budget (existing behavior). Acceptable at expected small budget counts; a combined list-with-status endpoint is a possible future optimization, out of scope here.

## Migration Plan

1. Add `V21__monthly_budgets.sql`: delete duplicate budgets per tag (retain newest), drop `start_date` and `end_date` columns, add `ALTER TABLE budgets ADD CONSTRAINT uq_budgets_tag UNIQUE (tag_id)`.
2. Update entity/DTO/service/controller and the transaction sum usage.
3. Update Angular model, service, component, and dialog.
4. Deploy backend and frontend together.
- **Rollback**: revert the code; the dropped date columns cannot be restored with data, but budgets can be recreated from the (preserved) tag + value. Acceptable for current scale.

## Open Questions

- Which timezone is authoritative for "current month"? Default to the app/server configured zone unless a user timezone exists; confirm against how transaction dates are currently interpreted.
