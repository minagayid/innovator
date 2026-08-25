---
name: eureka-computational-lab
description: Plan, execute, and audit high-integrity computational studies with verification, validation, uncertainty quantification, ensembles, refinement, manifests, and proof-gap reporting. Use for high-consequence numerical models, stochastic experiments, scalable simulation, surrogate studies, or computational evidence that must be reproducible and honestly bounded.
---

# Eureka Computational Lab

Use this skill when a calculation must become an **auditable evidence package**, not merely a script that runs. It complements `advanced-mathematics-computation`: use that skill for theorem-aware mathematical routing; use this one for the execution contract, VVUQ, reproducibility, ensembles, and decision robustness.

## Core workflow

1. **Freeze the decision.** State the quantified target, operating regime, baseline, output, claim boundary, success threshold, and stop condition.
2. **Specify before coding.** Start from [computation-study.md](templates/computation-study.md). Declare units, solver/discretization, precision, data/parameter/seed policy, resources, outputs, and excluded physics or logic.
3. **Choose the compute pattern.** Use a direct solver for a small reference problem; refinement for numerical error; ensemble sampling for stochastic/parameter uncertainty; a surrogate only after testing it against held-out high-fidelity runs; and independent implementation for sensitive conclusions.
4. **Build controls.** Include a baseline, meaningful negative control, edge/degenerate case, invariant or analytic special case, and an output that could falsify the candidate.
5. **Run VVUQ separately.** Verify the implementation/discrete solution, validate the model against external reference when possible, quantify numerical/input/stochastic/structural uncertainty, and record unavailable layers with reasons. Read [vvuq.md](references/vvuq.md) for the required distinction.
6. **Preserve provenance.** Save source revision, dependencies/environment, input identifiers/hashes, parameter file, seed policy, command, checkpoints, output hashes, figure scripts, test command, and machine-readable summary.
7. **Audit adversarially.** Test refinement or tolerance sensitivity, parameter/seed sensitivity, boundary effects, control discrimination, and decision reversal. Inspect outliers rather than only aggregate plots.
8. **Report the proof gap.** State exactly what a pass supports, what it does not establish, and the next independent/physical/formal test.

## Compute-pattern selection

| Situation | Preferred pattern | Do not infer |
|---|---|---|
| Deterministic PDE/ODE/physics model | Refinement, invariants, manufactured/analytic case, external comparison. | Convergence is model validation. |
| Stochastic simulation or randomized algorithm | Pre-registered seed policy, multiple seeds/ensembles, distributional summary and uncertainty interval. | One seed is representative. |
| Large parameter/design space | Constraint-first sampling, sensitivity screen, retained failed cases, validation of any surrogate. | A sparse grid identifies a global optimum. |
| Exhaustive finite search | Domain/canonicalization proof, coverage count, independent enumerator or property test. | A finite result proves a universal statement. |
| Symbolic/formal claim | Explicit assumptions, solver/certificate log and proof-gap classification. | CAS output is a formal proof. |

## Required package

Create a versioned workspace containing `SPEC.md`, source, tests, `inputs/`, `outputs/`, `manifest.json`, a rerun command, and `PROOF_GAP.md`. Run:

```bash
python /home/ubuntu/skills/eureka-computational-lab/scripts/validate_computation_package.py SPEC.md
```

The validator checks headings only. It does not certify code, mathematics, model validity, safety, or readiness.

## Completion gate

Call the study **computed evidence** only when its version, inputs, controls, VVUQ status, uncertainty sensitivity, output paths, and proof gap are available. State `verification not performed`, `validation unavailable`, or `uncertainty not quantified` explicitly rather than silently omitting a layer.
