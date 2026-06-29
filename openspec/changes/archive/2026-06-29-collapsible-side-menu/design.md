## Context

The app uses a single `AppLayoutComponent` with a fixed-width 240px sidebar for desktop navigation. The sidebar is pure HTML/CSS with Angular signals — no third-party sidebar component. PrimeNG is available for UI primitives (Tooltip, etc.). State lives in component signals today; persistence will use `localStorage`.

## Goals / Non-Goals

**Goals:**
- Toggle sidebar between expanded (240px) and collapsed (64px, icon-only) on desktop
- Persist collapse state in `localStorage` so it survives page reload
- Show PrimeNG tooltips on nav items when collapsed
- Smooth CSS transition on collapse/expand

**Non-Goals:**
- Mobile behavior is unchanged (mobile uses a Drawer overlay, not the sidebar)
- No user-account-level persistence (localStorage per browser is sufficient)
- No animation beyond a simple CSS width/opacity transition

## Decisions

### 1. Signal-based state + localStorage persistence

Use an Angular `signal<boolean>` (`sidebarCollapsed`) initialized from `localStorage.getItem('sidebar-collapsed')`. On toggle, update the signal and write back to localStorage.

**Alternative considered**: a shared service. Rejected — only one component uses this state, so a service adds unnecessary indirection.

### 2. CSS class toggle approach

Add a `collapsed` class to `.sidebar` (via `[class.collapsed]="sidebarCollapsed()"`) and drive all visual changes from SCSS. This keeps logic minimal and transitions declarative.

### 3. PrimeNG `pTooltip` for collapsed labels

When collapsed, nav item text is hidden but icons remain. `pTooltip` (PrimeNG) displays the item label on hover. `tooltipPosition="right"` keeps it visible outside the narrow sidebar.

**Alternative**: custom tooltip. Rejected — PrimeNG is already a dependency.

### 4. Toggle button placement

A small `<p-button>` with a chevron icon (`pi-chevron-left` / `pi-chevron-right`) at the bottom of the sidebar header, aligned right. Clicking it toggles the state.

## Risks / Trade-offs

- [CSS transition width change] may cause layout reflow on large pages → Mitigation: use `transition: width 0.2s ease` and `overflow: hidden` on sidebar to avoid content flicker.
- [localStorage unavailable] in private browsing or restricted environments → Mitigation: wrap read/write in try/catch; default to expanded.
- [Icon-only mode accessibility] — screen readers need nav item labels → Mitigation: keep `<span>` in DOM but visually hide with `visibility: hidden`/`width: 0` rather than removing; `aria-label` on the link is the icon class label which PrimeNG resolves; tooltips are supplemental.
