# Computational VVUQ Ladder

Use this reference for simulations, numerical experiments, optimization, surrogate models, or stochastic studies whose conclusions could affect a theorem candidate, physical design, safety claim, or experimental choice.

| Layer | Question | Minimum artefact |
|---|---|---|
| **Specification** | What exact claim, regime, output and decision are in scope? | Versioned experiment specification and stop condition. |
| **Code verification** | Does the implementation solve the stated discrete problem? | Analytic/manufactured solution, invariant, convergence/refinement study, or independently checked special case. |
| **Model validation** | Does the model represent the target system for the claimed regime? | Comparison against external reference data/theory, or an explicit statement that validation is unavailable. |
| **Uncertainty** | How do numerical, parameter, stochastic, data and structural uncertainties affect the conclusion? | Parameter ranges/distributions, sensitivity or ensemble result, and decision robustness. |
| **Reproducibility** | Can another reviewer rerun, inspect and challenge the result? | Manifest, pinned inputs, seed policy, environment record, rerun command, output hashes and tests. |

## Required distinction

Do not substitute one layer for another. A converged solver does not validate a model. Agreement with one dataset does not verify an implementation. A reproducible output does not make a conclusion correct. Mark unavailable layers as **not performed** with a reason.

## Escalation

Require an independent implementation, a second discretization/solver, or a formally certified method when all three conditions hold: the conclusion is high consequence, the observed effect is small relative to uncertainty, and the model has no decisive external validation data.

## References

[1] [Yeo, “A Summary of Industrial Verification, Validation, and Uncertainty Quantification Procedures in Computational Fluid Dynamics,” NISTIR 8298 (2020).](https://www.nist.gov/publications/summary-industrial-verification-validation-and-uncertainty-quantification-procedures)

[2] [Coveney, Groen and Hoekstra, “Reliability and reproducibility in computational science,” *Philosophical Transactions of the Royal Society A* (2021).](https://royalsocietypublishing.org/rsta/article/379/2197/20200409/111837/Reliability-and-reproducibility-in-computational)

[3] [Wilson et al., “Best Practices for Scientific Computing,” *PLOS Biology* (2014).](https://pmc.ncbi.nlm.nih.gov/articles/PMC3886731/)
