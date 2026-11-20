export const MAX_MANUFACTURING_BODY_BYTES = 20_000;
export const MAX_MANUFACTURING_TEXT_CHARS = 2_000;

export type ManufacturingInput = {
  title: string;
  problem: string;
  components: string[];
  category: string;
  researchEvidence: string[];
};

export type ManufacturingHandoff = {
  mode: "deterministic-gated";
  provenance: { evidence: "proposed"; source: "candidate-plus-user-input" };
  boundary: string;
  requirements: Array<{ item: string; provenance: "candidate" | "user-input" | "proposed"; acceptance: string }>;
  componentRecords: Array<{ component: string; provenance: "candidate" | "user-input"; supplier: string; incomingInspection: string }>;
  gates: Array<{ gate: string; holdPoint: string; reversalCriteria: string }>;
  exclusions: string[];
  unresolved: string[];
};

function clean(value: string, max = MAX_MANUFACTURING_TEXT_CHARS) {
  return value.trim().slice(0, max);
}

export function parseManufacturingBody(bodyText: string): { ok: true; value: ManufacturingInput } | { ok: false; status: 400 | 413; error: string } {
  if (new TextEncoder().encode(bodyText).byteLength > MAX_MANUFACTURING_BODY_BYTES) return { ok: false, status: 413, error: "Manufacturing handoff body is too large." };
  let body: unknown;
  try { body = JSON.parse(bodyText); } catch { return { ok: false, status: 400, error: "Manufacturing handoff body must be valid JSON." }; }
  if (!body || typeof body !== "object" || Array.isArray(body)) return { ok: false, status: 400, error: "Manufacturing handoff body must be an object." };
  const input = body as Record<string, unknown>;
  if (typeof input.title !== "string" || !input.title.trim()) return { ok: false, status: 400, error: "A candidate title is required." };
  if (typeof input.problem !== "string" || !input.problem.trim()) return { ok: false, status: 400, error: "A candidate problem is required." };
  if (input.title.length > MAX_MANUFACTURING_TEXT_CHARS || input.problem.length > MAX_MANUFACTURING_TEXT_CHARS) return { ok: false, status: 413, error: "Candidate text is too long." };
  if (input.category !== undefined && (typeof input.category !== "string" || input.category.length > 200)) return { ok: false, status: 400, error: "Category must be a short string." };
  if (input.components !== undefined && (!Array.isArray(input.components) || input.components.length > 30 || input.components.some((item) => typeof item !== "string" || item.length > 300))) return { ok: false, status: 400, error: "Components must be a bounded list of short strings." };
  if (input.researchEvidence !== undefined && (!Array.isArray(input.researchEvidence) || input.researchEvidence.length > 30 || input.researchEvidence.some((item) => typeof item !== "string" || item.length > 300))) return { ok: false, status: 400, error: "Research evidence must be a bounded list of short strings." };
  return { ok: true, value: { title: clean(input.title as string, 240), problem: clean(input.problem as string), category: typeof input.category === "string" ? clean(input.category, 200) : "unspecified", components: Array.isArray(input.components) ? input.components.map((item) => clean(item as string, 300)).filter(Boolean) : [], researchEvidence: Array.isArray(input.researchEvidence) ? input.researchEvidence.map((item) => clean(item as string, 300)).filter(Boolean) : [] } };
}

export function buildManufacturingHandoff(input: ManufacturingInput): ManufacturingHandoff {
  const components = input.components.length ? input.components : ["Candidate components not yet decomposed"];
  return {
    mode: "deterministic-gated",
    provenance: { evidence: "proposed", source: "candidate-plus-user-input" },
    boundary: "Research manufacturing handoff only. This is not a build authorization, operating procedure, safety approval, recipe, or production release.",
    requirements: [
      { item: `Define the observable requirement for ${input.title}`, provenance: "candidate", acceptance: "Write a measurable baseline, target, uncertainty, and falsification observation before fabrication." },
      { item: `Constrain the ${input.category} use context`, provenance: "user-input", acceptance: "Record environment, users, interfaces, maintenance assumptions, and excluded uses." },
      { item: "Freeze configuration and traceability", provenance: "proposed", acceptance: "Assign revision, serial/lot identifiers, drawings, data schema, and change-control owner." },
    ],
    componentRecords: components.map((component) => ({ component, provenance: input.components.includes(component) ? "candidate" : "proposed", supplier: "Qualified supplier not selected; obtain at least two credible sources where practical.", incomingInspection: "Verify part identity, revision, lot, certificates/datasheets, visual condition, dimensions, and any domain-appropriate calibration or compatibility record." })),
    gates: [
      { gate: "G0 — requirements and hazard review", holdPoint: "No custom fabrication until requirements, hazard register, interfaces, evidence map, and qualified reviewers are recorded.", reversalCriteria: "Stop and return to framing if a required interface, hazard, or evidence owner is missing." },
      { gate: "G1 — non-energized first article", holdPoint: "Inspect fit, access, containment boundary, labeling, electrical segregation, and configuration record.", reversalCriteria: "Reject, quarantine, or redesign if inspection fails or an uncontrolled substitution appears." },
      { gate: "G2 — inert commissioning", holdPoint: "Verify logging, calibration status, interlocks, emergency state, leak/crossover checks, and recovery sequence under an approved protocol.", reversalCriteria: "Hold the article if any safety function, measurement chain, or traceability record is incomplete." },
      { gate: "G3 — controlled research campaign", holdPoint: "Run only the approved test plan; retain raw data, anomalies, maintenance, samples, and chain of custody.", reversalCriteria: "Stop the campaign when controls fail, data are incomplete, abnormal conditions occur, or results cannot be reconstructed." },
      { gate: "G4 — independent characterization", holdPoint: "Compare results with the research specification and independent measurement plan.", reversalCriteria: "Redesign or stop; do not escalate to pilot or commercial claims from incomplete evidence." },
    ],
    exclusions: ["No recipes or chemical formulations", "No hazardous operating set-points or energized build instructions", "No safety bypasses, interlock defeat, or emergency override guidance", "No production release, build authorization, certification, or commercial performance claim"],
    unresolved: ["Which qualified domain reviewers own the hazard and compliance decisions?", "What baseline and acceptance thresholds will be preregistered?", "Which supplier evidence and incoming tests are mandatory for each component?", "What observation forces quarantine, redesign, or programme stop?", ...input.researchEvidence.length ? [] : ["No research records were attached; add source links and claim-level provenance before relying on requirements."], "What independent laboratory or test authority will verify the result?"]
  };
}
