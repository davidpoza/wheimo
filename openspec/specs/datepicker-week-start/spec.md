## ADDED Requirements

### Requirement: Datepickers start week on Monday
All `p-datepicker` instances in the application SHALL display the calendar with Monday as the first day of the week.

#### Scenario: Calendar week header starts on Monday
- **WHEN** the user opens any datepicker in the application
- **THEN** the first column of the calendar grid SHALL be Monday (not Sunday)

#### Scenario: All datepicker instances are consistent
- **WHEN** the user opens datepickers in different views (transactions filter, create transaction, assign transaction, price history, recurrents list)
- **THEN** all of them SHALL show Monday as the first day of the week
