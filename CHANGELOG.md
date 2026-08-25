# Changelog

All notable changes to this project will be documented in this file.

This project loosely follows the principles of Keep a Changelog and Semantic Versioning. Until the first public release, changes are tracked under **Unreleased**.

---

## [Unreleased]

### Sprint 2026-08-25

#### Added

- Established the reusable Next.js boilerplate foundation with the current application tooling, design-system primitives, theme support, quality tooling, Docker foundation, and build metadata workflow.

#### Documentation

- Replaced inherited product-specific documentation with domain-neutral boilerplate setup, architecture, design-system, environment, Git workflow, and reuse guidance.
- Updated coding-agent guidance for boilerplate maintenance, Server/Client Component boundaries, reusable component decisions, Gitmoji conventional commits, and changelog responsibilities.

#### Known Gaps

- No automated test stack is prescribed by the boilerplate; consuming projects should add one when their requirements justify it.
- Authentication, backend/API frameworks, databases, state management, and provider-specific deployment integrations are intentionally left to consuming projects.
