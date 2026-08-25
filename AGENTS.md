# AGENTS.md

## Project Overview

This repository is a reusable, domain-neutral Next.js + TypeScript boilerplate built on a **Tailwind CSS + shadcn/ui foundation**.

Tailwind CSS provides the styling and design-token layer, while local shadcn/ui primitives provide the primary component foundation. Build product UI by composing and extending that foundation rather than introducing a parallel design system.

Its purpose is to provide a current application foundation, development workflow, and reusable UI conventions without coupling the codebase to any specific product, authentication provider, backend, database, or business domain.

Agents must preserve that neutrality when changing the boilerplate itself. Product-specific infrastructure and business logic belong in consuming projects unless they are intentionally being promoted into the shared foundation.

## Core Principles

- Prefer readable, maintainable code over clever abstractions.
- Reuse existing components, hooks, utilities, and patterns before creating new ones.
- Keep the boilerplate domain-neutral.
- Treat Tailwind CSS + shadcn/ui as the default UI foundation.
- Follow the existing design system and semantic color tokens.
- Prefer composition over duplication.
- Avoid speculative infrastructure that only a future project might need.
- Keep client components scoped to the smallest practical boundary; do not add `"use client"` unnecessarily.
- Do not split trivial markup into standalone components unless the extraction improves reuse, readability, testing, or responsibility boundaries.
- Avoid unrelated refactors while implementing a focused task.

## Tech Stack

The current boilerplate includes:

- Next.js App Router
- React
- TypeScript
- Bun
- Tailwind CSS
- shadcn/ui-style local primitives
- Base UI and selected Radix primitives
- next-themes
- react-hook-form
- TanStack React Table
- ESLint
- Prettier
- Husky
- lint-staged
- Commitlint with Gitmoji conventional commits

Do not introduce a new framework or competing library for an existing concern without a clear benefit.

## Important Commands

Use Bun for dependency management and project scripts.

```bash
bun run dev
bun run build
bun run start
bun run lint
bun run check-types
bun run format
```

There is currently no required automated test command. Consuming projects may add an appropriate test stack when their requirements justify it.

Documentation-only work may skip lint and type checking when no executable source or configuration is changed.

## Repository Structure

Main application routes live under:

```text
app/
```

Shared source code lives under:

```text
src/
```

Common locations include:

```text
src/apis/                Shared API helpers when a project needs them
src/components/atom/     Small reusable UI pieces
src/components/molecules Composed reusable controls and patterns
src/components/organisms Larger reusable UI sections
src/components/ui/       Local shadcn/ui primitives and wrappers
src/config/              Shared application configuration
src/hooks/               Shared React hooks
src/layout/              Reusable layout components
src/lib/                 Shared libraries and helpers
src/modules/             Product-specific feature modules
src/providers/           Application-level providers
src/utils/               Shared utility functions
```

Not every consuming project needs every directory. Prefer an existing appropriate location before introducing new top-level architecture.

## Decision Hierarchy

When multiple solutions are viable, prefer:

1. Existing component
2. Existing pattern
3. Existing utility
4. Existing hook
5. Small reusable abstraction
6. New implementation

Do not create an abstraction only to satisfy this hierarchy. A direct implementation is preferable when reuse or separation would not improve the code.

## Expected Agent Workflow

1. Read the relevant route, module, component, and configuration before editing.
2. Inspect existing reusable components and patterns.
3. Confirm whether the change belongs in the boilerplate or only in a consuming product.
4. Implement the smallest maintainable change.
5. Preserve existing architecture unless there is a clear reason to change it.
6. Update documentation and `CHANGELOG.md` when required.
7. Run relevant validation commands unless the task is documentation-only.
8. Summarize the change, validation performed, and any remaining limitations.

## Architecture Principles

- Keep route entry points in `app/`.
- Keep product-specific business logic inside `src/modules`.
- Keep reusable UI inside `src/components`.
- Keep shared hooks inside `src/hooks`.
- Keep shared utilities pure whenever practical.
- Avoid circular dependencies.
- Prefer composition over inheritance.
- Avoid components that unnecessarily mix data fetching, state orchestration, layout, and low-level UI.
- Do not create parallel architectural patterns for the same concern without an explicit migration plan.
- Server Components are preferred where practical; introduce Client Components only when browser APIs, event handlers, client state, or client-only libraries require them.

## Component Rules

Before creating a component:

1. Search `src/components` and the relevant module for an existing implementation.
2. Prefer extending or composing existing primitives.
3. Keep genuinely reusable UI in `src/components`.
4. Keep module-specific UI close to its feature under `src/modules/<module-name>`.
5. Extract a component only when it creates a meaningful responsibility boundary or reuse opportunity.

Use these rough boundaries:

- `src/components/atom`: smallest reusable UI pieces.
- `src/components/molecules`: combinations of primitives or atoms.
- `src/components/organisms`: larger reusable UI sections.
- `src/components/ui`: local shadcn/ui primitives and wrappers.
- `src/layout`: reusable layout-level components.
- `src/modules`: consuming-product feature implementations.

Atomic design is a guide, not a requirement to split every visual fragment into its own file.

## Styling and Design-System Rules

This boilerplate is intentionally built from a **Tailwind CSS + shadcn/ui foundation**. Treat these as the default styling and component architecture for consuming applications.

Prefer Tailwind CSS and the existing local component primitives.

Do:

- Use semantic design tokens and CSS variables.
- Preserve light, dark, and system theme compatibility.
- Use Tailwind utility classes for layout and styling.
- Compose local shadcn/ui primitives before creating custom replacements.
- Prefer `grid` and `flex` for normal layout.
- Keep repeated styling centralized when doing so improves consistency.
- Treat CI/brand colors as replaceable tokens rather than component-level constants.

Avoid:

- Hardcoded hex, rgb, hsl, or arbitrary color values when a semantic token fits.
- Inline styles without a functional reason.
- Duplicated spacing or layout systems.
- Fixed pixel-heavy layouts that harm responsiveness.
- Absolute positioning for ordinary document layout.
- Introducing a second component/design-system foundation alongside shadcn/ui without an explicit architectural reason.

If a consuming project changes brand colors, update the centralized design tokens rather than rewriting component implementations.

## shadcn/ui Rules

Local shadcn/ui primitives live under:

```text
src/components/ui
```

Before adding a primitive:

1. Check whether it already exists locally.
2. Reuse the local component when available.
3. Add a missing shadcn/ui primitive only when the feature requires it.
4. Keep new primitives consistent with the repository's existing setup and tokens.

Do not install unrelated UI libraries merely to avoid composing existing components.

## Comment Conventions

This repository intentionally uses **Better Comments-style markers** in source comments. Preserve these markers when they communicate useful intent; do not normalize or remove them merely for stylistic consistency.

Use them purposefully:

```ts
//! Important warning, constraint, or behavior that is easy to misuse.
//? Explanation, implementation guidance, or a decision that may not be obvious from the code.
//* Highlighted context or noteworthy implementation detail.
// TODO: Work that is intentionally deferred and should be implemented later.
```

Examples in boilerplate code should remain provider- and product-neutral:

```ts
//? Add authentication logic for the consuming application here.
//! Never expose server-only credentials through client-accessible environment variables.
//* Keep this boundary provider-agnostic so consuming projects can choose their own implementation.
```

Comments should explain **why, constraints, extension points, or non-obvious behavior**. Do not comment obvious syntax, and do not leave inherited product-specific notes in reusable boilerplate code.

## Form Rules

Use `react-hook-form` for non-trivial client-side forms unless a consuming project intentionally adopts another pattern.

Prefer nearby reusable field and validation patterns before introducing new abstractions. Keep form state scoped to the form and avoid coupling it to unrelated presentation components.

## Import Rules

Prefer configured aliases over deep relative imports.

Group imports consistently:

1. React and framework imports
2. Third-party packages
3. Internal aliases
4. Relative imports

Remove unused imports before finishing.

## File and Naming Rules

Follow nearby naming conventions.

Keep related files close to the component or module they belong to. Do not move files unless the move clearly improves the architecture or is part of an intentional migration.

Prefer descriptive names over generic names such as `helper`, `data`, or `utils2` when the responsibility can be expressed more clearly.

## Performance Guidelines

- Avoid unnecessary re-renders.
- Do not add memoization without evidence or a clear reason.
- Avoid duplicate network requests.
- Prefer server-side data loading when it naturally fits the route and interaction model.
- Keep client-side state local unless state genuinely needs to be shared.
- Do not introduce global state management preemptively.

## Environment and Secrets

- Never commit credentials, private keys, access tokens, database passwords, or production secrets.
- Document introduced environment variable names in `.env.example`.
- Keep provider-specific environment configuration in consuming projects unless it is genuinely part of the reusable foundation.
- Do not hardcode deployment domains or service endpoints into reusable code.

## Versioning and Releases

The boilerplate follows Semantic Versioning. While the reusable architecture and conventions are still evolving, releases may remain in the `0.x` series.

- Patch: compatible fixes, maintenance, dependency/tooling updates, and documentation corrections.
- Minor: new reusable capabilities, components, tooling, or compatible architectural additions.
- Major: breaking changes to public architecture, conventions, or consuming-project integration expectations.

The canonical version lives in `package.json`. A release should use a matching `vX.Y.Z` Git tag and move the relevant changelog entries from `Unreleased` into a versioned release section.

Do **not** bump the version automatically for every task, commit, or pull request. Change it only when the task explicitly includes preparing or publishing a release/version, or when the user explicitly requests a version bump.

Do not create Git tags or GitHub Releases unless the user explicitly asks for them.

Consuming applications maintain their own application versions. Recording the originating boilerplate version is optional provenance metadata, not a requirement to keep the consuming application version synchronized with this repository.

## Documentation and Changelog Rules

Agents must keep repository documentation aligned with meaningful changes.

### When to Update `CHANGELOG.md`

Update `CHANGELOG.md` when a change is user-visible, contributor-visible, architectural, or operationally meaningful.

Examples include:

- New route, page, module, reusable component, or major UI section.
- Significant behavior or architecture changes.
- API, authentication, state-management, build, deployment, Docker, PWA, or environment changes.
- Bug fixes that affect users or developer workflow.
- Documentation changes that materially affect onboarding or contribution workflow.

Minor internal refactors do not require a changelog entry unless they materially affect maintainability, architecture, or public behavior.

### Where to Write Changelog Entries

Add unreleased entries under:

```md
## [Unreleased]
```

Group unreleased entries by sprint date first, then category:

```md
## [Unreleased]

### Sprint YYYY-MM-DD

#### Added

#### Changed

#### Fixed

#### Documentation

#### Known Gaps
```

Only include category headings that have entries. Keep sprint sections newest to oldest and do not create duplicate sections for the same sprint date.

Use the sprint date associated with the work, not merely the date the changelog was edited.

### Changelog Categories

- `Added`: new capability, route, component, feature, script, or documentation file.
- `Changed`: changed behavior, structure, workflow, styling convention, or implementation approach.
- `Fixed`: corrected behavior or developer workflow.
- `Documentation`: README, AGENTS, contributor guidance, or other documentation changes.
- `Known Gaps`: intentionally incomplete behavior, placeholders, or integration gaps.

### Changelog Writing Style

Keep entries short, specific, and focused on impact rather than file-level implementation noise. Merge repetitive bullets that describe the same outcome.

Write entries in past tense where practical.

Before finishing a task, check whether a changelog update is required. If a meaningful code, architecture, design-system, documentation, or workflow change was made, update the changelog in the same change set.

## Git and Commit Rules

Use the repository's Gitmoji + Conventional Commit format. Follow the configured Commitlint rules rather than inventing a different commit style.

Do not bypass protected-branch hooks or validation unless the user explicitly directs repository-history maintenance outside the normal workflow.

## Anti-Patterns

Do not:

- Add product-specific business rules to the shared boilerplate without an explicit reason.
- Duplicate components that already exist.
- Create tiny one-off components that add indirection without value.
- Add `"use client"` to files that do not require client behavior.
- Hardcode brand colors inside reusable components.
- Introduce a new state-management or UI library without strong justification.
- Add speculative backend, database, authentication, or deployment infrastructure to the boilerplate.
- Mix unrelated refactors into a focused task.
- Create large components that combine unrelated responsibilities.
- Leave documentation describing removed or product-specific behavior.
- Remove purposeful Better Comments markers merely to normalize comment style.

## Final Check

Before completing work, verify:

- Existing reusable code was used where appropriate.
- The boilerplate remains domain-neutral unless the task explicitly changes that goal.
- Tailwind CSS + shadcn/ui remain the default UI foundation unless the task explicitly changes that architecture.
- No unnecessary Client Components or abstractions were introduced.
- Purposeful Better Comments markers were preserved.
- Semantic design tokens were preserved.
- Documentation and changelog entries are current.
- Relevant lint, type, build, or other validation passed, or known failures are explained.

## Final Response Format

When finishing a task, summarize:

- What changed
- Relevant reuse or architectural decisions
- Validation performed
- Changelog updates
- Intentional deviations or remaining TODOs
