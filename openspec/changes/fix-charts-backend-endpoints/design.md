## Context

The Angular Charts feature (`frontend/src/app/features/charts/`) calls three endpoints via `ChartsService`:

- `GET /transactions/tags` → expects `TagExpense[]` = `[{ tagId, tagName, amount }]`
- `GET /transactions/calendar?accountId&year` → expects `Record<string, number>`
- `GET /transactions/statistics?accountId&from&to` → expects the `Statistics` interface

The Spring backend (`TransactionController`) only implements `/tags`, and it returns `Map<String, Object>` keyed by tag id (`{ "-1": { name, amount }, ... }`) — not the array the frontend consumes. The other two paths have no mapping, so Spring matches them against `@GetMapping("/{id}")` (which binds `@PathVariable Long id`) and fails trying to convert `"calendar"`/`"statistics"` to `Long`, surfacing as request failures on the Charts screen.

`TransactionService.calculateExpensesByTags` already does the per-tag aggregation; the work is mostly reshaping output and adding two new aggregations. Filtering is done with JPA `Specification` over `Transaction` (fields: `account.user.id`, `account.id`, `amount`, `date`, `tags`).

## Goals / Non-Goals

**Goals:**
- Make all three Charts requests succeed with shapes the existing frontend already expects (no frontend contract change required).
- Stop named chart paths from colliding with the `/{id}` numeric route.
- Reuse the existing `Specification`-based filtering and user scoping (`SecurityUtils.getCurrentUserId()`).

**Non-Goals:**
- No changes to the Charts UI components beyond verifying they render against the corrected responses.
- No new caching, pagination, or pre-aggregation tables — datasets are per-account and bounded by date range.
- No change to other `TransactionController` endpoints.

## Decisions

- **Return typed DTOs, not `Map`.** Introduce `TagExpenseDto(tagId, tagName, amount)`, `StatisticsDto`, and use a plain `Map<String, BigDecimal>` (date→amount) for the calendar. Rationale: matches the frontend contract directly and is self-documenting. Alternative — keep the `Map<String,Object>` and adapt the frontend — rejected because more code churns on the client and the loose `Object` typing is the source of the bug-prone shape.
- **`/tags` returns `non-tagged` as `tagId = -1`.** Preserves the existing bucket concept while giving it the `tagId`/`tagName` fields the frontend reads. Keeps a single response array.
- **Route-collision fix is implicit via explicit mappings.** Adding `@GetMapping("/calendar")` and `@GetMapping("/statistics")` makes Spring prefer the exact paths over `/{id}`, so no extra guard is needed. Alternative — constrain the id route with a regex like `/{id:\\d+}` — is a reasonable belt-and-suspenders addition and is listed as an optional hardening task.
- **Compute aggregations in the service from the filtered `List<Transaction>`.** The volume (one account, one year / one range) is small enough to aggregate in memory, mirroring the existing `calculateExpensesByTags` style. Alternative — JPQL `GROUP BY` queries — deferred; not worth the added query surface for current data sizes.
- **Calendar `year` filter** is implemented as a `from`/`to` date range covering Jan 1–Dec 31 of the requested year, reusing the same `Specification` predicates.

## Risks / Trade-offs

- **Breaking the `/tags` response shape for any other consumer** → The frontend is the only known consumer; grep confirms no other caller. Document as an internal breaking change in the proposal.
- **In-memory aggregation on large accounts** → Bounded by account + date range; acceptable now. If an account accumulates very large histories, revisit with a `GROUP BY` query.
- **Streak/`avgDailyExpense` definitions are ambiguous** → Define explicitly in tasks: `currentStreak`/`longestStreak` = consecutive days with at least one expense; `avgDailyExpense` = totalExpenses divided by number of days in range. Confirm against what the statistics panel renders.
- **Timezone of day-bucketing** → Bucket by the date portion of the transaction `date` (an `OffsetDateTime`) consistently for both calendar and `mostExpensiveDay` to avoid off-by-one day mismatches.
