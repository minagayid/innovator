# GENO-AQUATIC — Symbolic Aquatic-Trait Teaching Sandbox

GENO-AQUATIC is invention 10, a small research-literacy package for expressing
and checking **fictional, symbolic trait hypotheses** in aquatic settings. It is
kept separate from NeuroForge (invention 11).

The handoff described a computational genome-consequence teaching sandbox, but
both archives available in the shared conversation contained NeuroForge files.
This package is therefore a transparent, safety-bounded reconstruction from the
task description, not a recovered copy of the missing GENO-AQUATIC artifact.

This sandbox uses synthetic labels only. It contains no biological sequences,
organism-specific genetic design, gene-editing targets, laboratory protocol,
breeding instructions, or environmental-release plan. It cannot predict an
organism's phenotype, fitness, ecological effects, or safety. Its records are
not experimental results.

## Contents

- `docs/RESEARCH_BOUNDARY.md` defines permitted use and evidence limits.
- `schemas/candidate.schema.json` defines the small symbolic record format.
- `examples/candidate.example.json` is entirely synthetic.
- `tools/validate_candidate.py` checks structure and red-line fields offline.
- `tests/test_validator.py` verifies acceptance and rejection cases.

Run the local checks with `python -m unittest discover -s tests -v` from this
directory. The output only says whether a synthetic record fits the schema.
