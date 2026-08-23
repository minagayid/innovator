# NEREID Simulation Workspace

This directory contains a **deterministic finite screening suite** for an uncrewed common safety capsule using one mobility kit at a time. It is not a release-to-build package, dynamic flight simulator, pressure-hull analysis, stability book, navigation system, safety case, or regulatory demonstration.

## Regenerate

Run the following from this directory.

```bash
python3 nereid_mode_envelopes.py --output-dir outputs/nereid
python3 -m unittest -v test_nereid_mode_envelopes.py
```

The first command regenerates a JSON evidence record and `nereid_mode_envelopes.png`. The test reruns the simulation in a temporary directory and verifies the nominal scenarios, negative controls, fault matrix, and time-step check.

## What the suite checks

| Check | Nominal finite scenario | Negative control |
|---|---|---|
| Road | Controlled-course force demand retains a declared tire-force margin. | Low-grip case fails the margin. |
| Restricted flight | Eight-unit static thrust screen clears the chosen thrust-to-weight proxy. | One lost unit falls below the threshold. |
| Surface water | Declared enclosed displacement clears force and excess-volume proxies. | Reduced displacement fails. |
| Shallow submersion | Uncrewed basin recovery proxy has a positive declared upward reserve. | Reduced reserve volume fails. |
| Mode supervisor | Every named **mode-relevant** single fault denies hazardous admission. | Ignoring secondary-lock evidence produces unsafe admissions. |

> Passing this suite means only that its equations and declared finite controls behave as specified. The plots and JSON do **not** establish real vehicle margins or system safety.

Read `NEREID_SIMULATION_SPEC.md` before using any result. Read `EXTERNAL_CONSTRAINTS_LEDGER.md` for the regulatory and publication boundaries used to scope the work.
