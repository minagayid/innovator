# Research Ledger — Invention Design Program

**Status key:** sourced = directly supported by a cited source; inferred = logical engineering conclusion from sources; proposed = new conceptual design; unresolved = requires further evidence or experiment.

## Scope and safety boundary

This program treats all high-energy systems as **conceptual, non-operational engineering research**. It does not provide instructions to build nuclear, fusion, explosive, or propulsion systems. Every physics claim must conserve energy, mass, momentum, and entropy, and each design must state a falsifier.

## Evidence collected — 23 August 2026

| Topic | Claim | Evidence status | Design implication | Source |
|---|---|---|---|---|
| Fusion energy | ITER’s actively cooled blanket is designed to protect structures and magnets, slow fusion neutrons, and turn their kinetic energy into collected heat; the cited design removes up to 736 MW thermal power. | Sourced | A viable power-plant architecture must treat plasma confinement and heat capture as distinct systems; it cannot extract energy directly from the plasma as “pure energy.” | [ITER Blanket](https://www.iter.org/machine/blanket) |
| Fusion energy | ITER identifies plasma-facing materials, heat flux, neutron shielding, cooling, and tritium self-sufficiency as coupled engineering constraints. | Sourced | The core innovation target should be distributed thermal interception, replacement, and fault isolation—not an unbounded energy-release mechanism. | [ITER Blanket](https://www.iter.org/machine/blanket) |
| Inertial fusion | NIF has demonstrated target-level ignition: it describes a fusion output greater than laser energy delivered to the target, but this is not equivalent to whole-facility net electrical energy. | Sourced | The energy concept must not claim grid-positive inertial fusion without driver-efficiency and repetition-rate evidence. | [LLNL — Achieving Fusion Ignition](https://lasers.llnl.gov/science/achieving-fusion-ignition) |
| CERN context | CERN and Fusion for Energy collaborate on enabling technologies such as high-temperature superconducting magnets, materials, engineering and systems; CERN is not described as operating a commercial or grid-producing fusion-energy source. | Sourced | Correct user premise gently: CERN contributes enabling technology and fusion collaboration; ITER and NIF are more direct fusion references. | [CERN–F4E framework agreement](https://home.cern/cern-and-fusion-energy-advancing-together/) |
| CO₂ oxygen recovery | NASA’s MOXIE demonstrated electrochemical extraction of one oxygen atom from each CO₂ molecule and produced 9.8 g O₂ in its final run under Mars conditions. | Sourced | A CO₂-to-O₂ submodule is physically demonstrated at a small scale, but it leaves carbon monoxide rather than stable elemental carbon. | [NASA MOXIE mission result](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/) |

## Initial correction and feasibility framing

The phrase **“pure energy” is not a physical output category**. Fusion releases energy as heat, high-energy particles, radiation, and—in deuterium–tritium fusion—mostly fast neutrons. The correct design question is how to **contain, absorb, convert, buffer, and reject** those energy flows without loss of control. In addition, oxygen cannot simply be released into the atmosphere as a universal benefit; the proper destination depends on air-quality regulation, local oxygen balance, fire risk, and demand. Captured carbon is not automatically suitable for batteries or coal manufacturing; product pathways must meet material specifications and must be assessed against permanence and lifecycle emissions.

## Research vocabulary to guide the next phase

| Design area | Mechanism vocabulary | Quantitative constraints |
|---|---|---|
| Fusion power | magnetic confinement, plasma-facing component, blanket, divertor, molten-salt intermediate loop, Brayton cycle, thermal storage, tritium breeding | heat flux, neutron damage, availability, thermal efficiency, decay heat, tritium inventory |
| Relativistic travel | specific energy, relativistic kinetic energy, momentum conservation, power beaming, sail areal density, acceleration distance, dust shielding, deceleration | \(\gamma\), \(E_k=(\gamma-1)mc^2\), beam divergence, waste heat, radiation dose |
| CO₂ processing | contactor, carbonic anhydrase mimic, humidity swing, electro-swing, bipolar membrane, solid oxide electrolysis, electroreduction, carbon black, graphite, life-cycle analysis | capture rate, pressure drop, energy per mol, selectivity, product purity, oxygen demand |
| Multimodal vehicle | road chassis, hydrofoil, submersible pressure hull, electric ducted fan, buoyancy, distributed electric propulsion, certification, crashworthiness | mass fraction, wing loading, pressure depth, buoyancy reserve, range, noise, redundancy |

## Design stop conditions

1. Reject any concept that appears to create energy, produce net thrust without reaction momentum or photon momentum, or treats an ignition result as a power plant.
2. Reject CO₂ concepts that claim direct stable carbon plus oxygen without specifying energy input and reaction pathway.
3. Treat a single vehicle that is simultaneously road legal, certified to fly, and certified for deep submergence as a high-risk system-of-systems; retain only a bounded shallow-water demonstrator unless mass and certification constraints can be reconciled.

| Interstellar propulsion | NASA’s 2015 NIAC DEEP-IN study describes a **futuristic but technically credible concept** combining directed energy propulsion with wafer-scale spacecraft, intended for small probes; its page explicitly says technological challenges are formidable. | Sourced | The near-light-speed variant must be restricted to an uncrewed, wafer-scale flyby probe and cannot claim a near-term crewed vehicle or arrival/deceleration capability. | [NASA DEEP-IN study](https://www.nasa.gov/general/deep-in-directed-energy-propulsion-for-interstellar-exploration/) |

## Mechanism correction — CO₂ separation

The requested phrase “separating the carbon and oxygen” represents the reaction \(\mathrm{CO_2 \rightarrow C + O_2}\), which is **uphill in free energy**. It cannot operate as a passive gill. NASA’s MOXIE pathway performs \(\mathrm{2CO_2 \rightarrow 2CO + O_2}\); further conversion of carbon monoxide to stable elemental carbon requires additional energy and process units. The proposed system therefore must use renewable electricity and must account for the resulting carbon monoxide, oxygen, water, heat, and product purity.

## Mechanism correction — relativity

For a dry spacecraft mass \(m\), the minimum kinetic energy to accelerate from rest to velocity \(v\) is \(E_k=(\gamma-1)mc^2\), where \(\gamma=(1-v^2/c^2)^{-1/2}\). This ideal lower bound excludes driver losses, beam spill, radiation, shielding, payload systems, and deceleration. Any physically honest design must state both energy and momentum source; a fusion reactor alone does not supply thrust without reaction mass or a photon/particle beam.

| Multimodal vehicle | The FAA’s Advanced Air Mobility material treats powered-lift as an aviation category and links certification, production, airworthiness, pilot/operational rules, and vertiport requirements. | Sourced | A flying-road-water prototype must be treated as multiple regulated vehicles. The first concept phase should not promise a single all-jurisdiction road-certified, air-certified, and deep-submersible consumer craft. | [FAA Advanced Air Mobility](https://www.faa.gov/air-taxis) |

## Emerging system boundary — metamorphic vehicle

A four-domain vehicle faces an unusually severe mass contradiction: wings/rotors and energy storage add mass to a boat; road crash structure adds mass to an aircraft; a pressure hull, ballast, and reserve buoyancy add mass to both. The proposed design must therefore **separate modes in time and depth**. The retained concept will be a low-altitude/eVTOL-capable **two-seat demonstrator**, surface-water capable, and restricted to **shallow controlled submersion** (for example, a few metres) in a protected test basin. A deep-diving consumer submarine is excluded from the baseline concept until pressure-hull structural validation and regulatory pathways are established.

| Biomimetic contactor | A PNAS modeling and biological-comparison study reports that fish-gill lamellae balance increased transfer area against viscous pumping resistance; its result is directly relevant to microchannel mass-transfer geometry, not to a claim of passive CO₂ decomposition. | Sourced | The proposed contactor will transfer the **geometry and pressure-drop optimization problem**—nested lamellae, counterflow, and controllable channel spacing—while providing an electrochemical or sorbent driving force separately. | [Park, Kim & Kim, *PNAS* (2014)](https://www.pnas.org/doi/10.1073/pnas.1403621111) |

## Clarification on biological transfer

The fish-gill analogy is **structural, not chemical**. Its transferable mechanism is the coupled optimization of wetted area, diffusion path, counterflow, and pumping loss. Its non-transferable conditions include aqueous oxygen diffusion, living tissue repair, blood chemistry, and metabolic pumping. The CO₂ system must independently solve selectivity, sorbent regeneration, water management, corrosion, electrical energy demand, and safe handling of oxygen and carbon monoxide.

## Visual-design validation

The single combined systems diagram rendered at an unusably compressed height for its width. It is retained as source only and will be replaced by separate, legible per-invention diagrams in the final package.

The standalone AURORA and TIDEGILL diagrams render at a legible scale and correctly preserve the stated architecture: AURORA separates heat, buffering, conversion, and relief paths; TIDEGILL separates capture, Train A, Train B, safety, and product custody. The remaining standalone diagrams use the same visual approach.

## Re-audit note — VEILIGHT evidence access

A current primary open-access lightsail-stability article was located but its publisher page presented a browser-verification barrier in this session. Its search metadata identifies dynamically stable, spin-stabilized flexible lightsail shapes as a specific research direction; it is retained as a **lead**, not independently extracted evidence. VEILIGHT’s revised dossier will therefore require a subscale beam-riding experiment and will avoid presenting a passive self-stabilizing sail as established for the required operating regime.

## Re-audit note — NEREID certification boundary

The FAA’s active AC 21.17-4 (issued 18 July 2025) explicitly addresses type, production, and airworthiness certification for powered-lift aircraft. This confirms that the NEREID concept must maintain a dedicated aviation evidence stream alongside its road and water streams. The revised concept will downgrade its integrated crewed demonstration claim and introduce a **single-domain-at-a-time test article sequence** with no crewed water-to-air transition until independently reviewed.

