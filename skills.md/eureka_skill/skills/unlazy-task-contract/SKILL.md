---
name: unlazy-task-contract
description: Convert substantial engineering, research, product, and creative implementation requests into explicit, revisioned acceptance contracts before execution. Use when a task has multiple deliverables, ambiguous completion criteria, meaningful risk, or likely follow-up changes.
---

# Unlazy Task Contract

## Purpose

Turn a natural-language request into a finite set of independently observable outcomes. A plan is not completion evidence. Keep the contract small enough to inspect and specific enough to fail.

## Procedure

1. **Reread the request.** Capture the original request, later amendments, exclusions, constraints, target audience, output format, and authorization boundaries. Do not infer permission for irreversible external actions.
2. **Bound the task.** State the intended outcome, in-scope surfaces, non-goals, risk of error, dependencies, environment limits, and stop conditions. Ask one focused question if a missing detail materially blocks correct execution; otherwise state a reversible assumption.
3. **Inventory deliverables.** Assign stable IDs to every independently omittable outcome and every constraint that changes acceptance. For each row record: requirement, owner, observable evidence, dependencies, status, and revision.
4. **Define observable acceptance.** Prefer a check that reads or measures the actual artifact or behavior. Avoid tautologies, fixed-output commands, expectations copied from the brief, and checks that pass when the target is missing. Manual gates must name the artifact and reviewer decision needed.
5. **Choose proportionality.** Use a compact checklist for a small bounded task. Use a revisioned plan, dependency graph, gate ledger, and leaf/branch ledgers for complex tasks. Do not add ceremony to trivial requests.
6. **Reconcile changes.** Every user amendment that changes acceptance increments the contract revision. Reread the current request before declaring completion; map each current requirement to evidence, a blocker, an explicit deferment, or an authorized abandonment.
7. **Preserve honesty.** Distinguish proposed, implemented, checked, independently reverified, manually reviewed, blocked, and abandoned outcomes.

## Contract template

| ID | Required outcome / constraint | Owner | Observable evidence | Depends on | Status |
|---|---|---|---|---|---|
| C1 | State one independently omittable outcome | Root or leaf | Exact test, artifact, or manual review | IDs or none | OPEN |

Record revision, scope, exclusions, environment, stop conditions, and approval requirements above the table.

## Completion gate

Do not call the task complete while a required contract row lacks current evidence, has stale ownership, or remains unresolved. Report blockers and user decisions explicitly. An abandonment is a handoff, never a pass.
