# Data rights, provenance and release controls

## Non-negotiable admission rule

No record enters training unless its provenance is traceable and its rights basis explicitly permits the intended use. Public visibility, a downloadable URL or an open API is not proof that downstream ML training and model-weight distribution are authorized.

## WIPO rights register

For every publication/document record, track publication ID, collection, product, source release, retrieval time, source URI, licence ID/version/basis, territory/term, permitted fields, training permission, derivative-model permission, weight redistribution, commercial use, attribution, retention/deletion and audit requirements.

Unknown means false. A licence permitting an internal searchable database may not permit public trained weights. Get written WIPO confirmation for model training, outputs and weight redistribution.

## NCBI rights/provenance register

For every accession.version, track sequence type, taxid, organism, source database/release, assembly, cross-references, source URI, checksum, retrieval time, submitter/source reuse restrictions, training basis, access restriction and human-data status.

NCBI's general data-use statement does not override original submitter/country rights or controlled-access conditions. Separate sequence content from personal/clinical sample metadata; exclude controlled-access data unless authorized. Re-evaluate rights at every release.

## Reproducibility manifest

Every corpus/model build records:
- source URLs and release dates; collection names
- manifest hashes, counts, bases/tokens, languages/taxa and year coverage
- included/excluded/quarantined counts and reasons
- normalization, masking, deduplication and clustering versions
- train/dev/test hashes and group-split rules
- rights-register hash and review status
- model/base revision, tokenizer/adapter revision, code commit and dependency lock
- seeds, accelerators, runtime, GPU hours and checkpoint checksums

Connect source rights manifests to model release statements. Model cards must explain data categories, coverage gaps and rights questions that remain unresolved.
