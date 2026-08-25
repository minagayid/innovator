---
name: research-synthesis-hypothesis
description: A rigorous research workflow for discovering, comparing, and synthesizing knowledge across disciplines, then turning gaps into testable hypotheses and bounded experiments. Use for literature reviews, technical reconnaissance, research maps, and evidence-backed idea generation.
---

# Research, Synthesis, and Hypothesis Formation

Use this skill when a question spans multiple fields or needs more than a list of sources. The goal is a traceable chain from **question → evidence → synthesis → hypothesis → test**.

## Workflow

1. **Frame the research question.** Define the decision or unknown, scope, date window, populations or systems, and what evidence would change the conclusion.
2. **Map the vocabulary.** Build synonyms, neighboring concepts, canonical methods, known failure modes, and competing explanations before searching.
3. **Collect source layers.** Start with primary papers, official specifications, datasets, and authoritative institutional pages. Use reviews for orientation, not as a substitute for primary evidence. See [source-hierarchy.md](references/source-hierarchy.md).
4. **Extract claim units, not just summaries.** For each source record the claim, method, sample or domain, assumptions, result, limitation, exact location/link, and whether the claim is directly observed, inferred, or only proposed.
5. **Audit evidence coverage.** For every material mechanism link, record supporting, contradicting, missing, and non-comparable evidence. Stop expanding search only when vocabulary, source-layer, date, and mechanism coverage are stated.
6. **Synthesize by mechanism.** Group findings by causal mechanism, invariant, measurement, or failure mode. Explicitly preserve disagreement and distinguish absence of evidence from evidence of absence.
7. **Generate hypotheses.** Formulate a falsifiable statement with variables, direction or expected relation, scope, and a plausible mechanism. Produce alternatives, not a single favored story.
8. **Design the smallest decisive test.** Prefer a low-cost experiment, ablation, replication, counterexample search, or formal derivation that can eliminate hypotheses. State the evidence threshold that would reverse the current ranking.
9. **Update the ledger.** Mark each claim as supported, contradicted, unresolved, or assumption-dependent. Record next steps, search limits, and what would constitute a breakthrough.

## Hypothesis quality gate

A usable hypothesis must be specific enough to fail, connected to an identified mechanism, measurable with available data or mathematics, and bounded so that a negative result is informative. Do not describe a speculative connection as established fact.

## Default output

Use `templates/research-brief.md`: executive conclusion, evidence table, synthesis, competing hypotheses, decisive tests, limitations, and references. Cite primary sources inline with stable links.
