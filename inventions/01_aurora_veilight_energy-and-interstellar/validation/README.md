# Run the Validation Models

The scripts use only Python 3, NumPy and Matplotlib. They are deterministic: no network input, random seed, or external dataset is required. Outputs are written to a local directory and can be regenerated without overwriting the source materials.

```bash
cd inventions/01_aurora_veilight_energy-and-interstellar/validation
python3 aurora_thermal_containment.py --output-dir outputs/aurora
python3 veilight_sail_dynamics.py --output-dir outputs/veilight
```

Each run produces a PNG plot and a JSON summary. The JSON is the authoritative machine-readable result; the PNG is a readable visualization of the same finite simulation.

| Script | Output | Required controls |
|---|---|---|
| `aurora_thermal_containment.py` | `aurora_thermal_containment.png` and JSON summary | Nominal control, sector-isolated fault, high-coupling negative control, time-step sensitivity. |
| `veilight_sail_dynamics.py` | `veilight_sail_dynamics.png` and JSON summary | Flat-specular control, restoring candidate, thermal negative control, time-step sensitivity. |

Read [`MODEL_SPEC.md`](MODEL_SPEC.md) before interpreting results. Passing the finite checks does not validate a reactor, a magnetic confinement field, a high-power optical array, a spacecraft mission, or a safety case.
