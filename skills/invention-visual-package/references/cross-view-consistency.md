# Cross-view consistency contract

Use this checklist before generation and during visual QA. The design lock is the package's single source of truth.

## Design lock

| Field | Required content |
|---|---|
| Invention name | One provisional name, used consistently |
| Use case | User, setting, conditions, excluded uses |
| Overall form | Shape, proportions, orientation, enclosure |
| Main assemblies | Stable names and identifiers |
| Component register | ID, exact name, location, purpose, relationships |
| Interfaces | Electrical, mechanical, fluidic, thermal, data, or other relevant interfaces |
| Dimensions | Value, units, datum, and status/provenance |
| Operating sequence | Stages, inputs, outputs, control loops, shutdown |
| Visual style | Palette, line weight, camera, rendering style, typography |
| Unknowns | Unverified performance, material, assembly, safety, or regulatory details |

## Consistency checks

- Preserve the silhouette and external dimensions between the hero image and orthographic views.
- Place each internal component consistently in the cross-section and exploded view.
- Reuse part IDs, names, and functions verbatim; do not silently renumber.
- Confirm that the exploded assembly plausibly forms the assembled device and the BOM covers its major parts.
- Match flow arrows and stage order between process diagrams and any flow depicted in the product cutaway.
- Do not add new features in application scenes that are absent from the design lock.
- Use one units system; state conversions and round consistently.
- Manually check all labels, numbers, screens, gauges, ports, connectors, seals, and small text.

## Evidence status

- **Supplied:** explicitly given by the user.
- **Sourced:** supported by a named external source.
- **Derived:** calculated from stated inputs.
- **Proposed:** selected for a concept but not tested.
- **Unresolved:** information/evidence is missing.

A convincing image does not move a proposed or unresolved claim into a verified category.
