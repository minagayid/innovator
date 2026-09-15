# TransistorMesh Re-Audit

## Original claim corrected

The original new-transistor/processor framing combined GAA, backside power, local mesh routing, low-voltage operation and advanced process claims without matched post-layout or silicon evidence. It is rejected as a new device or universal processor claim.

## Retained mechanism

For a fixed local integer workload, a trace-guided segmented signal fabric with local memory and explicit guard-band accounting may lower total useful-work energy versus matched conventional tile topologies. GAA/BSPDN is an optional future process flavour, not the defining evidence.

## Rejected paths

| Rejected path | Reason |
|---|---|
| Novel transistor claim | The proposed devices/process families are established or active advanced-CMOS directions. |
| Device-only energy comparison | Does not account for SRAM, wires, clock, leakage, PDN, control and workload behavior. |
| Arbitrary full-chip mesh | Likely adds capacitance/control overhead without an evidence-driven locality benefit. |
| Immediate GAA/BSPDN fabrication narrative | Requires authorized PDKs, foundry integration, extraction, test structures and thermal/reliability evidence. |

## Decisive falsifier

If a matched post-layout candidate consumes no less total workload energy than conventional bus/systolic baselines after repeaters, segmentation, memory, clock and PDN overhead, reduce or reject the mesh policy.

## Unresolved

Workload transferability, PDK availability, SRAM minimum-voltage behavior, detailed PDN/thermal extraction, silicon yield, reliability, GAA/BSPDN process access and commercial value remain unresolved.

## Scientific review additions

Eyeriss already demonstrates local reuse and direct processing-element
communication as accelerator mechanisms
([Chen, Emer & Sze, ISCA 2016](https://people.csail.mit.edu/emer/media/papers/2016.06.isca.eyeriss_architecture.pdf)).
The remaining hypothesis must therefore name a distinct segmentation/gating
policy and fixed mapping procedure before any comparison; this review is not a
legal novelty or patent opinion.

Include external-memory and I/O energy in the useful-work boundary, and match
the bus and systolic baselines for workload, output, precision, throughput,
capacity, PDK, and PVT/SRAM constraints. Report area, timing, and measured or
modeled energy uncertainty. Remove yield claims unless a defined target and
supporting yield/corner analysis are supplied; RTL or wire-only energy is not a
full-workload result.
