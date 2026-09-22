# Innovator

**Innovator** is a research studio for turning problems into bounded invention candidates. It combines a cross-domain reasoning loop, documented invention research packages, a persistence-backed workspace, and a versioned collection of reusable advanced-mathematics and innovation skills. The repository retains earlier application material while its reusable-methods surface is now the canonical [`skills.md/eureka_skill/`](skills.md/eureka_skill/) collection.

> **Evidence boundary.** Repository materials can document hypotheses, simulations, finite checks, design studies, and research workflows. They do **not** by themselves establish a theorem, safe physical design, patentability, freedom to operate, certification, manufacturing readiness, or commercial viability.

| Repository area | What it contains | Primary entry point |
|---|---|---|
| Application | A Vinext/Vite, React, and Cloudflare Worker-compatible invention workspace. The default Research Studio makes Frame → Bridge → Challenge → Test visible, with deterministic demo behavior and an optional OpenAI disclosure route. | [`app/`](app/) and [`package.json`](package.json) |
| Invention archive | Bounded research packages, supporting visual material, models, and explicit limitations from prior work. | [`inventions/`](inventions/) |
| Concept assets | Eleven repository-ready concept images from the shared invention-image set, with a reproducible generator and a public mirror for the app. | [`assets/pictures/`](assets/pictures/) and [`scripts/generate_innovator_assets.py`](scripts/generate_innovator_assets.py) |
| Reusable methods | The **eureka_skill** collection: 17 installable skill packages for evidence synthesis, mechanism design, mathematics, high-integrity computation, design-space studies, formal-claim auditing, and adversarial peer review. | [`skills.md/INDEX.md`](skills.md/INDEX.md) |
| Static companion | A generated GitHub Pages-friendly research archive, deliberately separate from the server-dependent application. | [`GITHUB_PAGES.md`](GITHUB_PAGES.md) |

## `eureka_skill`: reusable advanced-mathematics and innovation methods

The literal `skills.md/` directory name preserves the requested repository path. It is a directory—not a single Markdown file—because every child is a self-contained skill package with a `SKILL.md` and only the scripts, templates, or references it needs.

The collection is organized around an evidence-first contract. It labels claims as **sourced, computed, inferred, proposed, or unresolved**; requires baselines, meaningful negative controls, decision-reversal conditions, and explicit proof gaps; and keeps verification, model validation, uncertainty quantification, and reproducibility distinct. The included computational extensions are not a claim that the repository provides supercomputer hardware or results.

| Collection component | Package(s) | Function |
|---|---|---|
| Research and critique | `critical-creative-thinking`, `research-synthesis-hypothesis`, `frontier-research-architect`, `adversarial-peer-review` | Frame decisions, audit evidence coverage, expose assumptions, and run bounded attack-and-repair review loops. |
| Mechanism generation | `innovation-breakthrough-design`, `contradiction-mechanism-lab`, `cross-domain-recombination`, `invention-generation-orchestrator` | Create and compare falsifiable mechanism candidates. |
| Formalization and validation | `conjecture-formalization-lab`, `invention-validation-lab`, `bounded-invention-engineering` | Bound models, hypotheses, and kill/continue/reframe decisions. |
| Mathematics and high-integrity computation | `advanced-mathematics-computation`, `math-research-orchestrator`, `eureka-computational-lab`, `eureka-design-space-lab`, `eureka-formal-logic-lab` | Plan VVUQ-aware studies, constrained trade-offs, finite/exhaustive checks, certificates, and counterexample search. |
| Debate and red-team gate | `adversarial-peer-review` | Attack structure, logic, evidence, safety, and execution; apply concrete repairs; and record residual risks and reversal criteria. |
| Mega router | `eureka-skill` | Expose the user-facing **eureka_skill** routing workflow. |

Read the complete collection charter, validation record, and cited research grounding in [`skills.md/eureka_skill/COLLECTION.md`](skills.md/eureka_skill/COLLECTION.md). Individual packages are available under [`skills.md/eureka_skill/skills/`](skills.md/eureka_skill/skills/).

## Local development

The application requires **Node.js 22.13+** and pnpm. Install the locked dependency set and start the local development server as follows.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by the development server. The app remains an experimental vertical slice: its deterministic demo path runs without external credentials, while the optional disclosure endpoint can use an API key when configured.

The product direction and research method are recorded in [`docs/ADR-001-research-studio.md`](docs/ADR-001-research-studio.md). The Studio is deliberately a hypothesis-navigation tool: a bridge is not a discovery, and a candidate route is not a validated invention.

## Optional OpenAI configuration

Copy `.env.example` to `.env.local` and supply values appropriate to your environment.

```text
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6
```

Do not treat generated disclosure text or prior-art-like similarity output as legal, scientific, or engineering validation. Human subject-matter review remains necessary.

## Verification commands

Run the repository checks before proposing or merging changes.

```bash
pnpm build
pnpm test
pnpm lint
```

The `test` script runs a production build before its rendered-HTML test. The reusable skills carry their own structural validation instructions; the current collection release records its validation status in [`COLLECTION.md`](skills.md/eureka_skill/COLLECTION.md). A structural validator checks package shape and required sections; it cannot certify mathematical correctness or physical readiness.

## Static companion and deployment boundary

The main application includes server-rendered routes and API behavior, which GitHub Pages cannot execute. The repository therefore provides a separate static research companion rather than pretending the full application is a static deploy.

```bash
pnpm run pages:build
```

This writes a reviewable static artifact to `dist-pages/`, which is intentionally ignored by Git. The tested deployment workflow remains a template because the available automation credential could not create a GitHub Actions workflow file. See [`GITHUB_PAGES.md`](GITHUB_PAGES.md) for the administrator activation step and the exact static-versus-server boundary.

## Legal, safety, and research boundaries

Prior-art-like outputs are informational only and not legal advice. A low similarity score does not guarantee novelty, patentability, non-infringement, or freedom to operate. Simulation convergence does not automatically validate a physical model, and a documented invention package does not make a device safe or ready to manufacture. Safety-critical, regulated, and high-consequence work requires qualified independent review, measured evidence, and applicable regulatory/legal processes.

## Historical implementation note

The source tree and a few internal filenames retain the earlier **InventionHub** label because they are part of the preserved application implementation. The repository identity and current documentation are **Innovator**. The former Build Week/demo framing is retained only as historical implementation context in tracked source material, not as the current description of this project.

## License

Application code is available under the [MIT License](LICENSE). Individual invention packages and reusable skills may state their own licensing or usage terms where applicable.

## Provider and project limits

A disclosure request uses at most one configured paid provider. Gemini takes precedence when configured; provider errors do not trigger a second paid-provider request. The route requires the configured trusted-edge identity and shared D1 quota controls before paid inference. See [`docs/paid-inference-boundary.md`](docs/paid-inference-boundary.md) before enabling paid providers in a public deployment.

Project creation uses shared D1 quotas (3 per user per UTC hour, 10 per user per UTC day, 25 per deployment per UTC hour, and 100 per deployment per UTC day) and fails closed if the quota store is unavailable. Project listing is cursor-paginated (20 by default, maximum 50). These limits control request and page volume; they do not define a lifetime storage or retention policy. Set a deletion policy and monitor storage before broad production use.
