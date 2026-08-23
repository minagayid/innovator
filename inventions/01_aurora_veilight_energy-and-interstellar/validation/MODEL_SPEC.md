# Mathematical Validation Models — Scope and Acceptance Criteria

These scripts are **bounded engineering models**, not reactor, propulsion, flight-safety, or mission-certification tools. They use no nuclear source terms, no magnetic-coil geometry, and no directed-energy array design. Their job is to make two testable subsystem hypotheses reproducible before physical integration.

## AURORA thermal containment model

### Mathematical target

For \(n\) coupled thermal sectors, determine whether a specified loss-of-flow event in one sector remains **non-propagating** under a conservative lumped-parameter heat-transfer model. The state vector is the sector-temperature vector \(\mathbf T(t)\). For sector \(i\),

\[
C_i\frac{dT_i}{dt}=P_i-h_i(T_i-T_c)-\sum_{j\in\mathcal N_i}k_{ij}(T_i-T_j),
\]

where \(C_i\) is effective thermal capacity, \(P_i\) is a non-nuclear surrogate heat load, \(h_i\) is local heat-removal conductance, \(T_c\) is coolant reference temperature, and \(k_{ij}\) is thermal cross-coupling. A fault scales \(h_f\) in one chosen sector. The model includes no plasma, neutron transport, radiation damage, mechanical stress, safety system, tritium, magnetic field, or licensed reactor behaviour.

### Controls and finite evidence level

The script compares three runs: a nominal control, a faulted but sector-isolated architecture, and a deliberately high-coupling negative control. It uses a fixed time step, deterministic parameters, per-run JSON output, and a thermal-margin plot. The evidence label is **finite numerical scenario evidence**, not a safety proof.

| Check | Initial threshold | Interpretation |
|---|---:|---|
| Unfaulted-sector maximum temperature | Below 360 K | Demonstrates the chosen adjacent-sector margin under the abstracted scenario. |
| Any-sector maximum temperature | Below 430 K | Demonstrates bounded response for this calibrated surrogate; not an equipment limit. |
| High-coupling negative control | Must fail at least one nominal acceptance condition. | Confirms that the test can distinguish a containment architecture from an intentionally poor one. |
| Numerical sensitivity | A halved time step must not change maxima by more than 1%. | Screens only for a time-integration artefact. |

## VEILIGHT laboratory lightsail model

### Mathematical target

For a small laboratory coupon, compare a flat-specular control with a candidate restoring configuration under low-power photon pressure, lateral perturbation and radiative heating. The state is \((x,v,T)\), with

\[
F_{\parallel}=\frac{2RP}{c},\qquad F_x=-Kx-Bv,
\]

and

\[
C_{\mathrm{th}}\frac{dT}{dt}=\alpha P-\varepsilon\sigma A(T^4-T_{\mathrm{env}}^4).
\]

The `K` and `B` terms are **phenomenological laboratory parameters**, not a claim that a particular metasurface, beam profile or real sail configuration supplies them. A zero-\(K\) / zero-\(B\) flat control is deliberately included.

### Controls and finite evidence level

The model uses a low-power, coupon-scale scenario only. It does not calculate a high-power laser system, an interstellar trajectory, an array design, a target velocity, dust survival, material fracture, spin mechanics, beam safety, or destination braking. The evidence label is **finite low-power laboratory-model evidence**.

| Check | Initial threshold | Interpretation |
|---|---:|---|
| Candidate lateral envelope | Peak displacement is less than the flat-control displacement plus a 10% tolerance. | Indicates a restoring response under the chosen abstracted model. |
| Candidate endpoint | \(|x(t_{end})| < 0.5|x(0)|\). | Indicates damping or recovery in the modelled duration. |
| Temperature | Below 450 K for the scenario. | Checks that the chosen low-power model does not hide thermal runaway. |
| Numerical sensitivity | Halving time step changes reported maxima by less than 1%. | Screens only for a time-integration artefact. |

## Proof-gap ledger

| Model | Missing obligation before hardware claim |
|---|---|
| AURORA | Calibrated multi-physics thermal-hydraulic model; realistic materials and geometry; fault tree; independent verification; experimentally measured transfer coefficients; qualified safety analysis. |
| VEILIGHT | Measured optical response; coupled deformation and attitude dynamics; material defects; real beam profile; vacuum test data; independent thermal / structural model; mission-level dynamics. |

## Sources

ITER describes its actively cooled blanket as a critical heat-collection and shielding subsystem, which motivates the sectoral heat-removal abstraction but does not validate this model [1]. The flexible-lightsail study motivates the joint treatment of photon pressure, thermal response and lateral stability but also identifies material and dynamic limitations outside this compact model [2]. NASA frames directed-energy propulsion as a milestone-driven research path, not a ready mission capability [3].

[1] [ITER Organization, “Blanket.”](https://www.iter.org/machine/blanket)

[2] [Gao, R., Kelzenberg, M. D. & Atwater, H. A., “Dynamically stable radiation pressure propulsion of flexible lightsails for interstellar exploration,” *Nature Communications* 15, 4203 (2024).](https://www.nature.com/articles/s41467-024-47476-1)

[3] [NASA, “Directed Energy Interstellar Study.”](https://www.nasa.gov/general/directed-energy-interstellar-study/)

## Rendered-output validation

The current generated AURORA plot clearly separates the nominal control, local isolated-fault response and common-cooling negative control; the negative control crosses the selected unfaulted-sector threshold. The VEILIGHT plot clearly separates the stationary flat control, damped restoring candidate and an intentionally thermally unsafe negative control. These visuals confirm only that the scripted finite scenarios and labels render legibly; they do not add physical validation beyond the stated model scope.
