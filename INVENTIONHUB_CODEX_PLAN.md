# InventionHub / InnovArt Codex Build Plan

Last updated: July 21, 2026

## 1. Hackathon Fit

OpenAI Build Week requires a working project built with Codex and GPT-5.6, a text description, a public YouTube demo video under 3 minutes, and a code repository URL for judging. If the project existed before the hackathon, the submission must clearly document what was added during the submission period and show evidence of Codex and/or GPT-5.6 use.

Recommended track: **Work and Productivity**.

Why this track fits: InventionHub helps inventors, engineers, labs, students, and manufacturing partners move faster from physical invention idea to prior-art discovery, open collaboration, disclosure, prototype planning, and manufacturing handoff.

Secondary positioning: It can mention education and developer-tool-like qualities, but submit to only one track.

Submission deadline: July 21, 2026 at 5:00 PM PDT, which is July 22, 2026 at 3:00 AM Cairo time.

## 2. Product Vision

Build **InventionHub**, an open-source workspace for physical inventions.

The platform is similar in spirit to GitHub and Hugging Face, but instead of open-source code or machine learning models, it is organized around open physical inventions: designs, bills of materials, CAD files, manufacturing notes, test results, patent/prior-art checks, licensing, and commercialization pathways.

Mission: reduce duplicated invention effort, accelerate useful physical innovation, and create a fair path where inventors can publish, collaborate, manufacture, and share commercial upside.

Business model:

- Inventions can be published openly for public benefit.
- When InventionHub helps manufacture or commercialize an invention, net profit is split 50/50 between the inventor or inventor team and the company.
- Public-good and humanitarian inventions can include non-commercial or low-cost licensing options.
- The platform should be transparent about licenses, manufacturing rights, revenue-share terms, and attribution.

Important legal disclaimer for the MVP: InventionHub provides prior-art discovery and invention organization. It does not provide legal patent advice or guarantee patentability, freedom to operate, or non-infringement.

## 3. MVP Goal

Build a polished web app that demonstrates the core workflow:

1. An inventor creates an invention workspace.
2. GPT-5.6 helps structure the raw idea into an invention disclosure.
3. The system searches or simulates patent-office prior-art sources.
4. The app shows similarity results and repetition risk.
5. The inventor publishes an open invention page with files, collaborators, license, BOM, and manufacturing-readiness status.
6. A manufacturing partner can review the invention and express interest.
7. The platform shows the proposed 50/50 commercialization split.

For the hackathon, prioritize a believable vertical slice over a huge platform.

## 4. Build Strategy

Use the existing `minagayid/innovart` repo if it is available locally or can be cloned. If it is private or unavailable, create a new repo named `inventionhub` and include a note in the README explaining that the Build Week submission was created/extended during the hackathon with Codex.

Recommended stack for fastest build:

- Framework: Next.js with TypeScript
- Styling: Tailwind CSS
- UI: shadcn/ui or equivalent local component system
- Database: SQLite with Prisma for MVP, upgradeable to Postgres
- AI: OpenAI Responses API
- Search/RAG: local patent sample dataset for demo, with connector interfaces for patent office APIs
- File handling: local uploads or mocked artifact cards for CAD/BOM/demo purposes
- Deployment target: Vercel, Render, Railway, or any stable public demo URL

If the existing repo uses another stack, keep its stack unless it blocks rapid delivery.

## 5. Core Personas

Inventor:

- Has a physical product idea, prototype, or sketch.
- Wants to know if similar inventions already exist.
- Needs help turning scattered notes into a structured invention disclosure.
- Wants attribution, collaboration, and potential commercialization.

Collaborator:

- Can contribute CAD, electronics, materials, firmware, testing, manufacturing, safety, or documentation.
- Needs clear contribution history and role attribution.

Patent / prior-art reviewer:

- Reviews similarity results and flags likely duplication.
- Needs source links, claims summaries, and explainable similarity.

Manufacturing partner:

- Looks for inventions that are manufacturable, useful, and commercially viable.
- Needs BOM, estimated cost, readiness stage, and licensing/revenue terms.

## 6. MVP Features

### 6.1 Public Invention Gallery

Build a gallery of invention cards:

- Title
- Short summary
- Category
- Readiness stage
- Prior-art risk score
- License
- Collaboration status
- Manufacturing interest count

Example categories:

- Health and accessibility
- Climate and energy
- Agriculture
- Education hardware
- Safety
- Mobility
- Home and daily life
- Manufacturing tools

### 6.2 Invention Workspace

Each invention should have a dedicated workspace with tabs:

- Overview
- Prior Art
- Files
- BOM
- Prototype Plan
- Collaborators
- Manufacturing
- License and Terms

Workspace fields:

- Problem
- Proposed solution
- Key novelty claim
- Use cases
- Materials
- Components
- Sketch/CAD placeholders
- Safety considerations
- Manufacturing method
- Open questions

### 6.3 GPT Disclosure Assistant

The user enters rough notes. GPT-5.6 transforms them into:

- Invention title
- Abstract
- Problem statement
- Technical field
- Novelty hypothesis
- Main components
- Operating principle
- Differentiators
- Suggested diagrams
- Missing information questions
- Draft public summary

The assistant should be careful and use language like "possible novelty" rather than "patentable".

### 6.4 Patent / Prior-Art Search

For the hackathon MVP, implement two layers:

1. Demo dataset: Include 20-50 sample prior-art records in JSON or SQLite so judges can test reliably.
2. Integration interface: Add connector modules for real patent sources, even if only one is live.

Potential sources:

- USPTO PatentsView API
- European Patent Office OPS
- WIPO PATENTSCOPE
- The Lens
- Google Patents links as outbound references only, if direct API terms are not suitable

MVP prior-art result fields:

- Source
- Patent/publication number
- Title
- Abstract
- Filing/publication date
- Inventors/assignee if available
- Similarity score
- Matched concepts
- Why it may overlap
- Why the submitted invention may still be different
- Source URL

### 6.5 Repetition Risk Report

Show a concise report:

- Overall risk: Low, Medium, or High
- Top overlapping inventions
- Claimed novelty areas
- Missing search terms
- Suggested next searches
- "Not legal advice" notice

### 6.6 Open Invention Page

Create a public-facing page like a GitHub/Hugging Face project page:

- Hero summary
- Invention files
- README-style documentation
- License
- Contributor list
- Prior-art report
- BOM
- Prototype plan
- Manufacturing readiness
- Commercialization terms

### 6.7 Manufacturing and Revenue Split

Add a manufacturing panel:

- Estimated unit cost
- Target use case
- Manufacturing complexity
- Materials availability
- Quality/safety requirements
- Partner interest CTA
- Default proposed split: 50% inventor / 50% InventionHub

Make it clear that final terms require agreement.

## 7. Data Model

Recommended initial entities:

- `User`
- `Invention`
- `InventionVersion`
- `Disclosure`
- `PriorArtRecord`
- `PriorArtMatch`
- `FileAsset`
- `BomItem`
- `PrototypeStep`
- `Contribution`
- `License`
- `ManufacturingInterest`
- `CommercializationTerm`

Suggested fields:

`Invention`

- `id`
- `slug`
- `title`
- `summary`
- `category`
- `status`
- `readinessStage`
- `licenseType`
- `ownerId`
- `createdAt`
- `updatedAt`

`Disclosure`

- `id`
- `inventionId`
- `rawNotes`
- `abstract`
- `problem`
- `solution`
- `technicalField`
- `noveltyHypothesis`
- `componentsJson`
- `missingQuestionsJson`

`PriorArtMatch`

- `id`
- `inventionId`
- `priorArtRecordId`
- `similarityScore`
- `riskLevel`
- `matchedConceptsJson`
- `overlapExplanation`
- `differenceExplanation`
- `createdAt`

`BomItem`

- `id`
- `inventionId`
- `partName`
- `quantity`
- `estimatedUnitCost`
- `supplierNote`
- `required`

`CommercializationTerm`

- `id`
- `inventionId`
- `inventorSharePercent`
- `platformSharePercent`
- `licenseSummary`
- `requiresFinalAgreement`

## 8. AI Flows

### 8.1 Structure Invention Notes

Input:

- Raw invention description
- Optional category
- Optional intended users
- Optional materials/components

Output JSON:

- `title`
- `abstract`
- `problem`
- `solution`
- `technicalField`
- `noveltyHypothesis`
- `components`
- `keywords`
- `missingQuestions`
- `publicSummary`

### 8.2 Prior-Art Query Expansion

Input:

- Disclosure JSON

Output:

- Patent search keywords
- Synonyms
- IPC/CPC category guesses
- Search phrases
- Excluded terms

### 8.3 Similarity Explanation

Input:

- Disclosure
- Prior-art record
- Similarity score

Output:

- Matched concepts
- Overlap explanation
- Difference explanation
- Risk level
- Suggested follow-up searches

### 8.4 README Generator

Input:

- Invention data
- Disclosure
- BOM
- Prior-art report
- License/terms

Output:

- Public README-style invention page content
- Plain-English summary
- Safety notes
- Manufacturing notes

## 9. User Interface Plan

First screen should be the actual app, not a marketing page.

Recommended layout:

- Left sidebar: Gallery, New Invention, My Workspaces, Patent Sources, Manufacturing
- Top bar: Search, New Invention button, user menu
- Main screen: invention gallery and active workspace

Key screens:

1. Gallery screen
2. New invention wizard
3. Invention workspace
4. Prior-art report
5. Public invention page
6. Manufacturing partner view

Design tone:

- Serious, practical, optimistic
- Dense enough for real work
- Avoid a pure landing-page feel
- Use clear status badges and tables
- Show source links and confidence/risk levels visibly

## 10. API Routes

Suggested routes:

- `GET /api/inventions`
- `POST /api/inventions`
- `GET /api/inventions/:id`
- `PATCH /api/inventions/:id`
- `POST /api/inventions/:id/disclosure/structure`
- `POST /api/inventions/:id/prior-art/search`
- `GET /api/inventions/:id/prior-art`
- `POST /api/inventions/:id/bom`
- `POST /api/inventions/:id/manufacturing-interest`
- `POST /api/inventions/:id/readme/generate`

## 11. Patent Source Adapter Interface

Create a provider interface so real sources can be added one at a time:

```ts
export type PatentSearchQuery = {
  keywords: string[];
  phrases: string[];
  categoryHints?: string[];
};

export type PatentSearchResult = {
  source: "demo" | "uspto" | "epo" | "wipo" | "lens";
  publicationNumber: string;
  title: string;
  abstract: string;
  publicationDate?: string;
  inventors?: string[];
  assignee?: string;
  url?: string;
};

export interface PatentSourceAdapter {
  search(query: PatentSearchQuery): Promise<PatentSearchResult[]>;
}
```

Start with `DemoPatentAdapter`, then add `PatentsViewAdapter` if time allows.

## 12. Demo Dataset

Seed the app with example inventions:

1. Modular low-cost prosthetic hand
2. Solar food dryer for small farms
3. Portable water filter bottle
4. Classroom microscope phone attachment
5. Low-cost home energy monitor
6. Foldable emergency shelter connector

Seed prior-art records that overlap partially so the demo can show meaningful risk levels.

## 13. Build Phases

### Phase 1: Repo and App Foundation

- Create or inspect the repo.
- Add README with hackathon positioning.
- Set up Next.js, TypeScript, Tailwind, database, linting, and environment docs.
- Add `.env.example`.
- Add seed data.

Done when: the app runs locally and shows the gallery.

### Phase 2: Invention Workspace

- Build gallery.
- Build invention creation wizard.
- Build workspace tabs.
- Add CRUD for invention overview, BOM, prototype steps, and terms.

Done when: a user can create and edit an invention.

### Phase 3: GPT-5.6 Assistant

- Add OpenAI API client.
- Implement structured invention disclosure generation.
- Add query expansion for prior-art search.
- Add README/public-page generation.
- Include graceful fallback if no API key is present.

Done when: rough notes become a structured disclosure in the UI.

### Phase 4: Prior-Art Search

- Add demo patent adapter.
- Add similarity scoring.
- Add GPT explanation for overlaps and differences.
- Build prior-art risk report UI.
- Add source links and legal disclaimer.

Done when: an invention receives a believable prior-art report.

### Phase 5: Public Page and Manufacturing

- Build public invention page.
- Build manufacturing-readiness panel.
- Add 50/50 split display.
- Add manufacturing interest form.

Done when: the demo can show an invention moving from idea to publishable/manufacturable page.

### Phase 6: Hackathon Polish

- Add sample login or local demo mode.
- Add README setup instructions.
- Add testing instructions.
- Add "What was built with Codex/GPT-5.6" section.
- Add demo script.
- Deploy.
- Record under-3-minute video.

Done when: submission materials are complete.

## 14. README Requirements

The README should include:

- Project name and tagline
- Problem
- Solution
- Features
- Architecture
- AI usage
- Patent data/source notes
- Setup instructions
- Demo credentials or demo mode
- Testing instructions
- Known limitations
- Hackathon notes showing what was built during Build Week
- Codex/GPT-5.6 usage summary
- License

## 15. Demo Video Script

Target length: 2:30.

0:00-0:20 Problem:
"Inventors often duplicate work because physical invention knowledge is scattered across patent databases, notebooks, CAD files, and manufacturing contacts."

0:20-0:45 Product:
"InventionHub is an open-source workspace for physical inventions: GitHub and Hugging Face energy, but for hardware, prototypes, BOMs, prior art, and manufacturing."

0:45-1:20 Create invention:
Show rough notes becoming a structured invention disclosure through GPT-5.6.

1:20-1:55 Prior art:
Run prior-art search, show overlapping patents, similarity risk, and explainable differences.

1:55-2:20 Publish/manufacture:
Show public invention page, BOM, collaboration status, and 50/50 manufacturing revenue split.

2:20-2:30 Codex:
"Codex helped plan, build, refactor, and document the app during Build Week."

## 16. Devpost Submission Text Draft

Project title: InventionHub

Tagline: An open-source invention workspace that helps physical inventors publish, check prior art, collaborate, and move toward manufacturing.

Description:
InventionHub is a collaborative platform for physical inventions. It gives inventors a structured workspace for turning rough ideas into invention disclosures, checking similar prior art from patent-style databases, publishing open invention pages, and coordinating manufacturing interest. The product is designed to reduce duplicated effort and help useful inventions reach the world faster.

Built with GPT-5.6 and Codex, the MVP includes an AI disclosure assistant, prior-art query expansion, explainable similarity reports, public invention pages, BOM/prototype planning, and a manufacturing model where commercialized inventions can share profit 50/50 between the inventor and the platform.

## 17. Judging Strengths to Emphasize

Technical implementation:

- Real app workflow, not just a concept deck.
- Structured AI outputs.
- Patent-source adapter architecture.
- Explainable prior-art scoring.
- Data model for physical invention collaboration.

Design and UX:

- Clear invention workspace.
- Transparent risk reports.
- Practical manufacturing-readiness flow.

Impact:

- Reduces repeated invention effort.
- Helps independent inventors and students.
- Supports public-good hardware.
- Creates a fairer commercialization path.

Idea quality:

- Extends open-source collaboration from software and models into physical invention.
- Connects invention disclosure, prior art, collaboration, and manufacturing in one place.

## 18. Legal and Safety Boundaries

The app must display:

- "Prior-art results are informational and not legal advice."
- "A low risk score does not guarantee patentability or freedom to operate."
- "Manufacturing interest does not create a binding agreement."
- "Safety-critical inventions require qualified review before use."

Avoid:

- Claiming that the app "clears" patents.
- Claiming official integration with patent offices unless actually implemented and authorized.
- Using copyrighted CAD files, trademarked product images, or proprietary patent data without permission.

## 19. Codex Work Prompt

Use this prompt to start the build:

```text
Build InventionHub, a Next.js TypeScript web app for open-source physical inventions.

Use this markdown file as the source of truth. Implement the MVP vertical slice:
gallery -> create invention -> GPT disclosure assistant -> prior-art demo search -> risk report -> public invention page -> manufacturing panel with 50/50 split.

Keep the UI practical and work-focused. Use seeded demo data so the app works without external patent API credentials. Add an OpenAI API integration behind environment variables, with graceful fallback demo responses when no API key exists. Include README setup instructions, .env.example, and a Build Week section documenting what was built with Codex/GPT-5.6.

Prioritize a polished, testable demo over breadth.
```

## 20. References

- OpenAI Build Week Devpost rules: https://openai.devpost.com/rules
- OpenAI Build Week FAQ: https://openai.devpost.com/details/faqs
- OpenAI Build Week overview: https://openai.com/build-week/
- OpenAI Build Week resources: https://openai.devpost.com/resources
