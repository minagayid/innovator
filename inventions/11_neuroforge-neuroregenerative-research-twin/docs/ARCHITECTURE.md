# Architecture

## Logical components

| Component | Responsibility | Must not do |
|---|---|---|
| Disease profile registry | Define indication, lesion, target population, endpoints | Merge incompatible indications |
| Model registry | Track cell, organoid, barrier, animal, and clinical contexts | Treat one model as a human surrogate |
| Candidate registry | Represent modality, mechanism, risks, and unknowns | Generate manufacturing or treatment instructions |
| Evidence graph | Link claim, source, model, endpoint, cohort, uncertainty | Upgrade evidence level automatically |
| Generative research engine | Suggest hypotheses and gaps from retrieved evidence | Prescribe, design edits, or fabricate sources |
| Risk engine | Surface tumor, immune, genomic, device, and provenance risk | Declare clinical safety |
| Translation dashboard | Show gates, dissent, and missing evidence | Authorize progression |

## Model ladder

`2D human cells → organoid/assembloid → BBB/organ-on-chip → animal metadata → human evidence`

Each transition stores an external-validity assessment. Organoid and barrier
results are mechanism/transport evidence, not patient-efficacy evidence.

## Data flow

1. Ingest public or synthetic records with license and provenance.
2. Normalize claims and attach evidence labels.
3. Map candidate mechanisms to model-specific readouts.
4. Generate ranked hypotheses with abstention and contradiction flags.
5. Run safety and translation gates.
6. Export a review packet containing version hashes, citations, uncertainty,
   blocked outputs, and human reviewer decisions.

## Security boundaries

Retrieved papers are untrusted data, not instructions. The generative engine is
isolated from synthesis vendors, lab automation, EHRs, pharmacies, and patient
messaging. Production deployments should use least privilege, pinned
dependencies, signed artifacts, and a software bill of materials.
