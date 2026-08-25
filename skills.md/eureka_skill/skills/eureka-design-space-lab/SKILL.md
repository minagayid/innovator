---
name: eureka-design-space-lab
description: Design and audit bounded multi-objective parameter and architecture studies with constraints, baselines, sensitivity analysis, Pareto interpretation, surrogate limits, and reproducible stop conditions. Use for engineering trade-off studies, optimization proposals, architecture sweeps, or claims of efficient designs that require honest design-space evidence.
---

# Eureka Design Space Lab

Use this skill when the question is **which feasible design or parameter regime is preferable**, rather than whether a single model run works. It prevents false optimum claims by making constraints, comparison classes, failed evaluations, uncertainty and human trade-offs explicit.

## Workflow

1. **Freeze the decision.** State the use case, operating regime, objectives, hard constraints, baseline designs, excluded claims and decision owner.
2. **Define a computable design space.** Declare variables, units, bounds, conditional constraints, infeasible regions and fixed assumptions. Do not optimize an undefined feasible set.
3. **Choose comparable objectives.** Specify output metric, measurement/model source, direction, normalization and trade-off rule. Keep energy, cost, risk and performance separate until a justified decision rule combines them.
4. **Plan exploration.** Begin with a space-filling or sensitivity-oriented initial design; state budget, adaptive rule, seed policy, failed-run treatment and stopping condition. Use [design-space-study.md](templates/design-space-study.md).
5. **Establish model credibility.** Record verification, external validation status, uncertainty and fidelity. A surrogate may rank candidates only after held-out or cross-validated checks in the region used for decisions.
6. **Run robustness checks.** Test constraint margins, influential variables, uncertainty ranges, baseline alternatives and decision-reversal cases. Preserve dominated, infeasible and failed samples.
7. **Interpret frontiers honestly.** Call a result a finite observed trade-off set, not a global Pareto frontier, unless coverage and model conditions justify stronger language. State which choice remains a human value judgment.
8. **Hand off.** Provide the chosen/rejected designs, data/manifest, validity domain, proof gap and smallest physical/formal follow-up.

## Routing

| Need | Route |
|---|---|
| Mathematical solver, ensemble or VVUQ implementation | `eureka-computational-lab` |
| Mechanism and invariant definition | `conjecture-formalization-lab` |
| Candidate invention set | `innovation-breakthrough-design` or `invention-generation-orchestrator` |
| Safety/feasibility/prior-art kill gate | `invention-validation-lab` |

## Required outputs

Preserve a versioned specification, input table, design/evaluation source, baseline definitions, raw outputs, failure log, sensitivity result, trade-off plot/table, manifest, rerun command, decision log and proof-gap ledger. Run:

```bash
python /home/ubuntu/skills/eureka-design-space-lab/scripts/validate_design_study.py SPEC.md
```

The validator checks the specification structure only. It does not establish that a computed optimum is globally optimal, physically feasible, safe, or deployable.

## Completion gate

Report a result as a **bounded design-space finding** only when its feasible set, baselines, sampling budget, model credibility, uncertainty/robustness, failed points and decision rule are visible. If a change in plausible assumptions reverses the selection, report the decision as unstable and prioritize the assumption for measurement.
