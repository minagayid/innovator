---
name: rural-his-charter-presentation
description: Create a complete rural-hospital HIS transformation package from scenario
  briefs and charter templates. Use when the task involves selecting or implementing
  a Hospital Information System in a resource-constrained hospital, especially when
  it requires a project charter, 12-month timeline, budget, stakeholder engagement,
  change management, vendor evaluation, presentation deck, speaker notes, or a printable
  script handout.
---

# Rural HIS Charter and Presentation Workflow

## Overview

Use this skill to turn a hospital scenario and project-charter template into a coherent, evidence-bounded HIS selection and implementation package. Produce a tailored charter, lifecycle plan, budget, stakeholder and change-management plan, professional presentation, speaker notes, and—when requested—a ready-to-print project-team handout.

Keep the work grounded in the supplied scenario. Label planning assumptions explicitly and do not present invented vendor names, regulatory claims, dates, or clinical outcomes as facts.

## Workflow

### 1. Inspect the source package

Read the scenario brief and charter template completely before drafting. Extract the following into a project fact sheet:

- Facility type, location, beds, workforce, departments, and current workflows.
- Existing infrastructure, internet quality, devices, servers, power constraints, and IT staffing.
- Stated budget, duration, challenges, required outcomes, and stakeholder groups.
- Template sections that must be completed or adapted.

If PDFs are supplied, use text extraction first and visual inspection when tables, layouts, or scanned content matter. Preserve the source scenario’s numbers exactly.

### 2. Establish the project design principles

Translate the scenario into explicit design principles before choosing a solution. For rural or poorly connected hospitals, prioritize:

1. **Local-first continuity:** core clinical and administrative workflows must operate on the internal hospital network without continuous external internet.
2. **Small, controlled server room:** include a local HIS/EMR server, backup storage, UPS, restricted access, environmental checks, and recovery procedures.
3. **Low-readiness adoption:** assume uneven computer confidence; use short role-based sessions, supervised practice, printed job aids, and peer instructors.
4. **Scope discipline:** prioritize patient identity, registration, emergency, outpatient, inpatient, nursing, laboratory, radiology, pharmacy, billing, and reporting before optional cloud, portal, telemedicine, ERP, or advanced device features.
5. **No-surprises governance:** document workflows, owners, policies, approvals, support routes, downtime procedures, and go-live gates before scale-up.

### 3. Complete the 16-step lifecycle

Use this lifecycle as a gated backbone. Each step must have an owner, output, and approval point.

| Step | Required work package | Minimum output |
|---:|---|---|
| 1 | Project charter | Approved objectives, scope, budget, governance, assumptions, and expected outcomes |
| 2 | Project team identification | Multidisciplinary team and responsibility matrix |
| 3 | Data collection / current-state assessment | Workflow, infrastructure, readiness, staffing, connectivity, and baseline report |
| 4 | Stakeholder meetings | Needs, concerns, expectations, and decision log |
| 5 | Requirements gathering | Functional, clinical, technical, integration, reporting, security, usability, and operational requirements |
| 6 | Vendor evaluation matrix | Criteria, weights, scoring scale, mandatory gates, and evidence rules |
| 7 | HIS vendor shortlisting and evaluation | Approximately three shortlisted solutions, scripted demonstrations, scorecards, reference checks, and technical tests |
| 8 | HIS selection | Recommendation and documented justification |
| 9 | Budget preparation | License, infrastructure, implementation, integration, migration, training, support, maintenance, and contingency model |
| 10 | Procurement | Approved procurement package, contract, service levels, and payment milestones |
| 11 | Implementation planning | Workplan, responsibilities, dependencies, migration, integrations, testing, training, downtime, and cutover plan |
| 12 | Training and change management | Instructor/super-user plan, competency model, communications, policies, and adoption dashboard |
| 13 | System implementation and go-live | Configured system, tested interfaces, migrated data, readiness approval, and phased cutover |
| 14 | Post-go-live support | Hypercare log, issue burn-down, support rota, and stabilization report |
| 15 | Maintenance and continuous support | SLA, maintenance calendar, incident process, enhancement backlog, and handover |
| 16 | Performance monitoring | KPI definitions, monthly dashboard, benefits review, and improvement actions |

### 3A. Integrate a technical specification addendum

When the user supplies a detailed addendum, map it into the charter instead of copying it as unsupported fact. Add these seven workstreams when requested:

1. Needs assessment: current hospital status, technical gaps, and workforce specialization.
2. HIS selection and technical specifications: local on-premise/open-source candidate, PostgreSQL or equivalent, audit trail, LAN/server room, power, failover, and legacy hardware upgrades.
3. Implementation, timeline, workflow, and budget: preserve the approved overall program while labeling any shorter installation-to-go-live window explicitly.
4. Training and change management: digital literacy, role/permission-based training, simulation, parallel running, instructor cohort, and on-floor support.
5. Emergency and disaster recovery: UPS/generator, server-failure contingency, downtime forms, strategic spares, and controlled backlog entry.
6. Governance and tender procedures: bidder evidence, bonds, warranty/SLA, disqualifiers, and weighted technical scorecard.
7. KPIs and smart reporting: waiting/turnaround time, adoption, medication-order clarity, system health, daily flow, productivity, supply chain, and periodic executive reports.

Convert precise technical claims into **targets and acceptance tests** unless they have been verified. For example, two-server high availability, RAID, two-hour UPS ride-through, five-minute failover, and a 60% turnaround improvement are design or evaluation targets until witnessed, measured, and accepted. Treat open-source product names as candidate references, never as a pre-selected vendor.

### 4. Build the 12-month plan

Use a 12-month schedule unless the scenario imposes a different duration. For a rural hospital, use this default sequence and adapt only when justified:

| Months | Focus |
|---|---|
| 1–2 | Charter, team, current-state assessment, stakeholder meetings, readiness baseline, and requirements |
| 2–4 | Evaluation matrix, vendor shortlist, selection, budget approval, procurement, and contract |
| 4–7 | Internal LAN, small server room, local server, configuration, data preparation, integrations, backup, and recovery testing |
| 8 | One-month pilot in representative departments; log issues daily, fix and communicate weekly, and hold a formal exit decision |
| 7–9 | Certify instructor-users, prepare materials, train department heads and key users, and acknowledge policies |
| 10–11 | Phased hospital go-live, command center, floor support, hypercare, stabilization, and issue resolution |
| 12 | Maintenance handover, support review, first KPI/benefits review, lessons learned, and closure |

Do not describe Month 8 as a short demonstration. Treat it as a full one-month operating pilot with defect management, feedback, recovery testing, and an explicit go/no-go decision.

### 5. Build and verify the budget

Set a fixed total budget from the scenario. Reserve **10% of the total budget as a separate contingency and miscellaneous line** when the user requires it. Use a deterministic calculation tool such as `bc` to verify the allocation sum and contingency percentage; never rely on mental arithmetic.

For a rural Egyptian project with a fixed EGP 5 million ceiling, this is a reusable starting structure. Adjust labels or amounts only when the scenario requires it, and verify that the percentages sum to 100% and the amounts sum to EGP 5.00M.

| Category | Default EGP M | Default share |
|---|---:|---:|
| HIS/EMR software | 0.95 | 19% |
| Infrastructure, internal LAN, and server room | 1.20 | 24% |
| Configuration and integration | 0.85 | 17% |
| Data digitization and migration | 0.40 | 8% |
| Training and change management | 0.35 | 7% |
| One-month pilot and hypercare | 0.25 | 5% |
| Maintenance, security, and backup | 0.50 | 10% |
| Contingency and miscellaneous | 0.50 | 10% |
| **Total** | **5.00** | **100%** |

State what the reserve may cover—rural travel and logistics, price variation, replacement equipment, power/connectivity surprises, minor approved scope gaps, and other unforeseen implementation needs—and require governance approval for release.

### 6. Create the stakeholder engagement plan

Use a matrix with these columns: stakeholder group, concern/contribution, engagement method, cadence, accountable owner, and evidence of engagement. At minimum, consider:

- Hospital Director / Sponsor.
- Relevant health authority or public-sector oversight.
- Medical, nursing, ancillary, registration, billing, and administration leads.
- Hospital IT and the wider IT team.
- Instructor-users / super-users.
- Patients and community representatives.
- HIS vendor / implementation partner.

Use a predictable rhythm: monthly sponsor governance, department workshops and UAT, weekly vendor delivery reviews, technical acceptance and recovery drills by IT, and daily command-center meetings during the pilot and go-live.

### 7. Create the change-management plan

When staff are untrained or have low computer confidence, use a train-the-trainer model. If the workforce is 250, certify **50 instructor-users**, equal to 20%. Calculate the cohort using a deterministic tool when the percentage is variable.

The instructor curriculum should include:

- Basic computer and login skills.
- HIS workflows by role.
- Teaching and communication skills.
- Privacy, acceptable use, and patient identity.
- Downtime, backup, and recovery procedures.
- Basic troubleshooting and escalation.
- The approved no-surprises policy pack.

Require short role-based sessions, repeat sessions for shifts and rotating staff, supervised practice, competency checks, quick-reference cards, floor support, an issue route, and an adoption dashboard.

### 8. Define the no-surprises policy pack

Before pilot entry, publish version-controlled plain-language policies. At minimum cover:

- Scope and decision rights.
- User access, identity, roles, and visiting-physician access.
- Privacy and acceptable use.
- Patient identity, duplicate prevention, and data correction.
- Clinical and administrative workflows.
- Downtime and recovery.
- Backup and server-room operations.
- Incident severity and escalation.
- Training and competency.
- Change and release management.
- Vendor support and service levels.
- Procurement and contingency release.
- KPI definitions and review cadence.

Do not make a new workflow mandatory until it has a documented owner, procedure, demonstration, support route, and user acknowledgement.

### 9. Create the presentation

Use the dedicated slide workflow. Keep each generated deck to no more than 12 slides when the presentation environment imposes that limit. If the user requests a longer presentation, plan a multi-part set of merge-ready decks rather than silently compressing or dropping required content. A strong single-deck default outline is:

1. Cover: project title, scenario, and presenters.
2. Presenter 1 divider: needs assessment.
3. Needs assessment: hospital status, technical gaps, workforce map.
4. Presenter 2 divider: HIS selection and implementation.
5. Technical specifications: local architecture, PostgreSQL/security, LAN/server room, legacy hardware.
6. Implementation/workflow/budget: six-month installation-to-go-live window, departmental workflow, detailed budget, and contingency.
7. Presenter 3 divider: training, resilience, and governance.
8. Training/change: digital literacy, role/permission training, simulation, parallel running, instructors, on-floor support.
9. DRP: power, server failover, downtime and backlog reconciliation.
10. Governance/tender: legal/financial requirements, disqualifiers, 100-point scorecard, 85-point technical threshold.
11. KPIs/reporting: waiting time, adoption, medication clarity, system health, and daily/periodic reports.
12. Decision/thank you: budget, local technical plan, pilot, training, DRP, governance, and KPI approvals.

Use real scenario numbers. Do not invent vendor names or performance evidence. Gather visual assets before slide generation when imagery is useful. Use diagrams or native slide shapes for accurate architectures, timelines, and budgets rather than AI-generated charts.

### 9A. Divide the presentation by presenter

When multiple presenters are named, allocate contiguous slide sections and insert typographic divider slides before each presenter’s content. Keep the deck within the maximum slide count by combining related content rather than adding unlimited slides. A practical 12-slide arrangement is:

| Slides | Presenter | Focus |
|---|---|---|
| 1–3 | Presenter 1 | Cover, divider, needs assessment |
| 4–6 | Presenter 2 | Divider, technical specifications, implementation/workflow/budget |
| 7–12 | Presenter 3 | Divider, training, DRP, tender, KPIs, decision/thank you |

Use minimal divider slides with a generic presenter label, section title, and a one-line topic preview. Do not assume that Presenter 1, Presenter 2, or Presenter 3 corresponds to a named person unless the user explicitly provides that arrangement. Place presenter names on the opening and closing slides when appropriate. After any structural revision, regenerate notes from the final slide order and confirm that notes refer to the correct slide identifiers.

### 9B. Split, review, and merge long presentations

When the requested deck exceeds the per-deck slide limit, create separate merge-ready parts. First write a single master outline with global slide numbers, source-part mapping, presenter ownership, and transition text. Then split it into chunks of no more than 12 slides, preserving the visual system and page numbering logic in each part. Keep the opening cover and continuation cover minimal; do not repeat substantive content merely to fill a part.

For a 24-slide two-part design, a reliable allocation is Part 1 slides 1–12 and Part 2 slides 13–24. Use exact global ownership counts—for example, four substantive owned slides for each of three presenters—while treating neutral divider slides and shared program/closing slides as unassigned. A good pattern is: Presenter 1 owns slides 3–6, Presenter 2 owns slides 8–11, and Presenter 3 owns slides 17–20; shared slides carry the program context, handoffs, KPIs, support, and closing.

Before delivery, review every transition in sequence. Check that each slide answers the question raised by the previous slide, that the handoffs do not introduce a new topic abruptly, and that the final decision request appears only after evidence, controls, and measures. Produce a merge guide with the exact order, source slide, owner, and transition assessment. Create a combined script/notes handout using the merged global numbering even when the actual presentations remain separate.

### 10. Generate speaker notes and print handout

After the deck is finalized, generate notes for all slides. Each note should:

- Be written as a presenter script, not a copy of the slide text.
- Explain the visual’s decision logic.
- Mention the scenario-specific constraints and controls.
- Include a natural transition to the next slide.
- Stay concise enough for live delivery, generally 80–130 words per slide and always under 200 words.

For a ready-to-print team handout, create a structured Markdown document with:

1. Title, presenters, audience, and version.
2. Project snapshot table.
3. Suggested delivery approach and timing.
4. One section per slide with purpose, speaker script, delivery cues, and transition.
5. Likely questions and suggested answers.
6. Final team reminder and source basis.

Convert the final handout to PDF only when requested. Prefer the Typst PDF workflow for precise professional documents; use `manus-md-to-pdf` as a practical fallback when the environment or task makes it more appropriate. Visually inspect representative pages and verify that tables and headings remain readable.

## Quality gates

Before delivery, verify the following:

- All scenario numbers match the source brief and charter.
- The budget amounts sum exactly to the approved total and contingency equals 10% when required.
- The internal LAN and small server-room architecture is explicit.
- The pilot is one full month and has a formal exit decision.
- The instructor cohort is exactly 20% of the workforce when required.
- Policies cover access, privacy, identity, workflows, downtime, backup, incidents, training, changes, support, procurement, and KPIs.
- The 16 lifecycle steps are all represented in the charter and presentation.
- The seven requested workstreams are visible in the charter and deck.
- The deck uses presenter divider slides, or uses multiple merge-ready parts when the slide limit requires splitting.
- A long-deck merge guide records the exact global order and transition logic.
- Speaker notes align with the final global slide order and presenter ownership, not an earlier draft.
- The PDF handout has been visually inspected and is readable when printed.

## Common failure modes

Avoid these recurring mistakes:

- Recommending cloud-first deployment despite poor connectivity.
- Treating the HIS as only a software installation instead of a selection, adoption, and support program.
- Hiding contingency inside another budget line.
- Calling a short demonstration a pilot.
- Training everyone once without a local instructor network.
- Presenting policies as informal suggestions rather than controlled pre-go-live requirements.
- Introducing unsupported vendor names or regulatory claims.
- Letting the speaker notes drift from the latest slide order after revisions.
- Delivering a PDF handout without checking tables, page breaks, or print readability.
- Assuming divider-slide names or presenter ownership without user confirmation.
- Creating separate deck parts without a global merge order, transition review, or combined notes handout.
