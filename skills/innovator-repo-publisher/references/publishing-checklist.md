# Innovator repository publishing checklist

Before publishing, capture:

- resolved remote URL and branch;
- exact source bundle and destination path;
- clean/dirty status before staging;
- validator output for each `SKILL.md`;
- bundle manifest and file count;
- diff review showing only intended files;
- resulting commit and remote verification.

Reject a bundle when it contains credentials, absolute local paths in operational instructions, symlinks that escape the bundle, unfinished scaffold markers, or a skill folder without `SKILL.md`. Local validation may succeed while remote authentication or branch protection still prevents publication; report those separately.
