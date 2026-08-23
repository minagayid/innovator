# NEREID Common Safety Capsule Platform

NEREID is no longer presented as a single consumer car that is simultaneously road-legal, air-certified, sea-capable and deep-diving. It is a **common protected capsule** with standard interfaces for road, restricted-flight, surface-water and shallow-submersion kits. Each kit must earn its own evidence before it is connected to the capsule or another domain is considered.

| Document | Role |
|---|---|
| [`REFINED_DESIGN.md`](REFINED_DESIGN.md) | Refined physical architecture, safety invariant, kit definitions, manufacturing sequence and decisive fault test. |
| [`RE_AUDIT.md`](RE_AUDIT.md) | Adversarial review of the original all-mode assumption, structural and certification conflicts, and corrected scope. |
| [`assets/`](assets/) | Concept render and refined capsule-platform systems diagram. |
| [`supporting/`](supporting/) | Earlier full design dossier and source ledger. |

The programme begins with an uncrewed capsule-interface rig, not a flying car. The rig must be able to inject lock, sensor, leak, power, transition and propulsion faults. Every credible single fault must deny unsafe entry to a more hazardous mode and end in a controlled, recoverable state.

> The late four-mode configuration is a research experiment, not a promised product. Public roads, public airspace, crewed water-to-air transitions and deep submersion are all out of scope until separately substantiated.
