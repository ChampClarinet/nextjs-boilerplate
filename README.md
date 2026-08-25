# Next.js Boilerplate

A reusable, domain-neutral Next.js application boilerplate built on a **Tailwind CSS + shadcn/ui foundation**, with modern development conventions and tooling already configured.

Tailwind CSS provides the styling and semantic-token foundation, while local shadcn/ui primitives provide the primary UI component foundation. Consuming applications should normally build their product UI by composing and extending these foundations rather than introducing a parallel design system.

The repository intentionally provides application foundations rather than product-specific business logic. New projects should extend the existing structure, design system, and development workflow instead of rebuilding those foundations from scratch.

## Included Stack

- Next.js 16 App Router
- React 19
- TypeScript with strict configuration
- Bun for package management and script execution
- Tailwind CSS 4
- shadcn/ui-style local primitives
- Base UI and selected Radix primitives
- next-themes for light, dark, and system themes
- react-hook-form for forms
- TanStack React Table
- React DayPicker with Buddhist calendar support
- date-fns
- Lucide icons
- Motion
- Sonner notifications
- ESLint
- Prettier with import and Tailwind class sorting
- Husky and lint-staged
- Commitlint with Gitmoji conventional commits
- Docker build support
- Build metadata generation

Product-specific integrations such as authentication providers, databases, API clients, state management, or backend frameworks should be added by the consuming project when required.

## Requirements

- Bun 1.4.0 or newer
- A runtime compatible with the current Next.js version

The repository declares Bun as its package manager and should not introduce npm, pnpm, or Yarn lockfiles.

## Getting Started

Install dependencies:

```bash
bun install
```

Start the development server:

```bash
bun run dev
```

Create a production build:

```bash
bun run build
```

Start the production server:

```bash
bun run start
```

## Quality Commands

Run linting:

```bash
bun run lint
```

Run TypeScript validation:

```bash
bun run check-types
```

Format the repository:

```bash
bun run format
```

There is currently no dedicated automated test command. Consuming projects may introduce a test stack when their requirements justify it.

## Versioning

The boilerplate follows Semantic Versioning and begins in the `0.x` series while its reusable architecture and conventions are still evolving.

- **Patch** (`0.1.x`) — compatible fixes, dependency/tooling maintenance, and documentation corrections.
- **Minor** (`0.x.0`) — new reusable capabilities, components, tooling, or compatible architectural additions.
- **Major** (`x.0.0`) — breaking changes to the boilerplate's public architecture, conventions, or expected consuming-project integration.

The canonical version is stored in `package.json`. Release versions should also be represented by a matching Git tag such as `v0.1.0` and a corresponding release section in `CHANGELOG.md`.

Do not bump the boilerplate version on every pull request or routine change. Bump it intentionally as part of a release/versioning change after deciding the appropriate SemVer impact.

Consuming projects may record the boilerplate version they originated from when that provenance is useful, but they should maintain their own independent application version after creation.

## Project Structure

```text
app/                     Next.js App Router routes and layouts
src/components/          Reusable application components
src/components/atom/     Small reusable UI pieces
src/components/molecules Composed reusable controls and patterns
src/components/organisms Larger reusable UI sections
src/components/ui/       Local shadcn/ui primitives and wrappers
src/hooks/               Shared React hooks
src/layout/              Shared layout components
src/lib/                 Shared libraries and helpers
src/modules/             Product-specific modules added by consuming apps
src/providers/           Application-level providers
src/utils/               Shared utility functions
public/                  Static assets and generated build metadata
scripts/                 Build-time and repository scripts
```

Not every project needs every directory. Prefer the existing structure when an appropriate location already exists, and add new top-level architecture only when the project genuinely requires it.

## Design System

The boilerplate is design-system-driven and intentionally uses **Tailwind CSS + shadcn/ui as its UI foundation**.

Before creating new UI:

1. Inspect existing reusable components and local shadcn/ui primitives.
2. Reuse or compose an existing component when possible.
3. Add missing shadcn/ui primitives when the product requires them rather than replacing the foundation with another component system.
4. Use the semantic color tokens defined in `app/globals.css` rather than hardcoded colors.
5. Preserve light, dark, and system theme compatibility.
6. Keep product-specific UI inside the relevant module rather than promoting it to shared UI prematurely.

The boilerplate should remain visually adaptable. Consuming projects are expected to replace CI/brand tokens without rewriting component implementations.

## Source Comment Convention

The source intentionally supports **Better Comments-style markers** as lightweight visual guidance in editors that support the convention:

```ts
//! Important warning or constraint.
//? Explanation or implementation guidance.
//* Highlighted context worth noticing.
// TODO: Intentionally deferred work.
```

Keep useful markers when adapting the boilerplate. Comments should explain extension points, constraints, decisions, or non-obvious behavior rather than obvious syntax.

## Environment Files

The repository includes environment templates for development and production workflows.

Keep secrets and machine-specific values out of version control. When a consuming project introduces environment variables, document their names and purpose in `.env.example` and in that project's README when appropriate.

Do not commit credentials, private keys, access tokens, database passwords, or production secrets.

## Build Metadata

`bun run build` runs the `prebuild` script:

```text
scripts/generate-sw-version.mjs
```

The script generates build metadata used by the application, including `public/version.json`.

## Docker

A `Dockerfile` is included as a reusable deployment foundation. Consuming projects may extend the deployment setup for their target infrastructure without coupling the boilerplate itself to a specific hosting provider or backend service.

## Git Workflow

The repository uses Husky, lint-staged, Commitlint, and Gitmoji conventional commits.

Commit messages must follow the repository's configured convention. For example:

```text
📝 docs: update boilerplate documentation
✨ feat: add reusable application capability
🐛 fix: correct shared component behavior
```

Use feature, release, or hotfix branches as appropriate for the repository workflow rather than bypassing protected-branch hooks.

## Documentation

- `README.md` describes the reusable boilerplate and contributor-facing setup.
- `AGENTS.md` defines implementation and design-system rules for coding agents.
- `CHANGELOG.md` records meaningful contributor-visible, architectural, operational, and user-visible changes.
- `CLAUDE.md` may provide agent-specific entry-point guidance while `AGENTS.md` remains the canonical repository-wide instruction set.

## Using This Boilerplate

When starting a product from this repository:

1. Create or copy the project from the boilerplate.
2. Replace project metadata and branding.
3. Define the project's CI colors and semantic design tokens.
4. Continue using the Tailwind CSS + shadcn/ui foundation unless the product has a deliberate reason to adopt another UI architecture.
5. Add only the infrastructure required by that product, such as authentication, API, database, or deployment integrations.
6. Add business features under `src/modules` and wire route entry points through `app/`.
7. Update the product README and changelog so they describe the resulting application rather than the boilerplate.

Avoid adding speculative infrastructure to this repository merely because a future project might need it. The goal is a small, current, reusable foundation that can be extended deliberately.

## Maintenance Principles

- Keep dependencies current and intentional.
- Keep the boilerplate domain-neutral.
- Preserve Tailwind CSS + shadcn/ui as the default UI foundation.
- Prefer reusable foundations over example business features.
- Avoid multiple competing patterns for the same concern.
- Preserve readable, maintainable code over premature abstraction.
- Keep documentation synchronized with meaningful architectural and workflow changes.

See `AGENTS.md` for the complete contributor and coding-agent rules.