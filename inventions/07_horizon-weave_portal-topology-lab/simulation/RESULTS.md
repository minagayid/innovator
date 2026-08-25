# Computed Results Record

## Run identity

The deterministic run used the checked-in `model.py` over 48 finite cases: \(\alpha\in\{0.25,0.5,1,2\}\), \(r_0\in\{0.5,1,2\}\), and \(N\in\{501,1001,2001,4001\}\) on \(x=r/r_0\in[1,30]\). The exact source, environment, parameter set, output hashes, and case-level values are retained in [`outputs/manifest.json`](outputs/manifest.json).

## Verified implementation observations

The visual review confirmed that each selected \(r_0=1\) profile remains below \(\rho+p_r=0\) over the plotted finite domain and approaches zero from below as radius increases. The profile is an expected consequence of the prescribed analytic formula, not evidence of an obtainable negative-energy source.

The refinement plot showed monotonically decreasing maximum interior relative NEC error for every tested \(\alpha\). The output validator confirmed every finite case had the expected throat identity, flare-out value, analytic and numerical NEC sign, exact flat-space negative control, and Schwarzschild-lapse comparison trend. The regression suite reported five passing tests.

| Result label | What the result supports | What it does not support |
|---|---|---|
| Analytic calculation | This chosen metric family has a radial NEC diagnostic below zero under its declared equations and assumptions. | A physically allowed material, quantum state, or source for the metric. |
| Grid refinement | The finite-difference implementation converges toward the specified analytic NEC expression on the declared grids. | Dynamical stability, a continuum proof beyond the formula, or model validation. |
| Flat-space control | The code’s zero-shape-function branch reports zero diagnostics. | Correctness of a real portal model. |
| Schwarzschild lapse comparison | The normalized exterior lapse approaches zero near the assumed horizon. | A traversable route through a black hole or a mechanism involving a white hole. |

## Claim boundary

The strongest permissible conclusion is **computed implementation verification for a prescribed classical metric family**. It is not a finding that wormholes can be maintained, that black/white holes can be coupled, or that a portal can be engineered. See [`PROOF_GAP.md`](../PROOF_GAP.md) for unresolved physical obligations.
