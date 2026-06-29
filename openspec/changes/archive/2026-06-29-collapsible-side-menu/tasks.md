## 1. Component Logic

- [x] 1.1 Add `sidebarCollapsed` signal to `AppLayoutComponent`, initialized from `localStorage` with try/catch fallback to `false`
- [x] 1.2 Add `toggleSidebar()` method that flips the signal and writes the new value to `localStorage`
- [x] 1.3 Import `TooltipModule` from PrimeNG in the component's `imports` array

## 2. Template Updates

- [x] 2.1 Add `[class.collapsed]="sidebarCollapsed()"` to the `.sidebar` `<aside>` element
- [x] 2.2 Add a collapse toggle `<p-button>` in `.sidebar-header` with chevron icon (`pi-chevron-left`/`pi-chevron-right` based on state) wired to `toggleSidebar()`
- [x] 2.3 Add `pTooltip` and `tooltipPosition="right"` to each nav item `<a>`, showing the translated label; use `[tooltipDisabled]="!sidebarCollapsed()"` so tooltips only show when collapsed

## 3. Styles

- [x] 3.1 Add `transition: width 0.2s ease` to `.sidebar` and define `.sidebar.collapsed` with `width: 64px; overflow: hidden`
- [x] 3.2 In `.sidebar.collapsed .nav-item span`, hide the label text (`width: 0; opacity: 0; overflow: hidden`)
- [x] 3.3 In `.sidebar.collapsed .sidebar-header .logo`, hide the text (show only icon/monogram or reduce opacity)
- [x] 3.4 In `.sidebar.collapsed .sidebar-footer .user-name`, hide user name text
- [x] 3.5 Center nav item icons when collapsed (remove gap or center `.nav-item` with `justify-content: center`)

## 4. Verification

- [x] 4.1 Manually verify expand/collapse toggle works and state persists on page reload
- [x] 4.2 Verify tooltips appear on hover when collapsed and are hidden when expanded
- [x] 4.3 Verify mobile layout (≤768px) is unaffected — toggle button not visible, drawer works normally
