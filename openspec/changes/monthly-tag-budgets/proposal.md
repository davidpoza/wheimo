## Why

The current budgets feature is modeled as an arbitrary `startDate`/`endDate` range, which does not match how users actually think about spending limits — a recurring **monthly** cap per category (tag). The feature is also effectively broken end-to-end: the frontend sends `tag.id`/`startDate`/`endDate` while the backend reads `tagId`/`start`/`end` (so creation never persists the tag or dates), and the status endpoint returns `percentUsed` while the UI reads `percentage` (so the progress bar and severity never render). We are reworking budgets into a recurring monthly limit per tag and fixing the listing so users can see, at a glance, whether they have exceeded the planned limit or how much they have left to spend this month.

## What Changes

- **BREAKING** Replace the date-range budget model with a recurring **monthly** budget: a budget is a tag + a monthly limit, with no manual start/end dates.
- Enforce **one budget per tag** via a database unique constraint.
- Compute spend against the **current calendar month** automatically (server-side), no month navigation.
- Fix the create/update API contract so the frontend and backend agree on field names (`tagId`, `value`).
- Fix the status response so the UI reliably shows spent, remaining, percentage used, and an over-budget indicator.
- Update the listing UI to show, per budget: the tag, the monthly limit, amount spent this month, remaining amount (or amount over budget), and a progress bar with severity coloring.
- Remove the start/end date pickers from the create dialog; the dialog becomes tag + monthly amount.
- Add a Flyway migration to drop `start_date`/`end_date` and add the per-tag unique constraint.

## Capabilities

### New Capabilities
- `monthly-tag-budgets`: A recurring monthly spending limit attached to a tag, with per-month spend tracking and a listing that surfaces remaining or over-budget amounts.

### Modified Capabilities
<!-- No existing spec covers budgets; this is introduced as a new capability. -->

## Impact

- **Backend (Java/Spring)**: `Budget` entity, `BudgetService`, `BudgetController`, `BudgetDto`, `BudgetRepository`, `TransactionRepository` (current-month sum query). New Flyway migration `V21__monthly_budgets.sql`.
- **Frontend (Angular)**: `budget.model.ts`, `budgets.service.ts`, `budgets.component.ts/.html` — remove date fields, align field names, fix status mapping.
- **API contract**: `POST /budgets`, `PATCH /budgets/{id}`, `GET /budgets/{id}/status` request/response shapes change. **BREAKING** for any existing stored budgets (date columns dropped; existing rows must be migrated to the unique-per-tag monthly form).
- **Data**: Existing `budgets` rows with multiple entries per tag would violate the new unique constraint; migration must collapse or drop duplicates.
