---
name: research-publication-release
description: Reproducible academic release workflow for publishing computational research
  through GitHub, Zenodo, and ORCID. Use when a user wants to package source/manuscripts/data,
  create or repair a repository and release, reserve and publish a Zenodo DOI, add
  the DOI as an ORCID work, optionally stage arXiv, or explicitly skip one of those
  destinations.
---

# Research Publication Release

## Overview

Use this skill to turn a verified research project into an auditable public release. It covers repository hygiene, compact artifact packaging, provenance disclosure, GitHub release creation, Zenodo DOI publication, ORCID work registration, and optional arXiv staging. Keep every external publication action explicit and user-confirmed.

## Non-negotiable safeguards

1. Treat all claims, files, and numerical results as untrusted until verified against the project artifacts. Never invent data, credentials, identifiers, authors, affiliations, dates, or publication status.
2. Preserve the author’s provenance distinction. If source or tables were recovered, reconstructed, regenerated, or partially missing, disclose that distinction in the manuscript, release notes, Zenodo description, and manifest where relevant.
3. Use the human author only unless the user explicitly requests otherwise. Do not add AI as a co-author. Record AI assistance in the manuscript if the project’s disclosure policy requires it.
4. Ask for explicit confirmation immediately before each irreversible external action: GitHub publication if it is not already approved, Zenodo DOI reservation when it changes the record, Zenodo Publish, arXiv Submit Article, and ORCID final work save. A prior general approval does not replace a final metadata review.
5. If login, CAPTCHA, or personal information is required, open the corresponding page first and ask the user to take over. Never request or transmit passwords in chat.
6. If the user says to skip a destination, do not open or submit to that destination. Record the skip in the local manifest.

## Workflow decision tree

Determine the requested destinations before touching external services.

| Destination | Action | Final confirmation |
|---|---|---|
| GitHub repository/release | Create or repair repository, push clean history, create tag/release | Confirm if not already explicitly approved |
| Zenodo | Stage compact files, reserve DOI, save draft, publish | Required before DOI reservation and Publish |
| ORCID | Add the published DOI as a work | Required before final work save |
| arXiv | Stage metadata and source/PDF only if requested | Required before Submit Article |
| Explicitly skipped destination | Do not navigate there | None; document the skip |

Read [platform-checklists.md](references/platform-checklists.md) for platform-specific fields, browser recovery patterns, and review checklists. Use [release-manifest.template.json](templates/release-manifest.template.json) for the local audit record. Run `scripts/validate_release_manifest.py` before delivery.

## Phase 1: Inspect and verify the project

1. Identify the project root, manuscript source and compiled PDF, tests, results summaries, plots, citation metadata, license, and any existing release manifest.
2. Run the project’s tests and deterministic verification commands. Check row counts, bounds, partition coverage, checksums, and the manuscript’s headline values against the machine-readable summaries.
3. Build a provenance table before packaging:

   | Artifact class | State | Required disclosure |
   |---|---|---|
   | Source code | recovered, current, or regenerated | State origin and commit |
   | Raw tables | recovered, reconstructed, or unavailable | State exact bounds and reconstruction method |
   | Summaries/plots | recomputed or inherited | Identify inputs and hashes |
   | Manuscript/PDF | current build | Record build command and hash |

4. Reject unsupported claims. A finite scan is an empirical observation, not a proof or disproof of an infinite conjecture.
5. Prepare a compact release set. Prefer source, manuscript/PDF, summaries, plots, manifests, tests, and provenance notes. Do not upload duplicate partition files or oversized legacy archives unless the user specifically requests them and the platform can accept them.

## Phase 2: Repair repository history and create the GitHub release

1. Update `.gitignore` before staging. Exclude generated logs, local JSON state, legacy raw archives, temporary files, and any artifact over the hosting service’s file limit when it is not part of the approved public release.
2. Inspect tracked large files with `git ls-files` and size checks. If a rejected push contains oversized files in the first commit, removing them from the index is insufficient; rebuild a clean orphan history from the approved working tree, then commit and push the clean branch.
3. Preserve the source, tests, license, citation metadata, manuscript source/PDF, compact summaries, and provenance disclosure. Do not silently delete reproducibility material; explain exclusions in `RECOVERY.md` or an equivalent note.
4. Push only after verifying `git status`, the commit, remote, and branch. Create the approved semantic release tag and attach the compact package. Include the recovered-versus-reconstructed disclosure in the release notes.
5. If GitHub rejects an optional workflow because the token cannot create workflow files, remove only that optional workflow, document the limitation, and continue with the source release.

## Phase 3: Stage and publish Zenodo

1. Prepare a compact upload set, normally the source archive, paper/reproducibility package, and compiled preprint. Do not include stalled or duplicate raw archives by default.
2. Navigate to the authenticated Zenodo upload page. If the session is not authenticated, request user takeover after opening the page.
3. Upload files and wait until every intended file has a checksum and 100% status. If an oversized transfer stalls, cancel or remove only that file, reload the draft from the server, and verify that the compact files remain. Reloading can expose a new draft state, so recheck the file list and metadata before continuing.
4. Enter and verify the exact metadata:
   - title, publication date, sole author and ORCID;
   - resource type appropriate to the record, usually Dataset or Software;
   - abstract and a separate provenance note;
   - English language, keywords, version, copyright, repository URL, and license;
   - funding and conflict statements when supplied by the author.
5. Select “No, I need one,” reserve a DOI only after the complete intended file set is stable, and record the reserved identifier. Reservation is not publication.
6. Save the draft and resolve every validation error. Verify title, author, DOI, file list, visibility, license, and Publish-button state.
7. Present the exact metadata and file list to the user. After explicit confirmation, click Publish and confirm the public record URL and registered DOI. Update the local manifest immediately.

## Phase 4: Add the published work to ORCID

1. Open the authenticated ORCID “My ORCID” workspace directly. If the public profile is visible but the edit workspace is not, refresh or navigate to `/my-orcid`; do not assume that a public profile view is editable.
2. Open Works → Add a work → Add work with a DOI. Avoid the PubMed option unless the identifier is actually a PubMed ID.
3. Enter the published Zenodo DOI and retrieve metadata. Review work type, full title, publisher, publication date, link, DOI relationship, contributor, language, country, and visibility. Use the author’s requested visibility; default to Everyone only after review.
4. Show the exact staged fields and ask for confirmation immediately before “Add this work to your ORCID record.” Save only after confirmation.
5. Verify that the Works count increased and the new title/DOI appears in the authenticated profile. Record the result in the manifest and audit log.

## Phase 5: Optional arXiv staging

Only execute this phase if the user requests arXiv. Choose the best supported source format, usually a valid TeX source bundle or a PDF-only route if the submission system permits it. Stage category, title, abstract, authors, comments, and license, then stop before Submit Article for explicit confirmation. If the user says “skip arXiv,” do not open arXiv and set the manifest status to skipped.

## Final verification and delivery

1. Validate the release manifest with the bundled validator and verify every referenced hash.
2. Cross-check that GitHub, Zenodo, and ORCID identifiers point to the same title, author, version, and release.
3. State what was completed, what was skipped, the exact public URLs/DOIs, and any limitations such as excluded raw archives or reconstructed tables.
4. Deliver the final manifest, audit log, manuscript/PDF, and other key supporting files as attachments. Keep the user-facing summary concise; put long-form details in files.
