# InventionHub

**An open-source workspace for physical inventions.** InventionHub helps inventors turn rough notes into structured disclosures, inspect explainable prior-art matches, coordinate open collaboration, and prepare useful hardware for manufacturing.

![InventionHub workflow](https://img.shields.io/badge/workflow-idea%20%E2%86%92%20prior%20art%20%E2%86%92%20manufacturing-176b48)

## The problem

Physical invention knowledge is fragmented across notebooks, CAD folders, patent databases, and manufacturing contacts. Independent inventors often repeat research, struggle to document possible novelty, and lack a transparent path from prototype to production.

## The solution

InventionHub brings the workflow into one practical workspace:

- A seeded public gallery of open physical inventions
- A GPT-powered disclosure assistant that uses careful “possible novelty” language
- A patent-source adapter concept and reliable demo prior-art dataset
- Explainable similarity scoring, overlap notes, and differentiation hypotheses
- README-style invention documentation, files, BOM, and prototype planning
- Contributor attribution and open-hardware licensing
- Manufacturing readiness and a clearly labeled proposed 50/50 net-profit split

The app is a polished vertical-slice demo. Every core flow works without external credentials.

## Quick start

Requirements: Node.js 22.13+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open the local URL shown in the terminal. Choose any invention to inspect its complete workspace, or select **New invention** to run the disclosure flow.

## Optional OpenAI integration

Copy `.env.example` to `.env.local` and add an API key:

```text
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6
```

`POST /api/disclosure` uses the OpenAI Responses API when a key exists and returns a deterministic demo disclosure otherwise. The system prompt explicitly avoids patentability claims and requests structured invention fields.

## Validate

```bash
pnpm build
pnpm test
pnpm lint
```

## Architecture

- Next.js-compatible TypeScript app powered by vinext/Vite
- React client workspace with accessible, responsive interactions
- Cloudflare Worker-compatible server output
- OpenAI Responses API route with credential-free fallback
- Local seed records for predictable gallery and prior-art demos
- Provider-oriented prior-art model ready for USPTO, EPO, or WIPO adapters

The system flow is documented in [`INVENTIONHUB_ARCHITECTURE.mmd`](INVENTIONHUB_ARCHITECTURE.mmd) and rendered as [`INVENTIONHUB_ARCHITECTURE.png`](INVENTIONHUB_ARCHITECTURE.png). The diagram distinguishes the credential-free deterministic demo fallback from the optional OpenAI path and ends at human review and legal verification; it does not claim patentability or manufacturing validation.

## Demo walkthrough (under 3 minutes)

1. Open the gallery and show real invention categories, readiness, risk, licensing, and manufacturing interest.
2. Create an invention from rough prosthetic-hand notes and structure the disclosure.
3. Open the workspace and inspect the repetition-risk report, overlap explanations, and source links.
4. Show the BOM, prototype plan, collaborators, and manufacturing brief.
5. Register manufacturing interest and explain the proposed, non-binding 50/50 commercialization split.

## Legal and safety boundaries

- Prior-art results are informational and are not legal advice.
- A low risk score does not guarantee patentability, freedom to operate, or non-infringement.
- Manufacturing interest does not create a binding agreement.
- Safety-critical inventions require qualified review before use.
- Demo patent matches are illustrative and should be verified at the linked official or public source.

## Build Week

This Build Week submission was created from the product plan in `INVENTIONHUB_CODEX_PLAN.md`. Codex helped scaffold the application, translate the product requirements into the complete interface, implement the demo data and OpenAI fallback, and validate the production build. GPT-5.6 is the configured model for live disclosure structuring.

## Known limitations

- Demo state resets on refresh; persistence and authentication are intentionally outside this vertical slice.
- Prior-art ranking uses curated demo results; production use requires live source adapters and legal review.
- Manufacturing cost figures and partner enquiries are illustrative.

## License

Application code is available under the [MIT License](LICENSE). Individual invention pages can declare their own hardware licenses, such as CERN-OHL-S-2.0.
