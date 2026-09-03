# Adversarial Peer Review: [title]

## Review contract

| Field | Record |
|---|---|
| Frozen version | [commit, file set, date, or quoted text] |
| Purpose and decision | [what the work is meant to establish or decide] |
| Scope | [included artifact, claims, tests, and audience] |
| Exclusions | [what is not being certified or judged] |
| Risk level | [low / medium / high / high-consequence] |
| Domain references | [files loaded] |
| Round cap | [default: 4 critique rounds + final pass] |
| Reversal condition | [evidence that would change the verdict] |

## Claim and evidence ledger

| ID | Claim/invariant | Evidence class | Evidence status | Decision relevance |
|---|---|---|---|---|
| C1 | [claim] | [formal / empirical / computational / documentary / expert / speculative] | [status] | [why load-bearing] |

## Round [N]

### Flags

| ID | Severity | Location | Claim/invariant | Attack | Why it matters | Evidence status | Repair test |
|---|---|---|---|---|---|---|---|
| R[N]-1 | [level] | [exact location] | [tested item] | [strongest objection or counterexample] | [impact] | [status] | [smallest decisive repair/test] |

### Resolutions

| Flag | Action | Artifact/test changed | Why this addresses the attack | What it does not establish |
|---|---|---|---|---|
| R[N]-1 | [repair / reject / reframe / defer] | [path or section] | [reason] | [boundary] |

### Round decision

[Proceed to re-attack / stop at decisive failure / defer for missing evidence]

## Final verification pass

| Lens | Attack performed | Result | Residual risk |
|---|---|---|---|
| Soundness | [logic, equations, claims, data] | [finding] | [risk] |
| Safety and integrity | [misuse, privacy, security, high-consequence review] | [finding] | [risk] |
| Completeness | [controls, dependencies, provenance, counterarguments] | [finding] | [risk] |
| Coherence | [title, claims, figures, code, recommendations] | [finding] | [risk] |

## Residual evidence-gap ledger

| Item | Status | Why unresolved | Reversal condition | Owner/next evidence |
|---|---|---|---|---|
| [gap] | [unresolved / out of scope / mitigated] | [reason] | [what would change verdict] | [next step] |

## Verdict

**[Clean within scope / Repairable with residual risks / Reframe required / Reject / Unable to conclude]**

Scope-qualified conclusion: [one paragraph].

Do not describe this report as universal proof, certification, safety approval, legal/medical/financial advice, patentability, or commercial validation unless an appropriate independent process actually established that claim.
