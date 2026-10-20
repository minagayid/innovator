# Acceptance Gates: <task>

Scope: <one-sentence complete deliverable>

## Requirements and gates

- [ ] G1: <observable outcome measured from the artifact or behavior>
  CHECK: <inspected command that can decide G1>
  EXPECT: <distinctive success-only marker>
  CWD: <repository-relative directory, if needed>
  EVIDENCE: pending

- [ ] G2: <manual outcome and precise review criteria>
  EVIDENCE: pending

## Safe-use notes

- Commands and called scripts must be inspected before execution.
- A runnable gate passes only on a successful exit plus the expected marker.
- Record the actual command result and the evidence location.
- Preserve blockers; do not remove a gate merely to make the task appear complete.

Optional handoff line:
ABANDON: G2 <reason, owner/next action, and evidence needed>
