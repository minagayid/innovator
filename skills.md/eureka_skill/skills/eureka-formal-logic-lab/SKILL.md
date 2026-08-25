---
name: eureka-formal-logic-lab
description: Formalize and audit theorem, algorithm, symbolic, exhaustive-search, and counterexample claims with explicit scope, assumptions, coverage, certificates, trusted-tool boundaries, and proof-gap reporting. Use when a mathematical or algorithmic claim may be mistaken for a proof without formal or finite evidence.
---

# Eureka Formal Logic Lab

Use this skill when a claim needs a precise status: theorem target, machine-checked proof, symbolic derivation, certified finite result, exhaustive search, property test, counterexample search, or conjecture. It does not turn CAS output, solver satisfiability, randomized testing, or a finite scan into a universal proof.

## Workflow

1. **Classify the claim.** State the strongest permissible evidence label and exact domain. Define the conclusion that is sought and prohibited overclaims.
2. **Formalize objects and assumptions.** Write quantifiers, predicates, domains, invariants, canonicalization, input/output contract, arithmetic model and excluded cases. Use [formal-claim.md](templates/formal-claim.md).
3. **Choose the right lane.** Use symbolic derivation for identities, exhaustive enumeration for a finite canonical domain, property testing for bug discovery, SAT/SMT only with a clear encoding/trusted base, and proof assistant/certificate workflow when formal proof is required.
4. **Build reference checks.** Include analytic special cases, known identities, small exhaustive cases, invariant checks and an independently implemented or trusted oracle where available.
5. **Establish coverage.** For a finite result, prove or state the construction/canonicalization and count. For an infinite theorem, name the missing lemma, induction, completeness, reduction or formalization obligation.
6. **Search adversarially.** Generate boundary, degenerate, randomized and metamorphic cases. Treat a discovered counterexample as the highest-value output.
7. **Preserve the trusted base.** Record tool version, exact/floating arithmetic, solver settings, generated artifacts, timeout/resource conditions, seeds, certificate/proof logs and rerun command.
8. **Report the conclusion boundary.** State exactly what was checked, what assumptions are trusted, and what remains a conjecture or proof obligation.

## Evidence labels

| Result | Permissible wording |
|---|---|
| Simplified symbolic expression | “Derived under the stated algebraic/tool assumptions.” |
| Finite enumeration with complete domain argument | “Certified finite result over the stated domain.” |
| SAT/SMT result | “Satisfiable/unsatisfiable for the stated encoding and trusted solver configuration.” |
| Property-test pass | “No counterexample found under the stated generator/budget.” |
| Machine-checked proof | “Formally proved in the named system and imported trusted base.” |

## Required package

Preserve `CLAIM.md`, source/encoding, tests/generators, input/domain construction, coverage count, certificate/proof logs if any, manifest and `PROOF_GAP.md`. Run:

```bash
python /home/ubuntu/skills/eureka-formal-logic-lab/scripts/validate_formal_claim.py CLAIM.md
```

The validator checks section presence only. It does not check a derivation, enumerate a domain, validate a solver encoding, or certify proof correctness.

## Completion gate

Use **formal proof** only when a named proof system/checker accepts the complete theorem under disclosed trusted assumptions. Otherwise report the narrower result and its exact coverage.
