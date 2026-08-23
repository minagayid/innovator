# TransistorMesh — Locality-and-Guard-Band Accelerator Tile

**Evidence class:** proposed digital-architecture and physical-design research programme. This document is not a transistor invention claim, foundry-process release, PDK, layout signoff, tape-out recommendation, energy-efficiency guarantee, yield estimate, or processor product specification.

## Claim boundary

TransistorMesh does **not** claim a new semiconductor device, a transparent processor, a foundry-ready GAA process, or universal superiority over conventional CPUs/accelerators. GAA nanosheets and backside power delivery are active advanced-CMOS directions with substantial integration and design-technology co-optimization requirements [1] [2].

> The retained hypothesis is that a workload-mapped, segmented local signal fabric plus local data reuse and an explicit supply-guard-band budget can reduce **total useful-work energy** for a matched low-to-moderate-speed integer accelerator tile. GAA/BSPDN may later be an implementation flavour; it is not the initial proof vehicle.

## Proposed Rev-A architecture

| Layer | Rev-A element | Boundary |
|---|---|---|
| Arithmetic | INT8/INT4 MAC or narrow SIMD lanes with clock/power gating. | No general-purpose CPU performance claim. |
| Storage | Per-cluster register files and local SRAM banks selected by workload footprint. | SRAM operating voltage remains an independent constraint. |
| Signal fabric | Nearest-neighbour links segmented by isolation/gating; a low-activity global control path. | Not an arbitrary full-chip mesh or a new transistor fabric. |
| Mapping | Compiler/static scheduler places high-reuse operands within a locality window. | No energy benefit is assumed unless trace data demonstrates locality. |
| Supply model | Explicit PDN, IR-drop and guard-band accounting in a matched implementation flow. | BSPDN is modelled only when the PDK/flow supports it. |
| Optional process flavour | Standard CMOS baseline first; advanced GAA/BSPDN comparison only through an authorized/calibrated PDK or foundry collaborator. | No fabricated GAA/BSPDN result is implied. |

## First falsifiable mechanism

For a matched workload, precision, throughput target, memory capacity and implementation flow:

\[
E_{\mathrm{useful}} = E_{\mathrm{logic}} + E_{\mathrm{local\ wire}} + E_{\mathrm{memory}} + E_{\mathrm{clock}} + E_{\mathrm{leakage}} + E_{\mathrm{PDN}} + E_{\mathrm{control}}.
\]

The candidate is accepted only when:

\[
E_{\mathrm{useful,candidate}} < E_{\mathrm{useful,baseline}}
\]

at matched functional output and declared timing/yield assumptions. A wire-only estimate, device-only comparison, or synthetic operation count cannot establish this result. The selected baseline is a same-function tile with local buses or a conventional systolic/routed data path under the same PDK, constraints and workload trace.

| Case | Intended condition | Discriminating outcome |
|---|---|---|
| Baseline A | Conventional local bus / placed-and-routed tile. | Establishes total energy, congestion, timing and memory movement. |
| Baseline B | Local systolic or nearest-neighbour design without candidate segmentation policy. | Separates generic locality benefit from the proposed gating/mapping policy. |
| Candidate | Segmented local fabric plus trace-guided operand placement and guard-band accounting. | Must reduce full-workload energy after all overheads. |
| Negative control | Over-meshed/unsegmented fabric or random workload mapping. | Must expose capacitance, repeater/control, or traffic overhead that defeats energy gains. |

## Validation and test gates

| Gate | Evidence | Pass/reframe criterion |
|---|---|---|
| Workload trace | Operand reuse, communication distance, activity and memory-access trace for a fixed integer workload. | If data movement is not local enough, use a conventional data path rather than force a mesh. |
| Matched implementation | Same PDK/design rules, constraints, memory macros, precision and throughput for all cases. | If comparison cannot be matched, publish it as a methodology experiment, not a PPA claim. |
| Post-layout energy | Extracted wire/switching, memory, clock, leakage and PDN/guard-band budget. | If candidate overhead eliminates the energy gain, reject or redesign the segmentation policy. |
| Voltage/frequency sweep | Energy, timing and failure/yield-model sensitivity over declared operating points. | If guard-band or SRAM limits erase the target point, reframe the architecture around its reachable operating point. |
| Physical test path | MPW/shuttle test structures only after a qualified flow exists. | No leading-node, GAA or BSPDN hardware claim without foundry/PDK access and measured silicon. |

## Process and manufacturing boundary

The first practical result is a **process-portable design study**, not a new fabrication flow. It can begin with a permitted educational/research PDK or FPGA/ASIC implementation proxy, provided that its limitations are stated. Advanced GAA/BSPDN results require a foundry-authorized PDK, extracted design flow, test-chip plan, parametric monitors and reliability assessment. Backside power delivery adds wafer thinning, backside alignment, nano-via/contact and thermal-integration challenges that cannot be inferred from RTL [1] [2].

## Proof-gap ledger

| A passing result would support | It would not establish | Next required evidence |
|---|---|---|
| A particular local mapping/fabric reduces modeled total workload energy. | Fabricated energy, GAA/BSPDN viability, yield, reliability or general-purpose processor advantage. | Matched post-layout study with recorded scripts and power reports. |
| An authorized PDK study shows a power-delivery benefit. | Commercial process availability, silicon yield or a new-transistor invention. | Foundry-supported shuttle with PDN, SRAM, mesh and thermal test structures. |
| A test chip improves a measured workload metric. | Transferability to arbitrary workloads/nodes. | Cross-workload, corner, aging and temperature replication. |

## References

[1] [imec, “Backside power delivery options: a DTCO study” (2023).](https://www.imec-int.com/en/articles/backside-power-delivery-options-dtco-study)

[2] [Horiguchi and Beyne, “Backside power delivery,” imec (2022).](https://www.imec-int.com/en/articles/how-power-chips-backside)

[3] [Zhang et al., “New structure transistors for advanced technology node CMOS ICs,” *National Science Review* (2024).](https://pmc.ncbi.nlm.nih.gov/articles/PMC10883695/)
