---
name: unlazy-depth-tree
description: Use to break complex work into a depth tree with complete contracts, meaningful work leaves, disjoint ownership, explicit dependencies, and bottom-up integration checks. Avoid decorative decomposition and unsafe parallel work.
---

# Depth Tree Planning

## Principle

Start with the user's request as the root. Split only at natural domain, component, evidence, or integration boundaries. Tree depth is a way to expose omissions, not a mathematical guarantee of effort or quality.

## Procedure

1. **Inventory the outcomes.** Reread the request and amendments. Assign stable IDs to every independently omittable outcome and every constraint that changes acceptance. Keep optional ideas separate from requirements.
2. **Choose mode and depth.** Use a solo ledger for one coherent deliverable. Use an orchestrated tree when several coherent deliverables benefit from independent ownership or fresh contexts. Merge tiny adjacent tasks; split leaves that hide several independent outcomes.
3. **Define contracts before dispatch.** Specify the interface, formats/schema, naming, error behavior, compatibility expectations, toolchain, working directory, and integration points shared across leaves.
4. **Assign exact ownership.** Give each leaf repository-relative paths or globs it may change. Normalize the ownership sets and keep concurrent ownership disjoint. If shared files cannot be split safely, make them a sequential dependency or a dedicated integration task.
5. **Declare dependencies.** A leaf is WAITING until every required dependency is verified; it is READY only when prerequisites and ownership are clear. Do not invent dependencies during dispatch or quietly delete a dependency because it has become satisfied.
6. **Dispatch the ready set.** Launch only independent ready leaves using the actual available host mechanism. Record task/agent handles and outcomes. If the environment cannot support safe concurrent execution, run the leaves sequentially.
7. **Reconcile each return.** Inspect returned files and diffs; rerun their gates independently. Mark a leaf verified only after runnable checks and required manual review pass. An abandoned leaf stays a handoff.
8. **Integrate bottom-up.** Branches verify children, interface compatibility, end-to-end behavior, and regressions. Root verification rereads the request and checks every contract item.

## Suggested states

Use one state per work leaf:

- WAITING — one or more dependencies are not verified.
- READY — dependencies are verified and ownership is available.
- IN-FLIGHT — work has started but independent verification has not passed.
- VERIFIED — independent checks and required manual reviews passed.
- BLOCKED — progress requires an outside decision, unavailable capability, or unresolved prerequisite.
- ABANDONED — a required outcome has a documented handoff and is not complete.

A branch may be OPEN, VERIFIED, or ABANDONED. Use the vocabulary supported by the local project; do not claim that these states are machine-enforced unless tooling actually enforces them.

## Planning table

For each leaf, record: ID, complete deliverable, owned paths, dependencies, acceptance gates, planned dispatch wave (if applicable), current state, and evidence/handoff. Keep one authoritative table and do not create conflicting duplicate schedules.

| ID | Deliverable / owner | Paths owned | Depends on | Gates | State |
|---|---|---|---|---|---|
| 1.1 | <specific outcome> | <relative paths> | — | G1, G2 | READY |
| 1.2 | <integration outcome> | <relative paths> | 1.1 | G3 | WAITING |

## Safe coordination

Ownership lists and coordination records reduce collisions but are not security sandboxes. Use isolated worktrees or separate output locations when concurrent writers could conflict. Do not dispatch tasks with overlapping write sets, unclear interfaces, or hidden shared state. Keep user-provided private text, credentials, and unrelated context out of shared plans.

## Depth quality check

Before dispatch, ask: does every leaf represent a complete deliverable, have a clear owner, and have a decisive way to be verified? Does every branch have integration gates? Would a shallower tree preserve clarity? Fix weak boundaries before launching agents.
