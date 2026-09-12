# MYCO-CLEAN — Contained Plastic Recovery Platform

> **Research boundary.** MYCO-CLEAN is a proposed closed-loop collection, sorting, pretreatment, enzyme-reactor and product-recovery platform. It does **not** authorize environmental release of engineered fungi, claim that all plastics can be biologically dissolved, or establish a commercial or marine-deployment design.

## Executive finding

The useful version of the plastic-eating-fungus idea is a **contained biocatalysis platform**, not a released organism. PET is the first target because a two-enzyme PET depolymerization pathway is experimentally established, and an engineered PET depolymerase has been demonstrated in a laboratory recycling context [1] [2]. Polyethylene remains an early-stage research target: a marine-fungus study measured UV-pretreated PE mineralization at 0.044% of the initially added PE per day under its stated laboratory conditions [3].

MYCO-CLEAN therefore separates the system into four boundaries:

1. **Collection:** remove plastic from a controlled water stream or shoreline interception point.
2. **Identification:** classify polymer and contamination with optical/NIR sensing.
3. **Biocatalysis:** use purified or immobilized enzymes in closed reactors; living organisms, if ever used for enzyme production, remain in a separate regulated facility.
4. **Recovery:** capture monomers or defined chemical products, monitor residual particles, and route residue to a separately qualified process.

The platform aims for **polymer-to-feedstock recovery**, not merely smaller fragments.

## Package map

| Artifact | Purpose |
|---|---|
| [`REFINED_DESIGN.md`](REFINED_DESIGN.md) | Functional architecture, sequence-free RNA/protein blueprint, life-cycle support requirements, device design and test gates. |
| [`RE_AUDIT.md`](RE_AUDIT.md) | Claim correction, safety boundary, prior-art boundary and reversal criteria. |
| [`simulation/MODEL_SPEC.md`](simulation/MODEL_SPEC.md) | Finite illustrative mass-balance model; no biological-rate claim. |
| [`simulation/EXTERNAL_CONSTRAINTS_LEDGER.md`](simulation/EXTERNAL_CONSTRAINTS_LEDGER.md) | Source-backed constraints and evidence labels. |
| [`schematics/`](schematics/) | Architecture, fail-closed state machine and qualification sequence sources. |

## Candidate portfolio

| Candidate | Mechanism | Status |
|---|---|---|
| A — PET loop | PET hydrolase plus secondary ester-hydrolysis module, product separation and recycled feedstock. | **Continue** as the first decisive test. |
| B — PUR loop | Enzyme panel for ester/urethane bonds with contaminant and product-toxicity monitoring. | **Research**; product distribution and kinetics unresolved. |
| C — PE discovery loop | Controlled surface activation plus oxidative enzyme discovery, with no open release. | **Research only**; slow rate and mineralization/product fate unresolved. |

## Reproduction

The finite model uses only standard-library Python and writes a machine-readable summary:

```bash
python3 simulation/test_model.py
python3 simulation/model.py
```

The generated result is an accounting aid for architecture sizing. It is not a scale-up, environmental, efficacy, or safety result.

## References

[1] [Yoshida et al., “A bacterium that degrades and assimilates poly(ethylene terephthalate),” *Science* (2016).](https://pubmed.ncbi.nlm.nih.gov/26965627/)

[2] [Tournier et al., “An engineered PET depolymerase to break down and recycle plastic bottles,” *Nature* (2020).](https://www.nature.com/articles/s41586-020-2149-4)

[3] [Vaksmaa et al., “Biodegradation of polyethylene by the marine fungus *Parengyodontium album*,” *Science of the Total Environment* (2024).](https://pubmed.ncbi.nlm.nih.gov/38679106/)

[4] [Temporiti et al., “Fungal Enzymes Involved in Plastics Biodegradation,” *Microorganisms* (2022).](https://pubmed.ncbi.nlm.nih.gov/35744698/)

[5] [US EPA, “Advanced Recycling of Plastics.”](https://www.epa.gov/plastics/advanced-recycling-plastics)

[6] [NIH, “NIH Guidelines for Research Involving Recombinant or Synthetic Nucleic Acid Molecules” (April 2024).](https://osp.od.nih.gov/wp-content/uploads/NIH_Guidelines.pdf)

