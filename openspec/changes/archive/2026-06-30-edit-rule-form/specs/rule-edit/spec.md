## ADDED Requirements

### Requirement: Edit button per rule row
Each row in the rules table SHALL display an edit button alongside the existing delete button.

#### Scenario: Edit button visible
- **WHEN** the rules table is rendered with at least one rule
- **THEN** each row SHALL show a pencil/edit icon button

### Requirement: Open edit dialog with prefilled data
Clicking the edit button of a rule SHALL open the creation dialog in edit mode with the rule's current data prefilled.

#### Scenario: Dialog opens in edit mode
- **WHEN** user clicks the edit button on a rule row
- **THEN** the dialog SHALL open with name, type, value and associated tags pre-populated from that rule

#### Scenario: Dialog title changes in edit mode
- **WHEN** the dialog is in edit mode
- **THEN** the dialog header SHALL display the edit label (not the create label)

#### Scenario: Submit button label changes in edit mode
- **WHEN** the dialog is in edit mode
- **THEN** the submit button SHALL display the edit/save label (not "Create")

### Requirement: Save edited rule
Submitting the form in edit mode SHALL update the rule data and reconcile its tags.

#### Scenario: Rule data updated
- **WHEN** user modifies name, type or value and submits in edit mode
- **THEN** the system SHALL PATCH the rule and reflect the changes in the table

#### Scenario: Tags reconciled on edit
- **WHEN** user adds or removes tags and submits in edit mode
- **THEN** new tags SHALL be associated and removed tags SHALL be disassociated from the rule

#### Scenario: Success toast on edit
- **WHEN** edit completes successfully
- **THEN** a success toast SHALL be displayed with the updated message

### Requirement: Close resets form mode
Closing the dialog (cancel or X) SHALL reset the form and return to create mode.

#### Scenario: Form reset on close
- **WHEN** user closes the dialog (cancel button or overlay click) in either mode
- **THEN** the form SHALL be cleared and the mode SHALL revert to create
