## 1. DTOs

- [x] 1.1 Add `TagExpenseDto` (`Long tagId`, `String tagName`, `BigDecimal amount`) in the web DTO package.
- [x] 1.2 Add `StatisticsDto` (`MostExpensiveDay mostExpensiveDay` with `LocalDate date` + `BigDecimal amount` (nullable), `int currentStreak`, `int longestStreak`, `BigDecimal totalIncome`, `BigDecimal totalExpenses`, `BigDecimal avgDailyExpense`).

## 2. Service: tags

- [x] 2.1 Change `TransactionService.calculateExpensesByTags` to return `List<TagExpenseDto>` instead of `Map<String, Object>`, keeping the same `Specification` filtering and user scoping.
- [x] 2.2 Represent untagged expenses as a single entry with `tagId = -1` and `tagName = "non-tagged"`; return `[]` when there are no matching expenses.

## 3. Service: calendar

- [x] 3.1 Add `calculateCalendar(userId, accountId, year)` returning `Map<String, BigDecimal>` of `YYYY-MM-DD` → net amount, filtering by account and a Jan 1–Dec 31 range for `year` via `Specification`.
- [x] 3.2 Bucket by the date portion of the transaction `date`; omit days with no activity.

## 4. Service: statistics

- [x] 4.1 Add `calculateStatistics(userId, accountId, from, to)` returning `StatisticsDto` from the filtered transaction list.
- [x] 4.2 Compute `totalIncome` (sum of positive amounts), `totalExpenses` (sum of negative amounts), and `mostExpensiveDay` (day with the largest single-day expense total, or `null` if none).
- [x] 4.3 Compute `currentStreak`/`longestStreak` as consecutive days with at least one expense, and `avgDailyExpense` as `totalExpenses` over the number of days in the range; return safe zero/`null` defaults when there are no transactions.

## 5. Controller

- [x] 5.1 Update `GET /transactions/tags` to return `List<TagExpenseDto>`.
- [x] 5.2 Add `GET /transactions/calendar` with `@RequestParam` `accountId` (required) and `year` (required), returning the calendar map.
- [x] 5.3 Add `GET /transactions/statistics` with `@RequestParam` `accountId`, `from`, `to`, returning `StatisticsDto`.
- [x] 5.4 (Hardening) Constrain the id route to numeric ids (`@GetMapping("/{id:\\d+}")`) so named paths can never fall through.

## 6. Verify

- [x] 6.1 Build the backend and confirm it compiles.
- [ ] 6.2 (DEFERRED — verify on deploy) With the app running, hit `/transactions/tags`, `/transactions/calendar`, and `/transactions/statistics` (authenticated) and confirm `200` responses with the documented shapes.
- [ ] 6.3 (DEFERRED — verify on deploy) Open the Charts screen in the frontend and confirm the tag pie, heatmap, and statistics panel render without errors.
