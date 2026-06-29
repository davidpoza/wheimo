## Why

Currently, multi-select mode in the transactions screen only allows selecting records visible on the current page. Users who want to bulk-tag or bulk-delete all transactions matching an active filter must page through and select manually — making mass operations impractical for large datasets.

## What Changes

- Add a **"Select all (x)"** button in multi-select mode that fetches and selects all transaction IDs matching the current filters, across all pages.
- Show a dismissible **chip** ("x transactions selected") when all results are selected, replacing the per-page count banner.
- Bulk tag and bulk delete operations work transparently whether the selection is page-local or all-results.
- New backend endpoint (or query param) to retrieve all IDs matching the current filter without pagination.

## Capabilities

### New Capabilities

- `bulk-select-all`: Select all transactions matching active filters (across all pages), then apply bulk tag/delete operations to the full result set.

### Modified Capabilities

_(none — existing selection and bulk-operation behavior is extended, not changed)_

## Impact

- **Frontend**: `transaction-grid.component` — new signal, button, and chip; `transactions.service` — new `getAllIds()` method.
- **Backend**: New endpoint `GET /transactions/ids` (returns just the IDs matching filters, no pagination limit) or reuse existing search with a `?idsOnly=true` param.
- **No breaking changes**: existing page-level selection continues to work identically.
