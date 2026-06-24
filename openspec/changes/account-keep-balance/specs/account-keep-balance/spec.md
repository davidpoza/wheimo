## ADDED Requirements

### Requirement: Account has keepBalance flag
The system SHALL store a boolean `keepBalance` field on each account, defaulting to `true`.

#### Scenario: New account defaults keepBalance to true
- **WHEN** a new account is created without specifying `keepBalance`
- **THEN** the account SHALL have `keepBalance = true`

#### Scenario: keepBalance can be set to false on create
- **WHEN** a new account is created with `keepBalance = false`
- **THEN** the account SHALL be persisted with `keepBalance = false`

#### Scenario: keepBalance can be toggled on edit
- **WHEN** an existing account is updated with a new value for `keepBalance`
- **THEN** the account SHALL reflect the updated value

---

### Requirement: Balance sync respects keepBalance
The system SHALL only update `account.balance` during movement creation/import when `keepBalance = true`.

#### Scenario: Balance updated when keepBalance is true
- **WHEN** a non-draft movement is created for an account with `keepBalance = true`
- **THEN** `account.balance` SHALL be updated to the new calculated balance

#### Scenario: Balance not updated when keepBalance is false
- **WHEN** a movement is created (or imported) for an account with `keepBalance = false`
- **THEN** `account.balance` SHALL NOT be modified

#### Scenario: Explicit balance value bypasses keepBalance
- **WHEN** a movement is created with an explicit `balance` value in the request
- **THEN** the account balance SHALL NOT be updated regardless of `keepBalance` (existing behavior preserved)

---

### Requirement: Account card hides balance when keepBalance is false
The frontend account card SHALL display the balance only when `keepBalance = true`.

#### Scenario: Balance visible for keepBalance true
- **WHEN** an account card is rendered for an account with `keepBalance = true`
- **THEN** the balance amount SHALL be visible in the card

#### Scenario: Balance hidden for keepBalance false
- **WHEN** an account card is rendered for an account with `keepBalance = false`
- **THEN** the balance amount SHALL NOT be rendered in the card

---

### Requirement: Create/edit account form includes keepBalance checkbox
The account creation and edit dialog SHALL include a checkbox for `keepBalance`.

#### Scenario: Checkbox visible in edit dialog
- **WHEN** the user opens the edit account dialog
- **THEN** a checkbox labeled to indicate balance synchronization SHALL be visible

#### Scenario: Checkbox state reflects account value
- **WHEN** the edit dialog opens for an account with `keepBalance = false`
- **THEN** the checkbox SHALL be unchecked

#### Scenario: Submitting form saves keepBalance value
- **WHEN** the user toggles the checkbox and saves the form
- **THEN** the account SHALL be updated with the new `keepBalance` value
