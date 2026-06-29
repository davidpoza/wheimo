### Requirement: Backend exposes all matching transaction IDs
The system SHALL provide an endpoint `GET /transactions/ids` that accepts the same filter parameters as `GET /transactions` (excluding `limit` and `offset`) and returns the complete list of matching transaction IDs as `List<Long>`, with no pagination.

#### Scenario: Fetch IDs with active filter
- **WHEN** a GET request is sent to `/transactions/ids` with filter params (e.g. `?tags=5&from=...`)
- **THEN** the response is HTTP 200 with a JSON array of Long IDs for all matching transactions belonging to the current user, in the same sort order as the list endpoint

#### Scenario: Fetch IDs with no filters
- **WHEN** a GET request is sent to `/transactions/ids` with no filter params
- **THEN** the response is HTTP 200 with all transaction IDs for the current user

### Requirement: Select-all button in multi-select mode
While multi-select mode is active, the transactions screen SHALL display a "Seleccionar todos (x)" button (where x is the current `total` count) that, when clicked, fetches all matching IDs via `GET /transactions/ids` and activates all-results selection.

#### Scenario: Button appears in multi-select mode
- **WHEN** the user activates multi-select mode (long-press or checkbox click)
- **THEN** a "Seleccionar todos (x)" button is visible in the selection banner

#### Scenario: Clicking select-all activates all-results mode
- **WHEN** the user clicks "Seleccionar todos (x)"
- **THEN** the frontend calls `GET /transactions/ids` with current filters
- **THEN** all returned IDs are stored as the effective selection
- **THEN** the all-results-selected chip is displayed

#### Scenario: Button is hidden while all-results mode is active
- **WHEN** all-results selection mode is active
- **THEN** the "Seleccionar todos (x)" button is NOT shown (the chip replaces it)

### Requirement: All-results-selected chip
When all results are selected, the transactions screen SHALL display a chip reading "x transacciones seleccionadas" (where x is the actual count of selected IDs) with a dismiss button (✕).

#### Scenario: Chip shows correct count
- **WHEN** all-results selection is activated
- **THEN** the chip displays the exact number of IDs returned by the backend

#### Scenario: Dismissing the chip clears all-results selection
- **WHEN** the user clicks ✕ on the chip
- **THEN** all-results mode is deactivated
- **THEN** the page-level selection is cleared and multi-select mode is reset to normal (page-local)

### Requirement: Bulk operations apply to all selected IDs
When all-results selection is active, bulk tag and bulk delete operations SHALL use the full list of all-results IDs, not just those visible on the current page.

#### Scenario: Bulk tag with all-results selected
- **WHEN** all-results selection is active and the user applies tags via the tagging dialog
- **THEN** `POST /transactions/apply-specific-tags` is called with all stored IDs

#### Scenario: Bulk delete with all-results selected
- **WHEN** all-results selection is active and the user confirms delete
- **THEN** `DELETE /transactions?ids=…` is called with all stored IDs
- **THEN** the selection and all-results mode are reset after completion

#### Scenario: Cancelling multi-select clears all-results mode
- **WHEN** the user cancels multi-select mode (e.g. clicks "Cancelar")
- **THEN** all-results mode is deactivated and all stored IDs are cleared
