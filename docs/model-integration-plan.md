# Domain model integration plan

The trained checkpoints are registered for Innovator, but **neither model is enabled in production inference**. The Hub repositories are private and require server-side authentication.

## Model contracts

### Patent domain adapter

- Hub repo: `minagayid/Innovator-Patent-Domain-Adapter`
- Base: `Qwen/Qwen2.5-0.5B-Instruct`
- Loader: Transformers + PEFT; load the base model, then attach the LoRA adapter.
- Current weights: interim 100-step pilot; a longer 1,500-step Kaggle run is pending.
- Intended role: domain adaptation for drafting/rephrasing patent-domain text after a separate prior-art retrieval step.
- It is not a novelty detector, patentability assessor, claim-validity evaluator or legal-advice system.

### NCBI multi-omics encoder

- Hub repo: `minagayid/NCBI-MultiOmics-MLM`
- Loader: custom PyTorch implementation in `modeling_multiomics.py`.
- Input modalities: DNA, RNA and protein residue sequences with explicit modality tokens.
- Output: masked-residue logits for the supplied sequence positions.
- It is not a generative sequence model, clinical model, diagnostic tool, variant caller or biological-function predictor.

## Recommended serving boundary

Do not load either model inside the browser or expose a Hugging Face token to client code. Add a private server-side model service with authenticated endpoints, rate limits and structured logs. The Innovator app should call the service through its server routes.

Suggested endpoints:

- `POST /v1/patent-adapter/generate`: accepts a bounded prompt, task type and retrieved evidence IDs; returns a draft plus model/version metadata. The retrieval layer must supply the evidence and citations; the adapter alone does not search patents.
- `POST /v1/multiomics/masked-prediction`: accepts modality, sequence and masked positions; returns residue-token predictions and model/version metadata.

Every response should include:
- model repository ID and immutable revision/commit SHA;
- base-model ID and revision where applicable;
- prompt/configuration version;
- source/evidence IDs and citations for patent tasks;
- inference timestamp, latency and token/sequence limits;
- an explicit research-only status until promotion gates pass.

## Secrets and access

- Store the Hugging Face read token only in the hosting provider's server-side secret manager.
- Keep both Hub repositories private until the owner explicitly chooses otherwise.
- Never place the token in browser JavaScript, client bundles, notebook outputs or Git.
- Restrict inference endpoints to authenticated Innovator users and enforce workspace/tenant authorization.

## Promotion gates

### Patent adapter
1. Complete and verify the longer training run; pin the final adapter revision.
2. Evaluate on a time-separated held-out patent set, not only a random split.
3. Measure retrieval recall separately from generation quality.
4. Check claim/abstract citation correctness and unsupported-claim rate.
5. Measure novelty false positives with expert review; do not make patentability determinations.
6. Red-team prompt injection from patent text and verify that retrieved documents are treated as untrusted evidence.

### Multi-omics encoder
1. Expand RefSeq coverage across more assemblies and taxonomic groups.
2. Report held-out accuracy/loss per modality and per taxon; improve the weak protein result.
3. Check sequence leakage, reverse-complement handling and duplicate accessions.
4. Calibrate confidence and compare with simple baselines.
5. Obtain independent biological review before any research-use promotion; do not use for clinical decisions.

## Current integration status

The private model repositories and `training/kaggle/model-registry.json` are ready as research artifacts. The current live Manus site is not connected to these repos. A production model service is blocked by the hosting prerequisites documented in `docs/deployment-readiness.md`; keep the models in research-only status until that service and the evaluation gates exist.