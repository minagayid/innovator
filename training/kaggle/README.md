# Kaggle domain-training pipelines

These notebooks are reproducible training experiments for Innovator. They are stored as source in GitHub; trained weights and output archives remain in the private Kaggle notebook outputs linked below.

## Patent-domain adapter

- Kaggle run: [Open Patents adapter — successful version 5](https://www.kaggle.com/code/minagayid/innovator-patent-domain-adapter-open-patents?scriptVersionId=372016489)
- Base: Qwen/Qwen2.5-0.5B-Instruct; LoRA adapter.
- Corpus: `allenai/us-patents` (PatentsView), ODC-BY, attribution required. The source has approximately 7.8M training and 79,836 validation records; this run streamed 12,000 training and 600 validation records.
- Training: 100 optimizer steps, sequence length 512, effective batch size 8. This consumed approximately 800 training examples; it is a pilot, not a full-corpus training run.
- Metrics: training loss 2.0397; validation loss 1.8974.
- Output archive: `innovator_patent_adapter_artifacts.zip` in the Kaggle version output.

**WIPO boundary:** this is not a PATENTSCOPE dataset. WIPO's PCT-data products are license-governed: a non-derivative license permits acquiring/downloading/storing the full dataset in a searchable database, while bulk redistribution requires a derivative license with added value. The PATENTSCOPE web service limits retrieval to 10 actions per minute per subscriber/IP and prohibits parallel IP use to increase throughput. This notebook does not scrape the service. For a full PCT corpus, obtain the appropriate WIPO data product/license. [Official terms](https://www.wipo.int/en/web/patentscope/data/terms).

## NCBI multi-omics encoder

- Kaggle run: [NCBI Multi-Omics model — successful version 3](https://www.kaggle.com/code/minagayid/ncbi-multi-omics-sequence-model-dna-rna-protein?scriptVersionId=372009604)
- Architecture: compact 4-layer, 256-hidden masked-residue Transformer encoder with DNA, RNA and protein modality tokens.
- Source: NCBI RefSeq through NCBI Datasets CLI.
- Scope: 8 representative assemblies across bacteria, archaea, fungi, plants, insects and nematodes; 182,419 extracted sequence windows.
- Training: 3 epochs; assembly-level train/validation/test split.
- Held-out metrics: masked-token accuracy 34.25%; loss 1.6004.
- Output archive: `ncbi_multiomics_model_artifacts.zip` in the Kaggle version output.

## Promotion gates

Both artifacts are research pilots, not production models. Before integrating into Innovator's invention-generation path:

1. Verify the downloaded ZIP and all SHA-256 hashes against each training manifest.
2. Add independent held-out benchmarks and source-specific attribution.
3. For patent use, evaluate retrieval recall, claim/abstract citation correctness, novelty false positives and expert review. Never present model output as legal novelty or patentability advice.
4. For genomics, evaluate per-modality and per-taxon generalization; do not use for clinical interpretation or diagnostics.
5. Promote model versions only after reproducible evaluation and explicit review.

The notebook outputs are private Kaggle artifacts; no model weights are committed to this repository.
