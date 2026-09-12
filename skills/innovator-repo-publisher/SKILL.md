---
name: innovator-repo-publisher
description: Package, audit, and publish Codex skill bundles and callable-tool manifests into an authorized innovator Git repository with a reviewed diff and verification record. Use for repository synchronization; do not push without explicit user authorization.
---

# Innovator Repo Publisher

Move a completed skill/tool bundle into the intended repository without contaminating unrelated work or claiming a push that was not verified.

## Workflow

1. Resolve the exact repository, account/remote, branch, destination folder, and source bundle. If any of these materially changes the target, stop for direction instead of guessing.
2. Inspect the repository status and preserve existing changes. Stage into a temporary work area when the source is outside the repository; do not overwrite an existing skill with the same name until its diff is reviewed.
3. Run the skill validator on every skill directory. Run `scripts/check_bundle.py` for package structure, path safety, missing metadata, suspicious secrets, and tool-manifest validity. Generate a deterministic `bundle-manifest.json` with `scripts/make_manifest.py`.
4. Review the exact destination diff. Include only the requested `skills/` content and its manifest; do not include credentials, browser state, unrelated outputs, caches, or hidden files.
5. A user request to upload/publish authorizes the final repository mutation for that named target. Before pushing, confirm the resolved remote and branch, then commit with a focused message. If authorization is not explicit, stop after preparing the diff.
6. Verify the remote commit and the expected files through the repository's normal read path. Record the commit, destination, file count, and validation results. If push or verification fails, report the observed state and leave the working tree recoverable.

Read [publishing-checklist.md](references/publishing-checklist.md) before an external push. Use the included scripts for local, repeatable checks; they do not authenticate or push anything.

## Boundaries

- Never search for, print, or commit secrets. Treat `.env`, credential files, tokens, cookies, and private browser exports as out of scope.
- Never use force-push, reset, mass deletion, or broad cleanup to make the diff convenient.
- Do not treat a local commit as an upload; verify the remote state independently.
