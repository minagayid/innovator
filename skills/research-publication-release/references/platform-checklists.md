# Platform Checklists

## GitHub recovery and release

Use a clean public history for the approved release. Before pushing, inspect the index for large files and generated state:

```bash
git status --short
git ls-files -z | xargs -0 -r -n1 sh -c 'test -f "$0" && stat -c "%s %n" "$0"' | sort -nr | head
```

If a rejected initial commit contains a file above the host limit, do not rely only on `git rm --cached`; the file remains in history. Build a clean orphan branch from the current approved tree, remove optional generated workflows if the token cannot create them, commit, and push that clean history. Verify the final commit and remote before creating the tag/release.

Release notes should include the release version, repository scope, tests, compact package contents, and a plain-language provenance note. Never claim that an unavailable raw table was recovered.

## Zenodo metadata checklist

| Field | Recommended value or rule |
|---|---|
| Title | Exact manuscript title |
| Creator | Sole human author with ORCID |
| Resource type | Dataset for reproducibility package; Software for source-only release |
| Date | Actual publication date in Zenodo format |
| Description | Abstract plus provenance note |
| License | Match the approved record license; do not conflate MIT source licensing with CC BY record licensing |
| Copyright | Author-approved statement |
| Keywords | Domain terms and reproducibility terms |
| Language | English when the work is written in English |
| Version | Semantic release version |
| Repository URL | Canonical GitHub repository |
| DOI | Reserve only after the intended file list is stable |
| Visibility | Public only after review and approval |

The compact default file set is: source archive, paper/reproducibility package, and compiled preprint. Large raw tables may be omitted when the public package retains summaries, manifests, hashes, and a clear recovery/reconstruction disclosure.

If an upload progress row remains at a low percentage with “checksum not yet calculated,” do not publish. Remove only the stalled file, reload the server-side draft, and verify that the remaining files and metadata survived. A browser refresh can reveal a new draft state or stale file row; trust the current server-rendered file list, not an old link.

Before Publish, inspect the exact public-facing title, creator, ORCID, DOI, resource type, license, visibility, file names, and validation state. After the user confirms, click Publish, then verify the public `/records/{id}` page and DOI badge.

## ORCID work checklist

Use the authenticated `/my-orcid` workspace, not only the public profile. Open Works → Add a work → Add work with a DOI. Do not choose PubMed for a DOI.

Review the imported work details. The minimum expected values are the full title, Dataset or other appropriate type, publisher Zenodo, publication date, DOI relationship Self, the Zenodo URL, Mina Gayid as Author, and the intended visibility. Ask for confirmation immediately before the final Add-this-work action. After saving, verify that the Works count increased and the new DOI appears in the first work entry.

## Browser and authentication recovery

Open the corresponding destination before requesting user takeover. The user may complete login or authorization in the browser; do not ask for passwords in chat. If a public profile appears while the edit page is logged out, navigate directly to the destination’s authenticated workspace and re-snapshot before acting. Element indices can change after menus, dialogs, uploads, and refreshes; always re-snapshot after a page mutation or stale-element error.

## arXiv branch

Use this branch only when explicitly requested. Stage the metadata and source/PDF, then stop before final Submit Article confirmation. If the user says to skip arXiv, do not navigate to arXiv at all and record the skip in the manifest.
