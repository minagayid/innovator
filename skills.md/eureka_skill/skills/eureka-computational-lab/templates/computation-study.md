# Computation Study Specification

## Target and decision

State the exact quantified claim, regime, decision this study informs, and what the study must not be used to claim.

## Evidence classification

Label the intended output as calibration, finite evidence, certified finite result, model validation evidence, theorem candidate, proof, or unresolved lead.

## Model and numerical method

Define equations/algorithm, discretization or solver, precision/tolerance, expected invariants, output units, and known model exclusions.

## Inputs and bounds

List data/source versions, parameter ranges or distributions, initial/boundary conditions, deterministic seed policy, and admissible domain coverage.

## Controls and baselines

Specify baseline, meaningful negative control, edge/degenerate case, and an independent special case or implementation if available.

## Verification

State the discrete-problem check: manufactured/analytic solution, invariant, refinement/convergence result, property test, or finite exhaustive check.

## Validation

State external reference data/theory and comparison metric. If unavailable, write `Not performed` and explain why this limits use of the result.

## Uncertainty

Separate numerical, input/parameter, stochastic/data, and structural/model uncertainty. State the sensitivity/ensemble/refinement method and decision-robustness criterion.

## Reproducibility manifest

Record source revision, environment/dependency versions, input hashes/locations, command, output paths/hashes, checkpoint policy, and test command.

## Proof gap and stop condition

Name the missing theorem, transfer, coverage, validation, or uncertainty obligation. Define the outcome that kills, reframes, or advances the study.
