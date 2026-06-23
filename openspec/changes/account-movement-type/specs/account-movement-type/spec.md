## ADDED Requirements

### Requirement: Account has movement type
Each account SHALL have a `movementType` field with one of three values: `INCOME`, `EXPENSE`, or `BOTH`. The default value SHALL be `BOTH`.

#### Scenario: New account defaults to BOTH
- **WHEN** a new account is created without specifying `movementType`
- **THEN** the account's `movementType` is set to `BOTH`

#### Scenario: Account created with INCOME type
- **WHEN** a new account is created with `movementType: INCOME`
- **THEN** the account's `movementType` is saved as `INCOME`

#### Scenario: Account updated to EXPENSE type
- **WHEN** an existing account is updated with `movementType: EXPENSE`
- **THEN** the account's `movementType` is updated to `EXPENSE`

### Requirement: Import filters by account movement type
When importing transactions (XLS or sync), the system SHALL only persist transactions whose amount sign matches the account's `movementType`.

#### Scenario: INCOME account skips negative transactions
- **WHEN** importing transactions into an account with `movementType: INCOME`
- **THEN** transactions with `amount < 0` are skipped and not persisted

#### Scenario: EXPENSE account skips positive transactions
- **WHEN** importing transactions into an account with `movementType: EXPENSE`
- **THEN** transactions with `amount > 0` are skipped and not persisted

#### Scenario: BOTH account imports all transactions
- **WHEN** importing transactions into an account with `movementType: BOTH`
- **THEN** all transactions are imported regardless of sign

#### Scenario: Skipped transactions counted in import result
- **WHEN** some transactions are filtered out by movement type during import
- **THEN** the import result's `skipped` count includes those filtered transactions

### Requirement: Movement type exposed in account form
The account creation and edit form SHALL display a selector for `movementType` with the three options (INCOME, EXPENSE, BOTH).

#### Scenario: Selector shown in create form
- **WHEN** the user opens the create account dialog
- **THEN** a selector for movement type is visible with options: Entrada, Salida, Ambos

#### Scenario: Selector pre-filled in edit form
- **WHEN** the user opens the edit account dialog for an account with `movementType: EXPENSE`
- **THEN** the movement type selector shows "Salida" as the selected value
