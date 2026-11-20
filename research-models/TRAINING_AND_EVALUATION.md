# Training and evaluation plan

## Stage gates

| Stage | Patent track | Bio track | Exit evidence |
|---|---|---|---|
| 0. Rights/acquisition | WIPO licence with explicit ML and model-output terms | NCBI source/release inventory and accession-level rights allowlist | Signed licence or reviewed rights register |
| 1. Corpus | Normalize authorized PCT/national collections and claims | Official GenBank/RefSeq/Datasets bundles | Counts, checksums, coverage and exclusion report |
| 2. Retrieval baseline | BM25 + dense patent retrieval, family collapse | BLAST/MMseqs2/DIAMOND + metadata/embedding retrieval | Recall@k, nDCG, accession/citation correctness |
| 3. Specialist baseline | Frozen Qwen3-4B with retrieved records | Frozen Evo2, RNA-FM/mRNA-FM, ESM-2 | Baseline benchmark |
| 4. Adaptation | Patent DAPT then reviewed SFT/QLoRA | Separate DNA/RNA/protein adapters or task heads | Trained weights and reproducibility manifest |
| 5. Safety/calibration | Citation faithfulness, abstention, no legal verdicts | Taxon/OOD calibration and biological task reliability | Independent red-team and human-review report |
| 6. Innovator | Retrieval-backed invention/evidence workflow | Modality-routed sequence/research service | API tests, provenance, rollback and version pinning |

## Compute strategy

- Patent: Qwen3-4B with 4-bit QLoRA is the initial candidate after licensed data exists. Begin with a manageable context length, gradient checkpointing and a pilot. DAPT and instruction SFT are separate stages.
- DNA: Evo2 1B for pipeline smoke tests; Evo2 7B as the initial higher-capability adapter target. Validate the upstream Evo2 implementation and model-specific training route; do not assume generic PEFT targets work.
- RNA/protein: use RNA-FM/mRNA-FM and ESM-2 pretrained representations with task-specific heads/adapters.
- Store large authorized source bundles in durable object storage; use normalized shards and separate indexes. Do not put multi-terabyte corpora or model base weights in the Innovator Git repository.
- Record accelerator type, hours, quota, disk use, data egress and checkpoints. Do not start billable HF Jobs or paid GPU resources without an explicit cost ceiling.

## Required metrics

**Patent:** retrieval Recall@10/50 and nDCG@10; family duplicate rate; extraction F1; claim-structure accuracy; citation correctness; unsupported factual-claim rate; abstention quality; expert-rated mechanism usefulness; time-based family holdout; external patent-professional review.

**Bio:** report DNA/RNA/protein separately; task-specific AUROC/AUPRC, macro-F1, calibration, per-taxon/OOD performance, length bins, sequence-family holdouts and accession/version correctness. Check benchmark overlap with upstream pretraining corpora.

## Promotion rules

Training loss decrease is not enough. Require fixed split hashes; family/homology leakage audit; retrieval-only/frozen/adapted ablations; no regression in unsupported citations; calibrated abstention; per-language/taxon/task metrics and confidence intervals; human sign-off for consequential claims; a reproducibility manifest; model card; and rollback.

Report exact collections/releases, dates, language/taxon coverage, records/bases/tokens actually used, exclusions, training steps, accelerator hours, model revisions and evaluation scope. Prefer “adapted on this authorized subset of …” over “trained on all …” unless full coverage and rights are demonstrable.
