## REMOVED Requirements

### Requirement: Transaction note field
The system SHALL allow users to add a secondary text annotation (`note`) to a transaction, separate from the `comments` field.

**Reason**: The `note` field is redundant with the existing `comments` field. Both serve as user-editable text annotations on a transaction; having two overlapping fields adds unnecessary complexity to the data model, DTOs, UI, and search predicate.

**Migration**: Use the `comments` field for all user annotations. The `note` column and its database index are dropped in migration V14.

#### Scenario: Note field removed from API
- **WHEN** a client sends a PATCH request to `/transactions/{id}` with a `note` property in the body
- **THEN** the field is ignored and no error is returned

#### Scenario: Note field removed from UI
- **WHEN** a user opens the transaction details dialog
- **THEN** only the "Comments" text area is shown; there is no "Nota" field

#### Scenario: Search no longer queries note column
- **WHEN** a user searches transactions by keyword
- **THEN** the search matches against `comments` only, not `note`
