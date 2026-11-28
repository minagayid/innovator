"use client";

import Link from "next/link";
import { CSSProperties, FormEvent, useEffect, useMemo, useState } from "react";
import type { StructuredDisclosure } from "./api/disclosure/input";
import { buildInventionMediaPrompts } from "./media-prompts";
import { buildPatentscopeQuery, buildPatentscopeUrl } from "./patentscope";
import type { RoleName } from "./ai/roles";
import styles from "./page.module.css";

type SessionUser = { id: string; email: string; displayName: string };
type Draft = { problem: string; targetUsers: string; existingApproaches: string; constraints: string; successCriteria: string; category: string; disclosure: StructuredDisclosure | null };
type ResearchItem = { id: string; title: string; authors: string[]; year: number | null; venue: string; url: string; source: string; evidence: string };
type RoleCandidate = { title: string; brief: string; mechanism: string; components: string[]; noveltyHypothesis: string; firstTest: string; openQuestions: string[] };
type CommitteeItem = { seat: string; finding: string; test: string };
type PlanItem = { stage: string; action: string; output: string };
type ManufacturingHandoff = { mode: string; boundary: string; requirements: Array<{ item: string; provenance: string; acceptance: string }>; componentRecords: Array<{ component: string; provenance: string; supplier: string; incomingInspection: string }>; gates: Array<{ gate: string; holdPoint: string; reversalCriteria: string }>; exclusions: string[]; unresolved: string[] };
type RoleResponse = { role?: RoleName; mode?: string; provenance?: { provider?: string | null; model?: string | null; evidence?: string }; candidate?: RoleCandidate; committee?: CommitteeItem[]; plan?: PlanItem[]; result?: unknown };
type StageId = "frame" | "bridge" | "challenge" | "test";

const STAGES: Array<{ id: StageId; number: string; title: string; hint: string }> = [
  { id: "frame", number: "01", title: "Frame", hint: "One box, your words" },
  { id: "bridge", number: "02", title: "Bridge", hint: "Research and transfer" },
  { id: "challenge", number: "03", title: "Challenge", hint: "Assumptions and failure modes" },
  { id: "test", number: "04", title: "Test", hint: "Measure and stop condition" },
];

const EMPTY_DRAFT: Draft = { problem: "", targetUsers: "", existingApproaches: "", constraints: "", successCriteria: "", category: "Climate and energy", disclosure: null };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isStructuredDisclosure(value: unknown): value is StructuredDisclosure {
  if (!isRecord(value) || !isRecord(value.provenance)) return false;
  return typeof value.title === "string" && typeof value.abstract === "string"
    && typeof value.problem === "string" && typeof value.solution === "string"
    && typeof value.technicalField === "string" && typeof value.noveltyHypothesis === "string"
    && typeof value.publicSummary === "string"
    && Array.isArray(value.components) && value.components.every((item) => typeof item === "string")
    && Array.isArray(value.keywords) && value.keywords.every((item) => typeof item === "string")
    && Array.isArray(value.missingQuestions) && value.missingQuestions.every((item) => typeof item === "string")
    && (value.mode === "live" || value.mode === "gemini-live" || value.mode === "huggingface-live" || value.mode === "freellmapi-live" || value.mode === "kilo-free-live" || value.mode === "demo-fallback")
    && (value.provenance.kind === "model-assisted-draft" || value.provenance.kind === "deterministic-fallback")
    && (value.provenance.provider === "OpenAI" || value.provenance.provider === "Gemini" || value.provenance.provider === "Hugging Face" || value.provenance.provider === "FreeLLMAPI" || value.provenance.provider === "Kilo Gateway" || value.provenance.provider === null)
    && (value.provenance.routerSelector === undefined || typeof value.provenance.routerSelector === "string")
    && (value.provenance.requestedModel === undefined || typeof value.provenance.requestedModel === "string")
    && (typeof value.provenance.model === "string" || value.provenance.model === null);
}

function buildBrief(draft: Draft): string {
  return [
    "PROBLEM TO SOLVE:\n" + draft.problem.trim(),
    "TARGET USERS AND CONTEXT:\n" + (draft.targetUsers.trim() || "Not specified; identify assumptions as open questions."),
    "EXISTING APPROACHES OR ATTEMPTS:\n" + (draft.existingApproaches.trim() || "Not supplied; do not invent prior-art facts."),
    "CONSTRAINTS AND EXCLUSIONS:\n" + (draft.constraints.trim() || "Not specified; surface important constraints as questions."),
    "MEASURABLE SUCCESS CRITERIA:\n" + (draft.successCriteria.trim() || "Not specified; propose testable criteria and label them as proposed."),
    "TASK: Generate one fresh invention candidate tailored to the complete specification. Explain a plausible mechanism, key components, differentiating hypothesis, assumptions, risks, and the first falsifiable test. Do not claim novelty, feasibility, safety, performance, patentability, or prior-art results without evidence. Label unknowns and proposed targets explicitly.",
  ].join("\n\n");
}

function scrollToStage(id: StageId) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

function roleLabel(role: RoleName) {
  return role === "review" ? "Research + peer-review committee" : role === "orchestration" ? "Orchestrator" : "Invention designer";
}

function RoleOutput({ response }: { response: RoleResponse }) {
  if (response.candidate) {
    return <div className={styles.outputSection}>
      <h4>Candidate mechanism</h4>
      <p><strong>{response.candidate.mechanism}</strong></p>
      <p>{response.candidate.firstTest}</p>
      {response.candidate.openQuestions.length > 0 && <ul>{response.candidate.openQuestions.map((item, index) => <li key={index}>{item}</li>)}</ul>}
    </div>;
  }
  if (response.committee) {
    return <div className={styles.committee}>{response.committee.map((item) => <article className={styles.committeeCard} key={item.seat}>
      <strong>{item.seat}</strong>
      <p>{item.finding}</p>
      <small>Suggested check: {item.test}</small>
    </article>)}</div>;
  }
  if (response.plan) {
    return <div className={styles.plan}>{response.plan.map((item) => <article className={styles.planCard} key={item.stage}>
      <strong>{item.stage}</strong>
      <div><p>{item.action}</p><small>Output: {item.output}</small></div>
    </article>)}</div>;
  }
  return <pre className={styles.rawResult}>{JSON.stringify(response.result ?? response, null, 2)}</pre>;
}

export default function Home() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [draftReady, setDraftReady] = useState(false);
  const [activeStage, setActiveStage] = useState<StageId>("frame");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [researchQuery, setResearchQuery] = useState("");
  const [researchResults, setResearchResults] = useState<ResearchItem[]>([]);
  const [researchLoading, setResearchLoading] = useState(false);
  const [researchError, setResearchError] = useState("");
  const [roleResults, setRoleResults] = useState<Partial<Record<RoleName, RoleResponse>>>({});
  const [roleLoading, setRoleLoading] = useState<RoleName | null>(null);
  const [manufacturing, setManufacturing] = useState<ManufacturingHandoff | null>(null);
  const [manufacturingLoading, setManufacturingLoading] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [kiloConsent, setKiloConsent] = useState(false);

  const roleBrief = useMemo(() => {
    const sourceNote = researchResults.length > 0
      ? `\n\nSOURCED RESEARCH RECORDS TO CONSIDER (navigation only):\n${researchResults.map((item) => `- ${item.title} (${item.source}, ${item.year || "year unlisted"})`).join("\n")}`
      : "";
    const candidateNote = draft.disclosure ? `\n\nCURRENT CANDIDATE:\n${draft.disclosure.title}\n${draft.disclosure.solution}` : "";
    return buildBrief(draft) + candidateNote + sourceNote;
  }, [draft, researchResults]);

  useEffect(() => {
    fetch("/api/session")
      .then((response) => response.ok ? response.json() : { user: null })
      .then((payload: { user?: SessionUser | null }) => setUser(payload.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setSessionReady(true));

    try {
      const saved = sessionStorage.getItem("innovator-unsaved-draft-v1");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isRecord(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore user-entered work after OAuth navigation/hydration.
          setDraft({
            problem: typeof parsed.problem === "string" ? parsed.problem : "",
            targetUsers: typeof parsed.targetUsers === "string" ? parsed.targetUsers : "",
            existingApproaches: typeof parsed.existingApproaches === "string" ? parsed.existingApproaches : "",
            constraints: typeof parsed.constraints === "string" ? parsed.constraints : "",
            successCriteria: typeof parsed.successCriteria === "string" ? parsed.successCriteria : "",
            category: typeof parsed.category === "string" ? parsed.category : EMPTY_DRAFT.category,
            disclosure: isStructuredDisclosure(parsed.disclosure) ? parsed.disclosure : null,
          });
        }
      }
    } catch {
      // Browser storage is optional; the workspace remains usable without it.
    }
    try {
      const seedRaw = sessionStorage.getItem("innovator-paper-seed-v1");
      if (seedRaw) {
        sessionStorage.removeItem("innovator-paper-seed-v1");
        const seed: unknown = JSON.parse(seedRaw);
        if (isRecord(seed) && typeof seed.title === "string") {
          const venue = typeof seed.venue === "string" && seed.venue ? ` (${seed.venue}${typeof seed.year === "number" ? `, ${seed.year}` : ""})` : "";
          const sourceLines = [
            `Seed paper: ${seed.title}${venue}`,
            typeof seed.url === "string" && seed.url ? `Source: ${seed.url}` : "",
            ...(Array.isArray(seed.similar) ? seed.similar.filter((item): item is string => typeof item === "string").slice(0, 6).map((item) => `Related: ${item}`) : []),
          ].filter(Boolean).join("\n");
          setDraft((current) => ({
            ...current,
            problem: current.problem.trim() || `Build on findings from: ${seed.title}${typeof seed.abstract === "string" && seed.abstract ? `\n\nPaper context: ${seed.abstract.slice(0, 700)}` : ""}`,
            existingApproaches: current.existingApproaches.trim() ? `${current.existingApproaches}\n\n${sourceLines}` : sourceLines,
          }));
          setMessage(`Studio seeded from "${seed.title.slice(0, 80)}". Research records are attached to your brief; claims still need verification.`);
        }
      }
    } catch {
      // Optional seed handoff from the research lab.
    }
    setDraftReady(true);

    const issue = new URLSearchParams(window.location.search).get("auth_error");
    if (issue === "google_email_not_allowed") setAuthError("This Google account is not on the configured access list.");
    else if (issue) setAuthError("Sign-in could not be completed. Check the OAuth configuration and try again.");
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    try {
      sessionStorage.setItem("innovator-unsaved-draft-v1", JSON.stringify(draft));
    } catch {
      // Private browsing policies may disable session storage.
    }
  }, [draft, draftReady]);

  function setDraftField(key: Exclude<keyof Draft, "disclosure">, value: string) {
    setDraft((current) => ({ ...current, [key]: value, disclosure: null }));
    setError("");
    setMessage("");
  }

  function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runGeneration(draft);
  }

  function refineWithAnswers() {
    const answers = followUp.trim();
    if (!answers || loading) return;
    setFollowUp("");
    const merged = `${draft.problem.trim()}\n\nFollow-up answers from the creator:\n${answers}`.slice(0, 5000);
    void runGeneration({ ...draft, problem: merged });
  }

  async function runGeneration(nextDraft: Draft) {
    setError("");
    setMessage("");
    setDraft({ ...nextDraft, disclosure: null });
    if (!nextDraft.problem.trim()) {
      setError("Describe your idea first. Even one rough paragraph is enough.");
      return;
    }
    const notes = buildBrief(nextDraft);
    if (notes.length > 8000) {
      setError("Your full specification is too long. Shorten it and try again.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/disclosure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, category: nextDraft.category, kiloConsent }),
      });
      const payload: unknown = await response.json();
      if (!response.ok || !isStructuredDisclosure(payload)) {
        throw new Error(isRecord(payload) && typeof payload.error === "string" ? payload.error : "The invention draft could not be generated.");
      }
      setDraft((current) => ({ ...current, disclosure: payload }));
      setActiveStage("frame");
      if (payload.mode === "demo-fallback") setMessage("A deterministic scaffold was returned. Model-assisted generation requires an enabled provider and the configured identity and quota controls.");
      else setMessage("Candidate drafted. Treat every mechanism and target as a proposal until tested.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The invention draft could not be generated.");
    } finally {
      setLoading(false);
    }
  }

  async function savePrivateDraft() {
    if (!draft.disclosure) return;
    if (!user) {
      window.location.assign("/api/auth/google?return_to=%2F");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.disclosure.title,
          summary: (draft.disclosure.publicSummary || draft.disclosure.abstract || draft.disclosure.problem).slice(0, 1900),
          category: draft.category,
          visibility: "private",
          document: {
            rawNotes: buildBrief(draft),
            brief: { problem: draft.problem, targetUsers: draft.targetUsers, existingApproaches: draft.existingApproaches, constraints: draft.constraints, successCriteria: draft.successCriteria, category: draft.category },
            disclosure: draft.disclosure,
          },
        }),
      });
      const payload: unknown = await response.json();
      if (response.status === 401) {
        window.location.assign("/api/auth/google?return_to=%2F");
        return;
      }
      if (!response.ok || !isRecord(payload) || !isRecord(payload.project) || typeof payload.project.id !== "string") {
        throw new Error(isRecord(payload) && typeof payload.error === "string" ? payload.error : "This private workspace could not be saved.");
      }
      setMessage("Private workspace saved. Workspace ID: " + payload.project.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "This private workspace could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function searchResearch(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const query = researchQuery.trim();
    if (!query) {
      setResearchError("Enter a mechanism, field, or bottleneck to search.");
      return;
    }
    setResearchError("");
    setResearchLoading(true);
    try {
      const response = await fetch(`/api/research?q=${encodeURIComponent(query)}`);
      const payload = await response.json() as { results?: ResearchItem[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "Research search failed.");
      setResearchResults(payload.results || []);
    } catch (cause) {
      setResearchResults([]);
      setResearchError(cause instanceof Error ? cause.message : "Research search failed. Try again.");
    } finally {
      setResearchLoading(false);
    }
  }

  async function runRole(role: RoleName) {
    if (!draft.problem.trim()) {
      setError("Frame a problem before running a committee or orchestration pass.");
      scrollToStage("frame");
      return;
    }
    setError("");
    setMessage("");
    setRoleLoading(role);
    try {
      const response = await fetch(`/api/roles/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: roleBrief }),
      });
      const payload: unknown = await response.json();
      if (!response.ok || !isRecord(payload)) throw new Error(isRecord(payload) && typeof payload.error === "string" ? payload.error : "The role pass could not be completed.");
      setRoleResults((current) => ({ ...current, [role]: payload as RoleResponse }));
      setActiveStage(role === "orchestration" ? "test" : "challenge");
      setMessage(`${roleLabel(role)} returned a bounded result. Review its proposed checks before acting on it.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The role pass could not be completed.");
    } finally {
      setRoleLoading(null);
    }
  }

  async function copyText(text: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(successMessage);
    } catch {
      setError("Clipboard access is unavailable in this browser. Use the download action instead.");
    }
  }

  async function generateManufacturingHandoff() {
    if (!disclosure) return;
    setManufacturingLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/manufacturing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: disclosure.title, problem: disclosure.problem, components: disclosure.components, category: disclosure.technicalField, researchEvidence: researchResults.map((item) => `${item.source}: ${item.title} — ${item.url}`) }) });
      const payload: unknown = await response.json();
      if (!response.ok || !isRecord(payload) || !Array.isArray(payload.gates)) throw new Error(isRecord(payload) && typeof payload.error === "string" ? payload.error : "The manufacturing handoff could not be generated.");
      setManufacturing(payload as ManufacturingHandoff);
      setMessage("Manufacturing handoff prepared as a gated research record. It is not build authorization.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "The manufacturing handoff could not be generated."); }
    finally { setManufacturingLoading(false); }
  }

  function downloadBrief() {
    const contents = draft.disclosure ? `${draft.disclosure.title}\n\n${buildBrief(draft)}\n\nPROPOSED SOLUTION:\n${draft.disclosure.solution}\n\nOPEN QUESTIONS:\n${draft.disclosure.missingQuestions.map((item) => `- ${item}`).join("\n")}` : buildBrief(draft);
    const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "innovator-brief.txt";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Brief downloaded. It contains proposals and unresolved questions, not proof.");
  }

  function clearDraft() {
    if (!window.confirm("Clear this unsaved brief and candidate from this browser session?")) return;
    setDraft(EMPTY_DRAFT);
    setKiloConsent(false);
    setResearchQuery("");
    setResearchResults([]);
    setRoleResults({});
    setError("");
    setMessage("Unsaved workspace cleared.");
    try { sessionStorage.removeItem("innovator-unsaved-draft-v1"); } catch { /* optional storage */ }
  }

  const disclosure = draft.disclosure;
  const currentRole = roleResults.review || roleResults.orchestration;

  return <div className={styles.shell}>
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="Innovator home">
        <span className={styles.brandMark}>IN</span>
        <span>INNOVATOR<small>EVIDENCE-FIRST INVENTION STUDIO</small></span>
      </Link>
      <nav className={styles.nav} aria-label="Primary">
        <Link className={`${styles.navLink} ${styles.navLinkActive}`} href="/">Studio</Link>
        <Link className={styles.navLink} href="/research">Research lab</Link>
      </nav>
      <div className={styles.auth} aria-label="Account actions">
        {sessionReady && user
          ? <><span className={styles.userChip}>{user.displayName}</span><Link href="/api/auth/logout?return_to=%2F">Sign out</Link></>
          : <>{sessionReady ? <Link className={styles.signInCta} href="/login">Sign in</Link> : "Checking session…"}</>}
      </div>
    </header>

    <main className={styles.main}>
      <section className={`${styles.hero} reveal`} aria-labelledby="page-title">
        <div>
          <p className={styles.eyebrow}>Research studio · provisional by design</p>
          <h1 id="page-title">Turn a hard problem into a <em>testable invention.</em></h1>
          <p className={styles.heroCopy}>Innovator helps you frame a problem, bridge it to research, challenge the assumptions, and choose the next measurement. The output is a candidate hypothesis—not a patentability opinion or a shortcut around evidence.</p>
        </div>
        <aside className={styles.heroAside} aria-label="Evidence legend">
          <h2>One evidence boundary</h2>
          <p>Color is always paired with a label. A useful mechanism can still be unverified.</p>
          <div className={styles.legend}>
            <div className={styles.legendRow}><i className={styles.legendDot} /> Sourced record from a public index</div>
            <div className={styles.legendRow}><i className={`${styles.legendDot} ${styles.inferred}`} /> Inferred interpretation from your brief</div>
            <div className={styles.legendRow}><i className={`${styles.legendDot} ${styles.proposed}`} /> Proposed candidate or test suggestion</div>
            <div className={styles.legendRow}><i className={`${styles.legendDot} ${styles.unresolved}`} /> Unresolved question requiring evidence</div>
          </div>
        </aside>
      </section>

      <nav className={`${styles.stageNav} reveal`} style={{ "--d": "90ms" } as CSSProperties} aria-label="Invention workflow stages">
        {STAGES.map((stage) => <button key={stage.id} type="button" className={activeStage === stage.id ? styles.active : undefined} aria-current={activeStage === stage.id ? "step" : undefined} onClick={() => { setActiveStage(stage.id); scrollToStage(stage.id); }}>
          <span className={styles.stageNumber}>{stage.number}</span><span className={styles.stageTitle}>{stage.title}</span><span className={styles.stageHint}>{stage.hint}</span>
        </button>)}
      </nav>

      {authError && <p className={styles.error} role="alert">{authError}</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      {message && <p className={styles.success} role="status">{message}</p>}

      <div className={styles.layout}>
        <div className={styles.column}>
          <section id="frame" className={styles.panel} aria-labelledby="frame-title">
            <div className={styles.panelHeader}><div><p className={styles.kicker}>Stage 01 · Frame</p><h2 id="frame-title">Say it the way you&rsquo;d explain it.</h2><p>One box, in your own words: the idea, the data or context you have, and what exists today. Innovator organizes it into a structured draft, then asks only the follow-ups that matter.</p></div><span className={styles.step}>01</span></div>
            <form className={styles.form} onSubmit={generate}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="idea"><span>Your idea, concept, data, and context <b aria-hidden="true">*</b></span><span>{draft.problem.length}/5000</span></label>
                <textarea id="idea" required maxLength={5000} rows={9} value={draft.problem} onChange={(event) => setDraftField("problem", event.target.value)} placeholder="Example: A low-cost sensor that flags early root infection in greenhouse tomatoes. I have two seasons of leaf photos, roughly labeled. Current options need lab tests. Budget under $50 per unit, must run off-grid…" aria-describedby="idea-hint" />
                <p className={styles.fieldHint} id="idea-hint">Write it like a message to a colleague. No structure needed. Do not include secrets or personal data.</p>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="category"><span>Technology field</span><span>Used for terminology only</span></label>
                <select id="category" value={draft.category} onChange={(event) => setDraftField("category", event.target.value)}><option>Health and accessibility</option><option>Climate and energy</option><option>Agriculture</option><option>Education hardware</option><option>Materials and manufacturing</option><option>Software and AI</option><option>Other</option></select>
              </div>
              <details className={styles.advanced}>
                <summary>Structured details <span>(optional — blank fields become open questions, not invented facts)</span></summary>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="target-users"><span>Who will use it, and in what environment?</span><span>{draft.targetUsers.length}/600</span></label>
                <textarea id="target-users" maxLength={600} rows={2} value={draft.targetUsers} onChange={(event) => setDraftField("targetUsers", event.target.value)} placeholder="People, setting, frequency of use, available infrastructure…" />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="approaches"><span>Existing approaches or attempts</span><span>{draft.existingApproaches.length}/1200</span></label>
                <textarea id="approaches" maxLength={1200} rows={3} value={draft.existingApproaches} onChange={(event) => setDraftField("existingApproaches", event.target.value)} placeholder="What is already used or has been tried? Distinguish facts from your observations." />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="constraints"><span>Constraints and exclusions</span><span>{draft.constraints.length}/1200</span></label>
                <textarea id="constraints" maxLength={1200} rows={3} value={draft.constraints} onChange={(event) => setDraftField("constraints", event.target.value)} placeholder="Budget, energy, materials, maintenance, environment, legal or safety constraints…" />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="success"><span>How could success be measured?</span><span>{draft.successCriteria.length}/1000</span></label>
                <textarea id="success" maxLength={1000} rows={3} value={draft.successCriteria} onChange={(event) => setDraftField("successCriteria", event.target.value)} placeholder="Baseline, measurable outcome, trade-offs, and what would falsify the idea…" />
              </div>
              </details>
              <label><input type="checkbox" checked={kiloConsent} onChange={(event) => setKiloConsent(event.target.checked)} /> If enabled, use the optional Kilo free model for this draft. I agree to send this brief to Kilo and its model provider, which may retain or use the data. Do not include confidential inventions, secrets, or personal data.</label>
              <div className={styles.formActions}>
                <button className={styles.primary} type="submit" disabled={loading}>{loading ? "Generating candidate…" : "Generate invention candidate"}</button>
                <button className={styles.quiet} type="button" onClick={clearDraft}>Clear unsaved work</button>
              </div>
              <p className={styles.formFootnote}>Your unfinished brief stays in this browser session. Generating may send it to the configured AI provider. Sign in to save a private workspace.</p>
            </form>
          </section>

          <section id="bridge" className={`${styles.panel} ${styles.researchPanel}`} aria-labelledby="bridge-title">
            <div className={styles.panelHeader}><div><p className={styles.kicker}>Stage 02 · Bridge</p><h2 id="bridge-title">Bring in a source before you make a claim.</h2><p>Search OpenAlex and Crossref for mechanisms, bottlenecks, and field language. These are sourced navigation records—not peer review, truth, novelty, or patentability determinations.</p></div><span className={styles.step}>02</span></div>
            <form className={styles.researchForm} onSubmit={searchResearch}>
              <label className={styles.visuallyHidden} htmlFor="research-query">Search mechanism, field, or bottleneck</label>
              <input id="research-query" className={styles.researchInput} value={researchQuery} onChange={(event) => setResearchQuery(event.target.value)} placeholder="Search mechanism, field, or bottleneck" maxLength={180} />
              <button className={styles.primary} type="submit" disabled={researchLoading}>{researchLoading ? "Searching…" : "Search records"}</button>
            </form>
            {researchError && <p className={styles.error} role="alert">{researchError}</p>}
            {researchLoading && <p className={styles.notice} role="status" aria-live="polite">Checking two public indexes. Opening a source will not attach evidence automatically.</p>}
            {!researchLoading && researchResults.length === 0 && !researchError && <div className={styles.resultEmpty}>No records loaded. Search for a mechanism or bottleneck, then record what each source supports and what remains unproven.</div>}
            {researchResults.length > 0 && <div className={styles.results} aria-live="polite">{researchResults.map((item) => <article className={styles.result} key={`${item.source}-${item.id}`}>
              <div><div className={styles.resultMeta}><b>{item.source}</b><span>· {item.year || "year unlisted"}</span><span>· Sourced record</span></div><h3>{item.title}</h3><p>{item.venue} · {item.authors.join(", ") || "authors unlisted"}</p></div>
              <a href={item.url} target="_blank" rel="noopener noreferrer">Open source ↗</a>
            </article>)}</div>}
          </section>
        </div>

        <div className={styles.column}>
          <section className={styles.panel} aria-labelledby="candidate-title" aria-live="polite">
            {!disclosure ? <div className={styles.empty}><div className={styles.emptyMark}>?</div><h3 id="candidate-title">No candidate yet.</h3><p>Describe your idea in the single box — a rough paragraph with whatever data or context you have is enough. The page keeps your unsaved draft in this browser session.</p><button className={styles.secondary} type="button" onClick={() => { setActiveStage("frame"); scrollToStage("frame"); }}>Start framing →</button></div> : <>
              <div className={styles.panelHeader}><div><p className={styles.kicker}>Working output</p><h2 id="candidate-title">Candidate brief</h2><p>A draft to inspect, challenge, and test. This is a proposed mechanism, not a finding.</p></div><span className={styles.step}>01</span></div>
              <div className={styles.output}>
                <div className={styles.outputTitle}><h3>{disclosure.title}</h3><span className={`${styles.badge} ${styles.proposed}`}>Proposed</span></div>
                <div className={styles.outputActions}>
                  <button className={styles.secondary} type="button" onClick={() => copyText(`${disclosure.title}\n\n${disclosure.abstract}\n\n${disclosure.solution}`, "Candidate summary copied.")}>Copy summary</button>
                  <button className={styles.secondary} type="button" onClick={downloadBrief}>Download brief</button>
                  <button className={styles.quiet} type="button" onClick={savePrivateDraft} disabled={saving}>{saving ? "Saving…" : user ? "Save private workspace" : "Sign in to save"}</button>
                </div>
                <div className={styles.metaGrid}><div className={styles.metaCard}><span>Field</span><b>{disclosure.technicalField}</b></div><div className={styles.metaCard}><span>Draft mode</span><b>{disclosure.mode === "demo-fallback" ? "Deterministic scaffold" : "Model-assisted"}</b></div><div className={styles.metaCard}><span>Evidence state</span><b>Unverified proposal</b></div></div>
                <div className={styles.outputSection}><h4>Generation provenance</h4><p>{disclosure.mode === "demo-fallback" ? "Deterministic local scaffold; no semantic model analysis was performed." : disclosure.provenance.provider === "FreeLLMAPI" ? `FreeLLMAPI draft; router selector ${disclosure.provenance.routerSelector || "unreported"}. The actual model is unverified. This text is unverified.` : disclosure.provenance.provider === "Kilo Gateway" ? `Kilo Gateway draft; requested model ${disclosure.provenance.requestedModel || "unreported"}. The actual model is unverified. This text is unverified.` : `${disclosure.provenance.provider || "Model"} draft using ${disclosure.provenance.model || "an unreported model"}. This text is unverified.`}</p></div>
                <div className={styles.outputSection}><h4>Abstract</h4><p>{disclosure.abstract}</p></div>
                <div className={styles.outputSection}><h4>Problem framing</h4><p>{disclosure.problem}</p></div>
                <div className={styles.outputSection}><h4>Proposed mechanism / solution</h4><p>{disclosure.solution}</p></div>
                <div className={styles.outputSection}><h4>Differentiating hypothesis — not a novelty decision</h4><p>{disclosure.noveltyHypothesis}</p></div>
                <div className={styles.outputSection}><h4>Key components</h4>{disclosure.components.length ? <div className={styles.tags}>{disclosure.components.map((component, index) => <span className={styles.tag} key={index}>{component}</span>)}</div> : <p>Not assessed yet.</p>}</div>
                <div className={styles.outputSection}><h4>Open questions / validation gates</h4><ul>{disclosure.missingQuestions.map((question, index) => <li key={index}>{question}</li>)}</ul></div>
                <div className={styles.followUp}>
                  <h4>Only the follow-ups that matter</h4>
                  <p>Answer any of these in your own words and refine the draft. What you skip stays marked as an open question.</p>
                  <textarea rows={4} maxLength={2000} value={followUp} onChange={(event) => setFollowUp(event.target.value)} placeholder="e.g. Budget is under $50 per unit. I already have about 400 labeled photos. It must work off-grid…" aria-label="Answers to the open questions" />
                  <div className={styles.formActions}>
                    <button className={styles.primary} type="button" onClick={refineWithAnswers} disabled={loading || !followUp.trim()}>{loading ? "Refining…" : "Refine draft with these answers"}</button>
                  </div>
                </div>
                <div className={styles.outputSection}><h4>Creative handoffs</h4><div className={styles.plan}>{Object.entries(buildInventionMediaPrompts(disclosure)).map(([kind, prompt]) => <article className={styles.planCard} key={kind}><strong>{kind === "conceptImage" ? "Concept image" : kind === "prototypeVideo" ? "Prototype video" : "Validation diagram"}</strong><div><p>{prompt}</p><small>Creative direction only; not visual evidence.</small></div></article>)}</div></div>
                <div className={styles.nextBox}><strong>Continue with a bounded role</strong><p>Use the research records and this candidate to expose assumptions before you choose a test.</p><div className={styles.roleActions}><button className={styles.secondary} type="button" onClick={() => { setActiveStage("challenge"); scrollToStage("challenge"); runRole("review"); }} disabled={roleLoading !== null}>{roleLoading === "review" ? "Reviewing…" : "Challenge with committee"}</button><button className={styles.secondary} type="button" onClick={() => { setActiveStage("test"); scrollToStage("test"); runRole("orchestration"); }} disabled={roleLoading !== null}>{roleLoading === "orchestration" ? "Orchestrating…" : "Choose next test"}</button><button className={styles.secondary} type="button" onClick={generateManufacturingHandoff} disabled={manufacturingLoading}>{manufacturingLoading ? "Preparing handoff…" : "Manufacturing handoff"}</button></div></div>
                {manufacturing && <div className={styles.outputSection}><h4>Manufacturing handoff · gated research record</h4><p>{manufacturing.boundary}</p><h5>Requirements and provenance</h5><ul>{manufacturing.requirements.map((item) => <li key={item.item}><b>{item.item}</b> <span>({item.provenance}) — {item.acceptance}</span></li>)}</ul><h5>Manufacturing and test gates</h5><div className={styles.plan}>{manufacturing.gates.map((gate) => <article className={styles.planCard} key={gate.gate}><strong>{gate.gate}</strong><div><p>{gate.holdPoint}</p><small>Reversal: {gate.reversalCriteria}</small></div></article>)}</div><h5>Explicit exclusions</h5><ul>{manufacturing.exclusions.map((item) => <li key={item}>{item}</li>)}</ul><h5>Unresolved before any qualified work</h5><ul>{manufacturing.unresolved.map((item) => <li key={item}>{item}</li>)}</ul></div>}
                <div className={styles.notice}>No live prior-art search ran. Similarity, novelty, feasibility, safety, and patentability remain unassessed. Verify factual claims and test proposed mechanisms independently.</div>
                <a className={styles.quiet} href={buildPatentscopeUrl(disclosure)} target="_blank" rel="noopener noreferrer">Continue in WIPO PATENTSCOPE ↗</a>
                <code className={styles.rawResult}>{buildPatentscopeQuery(disclosure)}</code>
              </div>
            </>}
          </section>
        </div>
      </div>

      <section id="challenge" className={`${styles.panel} ${styles.rolesPanel}`} aria-labelledby="challenge-title">
        <div className={styles.panelHeader}><div><p className={styles.kicker}>Stage 03 · Challenge</p><h2 id="challenge-title">One committee, one evidence boundary.</h2><p>Ask the research and peer-review committee to attack sources, controls, alternatives, safety, and deployment gaps. Run it again after adding research.</p></div><span className={styles.step}>03</span></div>
        <div className={styles.roleTabs}><button className={styles.roleButton} type="button" onClick={() => runRole("review")} disabled={roleLoading !== null}>{roleLoading === "review" ? "Running committee…" : "Run research + peer-review committee"}</button><button className={styles.roleButton} type="button" onClick={() => runRole("invention")} disabled={roleLoading !== null}>{roleLoading === "invention" ? "Designing…" : "Refine mechanism"}</button></div>
        {roleResults.review && <div className={styles.roleResult}><div className={styles.roleResultHeader}><strong>{roleLabel("review")}</strong><span>{roleResults.review.mode === "deterministic-fallback" ? "Deterministic fallback · proposed" : "Provider result · proposed"}</span></div><div className={styles.roleBody}><RoleOutput response={roleResults.review} /></div></div>}
        {roleResults.invention && <div className={styles.roleResult}><div className={styles.roleResultHeader}><strong>{roleLabel("invention")}</strong><span>Proposed mechanism</span></div><div className={styles.roleBody}><RoleOutput response={roleResults.invention} /></div></div>}
        {!roleResults.review && !roleResults.invention && <div className={styles.resultEmpty}>No committee pass yet. Generate a candidate first, then run the committee to expose the weakest assumptions and the cheapest useful checks.</div>}
      </section>

      <section id="test" className={`${styles.panel} ${styles.rolesPanel}`} aria-labelledby="test-title">
        <div className={styles.panelHeader}><div><p className={styles.kicker}>Stage 04 · Test</p><h2 id="test-title">Choose the next measurement, not the final answer.</h2><p>The orchestrator sequences research, invention, review, and a stop condition. It prepares the next action; it does not establish truth.</p></div><span className={styles.step}>04</span></div>
        <div className={styles.roleTabs}><button className={styles.primary} type="button" onClick={() => runRole("orchestration")} disabled={roleLoading !== null}>{roleLoading === "orchestration" ? "Sequencing…" : "Sequence next test"}</button></div>
        {currentRole && roleResults.orchestration && <div className={styles.roleResult}><div className={styles.roleResultHeader}><strong>{roleLabel("orchestration")}</strong><span>{roleResults.orchestration.mode === "deterministic-fallback" ? "Deterministic fallback · proposed" : "Provider result · proposed"}</span></div><div className={styles.roleBody}><RoleOutput response={roleResults.orchestration} /></div></div>}
        {!roleResults.orchestration && <div className={styles.resultEmpty}>The next test should name a baseline, intervention, measurement, sample or observation plan, and a result that would stop or reframe the idea.</div>}
      </section>
    </main>

    <footer className={styles.footer}><span>Innovator · Evidence-first invention generation</span><strong>Keep the claim smaller than the evidence.</strong></footer>
  </div>;
}

