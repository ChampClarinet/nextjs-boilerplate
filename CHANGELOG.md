# Changelog

All notable changes to this project will be documented in this file.

This project loosely follows the principles of [Keep a Changelog](https://keepachangelog.com/) and Semantic Versioning. Until the first public release, changes may be grouped under **Unreleased**.

---

## [Unreleased]

### Sprint 2026-08-24 - `feature/stock-management`

#### Added

- Added the application version and build metadata to the sidebar.

#### Fixed

- Fixed sidebar icon typing so configured icons resolve to a valid Lucide component.
- Fixed stock price detail and stock transaction requests to send full stock condition labels instead of numeric condition values.
- Fixed stock transaction detail Excel export to download the generated file from the dialog.

#### Changed

- Updated the sidebar version footer to load build metadata only from `/version.json`.
- Split the stock transaction details dialog into focused content and tile components.
- Updated the stock report type option from date/category grouping to employee reporting.
- Updated stock list filtering to use a date range for the `get_all_stock` request.
- Updated stock transaction Excel export to use the PO export endpoint.

### Sprint 2026-08-21 - `feature/stock-management`

#### Added

- Added stock and stock transaction report subtabs with API-backed filters and report tables.

#### Changed

- Updated stock module tabs to use the shared tabs primitive while preserving the existing visual treatment.
- Refined stock report subtab navigation hierarchy with smaller secondary tab styling and icons.

### Sprint 2026-08-17 - `feature/stock-management`

#### Added

- Added the protected `/stock` page and wired it to the new `StockModule`.
- Added a live API-backed Security Equipment Stock dashboard with product-type, total-item, borrowed-item, and below-minimum summary cards from `get_stock_stats`.
- Added stock filters for opening date, product/category search, category selection, and below-minimum-only display.
- Added stock movement presentation for incoming, outgoing, opening, current, and available/total counts.
- Added visual affordances for Stock, Purchase Orders, Stock History, Add Product, and Purchase Orders actions.
- Added stock table binding for `get_all_stock`, including Thai stock creation dates, availability totals, condition detail dialog, and row click details.
- Added create-stock dialog and API wiring for `create_stock`.
- Added borrow/return stock transaction dialog scaffolding with employee lookup, stock lookup, stock condition lookup, transaction number lookup, editable stock-detail rows, and calculated condition/net prices.
- Added update-stock support using the new stock API contract, including size, cost price, selling price, stock minimum, order minimum, optional image replacement, and remove-image handling.
- Added borrow/return stock API submission through `borrow_stock` and `return_stock`.
- Added stock transaction price lookup through `get_stock_price_details` after product and condition selection, with remaining stock, selling price, condition price, and net price calculation.
- Added department lookup and combobox display for `GIR ใบเบิกส่วนกลาง`, plus issuer name and return reason fields.

#### Changed

- Updated combobox and date picker popover triggers to use the current render-prop trigger composition.
- Updated combobox options to support custom option rendering for two-line employee display.
- Updated stock create/update and stock transaction forms to use `react-hook-form`.
- Updated stock transaction prerequisite loading so stock, condition, employee, and department requests run in parallel without blocking each other on one failed request.
- Updated stock transaction amount validation so requested quantity cannot exceed the fetched remaining stock.
- Consolidated Docker build and deployment workflow into `deploy.sh` with environment, branch, working-tree, and remote synchronization validation.
- Updated project documentation to reflect the current Stock module implementation and deployment workflow.

### Sprint 2026-08-17 - `feature/stock-ui-primitives`

#### Added

- Added shared atom components for status indicators, no-data placeholders, and toggle badges.
- Added shared molecule components for search, loading dialogs, comboboxes, date pickers, and date-range pickers.
- Added a TanStack-backed data table organism with pagination and empty-state handling.
- Added shadcn-style primitives for badges, calendar, cards, checkbox, command menu, dialog, input groups, popover, scroll area, select, spinner, table, tabs, and textarea.
- Added `PageScroll` as the shared authenticated page scroll wrapper.
- Added `addCommaInNumber` for reusable number formatting.

#### Changed

- Updated the authenticated main layout to use the shared page scroll wrapper and container query naming.
- Added table, calendar, command-menu, checkbox, and date utility dependencies needed by the new UI foundation.

### Sprint 2026-08-17 - `chore/project-paperwork`

#### Documentation

- Rewrote `README.md` for VIP Admin UI, replacing the generated Next.js scaffold text with the current auth flow, app shell, module map, environment variables, local workflow, and deployment notes.
- Updated the docs to reflect the `develop` branch's reusable UI/component foundation.
- Started `CHANGELOG.md` using the same project-paperwork format as `club21`.

### Known Gaps

- Sidebar module routes other than `/stock` are configured, but their protected module pages still need to be implemented.
- Purchase-order and stock-history tabs are visual placeholders only.
- The navbar still shows a static `Super Admin` label instead of rendering the authenticated Frappe user.
- Production Traefik labels are placeholders pending infrastructure confirmation.
- There is no `.env.example` or dedicated test script yet.

---

## [0.1.0] - 2026-08-17

Initial documented project snapshot for the current VIP Admin UI codebase.

### Added

- Next.js App Router frontend scaffold for VIP Admin UI.
- Frappe OAuth login page and callback route for authorization-code token exchange.
- Cookie-backed access, refresh, and ID token storage.
- Authenticated layout that loads the Frappe OpenID profile before rendering protected content.
- Token refresh support for server-side auth checks and client-side Axios requests.
- Logout route and navbar sign-out action.
- Collapsible authenticated admin shell with sidebar navigation, navbar, theme toggle, and padded main content area.
- Sidebar entries for Visitor Management, Patrol Management, Human Resources, Shift & Attendance, Training Course, Stock, Check & Billing, and Payroll.
- Root, login, callback, refresh-token, signout, and authenticated home redirect routes.
- Dockerfile, Docker Compose setup, and helper scripts for building and restarting the VIP Admin frontend container.
- Build metadata generation through `public/version.json`.

### Known Gaps

- Protected module page implementations other than `/stock` are not present yet.
- The authenticated home flow redirects to `/stock`, which is currently mock-backed.
- The navbar user display is static.
- Environment values must be supplied manually because no `.env.example` exists yet.
- No project test script is defined.
