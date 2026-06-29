## Context

The transactions screen has a multi-select mode (long-press on mobile, checkboxes on desktop) that lets users bulk-tag or bulk-delete the transactions visible on the current page. The backend already supports `DELETE /transactions?ids=…` and `POST /transactions/apply-specific-tags` which both accept lists of IDs. The frontend `TransactionsService` exposes `filters` (with pagination params) and `total` (total matching rows). All filter logic lives in `TransactionFilterParams` (Java DTO).

## Goals / Non-Goals

**Goals:**
- Let users select every transaction matching the active filters in one click, regardless of how many pages exist.
- Show a visible count badge ("xxx transacciones seleccionadas") while all-results are selected.
- Bulk tag and bulk delete both work transparently whether the selection is page-local or all-results.

**Non-Goals:**
- Mixed selection (some pages selected, some not). The feature is binary: page-level selection OR all-results selection.
- Real-time updates while in all-selected mode (no live re-query after filter changes).
- Persisting the selection across navigation.

## Decisions

### 1. New backend endpoint `GET /transactions/ids`

Return `List<Long>` for all IDs matching the current filters (same params as `GET /transactions`, ignoring `limit`/`offset`). This avoids fetching full transaction data for potentially thousands of rows.

**Alternative considered**: Reuse `GET /transactions` with a large `limit`. Rejected — unpredictable payload size, wasted bandwidth, risks OOM on the server.

**Alternative considered**: Pass filters to bulk operations directly (filter-based delete). Rejected — would require a more complex API change and is harder to confirm with the user before acting.

### 2. Frontend: separate `allSelectedIds` signal, not expanding `selected`

Add `selectAllActive = signal(false)` and `allSelectedIds = signal<number[]>([])`. A computed `effectiveIds` returns `allSelectedIds()` when active, otherwise `selected().map(t => t.id)`. The existing `selected` signal continues to track page-level checkboxes unchanged.

**Alternative considered**: Fetch all Transaction objects and push into `selected`. Rejected — could be thousands of objects; breaks PrimeNG table's `[(selection)]` binding.

### 3. UX flow

1. User activates multi-select (long-press / checkbox).
2. A **"Seleccionar todos (x)"** button appears in the `mobile-select-banner` area and also in the header actions when in select mode.
3. Clicking it calls `GET /transactions/ids` with current filters → stores IDs → sets `selectAllActive = true`.
4. A chip **"x transacciones seleccionadas ✕"** replaces the normal count text. Clicking ✕ resets to page selection.
5. Bulk tag and delete use `effectiveIds`.

### 4. No backend changes to bulk-operation endpoints

`POST /transactions/apply-specific-tags` and `DELETE /transactions?ids=…` already accept flat ID lists. We just pass more IDs.

## Risks / Trade-offs

- **Large ID lists in query params**: `DELETE /transactions?ids=1,2,3,…` can hit URL length limits with thousands of IDs. Mitigation: the delete endpoint already accepts a request body variant (or can be switched to POST-based delete if needed — noted as open question).
- **Stale count**: The `total()` shown in the button reflects the count at the time the filter was last applied. If transactions are added/removed concurrently, the count may differ from actual IDs returned. Acceptable for MVP — the actual operation uses the returned IDs, not the count.
- **UX on empty filters**: "Select all" with no filters could select the entire transaction history. The button always shows the count (`total()`), making this visible to the user before confirming.

## Open Questions

- Should the `DELETE /transactions` endpoint switch to accepting IDs in the request body (POST/DELETE with body) to avoid URL length limits? For now, comma-separated query param is used since the existing code already does it — can be addressed as a follow-up if needed.
