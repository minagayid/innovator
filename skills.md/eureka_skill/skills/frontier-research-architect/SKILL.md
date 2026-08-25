---
name: frontier-research-architect
description: Architect research for breakthrough invention by mapping a problem’s functions, bottlenecks, prior art, adjacent mechanisms, constraints, and evidence gaps. Use before ideation when a topic needs cross-disciplinary reconnaissance or a defensible opportunity map.
---

# Frontier Research Architect

Use this skill before generating inventions when the problem is broad, cross-disciplinary, or vulnerable to novelty and evidence errors. Produce a map of **what the system must do, why current approaches fail, and where a mechanism gap may exist**.

## Workflow

1. **Define the system boundary.** Specify users, environment, inputs, outputs, time scale, resources, failure costs, and excluded claims. Write the decision or unknown that the research must resolve.
2. **Map the function stack.** Decompose the system into desired functions, bottlenecks, interfaces, invariants, resources, and failure modes. Separate performance metrics from constraints and preferences.
3. **Build the vocabulary.** List synonyms, neighboring fields, canonical mechanisms, materials, algorithms, standards, and known failure modes. Search broad terms first, then refine with mechanisms and measurable outcomes.
4. **Collect layered evidence.** Prefer primary papers, official specifications, datasets, patents or prior-art databases, and authoritative institutional sources. Use reviews for orientation, not as substitutes for primary evidence. Record vocabulary, date coverage, source classes, and exclusions. Read [evidence-schema.md](references/evidence-schema.md) when constructing the ledger.
5. **Extract mechanisms.** For each source, record the causal or mathematical mechanism, operating conditions, metric, baseline, limitation, exact link, and evidence status. Distinguish “not studied” from “shown not to work.”
6. **Map the frontier.** Organize findings by mechanism rather than by publication. Mark mature, emerging, contradictory, under-measured, and neglected areas. Identify at least three gaps with different explanations.
7. **Write opportunity statements.** Each gap must state the tension, affected function, plausible mechanism class, evidence supporting and contradicting the gap, search coverage limits, gap confidence, and a decisive observation that could close it.
8. **Hand off.** Send the opportunity statements, evidence ledger, assumptions, and stop conditions to `contradiction-mechanism-lab` and `cross-domain-recombination`.

## Quality gates

Do not infer an opportunity from popularity alone. Require a measurable bottleneck, an explicit baseline, and a source-backed reason that current approaches leave value on the table. Do not call an area “unexplored” unless the search scope and vocabulary are stated.

## Output

Use [frontier-map.md](templates/frontier-map.md). Include a research question, system map, evidence ledger, mechanism clusters, gap statements, competing explanations, search limits, and recommended next handoff. Label each entry observed, sourced, inferred, proposed, or unresolved.
