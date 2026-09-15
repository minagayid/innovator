# Safety and governance

## Intended-use gate

Permitted: literature synthesis, model comparison, biomarker hypotheses,
non-clinical candidate prioritization, and evidence-gap detection.

Blocked: diagnosis, patient-specific treatment, dose/route/schedule, gene-edit
design, cell-production instructions, transplantation decisions, synthesis,
ordering, and automatic publication or clinical export.

## Fail-closed behavior

If evidence is sparse, contradictory, out of domain, unverifiable, or missing
consent/provenance, the system must abstain, quarantine the record, and explain
what is missing. A model score never advances a candidate by itself.

## Human review

Any candidate promoted beyond computational research requires at least two
independent reviewers: one disease/science expert and one safety, regulatory, or
bioethics reviewer. Disagreement is preserved rather than averaged away.

## Accountable roles

Scientific lead; neuroscience/translational lead; ML-safety lead;
bioethics/data-protection lead; regulatory/quality lead; and a patient/community
advisor. Roles are recorded with decisions and conflicts of interest.

## Audit record

Record user role, data/model/prompt versions, retrieved sources, generated
claims, blocked requests, reviewer decisions and dissent, exports, incidents,
and corrective actions. Never commit raw genomes or identifiable health data.
