# MEL-SHIELD — Bio-Inspired Radiation Management Platform

> **Research boundary.** MEL-SHIELD copies selected material and redox phenomena associated with melanized fungi into a nonliving, multilayer radiation-management material. It does **not** destroy radioactive nuclei, replace spectrum-specific shielding analysis, or authorize human/spaceflight deployment.

## Executive finding

Ionizing radiation has been reported to change melanin's electronic properties, and melanized fungi showed radiation-associated growth effects in a laboratory study [1]. NASA continues to study melanin pigmentation and fungal DNA-repair pathways in spaceflight biology [2]. These observations justify a **materials research question**, not a claim that a fungus can “eat” or terminate radiation.

The retained architecture is:

```text
fungal biology as inspiration
        ↓
sequence-free pathway and material research
        ↓
purified melanin / melanin-like material
        ↓
nonliving composite coupon
        ↓
hydrogen-rich and neutron-management layers
        ↓
calibrated spectrum-specific testing
```

Hydrogen-rich materials such as polyethylene are already recognized as useful candidates for many space-radiation conditions, while boron-containing materials can contribute to neutron management [3] [4]. Melanin is therefore an additive or interface hypothesis, not the sole shield.

## Package map

| Artifact | Purpose |
|---|---|
| [`REFINED_DESIGN.md`](REFINED_DESIGN.md) | Corrected radiation claim, sequence-free biology map, material/device architecture and qualification gates. |
| [`RE_AUDIT.md`](RE_AUDIT.md) | Adversarial claim audit and no-deployment boundary. |
| [`simulation/MODEL_SPEC.md`](simulation/MODEL_SPEC.md) | Finite areal-mass accounting; no attenuation claim. |
| [`simulation/EXTERNAL_CONSTRAINTS_LEDGER.md`](simulation/EXTERNAL_CONSTRAINTS_LEDGER.md) | Source-backed radiation, biosafety and evidence constraints. |
| [`schematics/`](schematics/) | Architecture, state machine and qualification sequence sources. |

## Candidate portfolio

| Candidate | Mechanism | Status |
|---|---|---|
| A — MEL-SHIELD | Melanin-containing nonliving composite added to a conventional multilayer shield. | **Continue** as coupon research. |
| B — MEL-CONVERTER | Radiation-induced electronic/redox change coupled to a test electrochemical interface. | **Speculative**; useful output and efficiency unresolved. |
| C — MEL-REMEDIATOR | Melanin-containing sorbent or coating for radionuclide immobilization and monitored handling. | **Research**; radionuclide selectivity and waste qualification unresolved. |

## Reproduction

The finite model only calculates declared layer areal mass and sensitivity to thickness. It does not model dose, spectrum, secondary radiation, thermal aging or human exposure.

```bash
python3 simulation/test_model.py
python3 simulation/model.py
```

## References

[1] [Dadachova et al., “Ionizing Radiation Changes the Electronic Properties of Melanin and Enhances the Growth of Melanized Fungi,” *PLOS ONE* (2007).](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0000457)

[2] [NASA Science, “Investigating the Roles of Melanin and DNA Repair on Adaptation and Survivability of Fungi in Deep Space.”](https://science.nasa.gov/biological-physical/investigations/melanin-and-dna-repair/)

[3] [NASA, “Radiation Analysis and Shielding Design.”](https://ddtrb.larc.nasa.gov/radiation/)

[4] [NASA, “Real Martians: How to Protect Astronauts from Space Radiation on Mars.”](https://www.nasa.gov/science-research/heliophysics/real-martians-how-to-protect-astronauts-from-space-radiation-on-mars/)

[5] [NIH, “NIH Guidelines for Research Involving Recombinant or Synthetic Nucleic Acid Molecules” (April 2024).](https://osp.od.nih.gov/wp-content/uploads/NIH_Guidelines.pdf)

