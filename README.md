# VIP Admin UI

VIP Admin UI is a Next.js frontend for security service administration workflows. It provides the authenticated admin shell, Frappe OAuth login integration, shared layout/navigation, and the route structure for VIP operational modules.

The current repository is early-stage but no longer a generic `create-next-app` scaffold. Treat the product surface as VIP Admin and keep new work aligned with the existing App Router, shadcn-style primitives, Tailwind utilities, and Frappe-backed authentication flow.

## Current Status

VIP Admin UI is an active frontend application focused on authenticated security service management.

Currently implemented:

- Frappe OAuth authorization-code login entry point.
- OAuth callback route that exchanges the code for access, refresh, and ID tokens.
- Cookie-backed auth storage for access, refresh, and ID tokens.
- Authenticated App Router layout that loads the current Frappe OpenID profile.
- Token refresh support for server-side profile loading and client-side Axios requests.
- Logout route and navbar sign-out action that clear auth cookies and return to `/login`.
- Authenticated application shell with collapsible sidebar, navbar, theme toggle, user affordance, and padded main content area.
- Shared scroll handling for authenticated pages through `PageScroll`.
- Reusable atom components for status indicators, no-data placeholders, and toggle badges.
- Reusable molecule components for search, loading dialogs, comboboxes, date pickers, and date-range pickers.
- Reusable TanStack-backed data table organism with pagination and empty-state handling.
- Expanded shadcn-style primitive set for badges, calendar, cards, checkbox, command menu, dialog, input groups, popover, scroll area, select, spinner, table, tabs, and textarea.
- Protected `/stock` module with stock management, stock transactions, and stock reporting workflows.
- Stock summary cards for product types, total items, borrowed items, and below-minimum items.
- Stock filtering by opening date, search text, category, and below-minimum status.
- Stock table showing product, category, available/total, stock status, opening, incoming, outgoing, and current counts.
- Sidebar route configuration for VIP Admin modules:
  - `/visitor-management`
  - `/patrol-management`
  - `/human-resources`
  - `/shift-attendance`
  - `/training-course`
  - `/stock`
  - `/check-billing`
  - `/payroll`
- Root redirect flow:
  - unauthenticated users go to `/login`
  - authenticated users go to `/home`
  - `/home` redirects to `/stock`
- Docker deployment script for validated image builds and Compose-based deployment.
- Build metadata generation through `public/version.json`.

Currently partial or scaffolded:

- Sidebar module routes other than `/stock` are navigation targets, but their page implementations are not present in the repository yet.
- The navbar user label is static (`Super Admin`) even though the authenticated Frappe user profile is available in context.
- The production Traefik labels in `docker-compose.yml` are placeholders pending backend/infrastructure confirmation.
- There is no `.env.example` in the repository today, so required environment values must be supplied manually.
- There is no dedicated test script in `package.json`.

## Product Surface

### Authentication

The app uses Frappe OAuth:

1. The public login page builds an OAuth authorize URL from the incoming request origin.
2. The login button redirects the user to the Frappe OAuth authorize endpoint.
3. Frappe redirects back to `/auth/callback` with an authorization code.
4. The local callback route exchanges that code at the Frappe token endpoint.
5. Access, refresh, and ID tokens are stored in cookies.
6. Authenticated layouts call the Frappe OpenID profile endpoint before rendering protected content.
7. Expired tokens are refreshed through `/auth/refresh-token`.
8. Invalid or expired sessions are cleared and redirected to `/login`.

### Main Modules

The sidebar defines the intended VIP Admin modules:

- `Visitor Management`
- `Patrol Management`
- `Human Resources`
- `Shift & Attendance`
- `Training Course`
- `Stock`
- `Check & Billing`
- `Payroll`

Currently implemented:

- `Stock`: security equipment inventory workflows covering stock management, stock transactions, and stock reports.

The default authenticated landing route is:

```text
/stock
```

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Bun for package management and script execution
- Tailwind CSS
- shadcn/ui style primitives
- Base UI
- Radix Checkbox
- TanStack React Table
- React DayPicker with Buddhist calendar support
- cmdk command menu primitives
- date-fns
- lucide-react icons
- next-themes-compatible local theme provider
- React Context for authenticated user state
- Axios for client-side API calls
- Frappe OAuth/OpenID backend integration

## Project Structure

```text
app/                     Next.js app router pages, layouts, and auth routes
src/apis/                Client and server API helpers
src/components/atom/     Small reusable UI elements
src/components/molecules Combined reusable controls and UI patterns
src/components/organisms Navbar, sidebar, data table, and larger UI sections
src/components/ui/       Local shadcn-style primitives
src/config/              Auth, redirect, and sidebar configuration
src/features/auth/       Auth cookie keys and user context
src/hooks/               Shared React hooks
src/layout/              Shared authenticated layout and page scrolling
src/lib/                 General library helpers
src/modules/             Product modules and feature-specific UI
src/providers/           App-level providers
src/utils/               Utility helpers
public/                  Static assets and generated version metadata
scripts/                 Build-time scripts
```

Module implementations live under `src/modules/<module-name>` and are wired into protected App Router pages under `app/(auth)/<route>/page.tsx`.

## Environment Variables

The app expects these variables to exist:

| Variable                          | Required           | Purpose                                                                |
| --------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_FRAPPE_API_URL`      | Yes                | Base URL for Frappe OAuth, OpenID profile, and API calls               |
| `NEXT_PUBLIC_CLIENT_ID`           | Yes                | Frappe OAuth client ID                                                 |
| `NEXT_PUBLIC_CLIENT_URL`          | Yes                | Public app URL used as the OAuth callback redirect base                |
| `NEXT_PUBLIC_SERVER_LOOPBACK_URL` | Production runtime | Internal loopback URL used by server actions to call local auth routes |
| `COMMIT_SHA`                      | Optional build arg | Fallback used when Git metadata is unavailable during builds           |
| `BRANCH`                          | Optional build arg | Fallback used when Git metadata is unavailable during builds           |
| `VIP_ADMIN_ENV_FILE`              | Optional build arg | Environment file selected for the Docker build                         |
| `IS_BUILD`                        | Build-time         | Set by the build script to adjust loopback behavior during Next build  |

## Local Development

### Prerequisites

- Node.js 24+
- Bun 1.3.x

### Install

```bash
bun install
```

### Run The App

```bash
bun run dev
```

The app runs on:

```text
http://localhost:5173
```

### Useful Scripts

```bash
bun run dev
bun run build
bun run start
bun run lint
bun run check-types
bun run format
bun run commit
```

## Build And Deployment

### Production Build

```bash
bun run build
bun run start
```

The build automatically runs:

```text
scripts/generate-sw-version.mjs
```

This creates:

- `public/version.json`

`version.json` includes the app version, commit SHA, branch, and build timestamp.

### Docker

Build and deploy to production:

```bash
./deploy.sh --env prod
```

Build and deploy to development:

```bash
./deploy.sh --env dev
```

Build and deploy to production with a custom version:

```bash
./deploy.sh --env prod v1.2.0
```

Build and deploy without Docker cache:

```bash
./deploy.sh --env prod --no-cache
```

Build and deploy while keeping older images:

```bash
./deploy.sh --env prod --keep
```

Show deployment options:

```bash
./deploy.sh --help
```

For Docker deployments, the application runs on port `3000` inside the container. `docker-compose.yml` exposes it through `VIP_ADMIN_PORT`.

## Quality Checklist

Before finishing UI work:

- Existing shadcn-style primitives were checked first.
- Existing navbar/sidebar/layout patterns were reused where possible.
- Existing atom, molecule, and organism components were reused before adding new module-specific UI.
- Tailwind utilities and existing CSS variables were preferred over inline styles.
- Auth behavior was checked against the Frappe OAuth flow.
- Stock module changes were checked against the current mock-backed table/filter workflow.
- Responsive layout was checked for sidebar and main content changes.
- `bun run lint` and `bun run check-types` pass, or known issues are explained.

## Notes And Gaps

- Sidebar modules other than Stock still need to be implemented.
- The app currently uses cookie-stored OAuth tokens. Review cookie flags and backend expectations before hardening production auth.
- The navbar should eventually render the authenticated user's real name or role from `UserProvider`.
- Add `.env.example` once deployment values and naming are stable.
- Add automated tests for module behavior and critical workflows.
