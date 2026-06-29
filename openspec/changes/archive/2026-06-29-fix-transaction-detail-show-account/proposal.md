## Why

The transaction detail dialog shows emitter, receiver, description, and balance — but not the account the transaction belongs to. This makes it impossible for users with multiple accounts to know at a glance which account a transaction came from when opening the detail from a cross-account view (e.g. search results or favourites).

## What Changes

- The transaction detail dialog will display the account name in the info section (read-only).
- A new i18n key `transactions.details.account` will be added.

## Capabilities

### New Capabilities

_(none — this is a display fix, not a new capability)_

### Modified Capabilities

- `transaction-detail-display`: The detail view now renders the account name derived from `tx.accountId` by looking it up in the existing `AccountsService.accounts` signal.

## Impact

- `transaction-details-dialog.component.ts` — inject `AccountsService`, add computed getter for account name.
- `transaction-details-dialog.component.html` — add an info-row for account name.
- `frontend/public/i18n/es.json` — add `transactions.details.account` key.
