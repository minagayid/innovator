# Offline corpus preparation utilities

These scripts do not scrape, download or call WIPO/NCBI. Acquire files only through authorized channels, then run locally.

## NCBI FASTA

    python research-models/pipelines/prepare_ncbi_sequences.py --fasta /data/refseq.fasta --rights-manifest research-models/schemas/ncbi-rights-manifest.tsv --output /data/prepared/ncbi.jsonl

Both training_authorized=true and a non-empty license_basis are required. The manifest explicitly identifies accession.version, sequence type, taxonomy, source database and release. DNA/RNA/protein alphabets are checked separately. Exact duplicates are collapsed while retaining all source accessions and taxa.

## WIPO-normalized JSONL

    python research-models/pipelines/prepare_patent_records.py --source /data/wipo/normalized_licensed_records.jsonl --rights-manifest /data/wipo/rights-register.json --output /data/prepared/patents.jsonl

Records require training_authorized=true, derivative_model_allowed=true and a non-empty license_id. Add --require-redistributable-weights before creating an artifact intended for public distribution; the utility fails unless the rights register explicitly permits weight redistribution for each included record.

The input must already have been acquired under contract and normalized by a separately reviewed WIPO export adapter. No HTML scraper or PATENTSCOPE browser crawler is provided.

## Tests

    PYTHONPATH=research-models python -m unittest discover -s research-models/tests -v
