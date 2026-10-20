---
name: unlazy-final-audit
description: Use before declaring substantial work complete to reconcile the original request, current amendments, repository diff, tests, and open handoffs. Produce a precise evidence-backed report without concealing incomplete work.
---

# Final Request and Evidence Audit

## Audit procedure

1. **Reread the request.** Include later user amendments and scope boundaries. Do not rely on memory of the original prompt.
2. **Reconcile every requirement.** Use the acceptance ledger or planning contract, if present. Give each requirement a current observation or mark it unmet, blocked, deferred, abandoned, or explicitly removed by the user.
3. **Inspect the final diff/artifact.** Check that all intended files are included, unrelated changes were preserved, generated files/secrets were not added inadvertently, and no TODO or placeholder silently replaces a requested deliverable.
4. **Remeasure claims.** Recheck test output, counts, metrics, links, file locations, commit IDs, or deployment status immediately before reporting. Cite exact evidence and avoid extrapolating beyond it.
5. **Count honestly.** For substantial tasks, summarize the number of gates verified, unmet, blocked, deferred, or abandoned when the ledger makes those counts meaningful.
6. **Surface handoffs.** For each unresolved requirement, state the blocker, responsible decision/owner if known, next action, and what evidence would resolve it.
7. **Report the boundary.** State what was implemented, what was verified, what was not run or could not be inspected, and any remaining uncertainty.

## Status meanings

- **Verified:** the relevant check ran now (or current authoritative external evidence was inspected) and supports the stated outcome.
- **Implemented, not verified:** a change exists, but the outcome lacks decisive current evidence.
- **Blocked:** progress needs a capability, dependency, credential, environment, or decision that is unavailable.
- **Deferred:** intentionally postponed, with scope and reason explicit.
- **Abandoned / handoff:** a required outcome cannot currently be completed; this is not success.
- **Removed by user:** scope changed with explicit user authorization. Do not infer removal from silence.

## Report structure

Use skills/unlazy-orchestrator/templates/final-report.md when useful. For most tasks, report:
- deliverables and links/paths;
- verification performed, including actual results;
- limitations and unmet gates;
- branch/commit/PR details for repository work;
- clear next action for any handoff.

Never say "all tests passed" unless all relevant tests were actually run and passed. Never say "deployment-ready" based only on source edits or a successful build. Never describe a pull request as merged unless it is verified as merged. Never hide a known failure under a general success statement.

## Final stop condition

If any required gate remains unmet, abandoned, deferred, or awaiting an owner decision, do not state unqualified completion. Deliver the confirmed work and label the remainder as a handoff.
