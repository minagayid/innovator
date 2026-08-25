# VVUQ and Reproducibility Reference

## Separate the layers

| Layer | Meaning | Typical evidence |
|---|---|---|
| Verification | The code solves the stated discrete/mathematical problem correctly enough for its target. | Manufactured solution, invariant, analytic special case, refinement, independent implementation. |
| Validation | The model represents the target system in the stated operating regime. | External experiment, benchmark dataset, accepted theory, held-out measurement. |
| Uncertainty quantification | Important uncertainty sources and their effect on the decision are identified and bounded. | Ensemble, sensitivity analysis, parameter range, discretization study, model-form comparison. |
| Reproducibility | A reviewer can reconstruct inputs, environment, commands, outputs and checks. | Manifest, source revision, input IDs/hashes, environment, seeds, rerun/test commands. |

## Minimal uncertainty inventory

Classify each material source as numerical/discretization, parameter/input, stochastic/data, structural/model-form, or measurement/reference uncertainty. State which source can reverse the decision and which is outside scope.

## High-consequence escalation

Escalate to an independent implementation or solver when the model affects a safety-critical decision, the reported effect is comparable to its uncertainty, or the result depends on a new/unvalidated model assumption.

## References

[1] [Yeo, NISTIR 8298 (2020).](https://www.nist.gov/publications/summary-industrial-verification-validation-and-uncertainty-quantification-procedures)

[2] [Coveney, Groen and Hoekstra (2021).](https://royalsocietypublishing.org/rsta/article/379/2197/20200409/111837/Reliability-and-reproducibility-in-computational)
