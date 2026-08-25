# Model Specification: Static Wormhole Energy-Condition Toy Study

## Target and decision

This study asks one narrow mathematical question: **for a prescribed, static, spherically symmetric, zero-redshift Morris–Thorne shape family, do the discretized stress-energy diagnostics reproduce the analytic radial null-energy-condition (NEC) violation required at and outside the throat?** A pass supports only implementation verification for this family. It does not establish a physical source, stability, quantum consistency, formation process, controllability, or a traversable portal.

## Evidence classification

The metric family and Einstein-equation diagnostic are **[S] sourced/standard formalism**; the particular parameter sweep and software output are **[C] computed finite evidence**; `Horizon-Weave` is a **[P] proposed research-architecture label**. Any claim of a usable portal, black-hole maintenance, white-hole maintenance, or superluminal transport is **[U] unresolved and prohibited**.

## Formal objects and units

Use geometrized units \(G=c=1\). Let \(r_0>0\) be the throat radius, \(x=r/r_0\ge1\), and \(\alpha>0\). The prescribed line element is

\[
ds^2=-e^{2\Phi(r)}dt^2+\frac{dr^2}{1-b(r)/r}+r^2d\Omega^2,
\qquad \Phi(r)=0,
\]

with shape function

\[
b(r)=r_0\left(\frac{r_0}{r}\right)^\alpha.
\]

The code evaluates the standard static spherical Einstein-equation components for \(\Phi=0\):

\[
\rho(r)=\frac{b'(r)}{8\pi r^2}, \qquad
p_r(r)=-\frac{b(r)}{8\pi r^3}, \qquad
\mathcal N_r(r)=\rho+p_r=\frac{r b'(r)-b(r)}{8\pi r^3}.
\]

For this family,

\[
b'(r)=-\alpha\frac{b(r)}{r},\qquad
\mathcal N_r(r)=-\frac{(\alpha+1)r_0^{\alpha+1}}{8\pi r^{\alpha+3}}<0.
\]

The throat and flare-out checks are \(b(r_0)=r_0\) and \(b'(r_0)=-\alpha<1\). These formulae are a calculation over a prescribed geometry, not an independently solved matter model.

## Controls and comparison geometries

| Case | Definition | Expected diagnostic | Role |
|---|---|---|---|
| Wormhole family | \(\Phi=0\), \(b=r_0(r_0/r)^\alpha\), \(\alpha>0\) | \(\mathcal N_r<0\) | Candidate toy geometry. |
| Flat-space negative control | \(b=0\), \(\Phi=0\) | \(\rho=p_r=\mathcal N_r=0\) | Detect sign or residual mistakes. |
| Schwarzschild horizon comparison | \(f(r)=1-r_s/r\), \(g_{tt}=-f\), sampled only for \(r>r_s\) | Lapse tends to zero as \(r\to r_s^+\) | Illustrate a horizon-bearing exterior; it is not a stress-energy solution in this implementation. |

The Schwarzschild comparison deliberately does not equate a black-hole/white-hole analytic extension with a traversable throat. A white-hole region is not numerically treated as a stabilizer, source, or endpoint.

## Parameter domain and exclusions

Evaluate \(\alpha\in\{0.25,0.5,1,2\}\), \(r_0\in\{0.5,1,2\}\), and \(x\in[1,30]\). Use resolution series \(N\in\{501,1001,2001,4001\}\). The finite-difference derivative is assessed only on an interior region excluding end points. The study excludes dynamic perturbations, rotation, charge, quantum fields, backreaction, semiclassical gravity, formation/collapse, matter microphysics, external sourcing, radiation, causal time-shift protocols, and human/object transit.

## Numerical method and outputs

Implement the formulas in double precision NumPy. Use `numpy.gradient(..., edge_order=2)` for the independent finite-difference derivative check. Save per-case CSV results, a `summary.json`, a plot of \(\mathcal N_r\), a parameter manifest, environment information, and output SHA-256 hashes. The method is deterministic and has no random seed.

## Verification, validation, and uncertainty

**Implementation verification:** compare the finite-difference \(b'\) and derived \(\mathcal N_r\) against their analytic expressions; check throat and flare-out identities; verify that the flat control is zero to floating-point tolerance; and check the expected horizon-lapse trend.

**External-model validation:** unavailable. The object is a prescribed metric ansatz rather than a validated model of any material or astrophysical system. Canonical references constrain interpretation but do not validate a physical portal model.

**Numerical/parameter uncertainty:** quantify maximum interior relative derivative error and NEC error across grid refinements; report \(r_0\)-rescaling and \(\alpha\)-sweep behavior. Parameter variation does not resolve the structural uncertainty of the assumed stress-energy.

## Pass, failure, and reversal conditions

The implementation passes only if every wormhole case has the expected analytic sign, throat/flare-out identities within tolerance, decreasing interior finite-difference error under refinement, and a flat-control residual below the stated tolerance. A sign mismatch, nonconverging derivative check, or nonzero flat control is an implementation failure. Even a pass must not reverse the no-build decision; only a separately derived, physically consistent, experimentally supported theory could alter the engineering status.

## Proof gap

A successful run cannot establish that the required stress-energy exists, can be created, obeys quantum inequalities, is stable under perturbation, is compatible with a UV-complete theory, avoids causality pathologies, or permits safe communication/transport. It cannot create, maintain, couple to, or use black holes, white holes, wormholes, or portals.
