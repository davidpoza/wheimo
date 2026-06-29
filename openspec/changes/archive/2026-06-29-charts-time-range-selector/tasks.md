## 1. Refactor Child Components to Accept from/to Inputs

- [x] 1.1 Add `from` and `to` as required `input<string>()` to `TagExpensesChartComponent`; remove internal hardcoded date calculation; update `effect()` to use the new inputs
- [x] 1.2 Add `from` and `to` as required `input<string>()` to `StatisticsComponent`; remove internal hardcoded date calculation; update `effect()` to use the new inputs

## 2. Add Time-Range State to BalanceEvolutionComponent

- [x] 2.1 Define the preset options (Current month, Last 3 months, Last 6 months, Last 12 months, Custom) and a helper that resolves each preset to `{ from, to }` ISO strings
- [x] 2.2 Add `selectedPreset` signal (default: current month) and `from`/`to` signals computed from the selected preset
- [x] 2.3 Update `loadChart()` to use the `from`/`to` signals instead of the hardcoded 90-day window

## 3. Add Time-Range UI to Charts Page Header

- [x] 3.1 Add a `p-select` for preset options to `balance-evolution.component.html`, placed next to the account selector
- [x] 3.2 Add a `p-datepicker` with `selectionMode="range"` that is shown only when the "Custom" preset is selected; wire it to update `from`/`to` signals
- [x] 3.3 Pass `[from]="from()"` and `[to]="to()"` as inputs to `<app-tag-expenses-chart>` and `<app-statistics>` in the template

## 4. i18n Labels

- [x] 4.1 Add translation keys for preset labels (`charts.timeRange.currentMonth`, `charts.timeRange.last3Months`, `charts.timeRange.last6Months`, `charts.timeRange.last12Months`, `charts.timeRange.custom`) in all i18n files (es, en)
