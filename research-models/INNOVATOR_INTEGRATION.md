# Innovator model-provider integration contract

## Principle

Innovator is a research studio, not a patent office or biological validation lab. Keep retrieval, model proposal, evidence review and user decision separate. Model-generated novelty hypotheses never become patentability/FTO verdicts.

## Patent Intelligence service

Proposed server endpoint: POST /v1/patents/research

Request fields: problem, technical_fields, jurisdictions, languages, top_k and optional date_cutoff.

Response:
- Retrieved records: publication/family ID, title, publication/priority date, language, IPC/CPC, record URL, exact passage/claim excerpts, retrieval score and corpus version.
- Synthesis: technical bottlenecks, existing mechanisms, contradictions and missing evidence.
- Candidate mechanisms: proposed mechanism, source-backed inspiration, differences from retrieved records, assumptions, failure modes and decisive test.
- Evidence ledger: sourced, computed, inferred, proposed or unresolved label plus exact supporting publication/passage.
- Limitations: retrieval coverage, language/date/jurisdiction gaps, and no legal-opinion statement.

## Bio Intelligence service

Proposed server endpoint: POST /v1/bio/analyze

Request fields: modality (DNA/RNA/PROTEIN), sequence or accession.version, organism taxid, task, reference release and top_k.

Response must contain model ID/revision, task and input sequence digest, accession.version, source database/release, taxonomy, predictions, calibrated confidence, sequence-search hits and limitations. Route each modality to its own specialist implementation.

## Server-side configuration

Suggested environment variables:
- PATENT_INTELLIGENCE_URL
- PATENT_INTELLIGENCE_MODEL_ID
- PATENT_CORPUS_VERSION
- BIO_INTELLIGENCE_URL
- BIO_DNA_MODEL_ID
- BIO_RNA_MODEL_ID
- BIO_PROTEIN_MODEL_ID
- NCBI_DATA_RELEASE

Keep tokens server-side. Do not put WIPO credentials, HF tokens, NCBI keys, licensed corpora, base weights or private source data in browser code, Docker layers, Git or client logs.

## Invention-generation sequence

1. Frame the user's problem and constraints.
2. Query patent retrieval first; return exact sources, families and claim passages.
3. Query scientific literature and other sources (Innovator already uses OpenAlex/Crossref).
4. Use patent model to compare mechanisms and propose alternatives. Treat novelty as a hypothesis.
5. When biology is relevant, call the appropriate DNA/RNA/protein expert and exact accession retrieval.
6. Generate at least three materially different mechanisms; map evidence/trade-offs and design a falsifiable test.
7. Run adversarial review and preserve unresolved conflicts; obtain human review for safety/legal/clinical claims.
8. Persist model versions, retrieval sources, input hashes, corpus releases, evidence labels and reviewer actions.

## Legacy mock warning

The old related-project PatentScout contains hard-coded sample patents and random identifiers, while the legacy PatentabilityAnalyzer emits patentability conclusions without source retrieval. Do not wire these mocks into production or surface their verdicts as evidence. Use retrieval-backed records and a legal boundary that never claims patentability or freedom to operate.

## Current app state

This branch defines contracts only. The current app/patentscope.ts remains a public-search URL handoff, and app/ai/roles.ts uses the configured OpenAI role provider. Runtime provider clients and API routes still need implementing after licensed corpus and model endpoints exist.
