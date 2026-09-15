# Re-audit — AURORA and VEILIGHT

**Disposition:** Continue as two separate research programmes. Neither is an
engineering release, safety case, fusion-plant design, or mission-ready system.

## AURORA — thermal segmentation

The retained hypothesis is that isolated thermal sectors can reduce propagation
of a specified local fault. The current model reduces conductance only in the
faulted sector; neighboring sectors retain nominal capacity. It omits shared
headers, utilities, sensors, isolation failures, and common-cause events, so its
result is an illustrative software check rather than evidence of containment.
The 1 GWth / 405 MWe example is arithmetic only until a plant-wide account
includes recirculating power, cryogenics, heating/current drive, tritium, and
balance-of-plant loads. The proposed two-hour thermal buffer still needs a
defined medium, operating range, storage losses, and an independently
qualified safety sink.

**Next falsifier:** compare a measured multi-sector rig with shared-path and
isolated-path baselines; inject local and common-cause faults, and predefine
temperature/time margins. A model where the fault is isolated by assumption
cannot establish the architecture's fault tolerance.

## VEILIGHT — directed-energy sail

The retained scope is an uncrewed, flyby-only research architecture. The
stationary, perfectly reflecting sail ceiling \(F\leq2P/c\) is not a constant
thrust law during relativistic acceleration. The low-power coupon's restoring
and damping terms are phenomenological; simulated recovery follows from those
chosen terms and is not a flight-stability result.

**Next gates:** close the relativistic beam-to-sail energy and momentum budget;
measure coupon response rather than prescribe restoring/damping; then treat
beam profile, misalignment, spin, thermal deformation, sustained perturbations,
and mission-speed particle exposure as independent gates. Flyby remains
provisional; no deceleration capability is implied.

## Sources and evidence limits

- ITER's actively cooled blanket describes a demanding heat-removal function,
  not validation of AURORA integration:
  https://www.iter.org/machine/blanket
- Simulated lightsail configurations show perturbation and damping questions:
  https://www.nature.com/articles/s41467-024-47476-1
- NASA's directed-energy study presents a milestone-based research path:
  https://www.nasa.gov/general/directed-energy-interstellar-study/
- Relativistic beam/sail energy accounting:
  https://doi.org/10.1103/PhysRevResearch.2.043186
- Relativistic probe dust/gas exposure:
  https://doi.org/10.3847/1538-4357/aa5da6

No cited source demonstrates this package's proposed combined system.
