---
name: unlazy-verification
description: Use during and after implementation to run expert review, hunt defects, polish deliverables, independently rerun available checks, and verify integration rather than relying on self-reported success.
---

# Four-Pass Delivery and Independent Verification

## Work in four passes

1. **Complete implementation.** Deliver every scoped requirement. Avoid placeholder functions, empty stubs, TODOs that stand in for requested behavior, and silent deferrals.
2. **Expert reread.** Inspect the artifact as a domain specialist and replace shallow, brittle, or merely plausible choices. Compare it with the contract, existing conventions, and adjacent code.
3. **Defect hunt.** Deliberately look for incorrect assumptions, missing cases, broken interfaces, security flaws, data loss, bad error handling, accessibility issues, performance regressions, platform incompatibilities, and weak test or measurement logic.
4. **Polish and repeat.** Improve names, messages, documentation, structure, usability, and maintainability where the change is safe and relevant. Rerun affected checks and repeat the improvement pass while a meaningful defect remains.

## Verification ladder

Use the strongest available layers appropriate to risk:

1. **Local check:** worker/author runs relevant checks and records real output.
2. **Independent re-verification:** a separate pass inspects changed files and reruns the checks rather than trusting a checkbox or prior output.
3. **Integration:** validate changed components together, interface/schema compatibility, end-to-end behavior, and regression risks.
4. **Final acceptance review:** map every current request constraint to evidence immediately before reporting.

For code changes, inspect the diff and the project's actual scripts before selecting commands. A lint pass does not replace tests; unit tests do not prove deployment readiness; a successful build does not prove runtime behavior. For UI work, include responsive layouts, interaction states, accessibility, and visual verification when tools/environment allow. For research, validate source credibility, dates, calculations, and citations. For documents, inspect completeness, rendering, and formatting as applicable.

## Re-run correctly

- Distinguish status inspection from test execution.
- Re-run checks after the final relevant change.
- Use the declared shell, working directory, and toolchain. An environment mismatch is not a pass.
- Do not claim that a test ran unless it was actually invoked and its result observed.
- Record the command, result, and any meaningful limitation. Keep reports concise but reproducible.
- When checks cannot run, state the blocker and the best available static/manual review; do not convert an unrun test into a pass.

## Test the evidence, not just the code

Try to falsify high-impact success claims. Confirm that an expected marker is emitted only after all relevant assertions succeed, test error/negative paths where appropriate, and ensure the test observes the named behavior. If supplied numbers or performance claims matter, recompute them from source data instead of echoing a target.

## Integration rules

A leaf's local success does not imply that the full product works. Once outputs are combined:
- check public interfaces and data contracts;
- run the narrowest meaningful end-to-end flow;
- inspect changed-file boundaries for unintended edits;
- run targeted regression checks;
- recheck requirements affected by integration;
- preserve and report any unresolved dependency.

Completion requires fresh evidence for required gates plus the relevant integration layer, not just an implementation diff.
