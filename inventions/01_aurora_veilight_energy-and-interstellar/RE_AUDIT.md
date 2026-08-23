# Re-Audit — Three Invention Programmes

**Date:** 23 August 2026  
**Method:** Mechanism freeze → conservation / safety check → closest-known-mechanism boundary → weakest assumption → decisive test → revision decision.

## Audit rule

A concept is retained only if it has a causal mechanism, an energy/material/momentum account, an explicit baseline, a falsifier, and a reversible first experiment. A compelling rendering, a biological analogy, or a long-range aspiration is not evidence of novelty or feasibility.

## Portfolio decision

| Programme | Original strength | Main weakness found | Revision decision | Confidence after revision |
|---|---|---|---|---|
| **AURORA** | Correctly separates fusion heat capture, storage, conversion, and export. | It implied a specific net-power planning point before a credible integrated plant energy-recirculation model exists; “prevents explosion” wording was too broad. | Retain as a **fault-containment and thermal-flexibility architecture**, not a reactor design or safety guarantee. | Moderate for the systems-engineering hypothesis; low for fusion-plant performance. |
| **VEILIGHT** | Correctly moves energy off the spacecraft and preserves photon momentum accounting. | Passive sail stability, thermal margin, dust survivability, and deceleration were under-specified. | Retain only as an **uncrewed, flyby-only research architecture** with materials / dynamics gates before array-scale work. | Low–moderate for a lab pathway; low for a mission. |
| **TIDEGILL** | Separates capture, oxygen recovery, carbon conversion, and climate accounting. | The gill analogy could be mistaken for proof of a capture-energy advantage; direct solid-carbon route has weak readiness. | Retain as a **contactor-control research hypothesis**; split it from the laboratory-only carbon electrolysis programme. | Moderate for a contactor benchmark; low for continuous battery-grade carbon. |
| **NEREID** | Identifies the central mass and certification contradiction. | A single crewed road-air-boat-submarine unit compounds incompatible structure, energy, and certification burdens. | Reframe as a **common safety capsule with interchangeable domain kits** and make full four-mode integration a late, optional research goal. | Moderate for individual kit demonstrators; low for a consumer all-mode craft. |

## 1. AURORA — revised mechanism

### What survives

The design’s credible contribution is **segmentation of energy paths**. Rather than treating a fusion heat source as an undifferentiated “pure energy” reservoir, AURORA isolates plasma-facing heat interception, independent primary loops, intermediate storage, conversion, and electrical dispatch. ITER’s blanket shows the physical basis: a fusion blanket must protect the machine, receive heat and neutron energy, and cool actively; its role is not a direct electricity outlet [1]. DOE identifies sCO₂ Brayton technology as promising but still subject to high-temperature durability and component hurdles [2].

### What changes

The previous 405 MWₑ net reference is no longer a projected outcome. It is a **placeholder accounting case** that cannot be used for comparisons until it includes realistic pumping, cryogenic, heating/current-drive, tritium and balance-of-plant loads. The revised claim is limited to this invariant:

\[
\forall i,\quad \text{single fault in heat sector }i\not\Rightarrow\text{loss of heat-removal margin in sector }j\ne i.
\]

AURORA does not claim to eliminate every accident class, avoid every disruption, or operate a fusion reactor without a licensed safety case.

| Issue | Revision | Falsifier |
|---|---|---|
| “No collapse or explosion” was too broad. | Replace with **non-propagation of specified single-fault thermal transients**. | A simulated or rig-induced fault crosses safety margins in an adjacent sector. |
| Storage was presented as an implicit safety solution. | Separate **operational buffer** from qualified passive / safety heat-removal systems. | Thermal model requires the buffer to perform a safety function without verified passive removal. |
| Net-electric estimate was over-interpretable. | Mark the 1 GWₜₕ / 405 MWₑ illustration as assumption-dependent only. | A plant energy-recirculation model invalidates the placeholder budget. |

**Best first experiment.** An electrically heated, non-nuclear, multi-sector loop rig with common and independent disturbances must demonstrate measured containment of a programmed loss-of-flow / sensor fault with pre-registered adjacent-sector temperature and pressure limits.

## 2. VEILIGHT — revised mechanism

### What survives

External directed energy preserves momentum accounting while avoiding onboard reaction mass. NASA’s NIAC material classifies directed energy as a difficult but potentially feasible path with testable intermediate waypoints, a small phased-array prototype, wafer-scale spacecraft work, and laser-communications development [3]. Recent peer-reviewed modelling reports candidate flexible-sail configurations that can be beam-riding and structurally stable in modelled conditions, but it explicitly discusses the need for very low absorption, high emissivity, and later work on damping / long-duration perturbations [4].

### What changes

VEILIGHT must not describe its sail as merely “self-stabilizing.” The revised sail is an **experimental opto-mechanical object** whose stability is conditional on its material, beam profile, spin / damping strategy, imperfections, and temperature. The dust bumper is also demoted from a protection solution to a measurement problem: it may reduce damage in a specified regime, but its survival value at a mission target speed is unverified.

| Issue | Revision | Falsifier |
|---|---|---|
| Passive stability was inferred from architecture. | Require a coupled optical–thermal–structural stability map, including perturbation growth and damping. | Measured or simulated excursions grow beyond the beam / stress envelope. |
| Thermal margin was not tied to absorption. | Treat absorptance, emissivity and defect statistics as test parameters, not design adjectives. | Coupon overheats or deforms under scaled irradiance. |
| Deceleration was only noted as missing. | Freeze the baseline as **one-way flyby only**; arrival orbit is a separate mission concept. | Proposal asserts target capture without a separate momentum-removal energy / infrastructure account. |
| Dust shielding was overconfident. | Call it an uncertainty; test staged impact / erosion regimes before a mission claim. | Representative material loses optical or electronic function under the validated exposure model. |

**Best first experiment.** A vacuum test of a centimetre-scale sail coupon should map reflectance, absorptance, thermal distortion, lateral restoring force, and loss of beam capture across controlled misalignment, beam-shape, and spin conditions. It must compare a candidate geometry against a flat specular control.

## 3. TIDEGILL — revised mechanism

### What survives

Fish gills offer a transport optimization analogy: lamellae increase transfer area but generate viscous resistance. The fish-gill study explicitly models the trade-off between transfer and pumping resistance and connects channel arrangement to mass-transfer performance [5]. NASA’s MOXIE demonstrates the oxygen-recovery principle from CO₂, but its process is CO₂-to-CO-plus-O₂, not CO₂-to-solid-carbon-plus-O₂ [6].

### What changes

TIDEGILL is split into two programmes.

1. **TIDEGILL Capture Cassette** tests whether a controlled lamellar counterflow geometry produces more captured CO₂ per combined fan-and-regeneration energy than a conventional monolith using the same capture material and inlet condition.
2. **TIDEGILL Carbon Cell** remains a separate laboratory electrochemistry project. It cannot inherit the capture cassette’s claimed advantage and does not claim battery-grade output before particle, impurity, conductivity and electrochemical qualification.

The ideal energy minimum for \(\mathrm{CO_2\rightarrow C+O_2}\) remains a lower thermodynamic bound, not a target energy consumption. NIST’s CO₂ data supports the direction and order of magnitude, but no production performance is inferred [7].

| Issue | Revision | Falsifier |
|---|---|---|
| Gill analogy could overstate selectivity. | Define it as a **channel-geometry** hypothesis only; sorbent chemistry must be benchmarked independently. | At matched sorbent mass and outlet target, no statistically / practically meaningful energy-normalized improvement occurs. |
| CO and O₂ interfaces needed stronger safeguards. | Process trains remain sealed and separated; oxygen dispatch is use-specific, not automatic atmospheric release. | Crossover, impurity, or emergency response test fails its defined safe limit. |
| Carbon product destination was too broad. | Create an explicit three-bin disposition: durable product, qualified speciality carbon, or carbon recycling with no removal credit. | Chain-of-custody / lifecycle mass balance cannot distinguish the bins. |

**Best first experiment.** A side-by-side 1–10 kg CO₂/day rig tests an instrumented lamellar cassette and conventional contactor, sharing the same sorbent inventory, inlet CO₂, humidity, pressure-drop cap, outlet target and calibrated electricity meters. The pre-registered metric is

\[
\Phi=\frac{\dot m_{\mathrm{CO_2,captured}}}{P_{\mathrm{fan}}+P_{\mathrm{regen}}},
\]

with degradation after cycling reported separately.

## 4. NEREID — revised mechanism

### What survives

A common protected capsule, shared energy spine, and fail-closed mode supervisor are valid safety-design concepts. FAA guidance now explicitly covers type, production and airworthiness certification for powered-lift aircraft [8]. That scope reinforces the need to separate aircraft certification evidence from road, surface-marine, and submersible evidence.

### What changes

NEREID is no longer framed as a single integrated consumer vehicle. It becomes the **NEREID Common Safety Capsule Platform**. A dry, protected capsule has standardised mechanical, electrical, data, thermal and emergency interfaces. It can be fitted with one verified kit at a time: road, restricted-flight, surface-water, or shallow-submersion. The full four-mode assembly is a late-stage experimental configuration, not a product requirement.

This change resolves a hidden assumption: flight-critical mass should not be permanently carried solely to enable a rare underwater function, and a pressure hull should not be presumed compatible with public-road crash loads or airframe fatigue without separate proof.

| Issue | Revision | Falsifier |
|---|---|---|
| Four domains were treated as concurrently practical. | Use interface-compatible, independently qualified kits; integrate sequentially. | The interface adds unacceptable mass / complexity or introduces cross-domain common-mode failure. |
| Deep-water imagery could mislead. | Restrict baseline to **shallow, uncrewed, controlled-basin** submersion. | Positive-reserve-buoyancy test fails after a loss-of-propulsion / sensor fault. |
| Mode-controller safety claim needed proof. | Define a fault-injection requirement: all unsafe transitions must be rejected by independent hardware, not only software. | A single fault permits an unsafe configuration or blocks recovery. |
| Consumer pathway was premature. | First objective is an instrumented, unmanned research platform. | A crewed test is proposed without vehicle-specific safety and certification evidence. |

**Best first experiment.** Build a capsule-interface rig with representative electrical isolation, mechanical locks, leak boundary and mode controller. Inject every single-fault case in a traceable matrix. No vehicle is flown, driven in public, or submerged with occupants until the rig proves the fail-closed state machine.

## Prior-art and novelty boundary

The re-audit finds known mechanism families near all four retained designs: fusion blanket / thermal storage integration, directed-energy lightsails, bio-inspired contactors and CO₂ electrolysis, and powered-lift / amphibious / underwater vehicles. Therefore none is described as legally novel or patentable. The defensible research contributions are **specific systems-integration hypotheses and test architectures**, each needing a bounded prior-art search before any novelty statement or IP filing.

## Re-audit conclusion

The best outcome is not an inflated promise. It is a better hierarchy of ideas:

1. **AURORA** is a fusion-adjacent thermal-containment research architecture.
2. **VEILIGHT** is a materials, photonics and dynamics research path for an uncrewed flyby probe.
3. **TIDEGILL** is a capture-contactor benchmark plus a separately gated carbon-electrochemistry programme.
4. **NEREID** is a common-safety-capsule platform with optional domain kits, not yet a four-mode consumer craft.

## References

[1] [ITER Organization, “Blanket.”](https://www.iter.org/machine/blanket)

[2] [U.S. Department of Energy, “sCO₂ Power Cycles.”](https://www.energy.gov/sco2-power-cycles)

[3] [NASA, “Directed Energy Interstellar Study.”](https://www.nasa.gov/general/directed-energy-interstellar-study/)

[4] [Gao, R., Kelzenberg, M. D. & Atwater, H. A., “Dynamically stable radiation pressure propulsion of flexible lightsails for interstellar exploration,” *Nature Communications* 15, 4203 (2024).](https://www.nature.com/articles/s41467-024-47476-1)

[5] [Park, K., Kim, W. & Kim, H.-Y., “Optimal lamellar arrangement in fish gills,” *PNAS* 111(22), 8067–8070 (2014).](https://www.pnas.org/doi/10.1073/pnas.1403621111)

[6] [NASA, “NASA’s Oxygen-Generating Experiment MOXIE Completes Mars Mission.”](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/)

[7] [NIST Chemistry WebBook, “Carbon dioxide.”](https://webbook.nist.gov/cgi/cbook.cgi?ID=C124389&Mask=1)

[8] [Federal Aviation Administration, “AC 21.17-4 — Type Certification—Powered-lift.”](https://www.faa.gov/regulations_policies/advisory_circulars/index.cfm/go/document.information/documentID/1044836)
