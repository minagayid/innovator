---
name: unlazy-depth-tree-orchestration
description: Decompose complex multi-part work into a dependency-aware Depth Tree with explicit ownership, isolated deliverables, rolling parallel dispatch, independent verification, and bottom-up integration.
---

# Unlazy Depth Tree Orchestration

## When to use

Use when one context cannot hold implementation and verification at full attention, or when deliverables can be independently owned and checked. Stay solo for a small, focused task where orchestration overhead would exceed its value.

## Plan before dispatch

1. Reread the current request and amendments; create a revisioned contract inventory.
2. Split work into leaves with one clear outcome, bounded inputs, exact output paths, acceptance gates, and explicit dependencies.
3. Put cross-cutting compatibility, end-to-end, and regression checks in branch/root ledgers—not duplicated inside every leaf.
4. Ensure concurrently active leaves own disjoint files or resources. Shared interfaces and naming conventions must be agreed before fan-out.
5. Record a leaf state: WAITING, READY, IN-FLIGHT, VERIFIED, or ABANDONED. A branch is OPEN, VERIFIED, or ABANDONED.

## Dispatch protocol

- Claim ownership before concurrent work. If a claim conflicts, revise the split or work sequentially; never bypass the conflict.
- Dispatch only leaves whose dependencies are verified and ownership is available.
- For each wave, record the exact set of launched tasks and every host handle before waiting for results.
- Give each worker only the shared contract, its assigned scope, dependencies, expected artifacts, and gate instructions. Avoid leaking unrelated task history.
- Process returns as they arrive. Record the return, independently reverify that leaf, review its manual gates, update status, and release its ownership before promoting dependent work.
- Do not invent dependencies mid-flight. Amend the plan, revise affected states, and record why.

## Verification and integration

1. Re-run each returned leaf's runnable gates, including previously passing gates when relevant.
2. Review manual evidence directly; a leaf is not verified merely because its automated tests pass.
3. Integrate bottom-up after named children settle. Verify interfaces and cross-leaf behavior at the branch level.
4. Run root-level regression and end-to-end gates on the composed result.
5. Reconcile all current contract rows before releasing the overall scope. Do not mark the root complete while any required leaf, wave, branch, or gate remains unresolved.

## Failure and recovery

A failed claim means concurrency is unsafe until the plan changes. A failed gate returns the leaf to active repair, not verified. A blocked or abandoned leaf must remain visible and must never be promoted as success. Release a scope early only as explicit recovery after confirming the recorded owner is no longer active.

## Handoff contract

Each leaf return includes: changed paths, implementation summary, exact checks run and results, remaining risks, blockers, and any unverified assumptions. The driver remains accountable for integration, independent verification, and the final report.

## Completion gate

All required leaves and dispatch waves are terminal; children and branches are reverified; ownership is released; root acceptance gates pass; and the current contract inventory reconciles to evidence. If native subagents or ownership tooling are unavailable, apply the dependency and evidence principles manually without claiming that tool-specific orchestration occurred.
