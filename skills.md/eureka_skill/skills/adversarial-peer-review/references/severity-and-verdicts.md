# Severity and Verdicts

## Severity definitions

| Level | Meaning | Required action |
|---|---|---|
| **Critical** | Invalidates a central conclusion, creates an unacceptable safety/security defect, or makes the artifact unusable for its stated decision. | Stop sign-off. Repair, reject, or reframe before proceeding. |
| **Major** | A material unsupported claim, missing decisive control, serious edge case, or structural gap that a competent reviewer would challenge. | Apply a concrete repair or downgrade/retract the affected claim; re-attack the revision. |
| **Minor** | A real but non-load-bearing defect in clarity, organization, traceability, or completeness. | Fix when efficient; otherwise record as residual risk. |
| **Observation** | A question, preference, or possible improvement that is not currently evidence of failure. | Do not present as a defect unless further evidence confirms it. |

Severity tracks **damage if true**, not tone, novelty, or disagreement. A speculative concern must not be escalated without a mechanism and evidence path.

## Evidence status

Use one status per flag: **demonstrated** (directly supported by an artifact or reproducible check), **supported** (indirect but credible), **assumed** (not tested), **contradicted** (reliable evidence points the other way), or **unknown** (the needed evidence is unavailable).

## Verdicts

| Verdict | Use when | Do not imply |
|---|---|---|
| **Clean within scope** | No Critical/Major flags remain after the final pass and the declared checks were run. | Universal correctness or certification. |
| **Repairable with residual risks** | Material issues were repaired, but minor or explicitly bounded risks remain. | Zero risk or perfect quality. |
| **Reframe required** | The artifact may be useful, but its question, claim, audience, or method must change. | That the original claim survived. |
| **Reject** | A decisive claim or safety condition failed, or the artifact is not fit for its stated purpose. | That no related future work is possible. |
| **Unable to conclude** | Evidence, access, authority, or reproducibility is insufficient to judge the load-bearing issue. | That the claim is true or false. |

Every verdict must name its scope, strongest remaining uncertainty, and the condition that would change the decision.
