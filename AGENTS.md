# AGENTS.md

## Project Overview

This repository is a Next.js + TypeScript frontend project using shadcn/ui, Tailwind CSS, Storybook, and Bun.

The UI is design-system-driven. Agents must treat existing Storybook stories, CI colors, and reusable components as the source of truth before creating or modifying UI.

## Core Principles

- Follow the existing design system.
- Prefer DRY, reusable, maintainable code.
- Use CI colors and existing design tokens.
- Follow atomic design structure where applicable.
- Prefer composition over duplication.
- Prefer improving the design system over bypassing it.
- Break the design system only when there is a clear functional reason.
- Avoid AI-generated one-off UI that does not match the repository style.

## Tech Stack

- Next.js
- TypeScript
- Bun
- Tailwind CSS
- shadcn/ui
- React Context
- react-hook-form for forms

## Important Commands

Use Bun for project scripts.

```bash
bun lint
```

There is currently no required test command.

## Repository Structure

Main application routes are under:

```txt
app/
```

Main source files are under:

```txt
src/
```

Reusable components are under:

```txt
src/components
```

Component groups follow atomic design:

```txt
src/components/atom
src/components/molecules
src/components/organisms
src/components/ui
```

## Decision Hierarchy

When multiple solutions are possible, prefer:

1. Existing component
2. Existing pattern
3. Existing utility
4. Existing hook
5. New reusable abstraction
6. New implementation

## Expected Agent Workflow

For UI tasks:

1. Understand the requested page, module, or component.
2. Inspect existing components in `src/components`.
3. Reuse or compose existing atoms, molecules, organisms, layout, and shadcn components.
4. Implement the smallest maintainable change.
5. Follow Tailwind/shadcn styling conventions.
6. Check whether documentation or `CHANGELOG.md` should be updated.
7. Run:

```bash
bun lint
```

but can be skipped in docs only job.

10. Summarize what changed and mention any intentional design-system deviation.

## Architecture Principles

- Prefer extending existing modules over creating new top-level folders.
- Keep route entry points in `app/`.
- Keep module-specific business logic inside `src/modules`.
- Keep reusable UI inside `src/components`.
- Keep shared utilities inside `src/utils`.
- Keep shared hooks inside `src/hooks`.
- Keep utility functions pure whenever possible.
- Avoid circular dependencies.
- Prefer composition over inheritance.
- Avoid mixing data fetching, state, layout, and low-level UI in one large component.

## Component Rules

Before creating a new component:

1. Search `src/components` for an existing atom, molecule, organism, layout, or shadcn component.
2. Prefer extending or composing existing components.
3. Do not duplicate components from old code or nearby files.
4. Keep components small and focused.
5. Put reusable UI in `src/components`.
6. Put page/module-specific UI inside the related `src/modules/<module-name>` folder.

Use this rough boundary:

- `src/components/atom`: smallest reusable UI pieces.
- `src/components/molecules`: combinations of atoms or shadcn components.
- `src/components/organisms`: larger reusable UI sections.
- `src/layout`: layout-level reusable components.
- `src/components/ui`: shadcn/ui primitives and wrappers.
- `src/modules`: feature/module-specific implementation.

## Styling Rules

Prefer Tailwind CSS and shadcn/ui.

Do:

- Use Tailwind utility classes.
- Use shadcn/ui components where possible.
- Use CI colors and existing tokens.
- Use `grid` and `flex` for layout.
- Keep class names readable.
- Extract repeated class patterns into reusable components or utilities when it improves maintainability.

Avoid:

- Hardcoded colors.
- Inline styles.
- Magic numbers.
- Duplicated layout logic.
- Absolute positioning unless necessary.

Absolute positioning is acceptable only when the UI genuinely requires layering or overlay behavior.

## Color and CI Rules

CI colors are part of the design system.

Before using a color:

1. Check `app/globals.css` for existing color system.
2. Check existing components for color usage.
3. Prefer tokens/classes already used in the project.
4. Do not hardcode hex, rgb, hsl, or arbitrary Tailwind color values unless necessary.

If a new color is required, document why and keep usage centralized.

## Layout Rules

Prefer:

- `flex`
- `grid`
- responsive Tailwind utilities
- reusable layout components

Avoid:

- absolute positioning for normal layout
- fixed pixel-heavy layouts
- duplicated spacing systems
- inline layout styles

## shadcn/ui Rules

Existing shadcn components live in:

```txt
src/components/shadcn
```

Before adding a new shadcn component:

1. Check if it already exists.
2. Use the existing local shadcn component if available.
3. If a required shadcn component is missing, it may be added.
4. Keep new shadcn components consistent with the existing local setup.

Do not install unrelated UI libraries unless there is a strong reason.

## Form Rules

Use `react-hook-form` for form state and validation flow.

Prefer existing form patterns from nearby modules before introducing new structure.

Keep form components composable and avoid deeply coupling form state to unrelated UI.

## Import Rules

Prefer importing through existing aliases.

Avoid deep relative imports when an alias exists.

Group imports:

1. React
2. Third-party packages
3. Internal aliases
4. Relative imports

Remove unused imports before finishing.

## File and Naming Rules

Follow nearby file naming conventions.

Current component folders commonly use:

```txt
index.tsx
<component-name>.stories.tsx
```

Keep files close to the component or module they belong to.

Do not move files unless it clearly improves structure.

## Performance Guidelines

- Avoid unnecessary re-renders.
- Prefer memoization only when justified.
- Do not prematurely optimize.
- Avoid duplicate API calls.
- Reuse existing hooks whenever possible.

## Working With Existing Code

When modifying existing code:

1. Read the existing component/module first.
2. Preserve the current architecture unless there is a clear reason to change it.
3. Prefer minimal, focused changes.
4. Avoid unrelated refactors.
5. Keep public component APIs stable when possible.
6. Update stories if visual behavior changes.
7. Run lint before finishing.

## Documentation and Changelog Rules

Agents must keep project documentation aligned with meaningful code changes.

### When to Update `CHANGELOG.md`

Update `CHANGELOG.md` when a change is user-visible, contributor-visible, architectural, or operationally meaningful.

Examples that should update the changelog:

- New route, page, module, or major UI section.
- New reusable component, design-system pattern, or Storybook coverage.
- Significant behavior change.
- API integration or authentication flow change.
- State management structure change.
- Build, deployment, Docker, PWA, or environment variable change.
- Bug fix that affects user behavior or developer workflow.
- Documentation change that affects onboarding or contribution workflow.

Minor internal refactors do not need a changelog entry unless they affect architecture, maintainability, or public behavior.

### Where to Write Changelog Entries

Add new entries under:

```md
## [Unreleased]
```

While changes are unreleased, group entries by **sprint date first**, then by changelog category.

Use this structure:

```md
## [Unreleased]

### Sprint YYYY-MM-DD

#### Added

#### Changed

#### Fixed

#### Documentation

#### Known Gaps
```

Use the sprint date associated with the work, not the date the changelog happens to be edited.

If an entry belongs to an existing sprint section, add it to that section instead of creating a duplicate sprint section.

If the sprint section does not exist yet, create it under `[Unreleased]`.

Within each sprint, use the existing categories when possible:

- `Added`
- `Changed`
- `Fixed`
- `Documentation`
- `Known Gaps`

Only include category headings that have entries. Do not create empty category sections.

Keep sprint sections ordered from newest to oldest.

Choose the category by intent:

- `Added`: new capability, route, component, story, feature, script, or documentation file.
- `Changed`: changed behavior, structure, workflow, styling convention, or implementation approach.
- `Fixed`: bug fixes and resolved incorrect behavior.
- `Documentation`: README, AGENTS, docs, comments, or contributor guidance.
- `Known Gaps`: intentionally incomplete behavior, placeholders, TODO-level limitations, or integration gaps.

### Keep Sprint Entries Compact

Do not let the current sprint become a running log of every small implementation change.

While a sprint is active, preserve useful detail, but compact entries when they start becoming repetitive, fragmented, or overly numerous.

When compacting:

- Merge related entries that describe the same feature, module, workflow, or outcome.
- Prefer one meaningful summary over several file-level or step-level bullets.
- Preserve distinct behavior changes, fixes, architectural decisions, and known gaps when they are independently useful.
- Remove implementation noise that does not help a future maintainer understand what changed.
- Do not merge unrelated changes merely to reduce the number of bullets.

Prefer:

```md
- Added and refined employee selection for stock transactions, including searchable employee metadata and validation.
```

Instead of:

```md
- Added employee autocomplete.
- Added employee option rendering.
- Added employee ID display.
- Updated employee selection validation.
- Adjusted employee autocomplete styling.
```

Agents may compact the current sprint opportunistically when updating `CHANGELOG.md`; do not wait until release cleanup if the section is already becoming noisy.

### Changelog Writing Style

Keep entries:

- Short and specific.
- Written in past tense.
- Focused on impact, not implementation noise.
- Useful to future maintainers.
- Grouped by feature or area when possible.

Prefer:

```md
- Added Storybook coverage for `FaceCard` loading and empty states.
- Fixed OAuth callback redirect to use the authenticated landing route.
- Clarified design-system workflow in `README.md`.
```

Avoid:

```md
- Changed stuff.
- Fixed bugs.
- Updated files.
- Refactored code.
```

### Changelog Responsibility

Before finishing a task, agents must check whether `CHANGELOG.md` should be updated.

If the changelog is not updated, the final response should briefly explain why it was not necessary.

If the task includes meaningful code, design-system, architecture, documentation, or workflow changes, update `CHANGELOG.md` in the same change set.

## When Breaking the Design System Is Allowed

Breaking existing patterns is allowed only when necessary.

If doing so, agents must explain:

- What existing pattern was insufficient.
- Why the deviation was needed.
- Whether the deviation should become part of the design system later.

Prefer improving the design system over bypassing it.

## Anti-Patterns

Do not:

- Duplicate UI from another folder.
- Copy old components into a new location instead of importing/reusing them.
- Create one-off components when existing design-system components fit.
- Hardcode colors.
- Use inline styles without necessity.
- Add a new state management pattern.
- Add a new UI library without strong justification.
- Overuse absolute positioning.
- Ignore Storybook.
- Break CI color usage for convenience.
- Create large components that mix data fetching, state, layout, and UI details unnecessarily.

## Final Check

Before completing work, verify:

- Existing components were reused where possible.
- No unnecessary hardcoded styles were added.
- CI colors and design tokens were followed.
- Layout uses grid/flex unless layering is required.
- Storybook remains accurate.
- `CHANGELOG.md` was updated when needed.
- `bun lint` passes or known lint failures are explained.

## Final Response Format

When finishing a task, summarize:

- What changed
- Reused components
- New components, if any
- Storybook updates
- Changelog updates
- Design-system deviations
- Remaining TODOs
