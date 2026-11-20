# NCBI Bio Intelligence: DNA, RNA and protein model family

## NCBI is a collection of databases, not one corpus file

Use the official sources appropriate to each task:
- GenBank/INSDC nucleotide records and release snapshots.
- RefSeq reference genomes, transcripts and proteins.
- NCBI Datasets packages for genomes, genes, viruses and annotations.
- Protein records and mappings between nucleotide, CDS, transcript and protein accessions.
- SRA, GEO, BioProject and BioSample only when a defined task requires them and their distinct access/consent/reuse conditions have been reviewed.

GenBank Release 274.0 (15 October 2026) reports about 60.07 trillion bases across 6.68 billion records. That is one GenBank release snapshot—not all NCBI and not every living organism. Coverage depends on sampling, sequencing, submissions and curation.

NCBI says it places no restrictions on molecular data in its databases, but original submitters/countries may assert rights and NCBI cannot grant rights it does not own. Human sequence and sample metadata may carry additional consent, privacy or controlled-access conditions. An accession-level rights/provenance manifest is required.

## Model stack: separate experts behind one service

| Modality | Starting model | Use |
|---|---|---|
| Genomic DNA | arcinstitute/evo2_7b (1B only for low-compute integration smoke tests) | Genomic sequence representation and defined DNA prediction tasks |
| Non-coding RNA | RNA-FM, official ml4bio/RNA-FM | RNA embeddings, family/function and structure-related downstream tasks |
| mRNA / coding RNA | mRNA-FM where available or another separately validated RNA specialist | CDS/transcript representation and task-specific predictions |
| Protein | facebook/esm2_t33_650M_UR50D | Protein embeddings and family/function or enzyme-related downstream tasks |

These are different architectures, alphabets and training objectives. They should not be flattened into one “all biology” network. Innovator can route through a common Bio Intelligence API, while gene→transcript→CDS→protein links connect the results.

Verify model cards, revisions, checkpoint provenance, code/model licence and task suitability before training. Avoid non-commercial-only checkpoints if Innovator may be used commercially.

## Full catalogue versus model training

Keep the full **eligible** catalogue searchable in object storage and sequence databases with exact accession.version, taxonomy, assembly, source release and record provenance. Use sequence search (BLAST, MMseqs2 or DIAMOND where appropriate) plus metadata and embedding retrieval.

Fine-tune specialists on curated, deduplicated, taxon-balanced subsets. The scale of GenBank alone makes full scratch pretraining a large distributed-compute project, not a commodity notebook job. A retrieval index is not proof that a model learned from every record.

## Ingestion gates

Acquire through official NCBI Datasets/FTP bundles or authorized APIs. Do not scrape pages or issue unbounded per-record requests. Preserve:
- accession.version, source database/release and source URI
- taxonomy ID/name, assembly and gene/transcript/protein cross-references
- molecule type, length, checksum and feature annotation
- rights basis, access restriction, human-data status and retrieval date

The FASTA pipeline requires accession-level training and derivative-use permission, checks DNA/RNA/protein alphabets, removes only a terminal protein stop marker, deduplicates exact sequences while retaining all source accessions/taxa, and makes no network requests. Public model-weight release additionally requires explicit weight redistribution permission.

Quality controls must flag contaminated assemblies, chimeras, vector/adaptor contamination, low-complexity regions, ambiguous positions, taxonomy conflicts and annotation-version drift. Preserve valid IUPAC ambiguity; never silently convert it into a concrete base.

## Evaluation

Split by sequence family/homology cluster, not random records. Hold out taxa/clades for OOD tests. For cross-modal gene/transcript/protein tasks, prevent homolog leakage and preserve accession.version mappings. Report DNA, RNA and protein tasks separately with task-specific metrics, calibration, per-taxon performance, length bins and external overlap checks.

Each Innovator result must include model/revision, task, sequence digest, accession.version, taxon, prediction, calibrated confidence, source links and limitations. It cannot claim clinical validity, biological safety or experimental confirmation. High-consequence sequence work requires additional screening and qualified review.
