# NEREID Simulation Suite — Scope, Controls, and Acceptance Criteria

**Evidence class:** deterministic finite scenario evidence. This is not a vehicle design release, dynamic-flight simulation, naval architecture certification, pressure-hull analysis, passenger safety case, or public-road / airspace / waterway authorization.

## 1. Purpose

NEREID is assessed as a **common safety capsule with one qualified mobility kit at a time**. The suite therefore tests four independent envelopes and one shared interface invariant. It does not simulate an all-mode consumer vehicle carrying every kit simultaneously.

The kit split follows the refined NEREID architecture: road, restricted flight, protected surface-water and uncrewed shallow-submersion articles are separately qualified before optional late integration. FAA powered-lift guidance treats powered-lift as a distinct certification path and expects type-specific airworthiness evidence; it cannot be substituted by a generic hover calculation [1]. The water and submersion calculations are screening checks, not stability or pressure certification [2].

## 2. Models

| Model | Finite mathematical target | Negative control | Required pass condition |
|---|---|---|---|
| Road traction | Determine whether a declared low-speed force demand is below \(F_{\mathrm{traction}}=\mu m g\cos\theta\), while retaining the configured force margin. | A low-grip surface case must fail the configured margin. | Nominal controlled-site case has at least 20% force margin; negative control is distinguishable. |
| Restricted-flight static hover screen | Determine whether a declared distributed-lift total has \(T/(mg)\) above an explicitly chosen finite surrogate threshold. | A single-unit loss must fail the threshold. | Nominal kit clears 1.30 thrust-to-weight; single-unit-loss case fails, proving the model exposes loss of margin. |
| Surface-water reserve-buoyancy screen | Compute \(\rho Vg-W\) and a declared freeboard proxy for a protected-water static case. | Reduced displaced volume must fail the reserve threshold. | Nominal state has positive declared reserve and the negative control fails. |
| Shallow-submersion recovery screen | Under a simplified vertical response, verify the normal propulsion-loss condition \(F_{\mathrm{buoyancy}}-W-F_{\mathrm{drag,down}}>F_{\mathrm{reserve}}\). | Reduced reserve-volume fault must fail. | Nominal uncrewed basin case clears the declared upward reserve; no depth or pressure rating is inferred. |
| Pre-entry mode-supervisor matrix | Inject one defined interface fault per domain kit and verify hazardous-mode admission is denied. Active-mode physical recovery is outside this model. | Disable one independent-lock check; at least one unsafe admission must occur. | Every defined pre-entry fault in the safeguarded design is denied; negative control is distinguishable. |

## 3. Shared model assumptions

The numerical inputs are **illustrative test-article parameters**, selected for deterministic behavior rather than representing a build-ready vehicle. All calculations use \(g=9.80665\,\mathrm{m/s^2}\) and water density \(\rho=1000\,\mathrm{kg/m^3}\). Every mode mass includes the common capsule and exactly one kit.

| Mode | Capsule plus kit mass | Key declared capacity | Boundary |
|---|---:|---|---|
| Road | 850 kg | Tire–surface traction coefficient and controlled low-speed demand. | Closed course only; no braking, crash or public-road claim. |
| Restricted flight | 960 kg | Eight independent lift units in a static thrust accounting screen. | Tethered / restricted research only; no flight dynamics, range or certification claim. |
| Surface water | 820 kg | 1.15 m³ enclosed displacement in still protected water. | No intact/damaged stability, wave, corrosion or open-sea claim. |
| Shallow submersion | 860 kg | 1.05 m³ positive-reserve recovery volume in an uncrewed basin scenario. | No pressure-vessel or depth claim; dynamic recovery must be physically tested. |

## 4. Numerical controls

The suite must run nominal cases, one meaningful negative control per envelope, and a time-step sensitivity check for the vertical recovery integration. It writes a reproducible JSON summary and plots. The fault matrix is exhaustive only over the named discrete fault set; it says nothing about multiple, latent, common-cause, manufacturing, human-factor, software or environmental failures.

## 5. Proof-gap ledger

| Result that may pass | Still missing before a hardware / deployment claim |
|---|---|
| Road traction screen | Real tire, brake, suspension, thermal, crash and road-homologation evidence. |
| Static hover screen | Aerodynamics, propulsion response, power limits, rotor interaction, flight controls, structural loads, noise and formal airworthiness compliance. |
| Surface-water screen | Full hydrostatics, stability curves, reserve buoyancy with damage, wave loads, propulsion, corrosion, egress and marine compliance. |
| Shallow recovery screen | Pressure-vessel analysis, wet-system qualification, real hydrodynamics, thermal / energy effects, positive-ascent trials and independent basin safety review. |
| Fault matrix | Hardware-in-the-loop testing, fault coverage analysis, common-cause analysis, timing, software assurance and independent safety assessment. |

## References

[1] [Federal Aviation Administration, “AC 21.17-4 — Type Certification—Powered-lift.”](https://www.faa.gov/media/80526)

[2] [U.S. Coast Guard, “Simplified Stability.”](https://www.dco.uscg.mil/Our-Organization/Assistant-Commandant-for-Prevention-Policy-CG-5P/Office-of-Design-and-Engineering-Standards-CG-ENG/Naval-Architecture-Division-ENG-2/Simplified-Stability/)

## Rendered-schematic validation

The rendered capsule architecture and mode-supervisor diagrams were visually checked. Both are legible at report scale and show the common capsule and individual kits separately. Any recovery path in a schematic is a proposed concept, not a validated state transition or actuator response. The diagrams are system schematics only; they do not provide dimensions, loads, wiring specifications, fabrication drawings or certification evidence.
