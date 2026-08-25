---
name: conjecture-formalization-lab
description: Formalize invention candidates as equations, algorithms, models, invariants, or falsifiable propositions with explicit assumptions and proof or experiment obligations. Use when an idea needs mathematical structure, quantitative predictions, simulation, symbolic analysis, or a clear boundary between conjecture and result.
---

# Conjecture Formalization Lab

Use this skill after a mechanism has been proposed and before treating it as a serious candidate. Translate prose into objects, variables, relations, governing constraints, and observations that can distinguish the candidate from a baseline.

## Workflow

1. **Choose the formal target.** Select an equation, dynamical system, optimization problem, algorithm, causal graph, logical statement, scaling law, or invariant. State what the formalization is intended to explain or predict.
2. **Define objects and units.** Name variables, domains, dimensions, units, parameters, observables, controls, initial conditions, boundary conditions, and admissible states. Check dimensional consistency.
3. **State assumptions.** Separate measured inputs, idealizations, empirical fits, priors, and unverified conjectures. Record omitted variables and regime limits.
4. **Derive the mechanism.** Show the shortest causal or mathematical chain from intervention to predicted outcome. Include conservation laws, symmetries, monotonicity, stability, limiting cases, and baseline reduction where applicable.
5. **Generate alternatives.** Formalize at least one rival model or null baseline. Identify parameters whose values would change the ranking, whether they are identifiable, and what observations distinguish them.
6. **Declare the computational contract.** If calculation is needed, state the reference/analytic case, numerical method, precision/discretization, solver tolerance, data/seed policy, expected invariants and output units before code is written.
7. **Design the decisive check.** State the theorem obligation, counterexample search, symbolic identity, numerical experiment, ablation, or field measurement that could falsify the candidate. Call `advanced-mathematics-computation` for difficult computation and preserve its proof-gap and VVUQ ledger.
8. **Audit communication.** Distinguish theorem, derivation, simulation result, empirical estimate, conjecture, and design proposal. Never turn a plausible equation into a validated law by presentation alone.

## Minimum formalization contract

Every candidate must include: formal objects; assumptions; governing relation; parameter regime; baseline; predicted signature; falsifier; uncertainty; identifiability note; and reproducibility path. For physical systems, include units and energy/material/information accounting. For algorithms, include inputs, outputs, complexity, failure cases, evaluation metric and reference implementation or test oracle.

## Output

Use [formal-hypothesis.md](templates/formal-hypothesis.md). Label each line as definition, assumption, derivation, result, conjecture, or unresolved obligation.
