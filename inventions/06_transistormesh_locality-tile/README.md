# TransistorMesh — Locality-and-Guard-Band Accelerator Tile

TransistorMesh is a **process-portable accelerator-tile hypothesis**, not a new transistor or a universal processor design. Its mechanism is trace-guided locality plus a segmented local fabric and explicit power-delivery guard-band accounting. GAA/BSPDN is optional and requires a separately authorized/calibrated process flow.

| Artifact | Role |
|---|---|
| [`REFINED_DESIGN.md`](REFINED_DESIGN.md) | Claim boundary, Rev-A architecture, matched-baseline requirement, test gates and proof gaps. |
| [`RE_AUDIT.md`](RE_AUDIT.md) | Original-claim correction, rejected paths, falsifier and unresolved obligations. |
| [`simulation/MODEL_SPEC.md`](simulation/MODEL_SPEC.md) | Required workload-matched post-layout energy accounting and negative controls. |
| [`schematics/transistormesh_architecture.mmd`](schematics/transistormesh_architecture.mmd) | Source schematic. |
| [`schematics/transistormesh_architecture.png`](schematics/transistormesh_architecture.png) | Rendered technical architecture. |

> A favorable modeled comparison supports only the stated implementation method on the stated workload and flow. It does not establish silicon performance, foundry access, GAA/BSPDN viability, yield, reliability, a new transistor or general-purpose CPU superiority.
