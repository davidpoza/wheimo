## ADDED Requirements

### Requirement: Expenses grouped by tag

The system SHALL expose `GET /transactions/tags` returning a JSON array of tag-expense entries, each with `tagId`, `tagName`, and `amount`, scoped to the authenticated user. Each entry's `amount` SHALL be the sum of expense (negative) transaction amounts for that tag within the optional `from`/`to` date range and optional `accountId` filter. Transactions with no tags SHALL be reported as a single entry with `tagId` of `-1` and `tagName` of `non-tagged`.

#### Scenario: Tagged expenses are aggregated

- **WHEN** an authenticated user requests `GET /transactions/tags?accountId=1&from=2026-01-01T00:00:00Z&to=2026-01-31T23:59:59Z`
- **THEN** the response is a `200` with a JSON array where each element is `{ "tagId": <id>, "tagName": <name>, "amount": <sum-of-negative-amounts> }`

#### Scenario: Untagged expenses are bucketed

- **WHEN** the user has expense transactions without any tag in the requested range
- **THEN** the response array includes an entry with `tagId` of `-1` and `tagName` of `non-tagged` whose `amount` is the sum of those untagged expenses

#### Scenario: Empty range returns empty array

- **WHEN** there are no matching expense transactions in the requested range
- **THEN** the response is a `200` with an empty JSON array `[]`

### Requirement: Per-day spending calendar

The system SHALL expose `GET /transactions/calendar?accountId&year` returning a JSON object mapping each `YYYY-MM-DD` date that has activity to that day's net transaction amount, scoped to the authenticated user and the given `accountId` and `year`.

#### Scenario: Calendar returns daily net amounts

- **WHEN** an authenticated user requests `GET /transactions/calendar?accountId=1&year=2026`
- **THEN** the response is a `200` with a JSON object such as `{ "2026-01-05": -42.50, "2026-01-06": 120.00 }`, where each value is the sum of that day's transaction amounts for the account in that year

#### Scenario: Days without activity are omitted

- **WHEN** a day in the requested year has no transactions for the account
- **THEN** that date key is absent from the response object

### Requirement: Aggregate spending statistics

The system SHALL expose `GET /transactions/statistics?accountId&from&to` returning a JSON object with `mostExpensiveDay`, `currentStreak`, `longestStreak`, `totalIncome`, `totalExpenses`, and `avgDailyExpense`, computed over the authenticated user's transactions for the given account and date range.

#### Scenario: Statistics are computed for the range

- **WHEN** an authenticated user requests `GET /transactions/statistics?accountId=1&from=2026-01-01T00:00:00Z&to=2026-01-31T23:59:59Z`
- **THEN** the response is a `200` with `{ "mostExpensiveDay": { "date": <YYYY-MM-DD>, "amount": <number> } | null, "currentStreak": <int>, "longestStreak": <int>, "totalIncome": <sum-of-positive-amounts>, "totalExpenses": <sum-of-negative-amounts>, "avgDailyExpense": <number> }`

#### Scenario: No transactions yields safe defaults

- **WHEN** the account has no transactions in the requested range
- **THEN** the response is a `200` with `mostExpensiveDay` of `null`, streaks of `0`, and totals/averages of `0`

### Requirement: Chart endpoints do not collide with the transaction-by-id route

The system SHALL route `/transactions/tags`, `/transactions/calendar`, and `/transactions/statistics` to their dedicated handlers and SHALL NOT let these paths fall through to the `GET /transactions/{id}` numeric-id handler.

#### Scenario: Named chart paths are not parsed as ids

- **WHEN** an authenticated user requests `GET /transactions/calendar` or `GET /transactions/statistics`
- **THEN** the dedicated chart handler responds and the server does NOT attempt to parse `calendar`/`statistics` as a numeric transaction id (no resulting type-mismatch error)
