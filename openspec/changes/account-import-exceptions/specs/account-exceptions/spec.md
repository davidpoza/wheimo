## ADDED Requirements

### Requirement: AccountException entity persisted per account
The system SHALL store account exceptions in a dedicated `account_exceptions` table with columns `id` (PK, auto-increment), `account_id` (FK to `accounts`, cascade delete), `regex` (VARCHAR 500, NOT NULL), `description` (VARCHAR 255, nullable), and `created_at` (TIMESTAMPTZ).

#### Scenario: Exception is created and persisted
- **WHEN** a POST request is made to `/accounts/{accountId}/exceptions` with a valid regex and optional description
- **THEN** a new `account_exceptions` row is created and the response returns 201 with the created exception DTO

#### Scenario: Deleting an account cascades to its exceptions
- **WHEN** an account is deleted
- **THEN** all associated `account_exceptions` rows are deleted via ON DELETE CASCADE

---

### Requirement: CRUD REST API for account exceptions
The system SHALL expose the following endpoints, all scoped to the authenticated user's account:
- `GET /accounts/{accountId}/exceptions` → list all exceptions for the account
- `POST /accounts/{accountId}/exceptions` → create a new exception
- `PATCH /accounts/{accountId}/exceptions/{id}` → update regex and/or description
- `DELETE /accounts/{accountId}/exceptions/{id}` → remove an exception

#### Scenario: User can list exceptions for their account
- **WHEN** the authenticated user calls `GET /accounts/{accountId}/exceptions`
- **THEN** the response returns 200 with an array of exception DTOs belonging to that account

#### Scenario: Create exception with invalid regex returns 400
- **WHEN** a POST is made with a regex string that does not compile as a valid Java regex
- **THEN** the server responds with 400 Bad Request

#### Scenario: Access to another user's account exceptions is forbidden
- **WHEN** the authenticated user calls any exception endpoint with an `accountId` that belongs to a different user
- **THEN** the server responds with 403 Forbidden

---

### Requirement: Import filtering via account exceptions
The system SHALL, during transaction import (XLS or automatic sync), discard any incoming transaction whose `description` field matches at least one active regex exception defined for the target account. Discarded transactions are counted as skipped and never persisted.

#### Scenario: Matching transaction is skipped during XLS import
- **WHEN** an XLS import is processed for account A and an incoming transaction's description matches an exception regex of account A
- **THEN** that transaction is not saved to the database and is counted in the `skipped` counter of `ImportResultDto`

#### Scenario: Non-matching transaction is imported normally
- **WHEN** an incoming transaction's description does not match any exception regex of the account
- **THEN** the transaction is persisted as usual

#### Scenario: Account with no exceptions behaves as before
- **WHEN** an account has no `account_exceptions` rows
- **THEN** the import behaviour is identical to the pre-feature behaviour

---

### Requirement: Account detail modal shows Excepciones tab
The frontend modal for viewing/editing an account SHALL display two tabs when opened in edit mode: **Detalle** (existing form content) and **Excepciones** (exception management).

#### Scenario: Edit modal renders two tabs
- **WHEN** the user opens the account detail modal for an existing account
- **THEN** a `p-tabView` is visible with "Detalle" and "Excepciones" as tab labels

#### Scenario: New account modal shows only Detalle tab
- **WHEN** the user opens the account creation modal (no existing account)
- **THEN** only the "Detalle" tab (the creation form) is shown; the "Excepciones" tab is not rendered

---

### Requirement: Exceptions tab displays p-table with CRUD actions
The Excepciones tab SHALL display a `p-table` listing all exceptions for the current account, with an edit button and a delete button per row, and a "New account exception" button above the table.

#### Scenario: Table shows all exceptions
- **WHEN** the Excepciones tab is active and the account has exceptions
- **THEN** each exception appears as a row with its `regex` and `description` columns visible

#### Scenario: New exception button opens creation dialog
- **WHEN** the user clicks "New account exception"
- **THEN** a dialog appears with a form to enter `regex` and `description`

#### Scenario: Edit button pre-fills the form
- **WHEN** the user clicks the edit button on an exception row
- **THEN** the same dialog opens pre-filled with the exception's current `regex` and `description`

#### Scenario: Delete button removes the exception after confirmation
- **WHEN** the user clicks the delete button on an exception row
- **THEN** a confirmation dialog appears, and upon confirmation the exception is deleted and the table refreshes
