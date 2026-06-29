## Context

The charts page (`BalanceEvolutionComponent`) is the host component for all chart sub-components. Currently each sub-component hard-codes its own date window:
- `BalanceEvolutionComponent.loadChart()` → last 90 days
- `TagExpensesChartComponent` constructor → last 30 days
- `StatisticsComponent` constructor → last 30 days

The backend API already accepts `from`/`to` ISO-string query params for all three endpoints, so no backend work is needed.

## Goals / Non-Goals

**Goals:**
- Single time-range control in the charts page header that governs all sub-charts.
- Preset options: Current month (default), Last 3 months, Last 6 months, Last 12 months, and Custom (date-range picker).
- Child components receive `from`/`to` as Angular `input()` signals and re-fetch when they change.

**Non-Goals:**
- Per-chart independent time ranges.
- Persisting the selected range across sessions.
- Adding new chart types.

## Decisions

### State ownership: page component owns the range

The host `BalanceEvolutionComponent` owns two signals: `from` and `to` (ISO strings). Child components (`TagExpensesChartComponent`, `StatisticsComponent`) expose them as required inputs and react via `effect()`. This avoids a shared service for transient UI state.

*Alternative considered*: a shared `ChartsStateService` — rejected because the range is local to this single page; a service would add indirection without benefit.

### Preset resolution at selection time

`from`/`to` are computed when the user picks a preset (or changes the custom range), stored as ISO strings, and passed down. No lazy computation in children.

### Custom range via PrimeNG DatePicker with `selectionMode="range"`

PrimeNG's `p-datepicker` with `selectionMode="range"` is already available in the project's PrimeNG dependency. Using it avoids adding a new library.

*Alternative considered*: two separate date pickers (from / to) — rejected because the range picker gives a better UX with a single interaction.

### Preset selector: PrimeNG `p-select`

Consistent with the existing account selector on the same page.

## Risks / Trade-offs

- [Balance chart uses transactions list, not the charts service] The balance-evolution chart calls `txService.loadAll()` which has its own date params — must ensure `from`/`to` are also passed there. → Include `from`/`to` in `loadChart()` params.
- [Custom range UX on mobile] A date-range picker can be awkward on small screens. → Accept this limitation for now; out of scope to redesign for mobile.

## Migration Plan

No data migration. The change is entirely frontend. Deploy as a standard frontend build.
