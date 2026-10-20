---
name: fullstack-product-delivery
description: Route substantial product-engineering requests across frontend UX, backend APIs, authentication, data models, deployment, testing, and release readiness. Use when a user asks to make an existing app production-ready or deliver multiple connected layers.
---

# Full-stack Product Delivery

## Outcome

Deliver the smallest complete, verifiable change that satisfies the user's current request across all required layers. Use this as the router; activate specialist skills only for the work that is actually in scope.

## Intake and repository inspection

1. Reread the full current request and prior task amendments. Separate required outcomes, preferences, exclusions, assumptions, and actions that need explicit authorization.
2. Inspect the repository before proposing architecture: README and project instructions, package/dependency manifests, app entry points, routing, existing API contracts, persistence, authentication, tests, CI, deployment files, open changes, and branch state.
3. Preserve existing product behavior and unrelated user work. Do not replace working architecture solely to match a preferred stack. Verify the current framework and hosting constraints from repository evidence and current authoritative documentation when the detail could have changed.
4. Write an acceptance ledger before substantial implementation. Every independently omittable outcome needs an owner, an observable check or named manual review, and a clear status.
5. Establish a safe branch/PR strategy. Never overwrite user changes, push directly to a protected/default branch, merge a PR, deploy, or make an irreversible production change without the necessary authority.

## Route by work

- Visual polish, responsive behavior, accessibility, forms, and interaction details: use modern-frontend-ux.
- REST endpoints, signup/login, sessions, identity providers, account lifecycle, or security-sensitive user data: use fastapi-auth-accounts.
- SQLAlchemy models, relational constraints, persistence, or Alembic: use data-models-and-migrations.
- Image builds, Docker Compose, runtime configuration, health checks, or cloud platform integration: use docker-cloud-deployment.
- Automated tests, CI matrices, build verification, or regression checks: use integration-testing-ci.
- A go/no-go recommendation, security review, operational controls, or launch blockers: use production-readiness-audit.

Do not treat these skills as separate projects with unrelated assumptions. Agree on shared contracts first: authentication cookie/token behavior, API paths and response/error schemas, user identity fields, database ownership, environment variables, health endpoints, and frontend callback handling.

## Depth and ownership

For a contained change, work in one context with a compact checklist. For a larger request, split along genuine boundaries with a single deliverable and explicit file ownership per workstream. Parallelize only where changes do not conflict and shared interfaces have been agreed. Keep integration, end-to-end behavior, security review, and final acceptance at the root level.

Use the repository's Unlazy-inspired contract, acceptance-gate, depth-tree, and completion-audit skills when a task has several deliverables or meaningful risk. Do not claim the upstream Unlazy executable, hooks, or subagent orchestration ran unless those tools were actually present and used.

## Implementation loop

1. Define observable acceptance and risk-based negative cases before implementation.
2. Inspect any command and transitive script that could affect the working tree, external services, credentials, or production resources before running it.
3. Implement in small, reviewable increments. For logic or changed behavior, write or identify a failing test first where practical.
4. Run the narrow relevant tests, then integration/build/lint/type checks required by repository conventions.
5. Perform an expert reread, a defect hunt for omitted cases and security regressions, then a polish pass. Re-run checks affected by final edits.
6. Review the actual diff for secrets, generated artifacts, unrelated changes, broken documentation, and accidental API incompatibility.
7. Commit coherently, open a PR against the intended base, and report checks and outstanding gates. Do not merge unless explicitly authorized.

## Completion contract

Before reporting done, map each requirement to evidence or a transparent status such as blocked, deferred, failed, or not implemented. Distinguish local verification from CI verification, deployment configuration from a real cloud deployment, and a successful build from production readiness. Never claim a test, security property, migration, PR state, or deployment unless there is direct evidence for it.

## Required output

Report the files or subsystems changed, observable behavior delivered, exact checks actually run and outcomes, PR/commit links when confirmed, remaining risks, and the next required owner decision. Keep limitations visible rather than burying them under a success summary.
