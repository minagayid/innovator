# Formal Claim Specification

## Claim type and scope

Classify as theorem target, formal proof, machine-checked proof, symbolic derivation, certified finite result, exhaustive finite search, property test, counterexample search, or conjecture. State the exact domain and excluded scope.

## Formal statement

Write objects, quantifiers, predicates/relations, inputs/outputs, units where relevant, and the desired conclusion.

## Assumptions and definitions

List axioms, algebraic/algorithmic assumptions, admissible inputs, implementation assumptions, canonicalization rules, and excluded cases.

## Reference cases and invariants

State known identities, analytic special cases, conserved quantities, test oracles, or independent libraries/solvers used for comparison.

## Method and tool assumptions

Record symbolic system/version, exact versus floating arithmetic, solver configuration, timeout/resource limit, generated code, and trusted computing base.

## Finite coverage or proof obligation

For finite search, show domain construction, canonicalization, count and completeness argument. For a theorem target, name the remaining lemma or formalization obligation.

## Counterexample strategy

Define adversarial generators, boundary/degenerate cases, randomized/property tests, and the output that refutes the statement.

## Reproducibility record

Record source revision, environment, commands, seeds, input/output hashes, certificate/proof log locations, and test command.

## Conclusion boundary

State precisely what the method establishes and what it does not. A symbolic simplification, SAT/SMT result, finite enumeration, or property-test pass is not a general proof unless the stated formal coverage/certificate obligation is met.
