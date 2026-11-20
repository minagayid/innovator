# Innovator research-model tracks: PATENTSCOPE + NCBI Bio Intelligence

**Status: integration scaffolding and rights-aware ingestion tests; no model has been trained in this branch.**

This workspace defines two independently governed tracks:
1. **Patent intelligence:** Qwen3-4B domain adaptation plus retrieval over WIPO-authorized patent records.
2. **Bio Intelligence:** modality-specific DNA, RNA and protein experts plus retrieval over eligible NCBI records.

The models are not intended to memorize an entire database. The eligible corpus is indexed for exact retrieval and citation; models are adapted on curated, deduplicated subsets.

## Contents

- WIPO_PATENT_MODEL.md — PATENTSCOPE access boundary, licence questions and patent model design.
- NCBI_BIO_MODEL.md — NCBI collections, DNA/RNA/protein specialists and sequence-ingestion requirements.
- TRAINING_AND_EVALUATION.md — staged training, compute and acceptance criteria.
- INNOVATOR_INTEGRATION.md — provider contracts and invention workflow handoff.
- DATA_RIGHTS_AND_PROVENANCE.md — per-record rights and traceability requirements.
- schemas/ — machine-readable corpus and rights-manifest examples.
- pipelines/ — offline WIPO/NCBI normalizers that refuse records without explicit training rights.
- tests/ — offline regression tests for rights gating, provenance retention and deduplication.
- configs/ — proposed model settings; not evidence of executed training.

The scripts make **no network requests and no scraping**. Obtain WIPO data only through a suitable WIPO product licence or separate written authorization. Obtain NCBI data through official Datasets/FTP services and review submitter/source and human-data terms before adding records to a training allowlist.

## Initial specialist stack

| Track | Starting model | Role |
|---|---|---|
| Patents | Qwen/Qwen3-4B-Instruct-2507 | Patent-language understanding, structured extraction and invention drafting grounded in retrieval |
| DNA | arcinstitute/evo2_7b | Genomic sequence representation and scoped DNA tasks |
| RNA | RNA-FM / mRNA-FM | Non-coding and coding RNA representations |
| Protein | facebook/esm2_t33_650M_UR50D | Protein representations and downstream function/family tasks |

DNA, RNA and protein remain separate experts behind one modality-routed Bio service.

## Completion states

| Deliverable | State |
|---|---|
| Innovator feature branch | Created |
| Rights-aware patent preprocessing | Implemented; offline tests pass |
| Rights-aware NCBI FASTA preprocessing | Implemented; offline tests pass |
| Architecture/training design | Documented |
| WIPO bulk data rights for AI training | Not obtained; requires written WIPO confirmation/licence |
| NCBI accession-level training allowlist | Not supplied |
| GPU fine-tuning | Not run |
| Model weights / adapter releases | Not produced |
| Innovator runtime provider hookup | Contract specified; runtime endpoints not yet implemented |

Do not publish “trained on all PATENTSCOPE” or “trained on all NCBI” until rights, coverage manifests, trained weights and evaluation evidence prove that claim.
