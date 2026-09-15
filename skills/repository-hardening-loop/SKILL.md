---
name: repository-hardening-loop
description: Implement approved audit corrections across code repositories, revalidate them, and prepare isolated review branches; use when the user asks for remediation, not merely a read-only review.
metadata:
  hermes:
    tags: [software-development, repository-hardening, testing]
---

# Repository Hardening Loop

Use this when the user asks to implement a repository audit or security correction plan.

## Preserve scope and existing work

- Map each accepted finding to the repository, files, intended behavior, test, and any dependency on deployment or product decisions.
- Inspect local instructions, Git status, remotes, and the latest relevant branch before editing. Preserve unrelated user changes, untracked content, media, data, and local configuration.
- For GitHub work, compare against the current default branch. Use an isolated worktree or feature branch and replay only the needed changes; do not overwrite newer upstream behavior with a stale local tree.
- Do not read secrets or private datasets. Do not install packages, run paid provider calls, or probe live services unless the user explicitly authorizes that exact step.

## Implement in verified units

For each fix, state the precondition, minimal change, decisive verification, and recovery path. Keep changes limited to the accepted correction plan. After each meaningful edit, run the cheapest test that demonstrates the new behavior. Then run the repository’s focused suite and relevant static checks on the exact final branch contents.

If the declared runtime or dependencies are unavailable, do not silently change environments or install tools. Record the unsupported check and use safe evidence from the available runtime without calling it release proof.

## Critique and repair loop

- Ask a senior-engineering lens to challenge architecture and regressions, and white-hat/red-hat/black-hat lenses to challenge controls and abuse paths when the user asks for those perspectives and agents are available.
- Keep adversarial work local and synthetic. A review role is a perspective, not proof of a reviewer’s real-world tenure or independence.
- Resolve material findings with code changes and tests, or record them as open gates with evidence and an owner decision. Stop after four critique/repair rounds, then perform a final diff and test review rather than cycling indefinitely.
- Recheck that tests cover the failure mode, that the final diff contains no conflict markers or unrelated files, and that generated artifacts are safe to publish.

## Publish only the authorized review surface

When the user explicitly asks to work in GitHub, create a named branch and a reviewable pull request from the verified branch contents. Use a draft PR if unresolved deployment, data, clinical, or governance gates remain. Do not merge or deploy unless the user explicitly requests it and the required gates are satisfied. For repositories on other hosts, do not assume GitHub access or push authority.

## Completion record

Update the audit artifact with the actual branch or PR link, tests run, test failures or unsupported environments, and remaining gates. Claim only what the evidence demonstrates; distinguish a code fix from deployed configuration and from real-world readiness.