# Adversarial Results and Reversal Audit

## Tests performed

This release added a symbolic simplification check and a quadrature/shape-domain check. The latter does not derive stress-energy independently of the analytic NEC expression.

| Audit | Finite coverage | Result | What it verifies |
|---|---:|---|---|
| Symbolic audit | Five identities under \(r>0\), \(r_0>0\), \(R>0\), \(\alpha>0\) | All identities simplified to zero. | The declared derivative, throat, flare-out, radial NEC, and integrated-NEC formulas are algebraically consistent within the ansatz. |
| Numerical quadrature and shape-domain check | 48 cases over the original \(\alpha\), \(r_0\), and resolution sets | All cases had negative integrated radial NEC and \(b/r<1\) outside the throat; quadrature refined toward the closed-form integral of the analytic NEC profile. | It checks quadrature and shape-domain calculations, not an independent stress-energy derivation. |

The analytic profile's volume integral is

\[
\int_{r_0}^{R}4\pi r^2(\rho+p_r)\,dr
=-\frac{(\alpha+1)r_0}{2\alpha}\left[1-\left(\frac{r_0}{R}\right)^\alpha\right] < 0
\]

for the stated parameter domain. The plot [`integrated_nec_debt.png`](simulation/outputs/integrated_nec_debt.png) visually confirms this finite-domain negative result.

## Reversal-criterion result

| Criterion | New audit evidence | Status |
|---|---|---|
| R1: Self-consistent physical source | None. The computations intentionally prescribe a metric and back out its required stress-energy diagnostic. | **Not satisfied.** |
| R2: Semiclassical negative-energy admissibility | None. The numerical NEC integral is not a quantum-energy-inequality calculation. Recent review evidence retains QEI restrictions. [1] | **Not satisfied.** |
| R3: Macroscopic safe regime | None. All radii are normalized geometrized parameters; no material, tidal, or scale realization follows. | **Not satisfied.** |
| R4: Dynamical stability/backreaction | None. Both audits are static identities/integrals. | **Not satisfied.** |
| R5: Global causal/topological admissibility | None. Neither audit studies global evolution or causal curves. | **Not satisfied.** |
| R6: Formation, control, transport, and safety | None. No physical intervention or system architecture exists. | **Not satisfied.** |

## Final audit conclusion

The added computation **strengthens the negative conclusion for this toy family**: the required NEC violation appears in the prescribed analytic profile and its symbolic identities, while finite-difference and quadrature checks test implementation consistency. It does not independently derive the stress-energy tensor. This is evidence against interpreting the original pass as a maintenance solution, not evidence that the physical obstacle has been solved.

The search found exact specialized theoretical wormhole solutions, including a 2022 model that introduces a phantom scalar in its general-relativistic formulation or changes the gravity theory in its alternative formulation [2]. This is a relevant theoretical lead, but it does not satisfy the linked source, semiclassical, stability, causal, and engineering criteria. The no-build decision therefore remains the only evidence-supported result.

## Reproduce

```bash
python3 test_adversarial_audit.py
python3 adversarial_audit.py
python3 symbolic_audit.py
```

The scripts intentionally print conclusion boundaries. A successful rerun must not be described as a maintained wormhole, a controlled black/white hole, a portal, or a physical breakthrough.

## References

[1] [Kontou, E.-A., “Wormhole restrictions from quantum energy inequalities,” *Universe* 10, 291 (2024).](https://arxiv.org/abs/2405.05963)

[2] [Cañate, P. and Maldonado-Villamizar, F. H., “Novel traversable wormhole in general relativity and Einstein-Scalar-Gauss-Bonnet theory supported by nonlinear electrodynamics,” *Physical Review D* 106, 044063 (2022).](https://doi.org/10.1103/PhysRevD.106.044063)
