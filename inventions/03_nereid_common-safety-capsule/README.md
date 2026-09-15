# NEREID Common Safety Capsule Platform

NEREID is no longer presented as a single consumer car that is simultaneously road-legal, air-certified, sea-capable and deep-diving. It is a **common protected capsule** with standard interfaces for road, restricted-flight, surface-water and shallow-submersion kits. Each kit must earn its own evidence before it is connected to the capsule or another domain is considered.

| Document | Role |
|---|---|
| [`REFINED_DESIGN.md`](REFINED_DESIGN.md) | Refined physical architecture, safety invariant, kit definitions, manufacturing sequence and decisive fault test. |
| [`RE_AUDIT.md`](RE_AUDIT.md) | Adversarial review of the original all-mode assumption, structural and certification conflicts, and corrected scope. |
| [`assets/`](assets/) | Concept render and refined capsule-platform systems diagram. |
| [`supporting/`](supporting/) | Earlier full design dossier and source ledger. |
| [`simulation/`](simulation/) | Reproducible road, static-lift, buoyancy, shallow-submersion response-proxy and pre-entry supervisor screens, with controls and JSON/plot evidence. |
| [`schematics/`](schematics/) | Conceptual common-capsule, pre-entry supervisor and qualification-sequence schematics; recovery paths are not validated actions. |

The programme begins with an uncrewed capsule-interface rig, not a flying car. The rig must be able to inject lock, sensor, leak, power, transition and propulsion faults. Pre-entry faults must deny unsafe admission; active-mode response and physical recovery remain unvalidated and require separate hardware-in-the-loop evidence.

> The late four-mode configuration is a research experiment, not a promised product. Public roads, public airspace, crewed water-to-air transitions and deep submersion are all out of scope until separately substantiated.
