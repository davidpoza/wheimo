## Why

The desktop sidebar always takes up 240px of horizontal space regardless of user preference, limiting content area on smaller screens or for users who prefer a more compact layout. Adding a collapse toggle lets users reclaim that space while keeping navigation accessible via icons.

## What Changes

- Add a collapse toggle button to the sidebar (desktop only)
- When collapsed, sidebar shrinks to icon-only mode (~64px wide) — text labels hidden, only icons shown
- The collapse state persists across page navigations (stored in `localStorage`)
- Tooltip on hover when collapsed to identify nav items
- Logo in header condenses to an icon or monogram when collapsed
- Footer user name hidden when collapsed; profile button remains

## Capabilities

### New Capabilities

- `collapsible-sidebar`: Toggle the desktop sidebar between expanded (240px with icons + labels) and collapsed (64px, icons only) states, with persistence via localStorage and tooltips for collapsed items.

### Modified Capabilities

<!-- No existing spec requirements are changing -->

## Impact

- `app-layout.component.ts` — add collapse signal and localStorage persistence
- `app-layout.component.html` — conditional classes and tooltip directives
- `app-layout.component.scss` — collapsed-state styles, CSS transitions
- PrimeNG `TooltipModule` needed for collapsed nav item tooltips
