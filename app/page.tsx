"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import type { StructuredDisclosure } from "./api/disclosure/input";

type SessionUser = { id: string; email: string; displayName: string };
type Draft = { problem: string; targetUsers: string; existingApproaches: string; constraints: string; successCriteria: string; category: string; disclosure: StructuredDisclosure | null };

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
    && (value.mode === "live" || value.mode === "gemini-live" || value.mode === "demo-fallback")
    && (value.provenance.kind === "model-assisted-draft" || value.provenance.kind === "deterministic-fallback")
    && (value.provenance.provider === "OpenAI" || value.provenance.provider === "Gemini" || value.provenance.provider === null)
    && (typeof value.provenance.model === "string" || value.provenance.model === null);
}

const CSS = [
  ".generator-app{min-height:100vh;background:#f4f6f3;color:#172b23;font-family:Inter,ui-sans-serif,system-ui,sans-serif}",
  ".generator-header{max-width:1240px;margin:0 auto;padding:22px 26px;display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid #dce4dd}",
  ".generator-brand{font-weight:850;letter-spacing:.16em;font-size:1.02rem;text-decoration:none;color:#173e32}",
  ".generator-brand small{display:block;letter-spacing:.2em;font-size:.62rem;color:#728279;margin-top:5px}",
  ".generator-auth{display:flex;align-items:center;gap:14px;font-size:.9rem;color:#52635b}",
  ".generator-auth a{color:#17634b;font-weight:750;text-decoration:none}",
  ".generator-main{max-width:1240px;margin:0 auto;padding:34px 26px 70px}",
  ".generator-hero{padding:12px 0 28px;max-width:850px}",
  ".generator-eyebrow{color:#897041;font-size:.75rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase}",
  ".generator-hero h1{font-size:clamp(2.3rem,5vw,4rem);line-height:1.04;letter-spacing:-.045em;margin:12px 0 18px;max-width:780px}",
  ".generator-hero h1 em{color:#28765c;font-style:normal}",
  ".generator-hero p{max-width:760px;color:#596962;line-height:1.7;font-size:1.04rem}",
  ".generator-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:22px;align-items:start}",
  ".generator-card{background:#fff;border:1px solid #e0e5df;border-radius:18px;padding:24px;box-shadow:0 8px 26px rgba(23,50,40,.04);min-width:0}",
  ".generator-card h2{margin:0 0 8px;font-size:1.25rem;letter-spacing:-.02em}",
  ".generator-muted{color:#68766f;line-height:1.6;font-size:.92rem}",
  ".generator-form{display:grid;gap:16px;margin-top:22px}",
  ".generator-form label{display:grid;gap:7px;font-size:.88rem;font-weight:750;color:#2b4037}",
  ".generator-form input,.generator-form textarea,.generator-form select{width:100%;box-sizing:border-box;border:1px solid #cdd8ce;background:#fcfdfb;border-radius:10px;padding:12px 13px;font:inherit;color:#172621;min-width:0}",
  ".generator-form textarea{resize:vertical;line-height:1.55}",
  ".generator-form input:focus,.generator-form textarea:focus,.generator-form select:focus{outline:3px solid #c8e5d5;border-color:#438968}",
  ".generator-button{border:0;border-radius:11px;background:#1f654b;color:#fff;font:inherit;font-weight:800;padding:14px 18px;cursor:pointer}",
  ".generator-button:disabled{opacity:.55;cursor:wait}",
  ".generator-button.secondary{background:#e7f1ea;color:#1e5e45;border:1px solid #c9ded0}",
  ".generator-output{display:grid;gap:18px}",
  ".generator-output section{border-top:1px solid #e8ece7;padding-top:15px}",
  ".generator-output h3{font-size:.76rem;letter-spacing:.12em;text-transform:uppercase;color:#7a6947;margin:0 0 8px}",
  ".generator-output p{line-height:1.65;margin:0;color:#394a42;white-space:pre-wrap;overflow-wrap:anywhere}",
  ".generator-output ul{margin:8px 0 0;padding-left:21px;color:#394a42;line-height:1.7}",
  ".generator-badges{display:flex;flex-wrap:wrap;gap:7px}",
  ".generator-badges span{border-radius:999px;background:#edf4ef;padding:6px 10px;color:#2f5944;font-size:.8rem}",
  ".generator-notice{border-radius:10px;background:#f7f2e7;border:1px solid #eadfc5;padding:13px;color:#61502d;font-size:.86rem;line-height:1.55}",
  ".generator-error{color:#9d2c24;background:#fff0ed;border:1px solid #f1c8c2;padding:12px;border-radius:10px}",
  ".generator-success{color:#1e6547;background:#edf8f0;border:1px solid #c9e6d1;padding:12px;border-radius:10px}",
  ".generator-footer{max-width:1240px;margin:0 auto;padding:0 26px 30px;font-size:.8rem;color:#738078}",
  "@media(max-width:850px){.generator-grid{grid-template-columns:1fr}.generator-header{align-items:flex-start;padding:17px 16px}.generator-auth{flex-wrap:wrap;justify-content:flex-end;text-align:right}.generator-card{padding:19px}.generator-main{padding:26px 16px 48px}}"
].join("\n");

const EMPTY_DRAFT: Draft = { problem: "", targetUsers: "", existingApproaches: "", constraints: "", successCriteria: "", category: "Climate and energy", disclosure: null };

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

export default function Home() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [draftReady, setDraftReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [authError, setAuthError] = useState("");

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
      // Session storage is optional; the app still works if browser storage is blocked.
    }
    setDraftReady(true);

    const issue = new URLSearchParams(window.location.search).get("auth_error");
    if (issue === "google_email_not_allowed") setAuthError("This Google account is not on the configured access list.");
    else if (issue) setAuthError("Google sign-in could not be completed. Check the OAuth configuration and try again.");
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

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setDraft((current) => ({ ...current, disclosure: null }));
    if (!draft.problem.trim()) {
      setError("Describe the problem you want to solve first.");
      return;
    }
    const notes = buildBrief(draft);
    if (notes.length > 8000) {
      setError("Your full specification is too long. Shorten the fields and try again.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/disclosure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, category: draft.category }),
      });
      const payload: unknown = await response.json();
      if (!response.ok || !isStructuredDisclosure(payload)) {
        throw new Error(isRecord(payload) && typeof payload.error === "string" ? payload.error : "The invention draft could not be generated.");
      }
      setDraft((current) => ({ ...current, disclosure: payload }));
      if (payload.mode === "demo-fallback") setMessage("A deterministic scaffold was returned. Model-assisted generation requires a signed-in user, a configured provider key, and a quota secret.");
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

  return <div className="generator-app">
    <style>{CSS}</style>
    <header className="generator-header">
      <Link className="generator-brand" href="/">INNOVATOR<small>INVENTION GENERATION STUDIO</small></Link>
      <div className="generator-auth">
        {sessionReady && user
          ? <><span>Signed in as <b>{user.displayName}</b></span><a href="/api/auth/logout?return_to=%2F">Sign out</a></>
          : <a href="/api/auth/google?return_to=%2F">{sessionReady ? "Sign in with Google" : "Checking session…"}</a>}
      </div>
    </header>
    <main className="generator-main">
      <section className="generator-hero">
        <div className="generator-eyebrow">FRAME · GENERATE · CHALLENGE · TEST</div>
        <h1>Turn your problem into a <em>testable invention.</em></h1>
        <p>Specify the problem, who you want to help, the constraints that matter, and how success could be measured. Innovator generates a structured invention candidate from your brief—not a preloaded invention gallery.</p>
      </section>
      {authError && <p className="generator-error" role="alert">{authError}</p>}
      <div className="generator-grid">
        <section className="generator-card">
          <h2>Your invention specification</h2>
          <p className="generator-muted">Be concrete about constraints and outcomes. Leave unknown details blank; the generated draft should make assumptions and unanswered questions visible.</p>
          <form className="generator-form" onSubmit={generate}>
            <label>What problem should the invention solve?
              <textarea required maxLength={3000} rows={5} value={draft.problem} onChange={(event) => setDraftField("problem", event.target.value)} placeholder="Describe the pain point, why current approaches fall short, and what you want to improve." />
            </label>
            <label>Who will use it, and in what environment?
              <textarea maxLength={600} rows={2} value={draft.targetUsers} onChange={(event) => setDraftField("targetUsers", event.target.value)} placeholder="People, setting, frequency of use, available infrastructure…" />
            </label>
            <label>Technology field
              <select value={draft.category} onChange={(event) => setDraftField("category", event.target.value)}>
                <option>Health and accessibility</option><option>Climate and energy</option><option>Agriculture</option><option>Education hardware</option><option>Materials and manufacturing</option><option>Software and AI</option><option>Other</option>
              </select>
            </label>
            <label>Existing approaches or attempts
              <textarea maxLength={1200} rows={3} value={draft.existingApproaches} onChange={(event) => setDraftField("existingApproaches", event.target.value)} placeholder="What is already used or has been tried? Distinguish facts from your observations." />
            </label>
            <label>Constraints and exclusions
              <textarea maxLength={1200} rows={3} value={draft.constraints} onChange={(event) => setDraftField("constraints", event.target.value)} placeholder="Budget, energy, materials, maintenance, environment, legal or safety constraints…" />
            </label>
            <label>How could success be measured?
              <textarea maxLength={1000} rows={3} value={draft.successCriteria} onChange={(event) => setDraftField("successCriteria", event.target.value)} placeholder="Baseline, measurable outcome, trade-offs, and what would falsify the idea…" />
            </label>
            <button className="generator-button" type="submit" disabled={loading}>{loading ? "Generating candidate…" : "Generate invention candidate"}</button>
          </form>
          <p className="generator-muted">Model-assisted drafting needs a configured provider key, a verified sign-in, and a rate-limit secret. Otherwise, Innovator returns an explicitly labeled deterministic scaffold. This tab preserves unfinished notes across Google sign-in.</p>
        </section>
        <section className="generator-card" aria-live="polite">
          <h2>Invention candidate</h2>
          <p className="generator-muted">A candidate is a hypothesis, not proof. Novelty, prior art, safety, feasibility, and patentability remain unassessed unless independently validated.</p>
          {error && <p className="generator-error" role="alert">{error}</p>}
          {message && <p className="generator-success" role="status">{message}</p>}
          {!draft.disclosure
            ? <div className="generator-notice">Your candidate will appear here. Start with your own problem statement; no archived invention is preselected.</div>
            : <div className="generator-output">
              <section><h3>Possible title</h3><h2>{draft.disclosure.title}</h2></section>
              <section><h3>Generation provenance</h3><p>{draft.disclosure.mode === "demo-fallback" ? "Deterministic local scaffold; no semantic model analysis was performed." : (draft.disclosure.provenance.provider || "Model") + " draft using " + (draft.disclosure.provenance.model || "an unreported model") + ". This text is unverified."}</p></section>
              <section><h3>Abstract</h3><p>{draft.disclosure.abstract}</p></section>
              <section><h3>Problem framing</h3><p>{draft.disclosure.problem}</p></section>
              <section><h3>Proposed mechanism / solution</h3><p>{draft.disclosure.solution}</p></section>
              <section><h3>Technical field</h3><p>{draft.disclosure.technicalField}</p></section>
              <section><h3>Differentiating hypothesis—not a novelty decision</h3><p>{draft.disclosure.noveltyHypothesis}</p></section>
              <section><h3>Key components</h3>{draft.disclosure.components.length ? <div className="generator-badges">{draft.disclosure.components.map((component, index) => <span key={index}>{component}</span>)}</div> : <p className="generator-muted">Not assessed yet.</p>}</section>
              <section><h3>Open questions / validation gates</h3><ul>{draft.disclosure.missingQuestions.map((question, index) => <li key={index}>{question}</li>)}</ul></section>
              <div className="generator-notice">No live prior-art search ran. Similarity, novelty, feasibility, safety, and patentability remain unassessed. Verify factual claims and test proposed mechanisms independently.</div>
              <button className="generator-button secondary" type="button" onClick={savePrivateDraft} disabled={saving}>{saving ? "Saving private workspace…" : user ? "Save as private workspace" : "Sign in to save privately"}</button>
            </div>}
        </section>
      </div>
    </main>
    <footer className="generator-footer">Innovator · Evidence-first invention generation · Private drafts by default</footer>
  </div>;
}
