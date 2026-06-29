## ADDED Requirements

### Requirement: Transaction detail shows account name
The transaction detail dialog SHALL display the name of the account the transaction belongs to in the info section.

#### Scenario: Account name visible in detail
- **WHEN** a user opens the transaction detail dialog for any transaction
- **THEN** the dialog SHALL show the account name resolved from `tx.accountId` via `AccountsService.accounts`

#### Scenario: Account name not found
- **WHEN** the accounts list is empty or does not contain the transaction's `accountId`
- **THEN** the account row SHALL render an empty string (no error thrown)
