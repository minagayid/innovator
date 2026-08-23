# TIDEGILL Carbon Cell — Manufacturing and Supply-Chain Roadmap

**Status:** A gated research-manufacturing plan for a **sealed direct-carbon electrochemistry module**, not a factory design, battery-material specification, investment case, or operating procedure.  
**Scope:** The roadmap covers buildability, traceability, supplier qualification, quality evidence, and staged integration of a research cell. It deliberately excludes reaction recipes, operating set-points, proprietary cell chemistry, and any claim that direct CO₂-to-solid-carbon technology is commercially mature.

## 1. Manufacturing objective and boundary

The first product is not a commercial carbon material. It is a **research module** that can generate an auditable dataset on carbon deposition, energy input, mass balance, component degradation and off-gas integrity. This boundary is essential because the literature identifies strong C–O bonding and electrode degradation as commercialization barriers for direct solid-carbon routes [1]. Broader CO₂-electrolysis scale-up literature likewise identifies durability, systems standardization, product purity, productivity and reliability as the transition bottlenecks between laboratory studies and industrial systems [2].

> **TIDEGILL’s make-or-break proposition** is not “turn captured carbon into batteries.” It is whether a sealed, serviceable research module can demonstrate repeatable material balance and component lifetime with a controlled quality record. Any battery use remains a separate customer-qualification programme.

## 2. System-of-systems design

| Module | Physical role | Build strategy | Manufacturing readiness gate |
|---|---|---|---|
| Feed and buffer skid | Receives a controlled CO₂ stream from the capture programme; records flow, impurity envelope and custody. | Buy standard industrial-grade sensing and containment components; custom only the mounting and data interface. | Feed composition, ingress and mass-flow logging are independently verified. |
| Sealed carbon-cell enclosure | Provides a maintainable containment boundary for an R&D electrochemical stack and compatible thermal hardware. | Contract a qualified high-temperature / specialty process-skid fabricator for enclosure, vessel and penetration design. | Independent pressure/leak, electrical-isolation, guarding and maintainability review. |
| Cell stack cassette | Houses research electrodes, electrolyte containment, current collection and removable coupons. | Use a configuration-controlled cassette with serialised parts and no unreviewed material substitutions. | Coupon-to-coupon dimensional, electrical-contact and leakage repeatability demonstrated. |
| Power and control cabinet | Supplies measured electrical energy and records interlocks, voltage, current and status. | Use industrial power and PLC / safety-relay components; integrate through an electrical panel builder. | Electrical inspection, interlock proof test, event-log retention and emergency-stop test. |
| Gas-management train | Segregates process gases, sample ports and defined treatment / recycle interfaces. | Use double-contained tubing where justified, compatible regulators and analyzers from qualified vendors. | Leak / crossover validation, analyzer calibration and credible abnormal-condition response. |
| Carbon handling and packaging | Collects and transfers recovered solid only within a controlled enclosure and batch record. | Use contained material-handling tools and serialised sample containers; outsource advanced characterization. | Batch identity, mass balance, contaminant screen and disposition record complete. |
| Data / MRV layer | Joins feed, energy, gas, solid, calibration and maintenance records. | Version-controlled protocol, append-only run ledger and calibration register. | A third party can reconstruct one run’s inputs, outputs, exceptions and instruments. |

## 3. Product architecture: design for regeneration

The physical design should be **cassette-first**. Feed conditioning, power electronics, analyzers, containment, and carbon collection must be separately replaceable so a failure produces a bounded maintenance action rather than an undocumented rebuild. Each installed part receives a configuration identifier, supplier lot, material certificate where applicable, incoming-inspection result and life-to-date operating history.

The minimum controlled interfaces are mechanical mounting, power, sensor bus, gas / process boundary, sample custody and shutdown state. A module cannot progress to the next gate unless its interfaces are explicitly frozen for that gate. This makes it possible to regenerate the same setup, compare runs across time and identify whether changes in performance originate in the cell, the feed, the power system or the measurement chain.

## 4. Supply-chain architecture

### 4.1 Source by component class, not by one supplier

No supplier is named as an approved vendor in this roadmap. The procurement team must qualify at least two credible sources for every non-proprietary, long-lead or safety-critical component class. This protects the programme from a false dependency on a single brand while preserving engineering control.

| Component class | Required supplier capability | Second-source requirement | Incoming acceptance evidence | Primary risk |
|---|---|---|---|---|
| Research electrodes / current collectors | Documented composition, lot control, compatible high-temperature / electrochemical use, small-batch reproducibility. | At least one qualified alternate material / fabricator route. | Certificate of analysis, dimensions, visual inspection, baseline electrical measurement. | Degradation, impurity transfer, uncontrolled geometry. |
| Electrolyte / containment material | Full composition disclosure to the R&D safety team, batch traceability and compatible packaging. | Alternate source or qualified inventory buffer. | CoA, packaging integrity, contaminant-screen plan and SDS review. | Contamination, storage damage, unknown impurity profile. |
| Refractory / insulation / enclosure materials | Service-temperature compatibility, traceable grade and controlled machining. | Two fabricators or a fabrication drawing package transferable to a second shop. | Material cert, dimensional inspection and heat / compatibility assessment. | Cracking, permeability, thermal cycling failure. |
| Seals, fittings and tubing | Declared media compatibility, pressure / temperature range and lot traceability. | Multiple industrial distributors or manufacturers. | Part-number match, serial / lot record, visual and pressure test. | Leak, incompatible elastomer / metal, counterfeit parts. |
| Power electronics and sensors | Industrial duty ratings, calibration path, accessible datasheets and support horizon. | Approved alternates for every single-point failure sensor. | Functional test, calibration certificate and firmware version record. | Measurement drift, obsolescence, untraceable failure. |
| Gas analyzers and sampling hardware | Calibratable for expected stream classes and compatible with safe sample custody. | Redundant / cross-check method for critical species. | Calibration traceability, zero/span record, response-time check. | False purity / mass-balance claim. |
| Carbon sample containers | Inert, sealed, serialized and laboratory-compatible. | Commodity second source. | Closure integrity, tare mass and identifier check. | Sample mix-up, moisture / airborne contamination. |
| Skid fabrication and panel assembly | Documented quality system, process-skid experience, drawing revision control and inspection capability. | One alternate fabricator can build from released package. | FAT dossier, weld / assembly records where applicable, electrical test reports. | Uncontrolled field modification. |

### 4.2 Responsible sourcing and strategic risk

The battery-material pathway must not be used to justify premature production. Any recovered solid is initially a **research sample**. It can be reclassified only after lot-specific evidence covers composition, morphology, conductivity, electrochemical behaviour, safety and customer requirements. This reflects the broader scale-up literature’s emphasis on product purity, productivity, stability and system reliability, rather than laboratory selectivity alone [2].

| Risk type | Mitigation | Trigger for redesign rather than procurement escalation |
|---|---|---|
| Critical-material / specialty fabrication delay | Maintain a qualified alternate design envelope and limited safety-stock policy for research consumables. | Lead time prevents repeatable experiments or forces an undocumented material substitution. |
| Quality drift | Coupon retain samples, incoming acceptance and trend charts by supplier lot. | Property shift cannot be isolated from run-to-run electrochemical change. |
| Obsolete instrument | Require protocol-based calibration and standard interfaces; archive raw data in non-proprietary formats. | A vendor lock-in prevents independent reconstruction of a run. |
| Carbon-product contamination | Closed sample handling, blanks, witness coupons and outsourced independent characterization. | Purity claim cannot distinguish deposited solid from equipment / ambient contamination. |
| Lifecycle claim inflation | Maintain a boundary-specific ledger for CO₂ feed, electricity, losses, product disposition and re-emission. | Any public removal claim lacks a documented storage-duration and end-of-life pathway. |

## 5. Manufacturing work packages

### WP-1 — Requirements and design freeze

Deliver a safety-reviewed functional specification, interface-control document, hazard register, preliminary bill of materials, equipment layout, data schema and gate-specific test plan. Do **not** release custom fabrication until the design identifies every safety-critical sensor, interlock, containment boundary and emergency state.

### WP-2 — Supplier prequalification and first articles

Release non-hazardous mechanical first articles and panel / enclosure mockups. The objective is not production yield; it is repeatable fit, inspectability, assembly access, tool clearances and configuration management. Material compatibility decisions remain under qualified electrochemical and safety review.

### WP-3 — Cell-cassette build and bench integration

Build the cassette as a serialized test article. Integrate it only after the enclosure, electrical cabinet and analyzer chain have separately passed their factory acceptance tests. Acceptance evidence must include as-built drawings, wiring verification, programmed interlock test results, sensor calibration records and a configuration baseline.

### WP-4 — Contained R&D campaigns

Run only approved test protocols with a hold-point review after each campaign. The output is a batch record: feed identity, energy input, electrical trace, analyzer results, recovered-solid mass, carbon / oxygen / CO accounting, maintenance actions, anomalies and sample disposition. A result with incomplete traceability is not a product-quality result.

### WP-5 — Independent characterization and design update

Send blinded or witness samples to an appropriate independent laboratory for agreed characterization. Compare measured product properties to the programme’s research specification, not to a battery-grade marketing claim. Use the result to issue a controlled design change, not an undocumented operator adjustment.

## 6. Quality system and release gates

| Gate | Required evidence | Decision |
|---|---|---|
| **G0 — Research architecture** | Requirements, model boundary, hazard review, source map, sample-custody plan. | Authorise non-energized mockup only. |
| **G1 — Mechanical / electrical first article** | Dimensional inspection, electrical segregation, enclosure integrity, interlock function. | Authorise inert integration. |
| **G2 — Inert commissioning** | Data logging, analyzer calibration, shutdown and recovery sequence, leak / crossover check. | Authorise controlled R&D campaign. |
| **G3 — Repeatable research output** | Multiple traceable runs; carbon, energy and gas balance; degradation trend; retained samples. | Authorise independent characterization. |
| **G4 — Materials decision** | Independent characterization, lifecycle boundary review, component-life data and two-source procurement plan. | Decide whether to continue research, redesign, or stop. |
| **G5 — Pilot readiness** | Third-party process-safety, quality-system and manufacturability reviews; customer specification only if a target market is named. | Pilot only under a separate approved programme. |

## 7. KPIs that prevent self-deception

Laboratory metrics must not be used alone. The roadmap tracks electrical input per recovered mass, product purity / contamination, carbon efficiency, material throughput, cell degradation, equipment availability, analyser drift, and complete custody of every batch. The scale-up review of CO₂ electrolysis separates laboratory indicators from industrial KPIs such as product purity, productivity, capacity, reliability, capital expenditure and operating expenditure [2].

| Metric | Meaning | Minimum reporting rule |
|---|---|---|
| Energy per recovered solid mass | Electricity intensity for the stated boundary. | Report with feed conditioning and auxiliary loads stated separately. |
| Carbon material balance | CO₂ received, converted, emitted, captured in product and held in waste. | Reconcile to the stated measurement uncertainty. |
| Solid quality panel | Composition, morphology and contaminant profile. | State analytical method, detection limits and chain of custody. |
| Electrode / cassette lifetime | Change in response versus cycles / operating time. | Report failure mode and whether a component was replaced. |
| Availability | Fraction of scheduled time with instrumented, valid operation. | Separate planned maintenance from fault downtime. |
| Safety integrity | Interlock, leak, gas-monitor and emergency-action test result. | Record every bypass; no bypass is allowed to become normal operation. |

## 8. Commercialization and deployment boundary

A direct-carbon module should not be sold as a battery-material source, carbon-removal plant or oxygen supplier until it has a specifically validated product pathway. CO₂ electrolysis is an active scale-up field, yet the review literature identifies durability and systems-oriented standardization as core lab-to-market bottlenecks [2]. Direct solid-carbon electroreduction has multiple proposed approaches but still faces electrode-degradation barriers [1]. MOXIE demonstrates oxygen extraction from CO₂ in a specific space-technology context; it supports the general need to measure product purity and system performance, not a transfer of its performance to TIDEGILL [3].

The practical first commercializable deliverable is therefore **a research-grade, traceable electrochemistry module and dataset**, supplied only to qualified R&D partners under a controlled test and safety framework. All other commercial claims require separate proof.

## References

[1] [Han, X. et al., “Electrochemical Reduction of Carbon Dioxide to Solid Carbon: Development, Challenges, and Perspectives,” *Energy & Fuels* 37(17), 12665–12684 (2023).](https://pubs.acs.org/doi/10.1021/acs.energyfuels.3c02204)

[2] [Belsa, B., Xia, L. & García de Arquer, F. P., “CO₂ Electrolysis Technologies: Bridging the Gap toward Scale-up and Commercialization,” *ACS Energy Letters* 9(9), 4293–4305 (2024).](https://pmc.ncbi.nlm.nih.gov/articles/PMC11406523/)

[3] [NASA, “NASA’s Oxygen-Generating Experiment MOXIE Completes Mars Mission.”](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/)
