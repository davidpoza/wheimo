## ADDED Requirements

### Requirement: Monthly budget per tag
The system SHALL allow a user to define a recurring monthly spending limit associated with a single tag. A budget consists of a tag reference and a positive monetary limit (`value`); it has no user-specified start or end date. Each tag SHALL have at most one budget per user, enforced at the database level.

#### Scenario: Create a monthly budget
- **WHEN** a user submits a budget with a tag they own and a positive monthly limit
- **THEN** the system persists the budget linked to that tag and returns it with its id, tag, and limit

#### Scenario: Reject a second budget for the same tag
- **WHEN** a user creates a budget for a tag that already has a budget
- **THEN** the system rejects the request and does not create a duplicate budget for that tag

#### Scenario: Reject a budget for a tag the user does not own
- **WHEN** a user submits a budget referencing a tag that does not belong to them
- **THEN** the system rejects the request with a forbidden error and creates no budget

### Requirement: Current-month spend tracking
The system SHALL compute a budget's spend as the sum of the user's transactions tagged with the budget's tag whose dates fall within the **current calendar month** (from the first day of the month at 00:00 through the end of the month, in the application's timezone). Income and refunds (positive amounts) reduce spend accordingly. The status SHALL expose the monthly limit, the amount spent this month, the remaining amount, the percentage of the limit used, and whether the budget is over its limit.

#### Scenario: Spend within the limit
- **WHEN** the current-month tagged transactions sum to less than the budget limit
- **THEN** the status reports the spent amount, a positive remaining amount, a percentage used below 100, and over-budget false

#### Scenario: Spend exceeds the limit
- **WHEN** the current-month tagged transactions sum to more than the budget limit
- **THEN** the status reports a negative remaining amount equal to the overspend, a percentage used above 100, and over-budget true

#### Scenario: No spend this month
- **WHEN** there are no current-month transactions for the budget's tag
- **THEN** the status reports spent as zero, remaining equal to the full limit, and percentage used as zero

#### Scenario: Prior-month spend is excluded
- **WHEN** transactions tagged with the budget's tag exist in a previous month but not the current month
- **THEN** those transactions are not counted and the status reports the current month as having no spend

### Requirement: Budget listing surfaces remaining or overspend
The system SHALL present each budget in a listing showing the tag name, the monthly limit, the amount spent this month, and either the remaining amount to spend or, when the limit is exceeded, the amount over budget. The listing SHALL include a progress indicator reflecting the percentage of the limit used, capped at 100% for display, with severity styling that escalates as usage approaches and exceeds the limit.

#### Scenario: Listing shows remaining amount
- **WHEN** a budget is under its monthly limit
- **THEN** the listing shows the remaining amount to spend and a progress bar below 100%

#### Scenario: Listing shows over-budget amount
- **WHEN** a budget is over its monthly limit
- **THEN** the listing shows the amount over budget with an over-budget indicator and a progress bar capped at 100% with the highest severity styling

#### Scenario: Empty state
- **WHEN** the user has no budgets
- **THEN** the listing shows an empty-state message prompting the user to create a budget

### Requirement: Manage budgets
The system SHALL allow a user to update a budget's monthly limit and to delete a budget. Deleting a tag SHALL cascade to delete its budget.

#### Scenario: Update the monthly limit
- **WHEN** a user updates an existing budget's limit to a new positive value
- **THEN** the system persists the new limit and subsequent status reflects it

#### Scenario: Delete a budget
- **WHEN** a user deletes a budget they own
- **THEN** the system removes it and it no longer appears in the listing

#### Scenario: Tag deletion cascades
- **WHEN** a tag that has a budget is deleted
- **THEN** the associated budget is also deleted
