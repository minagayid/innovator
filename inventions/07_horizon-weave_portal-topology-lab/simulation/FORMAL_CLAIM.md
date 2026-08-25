# Formal Claim Ledger

## Claim type and scope

**Claim type:** symbolic derivation plus finite numerical implementation verification.
**Domain:** \(r_0>0\), \(\alpha>0\), \(r\ge r_0\), static zero-redshift prescribed Morris–Thorne shape family in geometrized units.
**Prohibited conclusion:** no theorem about all wormholes; no claim of a physical, stable, controllable, or constructible portal.

## Formal statement

For

\[
b(r)=r_0(r_0/r)^\alpha,\quad \Phi=0,\quad r_0>0,\quad \alpha>0,
\]

the standard static spherical expressions used in this package imply

\[
b(r_0)=r_0,\qquad b'(r_0)=-\alpha<1,
\]

and

\[
\mathcal N_r(r)=\rho+p_r=-\frac{(\alpha+1)r_0^{\alpha+1}}{8\pi r^{\alpha+3}}<0
\]

for every finite \(r\ge r_0\). The code only tests this statement on a finite parameter/grid set and checks whether its implementation reproduces the formula.

## Assumptions and definitions

The stress-energy is *defined* through the Einstein tensor of a chosen classical metric. The calculation assumes the static, spherically symmetric ansatz and \(G=c=1\). It does not assume or derive a physical material, a semiclassical quantum state, a formation mechanism, or dynamical stability.

## Reference cases and invariants

The reference cases are the exact \(b'\) and \(\mathcal N_r\) expressions above, the throat identity, and flat spacetime \(b=0\), \(\Phi=0\), for which all reported stress-energy diagnostics vanish. A horizon-bearing Schwarzschild exterior is a comparison geometry, not a second wormhole solution or a test of a white hole.

## Method and tool assumptions

The code uses IEEE-754 float64 arithmetic and a second-order finite-difference derivative on a finite grid. The accepted result is a relative-error/convergence report, not a machine-checked proof. Numerical errors near the endpoints are excluded from the derivative assessment and must be reported.

## Finite coverage or proof obligation

The analytic sign statement follows algebraically under the listed assumptions. The numerical sweep covers only \(\alpha\in\{0.25,0.5,1,2\}\), \(r_0\in\{0.5,1,2\}\), and listed grid sizes; it has no universal coverage. A proof of a physical portal would require, at minimum, a self-consistent source theory, a well-posed dynamical evolution, stability/error analysis, quantum-inequality compatibility, causal analysis, and empirical support.

## Counterexample strategy

Treat any of the following as an implementation counterexample: a nonnegative computed \(\mathcal N_r\) in the interior of a documented wormhole case, a flat-control residual beyond tolerance, failure of derivative-error refinement, or mismatch of the throat/flare-out identity. Treat a source satisfying all physical constraints while supporting a macroscopic stable traversable geometry as a scientific counterexample to the present no-build conclusion; this package cannot search that space.

## Reproducibility record

Record Python and package versions, parameter JSON, source hashes, output hashes, exact command, grid list, and controls in `manifest.json`. Run `python validate_outputs.py` and `python test_model.py` after each execution.

## Conclusion boundary

Permissible conclusion: “The implementation reproduces the expected NEC violation of a chosen zero-redshift Morris–Thorne toy family over the finite tested set.” Impermissible conclusion: “A wormhole/portal can be maintained,” “black/white holes can be used as a portal,” or “the simulation proves a gateway exists.”
