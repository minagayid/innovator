---
name: artcraft-frontend-ux
description: Improve frontends and creative-tool interfaces using ArtCraft as an inspected reference for editor workflows, modular UI, visual hierarchy, and interaction quality.
---

# ArtCraft-Inspired Frontend UX

Use ArtCraft as a comparative reference when designing or refining creative tools, dashboards with dense controls, canvas workflows, or sophisticated editor interfaces. Reference: https://github.com/storytold/artcraft.

## Inspect source before adapting patterns

1. Read the current README and AGENTS.md. At authoring time, AGENTS.md described a Rust/TypeScript desktop product, Nx frontend workspace, React, Vite, shared frontend libraries, and creative workflows. Verify this against the current branch before relying on it.
2. Inspect frontend/package.json, Nx configuration, the app under frontend/apps, shared modules under frontend/libs, and neighboring tests.
3. Trace the actual user flow, component/state ownership, tokens, keyboard behavior, loading/error states, and data contracts before editing.
4. Inspect the relevant package's build and test scripts. Do not assume all apps or libraries share the same commands.

## Design and implementation principles

- Begin with the user's core job and high-frequency workflow, not a generic dashboard template.
- Establish clear hierarchy among the work surface, primary actions, contextual tools, secondary panels, and status.
- In editors, keep the canvas/work area legible and central; add inspectors, toolbars, contextual actions, and selection affordances only when they improve the task.
- Reuse established primitives and tokens for spacing, typography, color, borders, radii, focus, icons, and motion. Avoid duplicated one-off styling.
- Dark neutral surfaces, subtle separators, precise controls, and restrained blue accents can inspire a direction when appropriate; they are not mandatory theme requirements.
- Group dense controls by task, make labels meaningful, expose useful shortcuts when justified, and use progressive disclosure without hiding essential actions.
- Design relevant states explicitly: initial, loading, empty, selected, editing, success, error, disabled, permission-limited, and unsaved changes.
- Make responsive behavior intentional: sidebar collapse, toolbar overflow, panel scrolling, canvas scaling, and primary-action reachability.
- Include semantic markup, keyboard access, visible focus, contrast, accessible names, status announcements, reduced-motion support, and usable touch targets.

## Verification sequence

1. Inventory the current screen, target workflow, shared components, and breakpoints.
2. Turn the most important UX and functional requirements into observable acceptance criteria.
3. Build or reuse shared tokens/components before repeating patterns.
4. Implement a small vertical slice and verify that interactions change real application state correctly.
5. Exercise keyboard/pointer navigation, narrow and wide layouts, empty/error states, and any affected permissions or persistence.
6. Run relevant component/integration tests, visual checks if available, linting, and production build. Repair functional regressions rather than styling over them.

For substantial redesigns, report design rationale, changed components and state flows, responsive/accessibility considerations, and verification evidence. Link to the actual upstream source/documentation inspected when making a comparison. Do not copy ArtCraft branding or assets, and do not treat polish as a substitute for behavior or tests.
