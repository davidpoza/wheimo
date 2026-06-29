## Context

The `TransactionDetailsDialogComponent` shows a dialog with transaction metadata. The `Transaction` model already carries `accountId`, and `AccountsService` exposes a `accounts` signal loaded at app start with all user accounts. No network request is needed to resolve the account name — it's already in memory.

## Goals / Non-Goals

**Goals:**
- Display the account name in the detail info section, resolved from `accountId` via the accounts signal.
- Add the required i18n key.

**Non-Goals:**
- Making the account field editable (out of scope).
- Changing the data model or API.

## Decisions

**Use `AccountsService.accounts` signal directly — no extra API call.**  
The accounts list is global app state, always loaded before any transaction dialog opens. Computing the name with a getter avoids any async complexity.

**Display as a read-only info-row, consistent with the existing "From", "To", "Balance" rows.**  
Keeps the UI consistent without introducing new design patterns.

## Risks / Trade-offs

- [Risk] `AccountsService.accounts` could be empty if the dialog opens before accounts load → Mitigation: the app loads accounts at startup (`app-layout`), so this is only a risk in edge cases; displaying an empty string is acceptable fallback.
