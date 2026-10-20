---
name: modern-frontend-ux
description: Improve or build production-quality web interfaces with clear visual hierarchy, responsive behavior, accessible interactions, deliberate loading and error states, and consistent design tokens. Use for frontend-only polish, page implementation, forms, or UI/UX refinement.
---

# Modern Frontend UX

## Scope

Make the interface feel coherent, intentional, fast, and trustworthy without changing backend contracts or business behavior unless the user explicitly includes them. Inspect the existing framework and component system before choosing an implementation.

## Procedure

1. Map the routes, page hierarchy, shared components, design tokens, data states, navigation, and relevant tests. Identify what can be reused and what looks inconsistent.
2. Define the target experience in concrete terms: audience, primary action, information hierarchy, desktop and mobile behavior, accessibility needs, and success states.
3. Establish or reuse semantic tokens for type scale, spacing, colors, surface elevation, borders, radii, focus rings, and motion. Avoid unrelated one-off styles.
4. Design the entire state space, not only the default screenshot: loading, empty, success, validation error, API/network error, disabled, focus, hover, and narrow-screen states.
5. Build components with semantic HTML and clear responsibility. Keep important content and actions discoverable; do not sacrifice readability for decoration.
6. Verify keyboard navigation, visible focus, heading order, labels, touch target sizing, color contrast, zoom behavior, reduced-motion preferences, and screen-reader naming. Use project accessibility tooling when available.
7. Check responsive layouts at practical narrow and wide widths. Prevent horizontal overflow, clipped dialogs, inaccessible menus, and actions hidden below the fold.
8. Run the repository's formatter, tests, type checks, and production build as applicable. When browser tooling exists, verify the rendered DOM, browser console, network failures, and actual interactions. State clearly when visual browser inspection was not possible.

## Design quality gates

- A visitor can identify the page purpose and the primary action quickly.
- Repeated components use consistent spacing, typography, colors, radii, and behavior.
- Every input has an accessible label, useful validation, and a recoverable error path.
- Motion communicates state and does not block or disorient; respect reduced motion.
- Layout adapts rather than merely shrinking on mobile.
- Decorative effects do not impair performance, contrast, text selection, or focus visibility.
- No control appears interactive unless it performs a real action.
- New dependencies are justified by measurable value and fit the current stack.

## Constraints

Keep a frontend-only task frontend-only. Do not silently alter APIs, schemas, authentication, persistence, or deployment behavior to make a mock UI easier. Use realistic fixture data only when clearly separated from production data flow. Never claim a design is accessible based on appearance alone; verify the relevant behaviors.

## Handoff

Summarize the key UX decisions, changed components/routes, responsive and accessibility checks actually performed, unresolved visual issues, and the exact build/test results.
