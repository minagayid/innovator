---
name: integration-testing-ci
description: Design and run meaningful tests, CI checks, migration tests, container smoke tests, and regression verification for application features. Use when code behavior changes or a repository needs evidence-based release checks.
---

# Integration Testing and CI

## Define observable gates first

Read the project's test commands, CI matrix, supported language/runtime versions, package lock, formatting/lint/type conventions, service dependencies, and previous failure patterns. Each gate must measure the target artifact or behavior and fail for a relevant counterexample; a passing command that does not inspect the requested outcome is insufficient.

## Test pyramid for a connected app

- Unit tests for deterministic logic, schema validation, configuration and authorization decisions.
- API tests for status codes, response shape, cookies/headers, error behavior, and input boundaries.
- Database integration tests for constraints, transaction rollback, session rotation, migrations, persistence, and concurrent uniqueness.
- Frontend tests for critical form states, loading/empty/error paths, accessible names, navigation and responsive behavior where feasible.
- Cross-layer tests for browser-to-API auth, CORS/cookie behavior, authenticated user ownership, and the main user journey.
- Container smoke tests for image build, process startup, health endpoints, dependency connectivity, clean shutdown and persisted data.
- Regression tests for previously observed defects. Keep them focused so the original failure becomes impossible to reintroduce unnoticed.

## Test-driven implementation

For a bug or behavior change, first write or identify a test that captures the expected behavior and fails for the current defect when practical. Make the smallest change that satisfies it, then refactor without changing behavior. Do not use implementation snapshots as the only proof of correctness.

## CI contract

- Run the same project commands locally and in CI where practical, and make CI service dependencies explicit.
- Choose runtime matrix entries from the project's supported-version policy rather than arbitrarily adding versions.
- Install locked or declared dependencies; compile/check migration code where that is the established project practice.
- Include static checks, tests, production build, and an application/container smoke test appropriate to the repository.
- Keep secrets and external identity provider credentials out of CI unless a controlled integration test actually requires them. Test OAuth error paths with fixtures when credentials are unavailable.
- Upload actionable diagnostics without printing environment secrets or user data.
- Ensure failed tests, builds, migrations, or health checks fail the workflow; do not mask failures with permissive shell operators.
- Inspect the final workflow YAML and execute the relevant validation available in the environment.

## Evidence reporting

Record exact commands, exit status, meaningful test counts, skipped tests, environmental limitations, and source of evidence. Separate tests run locally from CI checks and distinguish pass, fail, skipped, and still-running statuses. Never claim the latest commit is green based on an older commit's workflow or a subset of matrix jobs.

## Completion gate

Re-run checks affected by the final edit and independently review whether the test suite would catch realistic omissions. A successful test suite raises confidence only for behaviors it covers; it is not a general security or production certification.
