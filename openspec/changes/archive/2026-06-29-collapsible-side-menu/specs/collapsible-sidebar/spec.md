## ADDED Requirements

### Requirement: Sidebar collapse toggle
The desktop sidebar SHALL provide a toggle button that collapses the sidebar to icon-only mode and expands it back to full width.

#### Scenario: User collapses the sidebar
- **WHEN** the user clicks the collapse toggle button in the sidebar
- **THEN** the sidebar SHALL shrink to ~64px wide, hiding all text labels and showing only icons

#### Scenario: User expands the sidebar
- **WHEN** the sidebar is collapsed and the user clicks the toggle button
- **THEN** the sidebar SHALL expand to 240px wide, showing icons and text labels again

### Requirement: Collapse state persistence
The sidebar collapse state SHALL be persisted in `localStorage` under the key `sidebar-collapsed` so it is restored on page reload.

#### Scenario: State survives navigation
- **WHEN** the user collapses the sidebar and navigates to a different route
- **THEN** the sidebar SHALL remain collapsed

#### Scenario: State survives reload
- **WHEN** the user collapses the sidebar and reloads the page
- **THEN** the sidebar SHALL load in the collapsed state

#### Scenario: localStorage unavailable
- **WHEN** `localStorage` is unavailable (e.g., private browsing restriction)
- **THEN** the sidebar SHALL default to expanded and no error SHALL be thrown

### Requirement: Tooltips in collapsed mode
When the sidebar is collapsed, each nav item SHALL display a tooltip showing its label on hover.

#### Scenario: Tooltip shown on hover
- **WHEN** the sidebar is collapsed and the user hovers over a nav item icon
- **THEN** a tooltip SHALL appear to the right of the icon with the nav item's text label

### Requirement: Mobile behavior unchanged
The collapse toggle and collapsed state SHALL only affect the desktop sidebar. The mobile header and drawer SHALL be unaffected.

#### Scenario: Mobile layout unaffected
- **WHEN** the viewport is 768px or narrower
- **THEN** the sidebar collapse toggle SHALL NOT be visible and the mobile header/drawer behavior SHALL remain the same
