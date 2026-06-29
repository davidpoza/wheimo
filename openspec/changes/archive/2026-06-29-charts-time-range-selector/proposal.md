## Why

The charts screen currently uses hardcoded time ranges (last 30 or 90 days) for all sub-charts, giving users no control over the period being analysed. Adding a time-range selector lets users compare any period they choose, with the current month as a sensible default.

## What Changes

- Add a shared time-range selector component to the charts page header (alongside the account selector).
- Define a set of preset options: current month (default), last 3 months, last 6 months, last 12 months, and a custom date-range picker.
- Replace all hardcoded `from`/`to` date calculations in `BalanceEvolutionComponent`, `TagExpensesChartComponent`, and `StatisticsComponent` with values derived from the selected range.
- Pass `from` and `to` as inputs to child chart components so the page owns the range state.

## Capabilities

### New Capabilities

- `charts-time-range-selector`: A selector in the charts page that lets the user choose a preset period (current month, last 3 months, last 6 months, last 12 months) or a custom date range, and propagates the resolved `from`/`to` dates to all child chart components.

### Modified Capabilities

<!-- No existing specs change their requirements. -->

## Impact

- `frontend/src/app/features/charts/balance-evolution/balance-evolution.component.ts` — add `from`/`to` signals; remove hardcoded 90-day window; add time-range UI.
- `frontend/src/app/features/charts/balance-evolution/balance-evolution.component.html` — add time-range selector to header.
- `frontend/src/app/features/charts/tag-expenses-chart/tag-expenses-chart.component.ts` — accept `from`/`to` as inputs instead of hardcoding last 30 days.
- `frontend/src/app/features/charts/statistics/statistics.component.ts` — accept `from`/`to` as inputs instead of hardcoding last 30 days.
- i18n translation files for new labels.
- No backend changes required (API already accepts `from`/`to` params).
