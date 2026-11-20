# WIPO PATENTSCOPE patent-intelligence model

## Access and licensing boundary

Do **not** scrape PATENTSCOPE or automate broad browser searches. WIPO's PATENTSCOPE Database Terms of Use prohibit excessive/automated queries, bulk acquisition/download/storage, web scraping and bulk copying/reformatting/redistribution. The public search interface is not a bulk data licence; WIPO's FAQ says the complete database cannot be downloaded through it.

WIPO lists separate PCT data products and service tiers: bibliographic data, image products, limited/full SOAP web-service access, language backfiles and XML backfiles. Each has different coverage and licence conditions. These products do not establish that all national/regional patent-office collections in PATENTSCOPE are included.

Before ingestion, obtain a written WIPO quote/licence that confirms:
1. Included collections and fields: PCT, national/regional offices, bibliography, full text, claims, drawings, OCR, translations, citations and historical backfiles.
2. Bulk acquisition, local storage, indexing, ML/LLM training, continued pretraining and supervised fine-tuning rights.
3. Whether public/commercial redistribution of adapter or full-model weights is allowed, and whether a derivative licence/fee is required.
4. Attribution, retention, deletion, update, audit and downstream output obligations.
5. Whether OCR and translations are included or separately licensed.

Do not infer that permission to maintain an internal searchable database permits public distribution of trained weights. The rights register must explicitly set the weight redistribution field to true before a public model is released.

## Model and design

Initial generative model: **Qwen/Qwen3-4B-Instruct-2507** (Apache-2.0 base). Pin an exact upstream commit before training.

Use two layers:
- **Retrieval:** full licensed corpus indexed using BM25 + dense embeddings, family grouping, IPC/CPC, priority/publication dates and citations.
- **Model:** patent-domain continued pretraining and instruction adaptation for structured extraction, claim interpretation, technical-field classification, evidence-grounded comparison and generation of alternative mechanisms.

The model drafts research hypotheses; it does not determine patentability, novelty, inventorship, infringement or freedom to operate.

## Data contract

The local patent preparation utility consumes **already acquired, locally normalized** JSONL under an authorized WIPO export. Each record should contain publication ID, family ID, title, abstract, description, claims, dates, language, IPC/CPC, citations and record URL.

A separate rights JSON manifest is mandatory per publication ID:
- training authorized = true
- derivative model allowed = true
- non-empty licence ID
- source and licence basis
- weight redistribution = true only if explicitly permitted

The pipeline never infers permission from public accessibility, a WIPO URL or a missing copyright notice.

## Training plan

1. Normalize licensed records; preserve claim hierarchy, original language, dates, family and source IDs. Track OCR quality.
2. Split by patent family and earliest priority date; keep continuations/family members and near-duplicates in the same split. Reserve a prospective time-based test.
3. Domain-adaptive causal pretraining on licensed patent text.
4. Instruction SFT on reviewed examples for extraction, source-grounded synthesis, mechanism comparison and uncertainty-aware invention drafting.
5. Preference/critique training on expert-reviewed pairs; reward correct citations and calibrated abstention, penalize invented citations and unsupported legal conclusions.
6. RAG over the full eligible corpus; every prior-art statement links to an exact publication and passage.
7. Release adapter, base/tokenizer revision, training manifest, data-release identifiers and rights statement. Never upload licensed source text unless the licence permits it.

Do not claim “trained on full PATENTSCOPE” until WIPO confirms the scope of the licensed collections and the data manifest proves coverage. A PCT backfile is not automatically the national/regional corpus.
