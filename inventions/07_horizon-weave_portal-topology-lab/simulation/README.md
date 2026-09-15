# Simulation: Static Wormhole Energy-Condition Toy Study

This directory contains a deterministic implementation-verification study for a **prescribed** zero-redshift Morris–Thorne metric family. It is not numerical relativity, not a physical source model, and not a simulation of wormhole formation, black-hole/white-hole control, portal maintenance, or transport.

## Run and audit

```bash
python3 test_model.py
python3 model.py
python3 validate_outputs.py
python3 test_adversarial_audit.py
python3 adversarial_audit.py
python3 symbolic_audit.py
python3 /home/ubuntu/skills/eureka-formal-logic-lab/scripts/validate_formal_claim.py FORMAL_CLAIM.md
```

`model.py` writes `outputs/summary.csv`, `outputs/summary.json`, selected radial profiles, and `outputs/manifest.json`. If Matplotlib is installed it also writes two PNG figures; the mathematical unit tests do not require Matplotlib. The manifest records parameter coverage, environment, source hashes, output hashes, and case-level results. `adversarial_audit.py` adds `adversarial_audit.csv` and `adversarial_audit.json`, plus a PNG when plotting support is present; `symbolic_audit.py` writes `symbolic_certificate.json`.

| Check | Role | Boundary |
|---|---|---|
| Analytic identity comparison | Implementation verification | It does not validate the chosen metric as a physical spacetime. |
| Grid refinement | Numerical-error sensitivity | It does not establish dynamical stability or a continuum physical solution. |
| Flat-space control | Computed zero-shape case through the finite-difference stress-energy formula pipeline | It checks zero residual for this control; it cannot validate signs, stress-energy derivation, or any material model. |
| Schwarzschild lapse comparison | Horizon-bearing exterior comparison | It does not represent transit through a black hole or a white-hole outlet. |
| Volume-integral audit | Numerical quadrature of the already-derived analytic NEC profile against its closed-form integral | This is a quadrature-consistency check, not an independent stress-energy derivation; it does not assess a quantum state, source, or stability. |
| Symbolic audit | Exact identities within the declared ansatz | It does not prove the ansatz physically occurs. |

Read [`MODEL_SPEC.md`](MODEL_SPEC.md), [`FORMAL_CLAIM.md`](FORMAL_CLAIM.md), [`EXTERNAL_CONSTRAINTS_LEDGER.md`](EXTERNAL_CONSTRAINTS_LEDGER.md), and [`RESULTS.md`](RESULTS.md) before interpreting the outputs.
