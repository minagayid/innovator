---
name: multi-application-architecture
description: Design or review multi-application products and monorepositories using HeyPuter Everything as an inspected reference for app boundaries, navigation, shared capabilities, and consistent product design.
---

# Multi-Application Architecture

Use HeyPuter / Everything when a product contains multiple apps, tools, workspaces, or modules that need coherent navigation and shared infrastructure. Reference: https://github.com/HeyPuter/everything. Its current README describes a monorepository with applications under src/ and per-app source links. Verify structure against the current branch.

## Required inspection

1. Read the README, agent/contribution instructions, root manifests, workspace configuration, and CI workflows.
2. Inspect the specific app's package manifest, scripts, entry point, routes, dependencies, build configuration, and tests.
3. Trace how app metadata/discovery, shell/navigation, deep links, shared components, state, persistence, and permissions work today.
4. Inspect neighboring apps only to validate an actual shared contract. Do not assume all apps use the same stack or have equal test coverage.
5. Verify runtime requirements from manifests and CI; README version guidance can become stale.

## Architecture principles

- **Clear app boundaries:** Each app has a comprehensible responsibility, entry point, launch/route contract, and dependency boundary.
- **Consistent shell, distinct workflows:** Share navigation, session integration, notifications, common layout, and design tokens when they represent stable product capabilities; preserve app-specific interaction needs.
- **Explicit discovery:** Prefer documented, validated app metadata or registration over naming guesses, hidden imports, and duplicated navigation lists.
- **Disciplined reuse:** Promote shared packages only when ownership and API boundaries are clear. Avoid premature abstractions and cyclic dependencies.
- **Predictable navigation:** Specify canonical app IDs, direct links, refresh behavior, active-app state, back/breadcrumb behavior, loading/failure states, and unknown-app handling.
- **Explicit contracts:** Clarify data ownership, authorization, APIs, persistence, events, and version compatibility. A shared shell must not broaden data access.
- **Failure isolation:** Make individual app failures diagnosable and prevent one app from corrupting another app's state.

## Decision and verification flow

1. Map apps, entry points, dependencies, shared packages, routes, and test/build commands.
2. Identify the actual problem: discovery, navigation, reuse, orchestration, shared state, or deployment boundary.
3. Compare only relevant alternatives: modular monolith, workspace packages, plugin-style registration, or independently deployed apps. Record material trade-offs in an ADR.
4. Implement incrementally and avoid large structural moves unless required and authorized.
5. Test app registration and unknown IDs, direct navigation, refresh/deep links, permission enforcement, shell failure states, and app-specific smoke flows as appropriate.
6. Run app-level checks plus the relevant integration checks, and report the exact commands/results.

For reviews, deliver the verified current shape, concrete friction points, proposed boundaries/contracts, options, migration steps, rollback, and tests. Adapt Everything's product patterns to the target; do not copy its implementation blindly or assume its dependencies, runtime, or test runner apply.
