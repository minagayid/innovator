# SolarScreen — Serviceable BIPV Vision Façade

**Evidence class:** proposed façade-component research programme. This is not a structural glazing release, fire test, energy-performance certificate, installation design, building-code determination, public-display approval, or whole-building energy claim.

## Claim boundary

SolarScreen is **not a transparent solar panel that powers a daytime media façade**. Every incoming photon remains subject to allocation: it is transmitted, absorbed by PV/shading material, reflected, or emitted by a display supplied from a separate energy budget. The refined programme treats these functions separately.

> The retained hypothesis is a serviceable, spatially patterned BIPV insulated-glass unit whose PV pattern behaves as a deliberate solar-control frit, while all active electronics remain in a replaceable mullion cassette. A display is optional, separately metered, brightness-limited and not embedded in the sealed glazing stack.

## Proposed Rev-A architecture

| Layer/module | Proposed function | Design boundary |
|---|---|---|
| Outboard lite | Safety glass and durable exterior interface. | Exact glazing build-up is jurisdiction/project specific. |
| PV shading pattern | Opaque or semi-opaque PV strips/islands in a controlled geometric fraction. | The product is semi-transparent, not clear transparent PV. |
| Vision fraction | Clear or low-haze daylight apertures spatially separated from PV. | Daylight, glare and privacy must be measured for each geometry/location. |
| IGU thermal stack | Spacer, cavity, low-e / solar-control strategy, seals and drainage interfaces selected by façade engineering. | No generic U-value or SHGC is claimed. |
| Mullion service cassette | DC protection, monitoring, module-level power electronics, sensors and optional low-duty information strip. | Electronics are not sealed inside the IGU; an information strip is not energy-neutral by default. |
| Service interface | Isolated electrical connectors and replaceable cassette access from a safe maintenance plane. | The cassette must not disable glazing weather protection if removed. |

The central design move is **architectural separation of lifetimes**: glass/PV structure follows long façade qualification cycles, while drivers, telemetry and any information display are replaceable electronics. This responds directly to the optical–thermal–electrical coupling required for transparent/semi-transparent BIPV assessment [1] and avoids claiming that a sealed micro-LED matrix can be economically or safely serviced inside an IGU.

## First falsifiable mechanism

For a defined module and time interval:

\[
E_{\mathrm{net,core}} = E_{\mathrm{PV}} - E_{\mathrm{conditioning}} - E_{\mathrm{controls}}
\]

is reported separately from optional information-layer use:

\[
E_{\mathrm{net,total}} = E_{\mathrm{net,core}} - E_{\mathrm{information}}.
\]

The experiment does not average away display use or HVAC effects. It records PV output, cell temperature, parasitic/control energy, visible transmission, solar heat gain proxy, and information-layer energy as separate streams. The design hypothesis passes only if the patterned PV glazing is competitive with a matched passive solar-control BIPV baseline for its chosen orientation/climate **before** any optional display-energy narrative is added.

| Case | Intended condition | Discriminating outcome |
|---|---|---|
| Passive baseline | Matched low-e / solar-control glazing or conventional BIPV glazing, no service cassette. | Provides the thermal/optical reference. |
| Candidate core | Patterned PV vision panel plus isolated mullion electronics. | Shows the combined optical, thermal and PV trade-off transparently. |
| Negative control | Same panel geometry with excess opaque fraction or a deliberately poorly matched power-electronics duty. | Demonstrates unacceptable daylight/energy/thermal outcome. |
| Optional information layer | Removable mullion-side strip, separately metered at defined duty/luminance. | Must never be used to claim core BIPV net positivity. |

## Test sequence and gates

| Gate | Measurement | Pass/reframe criterion |
|---|---|---|
| Coupon | Spectral transmission, haze, PV IV curve, pattern fidelity, encapsulant adhesion and electrical isolation. | If pattern/encapsulant alters optical quality or electrical continuity unacceptably, redesign the PV-to-vision geometry. |
| 1 m² representative IGU | PV power, temperature, light transmission, glare proxy, condensation/water-ingress inspection and insulated-glazing thermal measurements. | If the integrated unit is not competitive with the matched passive/BIPV baseline for the intended climate, retain only a non-vision spandrel BIPV module. |
| Service cassette | Isolated hot-swap/replacement procedure, electrical fault containment, maintenance accessibility and thermal dissipation. | If a cassette failure requires panel replacement or compromises weather protection, detach the electronics from the façade module. |
| Outdoor mock-up | Orientation-specific irradiance, power, optical comfort, thermal response, soiling/shading and human-visible pattern assessment. | If real-world performance diverges materially from coupon assumptions, re-model geometry and discontinue information-layer scope. |
| Project-specific qualification | Structural, weathering, fire, electrical, lightning, impact, façade drainage and local planning review. | No deployment on a building envelope without project-specific engineering and approvals. |

## Manufacturing and supply-chain boundary

Use separately qualified suppliers for safety glass, PV laminate, encapsulant, spacer/seal, cables/connectors, and mullion electronics. Do not combine their warranties implicitly. The first manufacturable unit is an **unpowered visual/thermal IGU mock-up**, followed by a powered non-critical test panel. Long-lived glazing, PV laminate and safety interfaces cannot be tested or repaired on the same lifecycle as drivers, sensors and displays; retain replaceable interfaces in the mullion.

## Proof-gap ledger

| A passing result would support | It would not establish | Next required evidence |
|---|---|---|
| A patterned PV/vision geometry can be characterized as a single component. | A building-energy saving, façade certification, long-term durability, content approval or advertising business case. | Full-scale mock-up with location-specific optical, thermal and electrical monitoring. |
| A service cassette can be electrically isolated and replaced. | Safe façade access, fire performance, lightning compliance or building-envelope durability. | Project-specific façade engineering and qualification matrix. |
| Core PV output exceeds core conditioning energy in a finite test. | Energy-neutral display operation at arbitrary duty/luminance. | Metered information-layer duty study, kept separate from core performance. |

## References

[1] [Romaní, Ramos and Salom, “Review of Transparent and Semi-Transparent BIPV for Fenestration Application Modeling,” *Energies* (2022).](https://www.mdpi.com/1996-1073/15/9/3286)

[2] [Khalifeeh et al., “State-of-the-Art Review on the Energy Performance of Semi-Transparent Building Integrated Photovoltaic,” *Energies* (2021).](https://www.mdpi.com/1996-1073/14/12/3412)

[3] [Michael et al., “A Systematic Review and Classification of Glazing Technologies for Building Façades,” *Energies* (2023).](https://www.mdpi.com/1996-1073/16/14/5357)
