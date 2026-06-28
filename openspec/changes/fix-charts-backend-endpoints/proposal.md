## Why

The Charts screen is broken: every backend request it makes fails. The frontend was built against three backend endpoints, but two of them (`/transactions/calendar`, `/transactions/statistics`) were never implemented, and the third (`/transactions/tags`) returns a response shape the frontend cannot consume. Users see errors instead of any chart.

## What Changes

- **Add** `GET /transactions/calendar?accountId&year`, returning a `Record<string, number>` map of `YYYY-MM-DD` → daily net amount, consumed by the heatmap.
- **Add** `GET /transactions/statistics?accountId&from&to`, returning `{ mostExpensiveDay, currentStreak, longestStreak, totalIncome, totalExpenses, avgDailyExpense }`, consumed by the statistics panel.
- **BREAKING** (internal contract) **Change** `GET /transactions/tags` to return a `TagExpense[]` array (`[{ tagId, tagName, amount }]`) instead of the current `Map<String, Object>` keyed by tag id. This aligns the endpoint with what the frontend already expects.
- Root cause being fixed: because `/calendar` and `/statistics` have no mapping, they fall through to `@GetMapping("/{id}")` (which binds `Long id`), so Spring tries to parse `"calendar"`/`"statistics"` as a number and throws — producing the request failures users observe.

## Capabilities

### New Capabilities
- `charts-api`: Backend endpoints that power the Charts screen — expenses grouped by tag, a per-day spending calendar, and aggregate spending statistics for a date range.

### Modified Capabilities
<!-- None: no existing spec covers these endpoints. -->

## Impact

- **Backend**: `TransactionController` (new `/calendar`, `/statistics` mappings; changed `/tags` return type), `TransactionService` (new aggregation methods; `calculateExpensesByTags` reshaped to a DTO list), new `TagExpenseDto` / `StatisticsDto` / calendar response types.
- **Frontend**: `ChartsService` and the `tag-expenses-chart`, `heatmap`, and `statistics` components already expect these contracts — no change needed if the backend matches them. Verify the `/tags` consumer once the shape is fixed.
- **API consumers**: any other client relying on the old `Map`-shaped `/tags` response must update (internal only).
