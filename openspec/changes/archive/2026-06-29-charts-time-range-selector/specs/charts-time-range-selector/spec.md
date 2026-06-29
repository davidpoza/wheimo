## ADDED Requirements

### Requirement: Time range selector in charts page
The charts page SHALL display a time-range selector in its header that applies a single `from`/`to` date window to all chart sub-components (balance evolution, tag expenses, statistics).

#### Scenario: Default range is current month
- **WHEN** the user navigates to the charts page
- **THEN** the time-range selector SHALL default to "Current month" (from the 1st of the current month to today)

#### Scenario: User selects a preset
- **WHEN** the user picks a preset option (Current month, Last 3 months, Last 6 months, Last 12 months)
- **THEN** all charts SHALL reload with the corresponding `from`/`to` dates immediately

#### Scenario: User selects custom range
- **WHEN** the user picks "Custom" and chooses start and end dates from the date-range picker
- **THEN** all charts SHALL reload with the selected `from`/`to` dates once both dates are chosen

#### Scenario: Charts reflect selected range
- **WHEN** any time-range change is applied
- **THEN** the tag-expenses chart, statistics panel, and balance-evolution chart SHALL all use the same `from`/`to` values for their API calls

### Requirement: Child components accept from/to as inputs
`TagExpensesChartComponent` and `StatisticsComponent` SHALL accept `from` and `to` as Angular `input()` values and react to changes, replacing their internal hardcoded date calculations.

#### Scenario: Child re-fetches on input change
- **WHEN** the parent updates the `from` or `to` input
- **THEN** the child component SHALL trigger a new API request with the updated values

#### Scenario: Child does not fetch without valid inputs
- **WHEN** `from` or `to` is null or empty
- **THEN** the child component SHALL NOT make an API request
