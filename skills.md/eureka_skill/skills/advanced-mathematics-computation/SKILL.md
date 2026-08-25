---
name: advanced-mathematics-computation
description: Theorem-aware computational mathematics for difficult conjectures, PDEs, geometry, number theory, complexity, and mathematical physics. Use for designing, implementing, auditing, or interpreting numerical, symbolic, formal, or exhaustive experiments on hard mathematical problems.
---

# Advanced Mathematics Computation

Use this skill when a task asks computation to investigate a deep theorem, conjecture, invariant, counterexample, or proof strategy.

## Core workflow

1. **State the exact mathematical target.** Write the domain, objects, quantifiers, assumptions, and what would count as a proof, counterexample, lemma, or calibration result.
2. **Separate evidence levels.** Label every output as calibration, finite empirical evidence, certified finite result, research lead, theorem candidate, or proof. Never promote a finite scan to a universal claim.
3. **Choose the computational lane.** Select exhaustive enumeration, symbolic algebra, interval/ball arithmetic, numerical simulation, optimization, formal verification, or a hybrid. Read [problem-families.md](references/problem-families.md) for domain-specific defaults.
4. **Design controls before running.** Specify seeds, bounds, precision, discretization, checkpoint format, negative controls, independent implementation, and failure conditions.
5. **Implement reproducibly.** Use deterministic metadata, atomic checkpoints, machine-readable summaries, and a manifest of source/data hashes. Prefer streaming algorithms when output size is large.
6. **Run verification, validation and uncertainty checks.** Separate implementation verification, external-model validation, and numerical/parameter/stochastic uncertainty. Read [vvuq-ladder.md](references/vvuq-ladder.md) for simulations or high-consequence computation.
7. **Run an adversarial audit.** Test precision sensitivity, resolution sensitivity, boundary effects, generator bias, degenerate cases, negative controls, and an alternative implementation or special case when feasible. Inspect the most surprising result first.
8. **Write the proof-gap ledger.** For each promising result, name the exact missing theorem obligation: universal quantifier, continuum limit, completeness count, independence proof, error bound, or model-transfer theorem.
9. **Report honestly.** Use `templates/experiment-plan.md`, preserve a reproducibility manifest and rerun command, and include a formal limitations section and references. Route large ensemble, design-space, or certification-like work to `eureka-computational-lab` when available.

## Domain routing

For RH or L-functions, prefer validated arithmetic, zero isolation, and a completeness count. For PDEs, require resolution and time-step refinement, conservation diagnostics, and a distinction between numerical concentration and singularity. For arithmetic geometry, pair point counts with certified rank or cycle calculations. For complexity, state the model and lower-bound target before collecting timing data. For gauge theory, track finite volume, lattice spacing, autocorrelation, renormalization, and continuum extrapolation.

## Quality gates

Do not claim a proof when any of the following is missing: a precise quantified statement, controlled numerical error, independent reproduction, complete coverage of the required domain, or a mathematical argument connecting the computation to the theorem. Do not call a simulation validated merely because it converges; record which VVUQ layers were completed or unavailable. Run `scripts/validate_experiment.py` to check an experiment plan before execution.
