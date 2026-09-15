# Threat model

| Threat | Control |
|---|---|
| Clinical misuse | Intended-use banner, refusal tests, no patient interface |
| Hallucinated evidence | Citation verification and claim-level provenance |
| Overconfident transfer | Applicability domain, calibration, abstention |
| Dataset poisoning | Immutable versions, anomaly checks, review |
| Prompt injection in papers | Retrieved text treated as untrusted data |
| Genomic privacy loss | Public/synthetic data only; consent and retention metadata |
| Dual-use gene output | Hard blocks on edits, vectors, sequences, and synthesis |
| Automation escalation | No vendor, lab, EHR, pharmacy, or execution connectors |
| Distribution shift | Disease/model compatibility checks and warnings |
| Conflict of interest | Disclosures, independent review, preserved dissent |
| Supply-chain compromise | Pinned dependencies, hashes, signed releases, SBOM |

Security incidents require containment, impact assessment, remediation,
notification assessment, and a regression test before release.
