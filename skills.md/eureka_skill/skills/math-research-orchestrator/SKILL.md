---
name: math-research-orchestrator
description: An orchestration layer for complex mathematical and innovation investigations. It routes a task through critical/creative thinking, research synthesis, innovation design, and advanced mathematics computation with explicit gates, evidence levels, and deliverables.
---

# Mathematics and Research Orchestrator

Use this skill when a request spans several reasoning modes or asks for a sustained research program. The orchestrator does not replace domain expertise; it selects the smallest sequence of specialist skills that can answer the question and prevents premature claims.

## Routing workflow

1. **Intake and goal frame.** Extract the objective, deliverable, scope, constraints, available artifacts, approval boundaries, and success criteria.
2. **Critical/creative pass.** Use `critical-creative-thinking` to clarify definitions, generate interpretations, identify assumptions, and propose adversarial tests.
3. **Research pass.** Use `research-synthesis-hypothesis` when external literature, prior art, data, or cross-domain evidence is needed. Produce a claim ledger and competing hypotheses.
4. **Innovation pass.** Use `innovation-breakthrough-design` when the task seeks new mechanisms, theories, equations, workflows, or inventions. Require at least three candidates unless constraints justify fewer.
5. **Mathematics-computation pass.** Use `advanced-mathematics-computation` for formalization, numerical experiments, exhaustive searches, symbolic work, or proof-gap analysis. Produce an experiment plan before running code. Use `eureka-computational-lab` for ensemble, VVUQ, design-space, or high-consequence studies when available.
6. **Compute-readiness gate.** Before execution, freeze the claimed decision, baseline, budget, output, numerical method, data/seed policy, reproducibility manifest, validation reference or unavailability rationale, and stop condition.
7. **Adversarial gate.** Return to critical/creative thinking to challenge the strongest result, inspect coverage and failure modes, and downgrade overclaims.
8. **Synthesis and decision.** Select the best-supported conclusion or next experiment. Preserve unresolved branches rather than forcing consensus.
9. **Deliverable and handoff.** Use the appropriate template, include verified-versus-assumed status, reproducibility instructions, VVUQ status, references, and the next bounded action.

## Decision routing

| User intent | Minimum route | Add when needed |
|---|---|---|
| Explain or assess a claim | Critical/creative thinking | Research for sources; math for formal proof obligations |
| Literature or field map | Critical/creative thinking → research synthesis | Innovation for opportunity gaps |
| New theory, equation, or invention | Critical/creative thinking → innovation design | Research for prior art; math for consistency and tests |
| Computational conjecture study | Critical/creative thinking → math computation | Research for known results; innovation for new heuristics |
| Millennium-class problem | All four skills, with repeated adversarial gates | Independent verification and proof-gap ledger are mandatory |

## Quality gates

Do not advance from exploration to execution without a precise target and bounded success criterion. Do not advance from computation to conclusion without reproducible metadata, controls, and an explicit proof gap. Do not call an idea novel, correct, safe, or commercially viable without the appropriate evidence. For irreversible external actions, stop at an approval gate.

## Default handoff contract

Every specialist handoff should include: objective, current evidence, assumptions, open questions, requested operation, output format, and stop condition. Read [routing.md](references/routing.md) for a compact handoff schema and use `templates/research-charter.md` for new programs.
