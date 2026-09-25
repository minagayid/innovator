"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { inventions, priorArt, type Invention } from "./seed-data";
import { archiveImages, candidateRoutes, domainOptions, evidenceLedger, knowledgeBridges, studioTemplates } from "./studio-data";
import type { StructuredDisclosure } from "./api/disclosure/input";

type View = "studio" | "gallery" | "workspace" | "create" | "sources" | "manufacturing";
type Tab = "Overview" | "Prior Art" | "Files" | "BOM" | "Prototype Plan" | "Collaborators" | "Manufacturing" | "License & Terms";
type SessionUser = { id: string; email: string; displayName: string };
type StoredProject = { id: string; title: string; summary: string; category: string; readinessStage: string; ownerName: string; updatedAt: string; visibility: string };

function isStructuredDisclosure(value: unknown): value is StructuredDisclosure {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<StructuredDisclosure>;
  const provenance = draft.provenance;
  return typeof draft.title === "string"
    && typeof draft.abstract === "string"
    && typeof draft.problem === "string"
    && typeof draft.solution === "string"
    && typeof draft.technicalField === "string"
    && typeof draft.noveltyHypothesis === "string"
    && typeof draft.publicSummary === "string"
    && Array.isArray(draft.components) && draft.components.every((item) => typeof item === "string")
    && Array.isArray(draft.keywords) && draft.keywords.every((item) => typeof item === "string")
    && Array.isArray(draft.missingQuestions) && draft.missingQuestions.every((item) => typeof item === "string")
    && (draft.mode === "live" || draft.mode === "gemini-live" || draft.mode === "demo-fallback")
    && Boolean(provenance) && typeof provenance === "object"
    && (provenance.kind === "model-assisted-draft" || provenance.kind === "deterministic-fallback")
    && (provenance.provider === "OpenAI" || provenance.provider === "Gemini" || provenance.provider === null)
    && (typeof provenance.model === "string" || provenance.model === null);
}

function storedProjectToInvention(project: StoredProject, index: number): Invention {
  return {
    id: project.id,
    title: project.title,
    summary: project.summary,
    category: project.category,
    stage: project.readinessStage,
    risk: "Medium",
    license: project.visibility === "public" ? "Open project" : "Private draft",
    interest: 0,
    owner: {
      name: project.ownerName,
      initials: project.ownerName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    },
    updated: new Date(project.updatedAt).toLocaleDateString(),
    tags: [project.visibility === "public" ? "Public" : "Private", "Saved project"],
    art: ["coral", "gold", "blue", "violet", "mint"][index % 5],
    symbol: "⌁",
    isSavedProject: true,
  };
}

const tabs: Tab[] = ["Overview", "Prior Art", "Files", "BOM", "Prototype Plan", "Collaborators", "Manufacturing", "License & Terms"];

const REPO_ROOT = "https://github.com/minagayid/innovator/tree/main/inventions";

type EngineeringPackage = {
  label: string;
  renderPath: string;
  scope: string;
  mechanism: string;
  firstGate: string;
  command?: string;
  documents: { label: string; path: string }[];
  modelChecks: string[];
};

const engineeringPackages: Record<string, EngineeringPackage> = {
  aurora: {
    label: "AURORA — non-nuclear thermal containment rig",
    renderPath: "/engineering/aurora_multisector_test_rig.png",
    scope: "Finite, deterministic thermal-network evidence only. This workspace does not model a reactor, plasma, magnetic field, neutron transport, or a licensed safety case.",
    mechanism: "Four abstract heat sectors are coupled through controlled thermal paths. The validation model compares nominal operation, a localized loss-of-flow surrogate, and a deliberately degraded common-cooling path.",
    firstGate: "An electrically heated, multi-sector rig must retain the chosen adjacent-sector margin during a pre-registered single-fault test.",
    command: "cd inventions/01_aurora_veilight_energy-and-interstellar/validation && python3 aurora_thermal_containment.py --output-dir outputs/aurora",
    documents: [
      { label: "Model specification", path: "01_aurora_veilight_energy-and-interstellar/validation/MODEL_SPEC.md" },
      { label: "Python validation script", path: "01_aurora_veilight_energy-and-interstellar/validation/aurora_thermal_containment.py" },
      { label: "Regeneration guide", path: "01_aurora_veilight_energy-and-interstellar/validation/README.md" },
    ],
    modelChecks: ["Sector-isolated fault stays within configured finite temperature limits.", "Common-cooling negative control must be distinguishable.", "Halving the numerical time step must preserve maxima within the stated tolerance."],
  },
  veilight: {
    label: "VEILIGHT — low-power sail coupon laboratory",
    renderPath: "/engineering/veilight_coupon_test_chamber.png",
    scope: "Finite low-power laboratory-coupon evidence only. This workspace does not design a high-power array, certify beam safety, predict an interstellar mission, or claim destination braking.",
    mechanism: "A flat-specular control is compared with an abstracted restoring and damped coupon response while tracking photon-force accounting and radiative thermal balance.",
    firstGate: "A vacuum coupon test must show measured lateral recovery and thermal margin relative to a flat control before any larger test is considered.",
    command: "cd inventions/01_aurora_veilight_energy-and-interstellar/validation && python3 veilight_sail_dynamics.py --output-dir outputs/veilight",
    documents: [
      { label: "Model specification", path: "01_aurora_veilight_energy-and-interstellar/validation/MODEL_SPEC.md" },
      { label: "Python validation script", path: "01_aurora_veilight_energy-and-interstellar/validation/veilight_sail_dynamics.py" },
      { label: "Regeneration guide", path: "01_aurora_veilight_energy-and-interstellar/validation/README.md" },
    ],
    modelChecks: ["Candidate endpoint is checked against its initial lateral offset.", "Candidate lateral response is compared against a flat-specular control.", "Thermal negative control must cross the stated coupon limit; time-step sensitivity must pass."],
  },
  tidegill: {
    label: "TIDEGILL — traceable direct-carbon research module",
    renderPath: "/engineering/tidegill_direct_carbon_research_module.png",
    scope: "A gated manufacturing roadmap for a sealed research module. It is not a commercial carbon plant, battery-material source, or operating recipe.",
    mechanism: "A cassette-first, serialised research module separates feed and buffer, cell containment, power and control, gas management, carbon custody and the run-data ledger.",
    firstGate: "A fully traceable R&D campaign must reconcile feed, energy, gas, solid mass, equipment condition and sample custody before material-quality claims are considered.",
    documents: [
      { label: "Manufacturing and supply-chain roadmap", path: "02_tidegill_carbon-cycle/manufacturing/MANUFACTURING_AND_SUPPLY_CHAIN_ROADMAP.md" },
      { label: "Supplier-qualification template", path: "02_tidegill_carbon-cycle/manufacturing/supplier_qualification_template.csv" },
      { label: "Refined system design", path: "02_tidegill_carbon-cycle/REFINED_DESIGN.md" },
    ],
    modelChecks: ["Supplier and lot identity must be recorded for each safety-critical component class.", "Every run requires calibrated analyzer, energy, feed, gas and sample-custody evidence.", "Battery-grade or durable-removal claims remain out of scope until separately qualified."],
  },
};

function RiskBadge({ risk }: { risk: Invention["risk"] }) {
  return <span className={`risk risk-${risk.toLowerCase()}`}><i />{risk} risk</span>;
}

function StageBadge({ stage }: { stage: string }) {
  return <span className="stage-badge">{stage}</span>;
}

function InventionCard({ invention, onOpen }: { invention: Invention; onOpen: () => void }) {
  return (
    <button className="invention-card" onClick={onOpen} aria-label={`Open ${invention.title}`}>
      <div className="card-topline"><span className="category">{invention.category}</span><span className="more">•••</span></div>
      <div className={`card-art art-${invention.art}`} aria-hidden="true"><div className="art-object" /><span>{invention.symbol}</span></div>
      <div className="card-copy">
        <div className="card-title-row"><h3>{invention.title}</h3><RiskBadge risk={invention.risk} /></div>
        <p>{invention.summary}</p>
        <div className="tag-row">{invention.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="card-footer">
          <div className="author"><span className="avatar">{invention.owner.initials}</span><span><b>{invention.owner.name}</b><small>updated {invention.updated}</small></span></div>
          <div className="card-stats"><span>◇ {invention.license}</span><span>◎ {invention.interest}</span></div>
        </div>
      </div>
    </button>
  );
}

function EvidencePill({ label }: { label: "Sourced" | "Computed" | "Inferred" | "Proposed" | "Unresolved" }) {
  return <span className={`evidence-pill evidence-${label.toLowerCase()}`}><i />{label}</span>;
}

function Studio({ setView }: { setView: (view: View) => void }) {
  const [problem, setProblem] = useState(studioTemplates[0].prompt);
  const [domainA, setDomainA] = useState(studioTemplates[0].domains[0]);
  const [domainB, setDomainB] = useState(studioTemplates[0].domains[1]);
  const [generated, setGenerated] = useState(true);
  const [expandedBridge, setExpandedBridge] = useState<string | null>(knowledgeBridges[0].id);
  const [reviewQuestion, setReviewQuestion] = useState("");
  const [reviewQuestions, setReviewQuestions] = useState(["What must be true for the analogy to transfer?"]);

  function loadTemplate(template: typeof studioTemplates[number]) {
    setProblem(template.prompt);
    setDomainA(template.domains[0]);
    setDomainB(template.domains[1]);
  }

  function addReviewQuestion() {
    const question = reviewQuestion.trim();
    if (!question) return;
    setReviewQuestions((current) => [...current, question]);
    setReviewQuestion("");
  }

  return <main className="studio-page">
    <section className="studio-hero">
      <div className="studio-hero-copy">
        <p className="studio-overline">INNOVATOR / RESEARCH STUDIO</p>
        <h1>Make the connection<br /><em>testable.</em></h1>
        <p>Link ideas across disciplines, surface the hidden assumption, and leave with a next experiment—not a louder claim.</p>
        <div className="studio-method-line"><span>01 Frame</span><span>02 Bridge</span><span>03 Challenge</span><span>04 Test</span></div>
      </div>
      <div className="studio-hero-orbit" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-core"><b>↗</b><span>useful<br />unknowns</span></div><i className="orbit-dot dot-one" /><i className="orbit-dot dot-two" /><i className="orbit-dot dot-three" /></div>
    </section>

    <section className="studio-layout">
      <div className="studio-main-column">
        <section className="studio-panel studio-brief-panel">
          <div className="studio-panel-heading"><div><p className="studio-kicker">START WITH A TENSION</p><h2>What needs to work better?</h2><p>Write the problem in plain language. The studio will keep your wording visible as the search expands.</p></div><span className="studio-step">01</span></div>
          <textarea aria-label="Problem or design tension" value={problem} onChange={(event) => setProblem(event.target.value)} rows={4} />
          <div className="template-row"><span>Try a starting point</span>{studioTemplates.map((template) => <button key={template.label} onClick={() => loadTemplate(template)} className={problem === template.prompt ? "active" : ""}>{template.label}</button>)}</div>
          <div className="domain-pair"><label><span>Source field</span><select value={domainA} onChange={(event) => setDomainA(event.target.value)}>{domainOptions.map((domain) => <option key={domain}>{domain}</option>)}</select></label><span className="bridge-arrow" aria-hidden="true">→</span><label><span>Target field</span><select value={domainB} onChange={(event) => setDomainB(event.target.value)}>{domainOptions.map((domain) => <option key={domain}>{domain}</option>)}</select></label><button className="studio-generate" onClick={() => setGenerated(true)}>{generated ? "Refresh route map" : "Map the connection"}<span>↗</span></button></div>
        </section>

        {generated && <>
          <section className="studio-panel bridge-panel">
            <div className="studio-panel-heading compact"><div><p className="studio-kicker">THE BRIDGEBOARD</p><h2>Three ways the fields might connect</h2><p>These are search directions, not discoveries. Open each bridge to inspect the mechanism and its limits.</p></div><span className="studio-step">02</span></div>
            <div className="bridge-list">{knowledgeBridges.map((bridge) => <article className={`bridge-card ${expandedBridge === bridge.id ? "expanded" : ""}`} key={bridge.id}><button className="bridge-summary" onClick={() => setExpandedBridge(expandedBridge === bridge.id ? null : bridge.id)}><span className="bridge-index">{String(knowledgeBridges.indexOf(bridge) + 1).padStart(2, "0")}</span><span className="bridge-path"><b>{bridge.from}</b><i>→</i><b>{bridge.to}</b><small>{bridge.bridge}</small></span><span className="bridge-confidence">{bridge.confidence}%<small>fit</small></span><span className="bridge-chevron">{expandedBridge === bridge.id ? "−" : "+"}</span></button>{expandedBridge === bridge.id && <div className="bridge-detail"><p>{bridge.mechanism}</p><div><EvidencePill label={bridge.evidence} /><span>{bridge.source}</span><a href={bridge.sourceUrl} target="_blank" rel="noreferrer">Inspect source ↗</a></div></div>}</article>)}</div>
          </section>

          <section className="studio-panel route-panel">
            <div className="studio-panel-heading compact"><div><p className="studio-kicker">CANDIDATE ROUTES</p><h2>What could we actually test?</h2><p>Converge on mechanisms that are useful, bounded, and falsifiable.</p></div><span className="studio-step">03</span></div>
            <div className="candidate-grid">{candidateRoutes.map((candidate) => <article className="candidate-card" key={candidate.id}><div className="candidate-topline"><EvidencePill label={candidate.status} /><strong>{candidate.fit}<small>/100 fit</small></strong></div><h3>{candidate.title}</h3><p>{candidate.summary}</p><div className="candidate-mechanism"><span>MECHANISM</span>{candidate.mechanism}</div><div className="candidate-next"><span>NEXT DECISIVE TEST</span>{candidate.nextTest}</div><details><summary>Stress-test the trade-off</summary><p>{candidate.tradeoff}</p></details></article>)}</div>
          </section>
        </>}
      </div>

      <aside className="studio-rail">
        <section className="studio-panel gate-panel"><div className="gate-orbit"><span>2</span><small>/ 4</small></div><p className="studio-kicker">CURRENT GATE</p><h2>Convergent selection</h2><p>Keep candidates that explain a mechanism and name the observation that could rule them out.</p><div className="gate-track"><i /><i className="active" /><i /><i /></div><div className="gate-labels"><span>Frame</span><span>Bridge</span><span>Challenge</span><span>Test</span></div><button onClick={() => setView("create")} className="text-button">Open a saved workspace <span>↗</span></button></section>
        <section className="studio-panel ledger-panel"><div className="studio-panel-heading mini"><div><p className="studio-kicker">EVIDENCE LEDGER</p><h2>Make uncertainty useful</h2></div><span>14 items</span></div>{evidenceLedger.map((item) => <div className="ledger-row" key={item.label}><span className={`ledger-dot ${item.tone}`} /><div><b>{item.label}</b><small>{item.copy}</small></div><strong>{item.count}</strong></div>)}<p className="ledger-note">A missing citation is a prompt to research, not permission to promote a hypothesis.</p></section>
        <section className="studio-panel review-panel"><p className="studio-kicker">RED-TEAM PROMPT</p><h2>What would change your mind?</h2><p>Capture the objection before the idea becomes precious.</p><div className="review-list">{reviewQuestions.map((question, index) => <div key={`${question}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span>{question}</div>)}</div><div className="review-input"><input aria-label="Add a red-team question" value={reviewQuestion} onChange={(event) => setReviewQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addReviewQuestion(); }} placeholder="Add a challenge…" /><button aria-label="Add challenge" onClick={addReviewQuestion}>+</button></div></section>
      </aside>
    </section>

    <section className="archive-strip"><div className="archive-intro"><p className="studio-kicker">RESEARCH ARCHIVE / 11 PACKAGES</p><h2>Ideas stay inspectable.</h2><p>Browse the repository’s bounded programmes, evidence ledgers, and claim boundaries.</p><button className="text-button" onClick={() => setView("gallery")}>Browse the invention library <span>↗</span></button></div><div className="archive-images">{archiveImages.map(([image, title, subtitle]) => <button key={image} onClick={() => setView("gallery")}><img src={`/pictures/${image}`} alt={`${title} ${subtitle}`} /><span><b>{title}</b><small>{subtitle}</small></span></button>)}</div></section>
  </main>;
}

function Sidebar({ view, setView }: { view: View; setView: (v: View) => void }) {
  const nav: [View, string, string][] = [
    ["studio", "Research studio", "✦"], ["gallery", "Invention library", "▦"], ["create", "New invention", "+"], ["workspace", "My workspaces", "⌂"],
    ["sources", "Patent sources", "⌕"], ["manufacturing", "Manufacturing", "⚙"],
  ];
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => setView("studio")}><span className="brand-mark">IN</span><span>Innov<b>ator</b></span></button>
      <nav>
        <p className="nav-label">WORKSPACE</p>
        {nav.map(([key, label, icon]) => <button key={key} className={view === key ? "active" : ""} onClick={() => setView(key)}><span className="nav-icon">{icon}</span>{label}{key === "workspace" && <em>3</em>}</button>)}
        <p className="nav-label community">COMMUNITY</p>
        <button><span className="nav-icon">◉</span>Collaborations</button>
        <button><span className="nav-icon">♢</span>Open challenges</button>
      </nav>
      <div className="sidebar-bottom">
        <div className="progress-card"><div><span>Research archive</span><b>11 packages</b></div><div className="progress"><i /></div><small>Evidence boundaries visible</small></div>
        <button className="help"><span>?</span>Documentation</button>
      </div>
    </aside>
  );
}

function Topbar({ setView, user, sessionReady }: { setView: (v: View) => void; user: SessionUser | null; sessionReady: boolean }) {
  const initials = user?.displayName.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase() || "IH";
  return <header className="topbar"><div className="global-search"><span>⌕</span><input aria-label="Search inventions" placeholder="Search inventions, components, inventors…" /><kbd>⌘ K</kbd></div><button className="icon-button" aria-label="Notifications">♢<i /></button><button className="new-button" onClick={() => setView("create")}>＋ New invention</button>{sessionReady && user ? <a className="user-menu" href="/signout-with-chatgpt?return_to=%2F" title="Sign out"><span>{initials}</span><span><b>{user.displayName}</b><small>Signed in · Log out</small></span><span>⌄</span></a> : <div className="auth-actions"><a href="/signin-with-chatgpt?return_to=%2F">Log in</a><a className="signup-button" href="/signin-with-chatgpt?return_to=%2F">Sign up</a></div>}</header>;
}

function Gallery({ open, setView, items, hasMoreProjects, loadingMoreProjects, projectListError, onLoadMoreProjects }: {
  open: (i: Invention) => void;
  setView: (v: View) => void;
  items: Invention[];
  hasMoreProjects: boolean;
  loadingMoreProjects: boolean;
  projectListError: string;
  onLoadMoreProjects: () => void;
}) {
  const [filter, setFilter] = useState("All inventions");
  const [sort, setSort] = useState("Recently updated");
  const shown = useMemo(() => filter === "All inventions" ? items : items.filter(i => i.category.includes(filter.replace(" & ", " and "))), [filter, items]);
  return <main className="page gallery-page">
    <section className="page-heading"><div><p className="eyebrow">INNOVATOR / RESEARCH ARCHIVE</p><h1>Ideas worth testing,<br /><em>together.</em></h1><p>Explore bounded invention programmes, inspect their evidence, and help move useful ideas from a clear problem to a decisive next test.</p></div><div className="heading-metrics"><div><b>11</b><span>Research packages</span></div><div><b>5</b><span>Evidence labels</span></div><div><b>0</b><span>Claims treated as proof</span></div></div></section>
    <section className="filter-row"><div className="filters">{["All inventions", "Health & accessibility", "Climate & energy", "Agriculture", "Education hardware"].map(x => <button key={x} className={filter === x ? "selected" : ""} onClick={() => setFilter(x)}>{x}</button>)}</div><label className="sort">Sort by <select value={sort} onChange={e => setSort(e.target.value)}><option>Recently updated</option><option>Lowest risk</option><option>Most interest</option></select></label></section>
    <section className="gallery-grid">{shown.map(i => <InventionCard key={i.id} invention={i} onOpen={() => open(i)} />)}<button className="start-card" onClick={() => setView("create")}><span>＋</span><h3>Start a new invention</h3><p>Turn rough notes into a structured, shareable workspace.</p><b>Open the invention assistant →</b></button>{hasMoreProjects && <button className="start-card" type="button" onClick={onLoadMoreProjects} disabled={loadingMoreProjects}><span>＋</span><h3>{loadingMoreProjects ? "Loading workspaces…" : "Load more workspaces"}</h3><p>Project results are paginated to keep each response small.</p><b>{loadingMoreProjects ? "Please wait" : "Show the next page →"}</b></button>}</section>
     {projectListError && <p className="form-error" role="alert">{projectListError}</p>}
     <div className="gallery-note"><span>✦</span><p><b>Built for inspectable invention work.</b> Every package keeps scope, evidence, uncertainty, and next tests visible.</p><button onClick={() => setView("studio")}>How Innovator works →</button></div>
  </main>;
}

function Workspace({ invention }: { invention: Invention }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [interest, setInterest] = useState(false);
  const [savedDocument, setSavedDocument] = useState(invention.savedDocument ?? null);
  const [documentLoading, setDocumentLoading] = useState(Boolean(invention.isSavedProject && !invention.savedDocument));
  const [documentError, setDocumentError] = useState("");

  useEffect(() => {
    setSavedDocument(invention.savedDocument ?? null);
    setDocumentError("");
    if (!invention.isSavedProject || invention.savedDocument) {
      setDocumentLoading(false);
      return;
    }

    const controller = new AbortController();
    setDocumentLoading(true);
    fetch(`/api/projects/${encodeURIComponent(invention.id)}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as { document?: { rawNotes?: unknown; disclosure?: unknown }; error?: string };
        if (!response.ok || !payload.document) throw new Error(payload.error || "Could not open the saved project document.");
        return payload.document;
      })
      .then((document) => {
        if (controller.signal.aborted) return;
        setSavedDocument({
          rawNotes: typeof document.rawNotes === "string" ? document.rawNotes : undefined,
          disclosure: isStructuredDisclosure(document.disclosure) ? document.disclosure : undefined,
        });
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setDocumentError(cause instanceof Error ? cause.message : "Could not open the saved project document.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setDocumentLoading(false);
      });

    return () => controller.abort();
  }, [invention.id, invention.isSavedProject, invention.savedDocument]);

  return <main className="page workspace-page">
    <div className="crumbs">Gallery <span>›</span> {invention.category} <span>›</span> {invention.title}</div>
    <section className="workspace-hero"><div className={`workspace-symbol art-${invention.art}`}>{invention.symbol}</div><div className="workspace-title"><div className="workspace-kicker"><span>{invention.isSavedProject ? (invention.license === "Private draft" ? "PRIVATE DRAFT" : "SAVED PROJECT") : "PUBLIC INVENTION"}</span><span>{invention.isSavedProject ? "Saved disclosure" : "Version 1.4"}</span></div><h1>{invention.title}</h1><p>{invention.summary}</p><div className="workspace-meta"><div className="author"><span className="avatar">{invention.owner.initials}</span><span><b>{invention.owner.name}</b><small>{invention.isSavedProject ? "Project owner" : "Lead inventor · Cairo, Egypt"}</small></span></div><span className="meta-divider" /><StageBadge stage={invention.stage} /><RiskBadge risk={invention.risk} /><span className="watch">◉ {invention.interest} watching</span></div></div><div className="hero-actions"><button className="secondary">↗ Share</button><button className="primary">＋ Contribute</button></div></section>
    <div className="tabs" role="tablist">{tabs.map(t => <button role="tab" aria-selected={tab === t} key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}{!invention.isSavedProject && t === "Prior Art" && <span>3</span>}{!invention.isSavedProject && t === "BOM" && <span>8</span>}</button>)}</div>
    {tab === "Overview" && (engineeringPackages[invention.id] ? <EngineeringOverview invention={invention} /> : invention.isSavedProject ? <SavedProjectOverview document={savedDocument} loading={documentLoading} error={documentError} /> : <Overview invention={invention} onPriorArt={() => setTab("Prior Art")} />)}
    {tab === "Prior Art" && (invention.isSavedProject ? <SavedProjectPlaceholder tab="Prior Art" /> : <PriorArt />)}
    {tab === "Files" && (invention.isSavedProject ? <SavedProjectPlaceholder tab="Files" /> : <Files />)}
    {tab === "BOM" && (invention.isSavedProject ? <SavedProjectPlaceholder tab="BOM" /> : <Bom />)}
    {tab === "Prototype Plan" && (invention.isSavedProject ? <SavedProjectPlaceholder tab="Prototype Plan" /> : <Prototype />)}
    {tab === "Collaborators" && (invention.isSavedProject ? <SavedProjectPlaceholder tab="Collaborators" /> : <Collaborators />)}
    {tab === "Manufacturing" && (invention.isSavedProject ? <SavedProjectPlaceholder tab="Manufacturing" /> : <Manufacturing interest={interest} setInterest={setInterest} />)}
    {tab === "License & Terms" && (invention.isSavedProject ? <SavedProjectPlaceholder tab="License & Terms" /> : <License />)}
  </main>;
}

function SavedProjectOverview({ document, loading, error }: { document: Invention["savedDocument"]; loading: boolean; error: string }) {
  if (loading) return <section className="content-card simple-panel"><p className="doc-label">SAVED DISCLOSURE</p><h2>Loading the saved draft…</h2></section>;
  if (error) return <section className="content-card simple-panel"><p className="doc-label">SAVED DISCLOSURE</p><h2>Could not load this draft</h2><p role="alert">{error}</p></section>;
  const disclosure = document?.disclosure;
  if (!disclosure) return <section className="content-card simple-panel"><p className="doc-label">SAVED DISCLOSURE</p><h2>No structured disclosure is stored for this project.</h2>{document?.rawNotes && <details><summary>View original notes</summary><p>{document.rawNotes}</p></details>}</section>;
  const source = disclosure.mode === "demo-fallback" ? "Local fallback · no semantic analysis" : `${disclosure.provenance.provider ?? "Model"} model-assisted draft · unverified`;
  return <div className="workspace-layout"><div className="workspace-main"><section className="content-card readme"><div className="card-header"><span><b>SAVED DISCLOSURE</b><small>{source}</small></span></div><article><p className="doc-label">ABSTRACT</p><p>{disclosure.abstract}</p><p className="doc-label">PROBLEM</p><p>{disclosure.problem}</p><p className="doc-label">PROPOSED SOLUTION</p><p>{disclosure.solution}</p><p className="doc-label">TECHNICAL FIELD</p><p>{disclosure.technicalField}</p><div className="callout"><span>✦</span><div><b>Possible novelty hypothesis</b><p>{disclosure.noveltyHypothesis}</p></div></div><p className="doc-label">MAIN COMPONENTS</p>{disclosure.components.length ? <div className="component-grid">{disclosure.components.map((component) => <div key={component}><span>⌁</span><b>{component}</b></div>)}</div> : <p>No components were extracted.</p>}<p className="doc-label">OPEN QUESTIONS</p><ul>{disclosure.missingQuestions.map((question, index) => <li key={`${question}-${index}`}>{question}</li>)}</ul>{document?.rawNotes && <details><summary>View original notes</summary><p>{document.rawNotes}</p></details>}</article></section></div><aside className="insight-rail"><section className="insight-card terms"><span>EVIDENCE STATUS</span><p className="terms-block">This saved record is a draft. It is not a scientific, engineering, novelty, safety, manufacturing, or legal review.</p></section></aside></div>;
}

function SavedProjectPlaceholder({ tab }: { tab: Tab }) {
  const message = tab === "Prior Art"
    ? "No prior-art search results are attached to this saved project."
    : tab === "Files"
      ? "No CAD, image, or other design files are attached to this saved project."
      : tab === "BOM"
        ? "No bill of materials has been prepared for this saved project."
        : tab === "Prototype Plan"
          ? "No prototype plan or test results have been added to this saved project."
          : tab === "Collaborators"
            ? "No collaborators have been recorded for this saved project."
            : tab === "Manufacturing"
              ? "Manufacturing feasibility, cost, and readiness have not been assessed for this saved project."
              : "No licensing terms have been assigned to this saved project.";
  return <section className="content-card simple-panel"><p className="doc-label">{tab.toUpperCase()}</p><h2>{tab} not yet added</h2><p>{message}</p></section>;
}

function EngineeringOverview({ invention }: { invention: Invention }) {
  const workspace = engineeringPackages[invention.id];
  return <div className="workspace-layout engineering-layout"><div className="workspace-main"><section className="content-card readme engineering-readme"><div className="card-header"><span><b>REPRODUCIBLE ENGINEERING WORKSPACE</b><small>Version-controlled source and bounded evidence</small></span><a href={`${REPO_ROOT}/${workspace.documents[0].path.split("/").slice(0, 2).join("/")}`} target="_blank" rel="noreferrer">Open repository ↗</a></div><article><p className="doc-label">CURRENT SCOPE</p><h2>{workspace.label}</h2><p>{workspace.scope}</p><figure className="engineering-render"><img src={workspace.renderPath} alt={`${workspace.label} concept render`} /><figcaption>Concept render of the bounded first test article; it is a design reference, not a build-ready drawing.</figcaption></figure><div className="callout"><span>✦</span><div><b>Testable mechanism</b><p>{workspace.mechanism}</p></div></div><p className="doc-label">FIRST DECISIVE GATE</p><p className="gate-copy">{workspace.firstGate}</p><p className="doc-label">REPRODUCE THE WORKSPACE</p>{workspace.command ? <pre className="run-command"><code>{workspace.command}</code></pre> : <p>The controlled manufacturing documents and supplier template are versioned in the linked repository directory.</p>}<div className="engineering-checks">{workspace.modelChecks.map((check, index) => <div key={check}><span>{String(index + 1).padStart(2, "0")}</span><p>{check}</p></div>)}</div></article></section><section className="content-card engineering-files"><div className="panel-heading"><div><p className="doc-label">VERSIONED ARTIFACTS</p><h2>Open, regenerate, inspect</h2><p>Source files are served from the public repository; review scope and limitations before reusing a result.</p></div></div><div className="file-list">{workspace.documents.map((document) => <a key={document.path} className="engineering-file" href={`${REPO_ROOT}/${document.path}`} target="_blank" rel="noreferrer"><span>DOC</span><p><b>{document.label}</b><small>{document.path}</small></p><b>Open ↗</b></a>)}</div></section></div><aside className="insight-rail"><section className="insight-card risk-report"><div className="insight-title"><span>VALIDATION STATUS</span><RiskBadge risk="High" /></div><div className="risk-score"><b>01</b><span>/05</span><div><strong>Bounded research</strong><small>Not a deployment claim</small></div></div><div className="score-bar"><i style={{width:"20%"}} /></div><p>Every model has an explicit control, a finite pass condition and an unresolved proof-gap ledger.</p></section><section className="insight-card readiness"><div className="insight-title"><span>READINESS</span><b>1 of 6</b></div>{["Mechanism stated", "Model / architecture", "Bench evidence", "Independent replication", "Design for manufacture", "Deployment review"].map((label, index) => <div className={index < 1 ? "done" : ""} key={label}><span>{index < 1 ? "✓" : index + 1}</span><p><b>{label}</b>{index===0 && <small>Current stage</small>}</p></div>)}</section><section className="insight-card terms"><span>RESPONSIBLE USE</span><p className="terms-block">These files are research artifacts. They are not operating instructions, a safety case, a commercial specification or a legal opinion.</p></section></aside></div>;
}

function Overview({ invention, onPriorArt }: { invention: Invention; onPriorArt: () => void }) {
  return <div className="workspace-layout"><div className="workspace-main"><section className="content-card readme"><div className="card-header"><span><b>README</b><small>Last edited 2 days ago</small></span><button>✎ Edit</button></div><article><p className="doc-label">THE PROBLEM</p><h2>Affordable, maintainable assistive devices are still out of reach for millions.</h2><p>Most advanced prosthetic hands are costly, difficult to repair locally, and built around proprietary parts. This project explores a modular alternative that can be assembled with common tools and adapted as a user’s needs change.</p><div className="callout"><span>✦</span><div><b>Possible novelty hypothesis</b><p>A tool-free tensioning cartridge and interchangeable grip modules may reduce fitting time while keeping all high-wear parts field-replaceable.</p></div></div><p className="doc-label">HOW IT WORKS</p><div className="steps"><div><span>01</span><b>Fit</b><p>A thermoformable socket adapts to the user without specialized equipment.</p></div><div><span>02</span><b>Configure</b><p>Grip modules snap onto a common palm chassis for different daily tasks.</p></div><div><span>03</span><b>Repair</b><p>Cables and joints can be replaced individually using standard fasteners.</p></div></div><p className="doc-label">KEY COMPONENTS</p><div className="component-grid">{["Palm chassis", "Tension cartridge", "Finger modules", "Adaptive socket"].map((x,i) => <div key={x}><span>{["▦","≋","⌁","◒"][i]}</span><b>{x}</b><small>{["Printed PETG", "Spring steel", "TPU + cable", "Thermoplastic"][i]}</small></div>)}</div></article></section></div><aside className="insight-rail"><section className="insight-card risk-report"><div className="insight-title"><span>PRIOR-ART RISK</span><RiskBadge risk={invention.risk} /></div><div className="risk-score"><b>42</b><span>/100</span><div><strong>Manageable overlap</strong><small>3 related records found</small></div></div><div className="score-bar"><i style={{width:"42%"}} /></div><p>Closest overlap is a cable-driven hand published in 2018. Your cartridge mechanism appears meaningfully different.</p><button onClick={onPriorArt}>View full risk report →</button></section><section className="insight-card readiness"><div className="insight-title"><span>READINESS</span><b>3 of 6</b></div>{["Concept defined", "Initial CAD", "Bench prototype", "User testing", "Design for manufacture", "Production ready"].map((x,i) => <div className={i < 3 ? "done" : ""} key={x}><span>{i < 3 ? "✓" : i+1}</span><p><b>{x}</b>{i===2 && <small>Current stage</small>}</p></div>)}</section><section className="insight-card terms"><span>COMMERCIALIZATION</span><div><b>50%</b><i /><b>50%</b></div><p><span>Inventor team</span><span>InventionHub</span></p><small>Proposed net-profit split. Final terms require a separate agreement.</small></section></aside></div>;
}

function PriorArt() { return <div className="report-layout"><section className="content-card report-summary"><div className="report-heading"><div><p className="doc-label">ILLUSTRATIVE SAMPLE REPORT</p><h2>Illustrative sample report</h2><p>This static example describes cable actuation and modular fingers; it is not a result for the open project.</p></div><div className="report-dial"><b>42</b><span>MEDIUM</span></div></div><div className="legal-note"><span>i</span><p><b>Informational only.</b> Prior-art results are not legal advice. A low score does not guarantee patentability or freedom to operate.</p></div><div className="novelty-grid"><div><span>LIKELY OVERLAP</span><ul><li>Cable-driven finger flexion</li><li>3D-printed palm chassis</li><li>Modular fingertip replacement</li></ul></div><div><span>POSSIBLE DIFFERENTIATORS</span><ul><li>Tool-free tensioning cartridge</li><li>Unified interface across grip modules</li><li>Field repair without adhesives</li></ul></div></div></section><section className="content-card matches"><div className="card-header"><span><b>Top matching records</b><small>Illustrative sample data · not queried for this project</small></span><button disabled>Live search not connected</button></div>{priorArt.map((p) => <article className="match" key={p.number}><div className="match-score">{p.score}<small>%</small></div><div><div className="match-meta"><span>{p.source}</span><b>{p.number}</b><span>{p.date}</span></div><h3>{p.title}</h3><p>{p.abstract}</p><div className="concepts">{p.concepts.map(x => <span key={x}>{x}</span>)}</div><details><summary>Why this may overlap <span>⌄</span></summary><p>{p.overlap}</p></details></div><a href={p.url} target="_blank" rel="noreferrer" aria-label={`Open source for ${p.number}`}>↗</a></article>)}</section></div> }

function Files() { return <section className="content-card simple-panel"><div className="panel-heading"><div><p className="doc-label">PROJECT FILES</p><h2>Design artifacts</h2></div><button className="primary">＋ Upload file</button></div><div className="file-list">{[["Palm chassis v4","STEP · 2.8 MB","CAD"],["Grip module drawings","PDF · 4.1 MB","DOC"],["Tension cartridge","STL · 1.2 MB","3D"],["Assembly guide","PDF · 860 KB","DOC"]].map(x=><div key={x[0]}><span>{x[2]}</span><p><b>{x[0]}</b><small>{x[1]} · Updated 2 days ago</small></p><button>↓</button></div>)}</div></section> }

function Bom() { return <section className="content-card simple-panel"><div className="panel-heading"><div><p className="doc-label">BILL OF MATERIALS</p><h2>Prototype bill</h2><p>Estimated prototype total: <b>$38.40</b></p></div><button className="primary">＋ Add item</button></div><table><thead><tr><th>Part</th><th>Qty</th><th>Material / source</th><th>Unit cost</th></tr></thead><tbody>{[["Palm chassis",1,"PETG, locally printed","$6.80"],["Finger module",5,"TPU + PETG","$2.40"],["Tension spring",5,"302 stainless steel","$0.90"],["Dyneema cable",2,"1.2 mm, per metre","$3.10"],["Socket sheet",1,"Low-temp thermoplastic","$8.40"]].map(x=><tr key={x[0]}>{x.map((v,i)=><td key={v}>{i===0?<b>{v}</b>:v}</td>)}</tr>)}</tbody></table></section> }

function Prototype() { return <section className="content-card simple-panel"><div className="panel-heading"><div><p className="doc-label">PROTOTYPE PLAN</p><h2>From bench to field test</h2></div><button className="primary">＋ Add step</button></div><div className="timeline">{[["01","Print structural parts","Complete","Verify dimensional tolerance across two printers."],["02","Bench-load test","Complete","Cycle each finger module 5,000 times at 30 N."],["03","Fit and comfort study","In progress","Run supervised fitting with five adult volunteers."],["04","Design-for-manufacture review","Planned","Assess injection moulding and assembly constraints."]].map(x=><div key={x[0]}><span>{x[0]}</span><p><b>{x[1]}</b><small>{x[3]}</small></p><em>{x[2]}</em></div>)}</div></section> }

function Collaborators() { return <section className="content-card simple-panel"><div className="panel-heading"><div><p className="doc-label">CONTRIBUTORS</p><h2>Built in the open</h2></div><button className="primary">Invite contributor</button></div><div className="people-list">{[["AK","Amir Khalil","Lead inventor · Mechanical design"],["LN","Lina Nassar","Occupational therapy advisor"],["RM","Rami Mansour","Materials & testing"],["SC","Sofia Chen","Technical documentation"]].map(x=><div key={x[1]}><span className="avatar">{x[0]}</span><p><b>{x[1]}</b><small>{x[2]}</small></p><button>View contributions</button></div>)}</div></section> }

function Manufacturing({ interest, setInterest }: { interest: boolean; setInterest: (v:boolean)=>void }) { return <div className="manufacturing-grid"><section className="content-card simple-panel"><div className="panel-heading"><div><p className="doc-label">MANUFACTURING BRIEF</p><h2>Small-batch ready for review</h2></div><StageBadge stage="Bench prototype" /></div><div className="metric-grid"><div><span>EST. UNIT COST</span><b>$31–42</b><small>at 100 units</small></div><div><span>COMPLEXITY</span><b>Moderate</b><small>14 unique parts</small></div><div><span>LEAD TIME</span><b>3–4 weeks</b><small>prototype batch</small></div><div><span>MATERIALS</span><b>Available</b><small>no constrained inputs</small></div></div><h3>Partner requirements</h3><ul className="check-list"><li>FDM or SLS additive manufacturing</li><li>Low-volume mechanical assembly</li><li>ISO 13485 experience preferred</li><li>Documented material traceability</li></ul><div className="legal-note"><span>!</span><p>Safety-critical inventions require qualified review before use. Manufacturing interest does not create a binding agreement.</p></div></section><aside className="interest-card"><span>MANUFACTURING PARTNERS</span><h2>Help bring this invention to people who need it.</h2><p>Review the files and requirements, then tell the inventor what capabilities you can offer.</p><div className="split"><div><b>50%</b><span>Inventor team</span></div><i /><div><b>50%</b><span>InventionHub</span></div></div><small>Default proposed split of net profit. Final terms require mutual agreement.</small><button className="primary" onClick={() => setInterest(true)}>{interest ? "✓ Interest registered" : "Express manufacturing interest"}</button>{interest && <p className="success">Thanks — the inventor will receive your demo enquiry.</p>}</aside></div> }

function License() { return <section className="content-card simple-panel"><div className="panel-heading"><div><p className="doc-label">LICENSE & TERMS</p><h2>CERN Open Hardware Licence v2 — Strongly Reciprocal</h2></div><span className="license-badge">CERN-OHL-S-2.0</span></div><div className="terms-copy"><p>You may study, modify, manufacture, and distribute this invention under the terms of the license. Modified design documentation must remain available under the same license.</p><div><h3>Attribution</h3><p>Credit the listed contributors and link to this project page in derived documentation.</p></div><div><h3>Commercialization</h3><p>Independent use follows the open-hardware license. Commercialization arranged through InventionHub uses the proposed 50/50 net-profit split, subject to a separate signed agreement.</p></div></div></section> }

function CreateInvention({ onCreated }: { onCreated: (i: Invention) => void }) {
  const [notes, setNotes] = useState("A low-cost hand prosthesis that can be repaired without specialist tools. Interchangeable grips, cable driven, printable parts, and a socket that can be fitted in local clinics.");
  const [category, setCategory] = useState("Health and accessibility");
  const [disclosure, setDisclosure] = useState<StructuredDisclosure | null>(null);
  const [structuredNotes, setStructuredNotes] = useState("");
  const [structuredCategory, setStructuredCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const activeDisclosure = disclosure && structuredNotes === notes && structuredCategory === category ? disclosure : null;

  async function structure(e: FormEvent) {
    e.preventDefault();
    const submittedNotes = notes;
    setLoading(true);
    setError("");
    setDisclosure(null);
    setStructuredNotes("");
    setStructuredCategory("");
    try {
      const response = await fetch("/api/disclosure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: submittedNotes, category }),
      });
      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        throw new Error("The disclosure service returned an unreadable response.");
      }
      if (!response.ok) {
        const message = payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
          ? payload.error
          : "Could not structure these notes.";
        throw new Error(message);
      }
      if (!isStructuredDisclosure(payload)) throw new Error("The disclosure service returned an incomplete draft.");
      setDisclosure(payload);
      setStructuredNotes(submittedNotes);
      setStructuredCategory(category);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not structure these notes.");
    } finally {
      setLoading(false);
    }
  }

  async function saveProject() {
    const draft = activeDisclosure;
    if (!draft) {
      setError("Structure the current notes before saving.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const savedDisclosure = { ...draft, generatedAt: new Date().toISOString() };
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          summary: draft.publicSummary,
          category,
          visibility: "private",
          document: { rawNotes: notes, disclosure: savedDisclosure },
        }),
      });
      const payload = await response.json() as { project?: StoredProject; error?: string; signIn?: string };
      if (response.status === 401 && payload.signIn) { window.location.href = payload.signIn; return; }
      if (!response.ok || !payload.project) throw new Error(payload.error || "Could not save this project.");
      const project = payload.project;
      onCreated({
        id: project.id,
        title: project.title,
        summary: project.summary,
        category: project.category,
        stage: project.readinessStage,
        risk: "Medium",
        license: "Private draft",
        interest: 0,
        owner: { name: project.ownerName, initials: project.ownerName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() },
        updated: "just now",
        tags: ["Private", draft.mode === "demo-fallback" ? "Unstructured draft" : "Model-assisted draft"],
        art: "coral",
        symbol: "⌁",
        isSavedProject: true,
        savedDocument: { rawNotes: notes, disclosure: savedDisclosure },
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this project.");
    } finally {
      setSaving(false);
    }
  }

  const sourceLabel = activeDisclosure?.mode === "demo-fallback"
    ? "Local fallback · no semantic analysis"
    : activeDisclosure?.mode === "gemini-live"
      ? "Gemini draft · unverified"
      : activeDisclosure?.mode === "live"
        ? "OpenAI draft · unverified"
        : "";

  return (
    <main className="page create-page">
      <div className="create-heading">
        <p className="eyebrow">AI DISCLOSURE ASSISTANT</p>
        <h1>Turn a rough idea into a clear invention record.</h1>
        <p>Describe the problem, your proposed solution, and anything you have already tried. The assistant will structure—not judge—your possible novelty.</p>
      </div>
      <div className="create-grid">
        <form className="content-card idea-form" onSubmit={structure}>
          <div className="step-label"><span>1</span><p><b>Start with your own words</b><small>Messy notes are welcome.</small></p></div>
          <label>What are you building?<textarea value={notes} onChange={(event) => { setNotes(event.target.value); setError(""); }} rows={9} /></label>
          <label>Category<select value={category} onChange={(event) => { setCategory(event.target.value); setError(""); }}><option>Health and accessibility</option><option>Climate and energy</option><option>Agriculture</option><option>Education hardware</option></select></label>
          <div className="privacy-note">⌁ If live AI is enabled, your notes and category may be sent to Gemini, or to OpenAI when Gemini is not configured. The request uses one provider; if it fails, the app returns a clearly labeled local fallback.</div>
          <button className="primary generate" disabled={loading || !notes.trim()}>{loading ? "Structuring disclosure…" : "✦ Structure with AI"}</button>
        </form>
        <section className={`content-card disclosure-preview ${activeDisclosure ? "ready" : ""}`} aria-live="polite">
          {!activeDisclosure ? <div className="empty-preview"><span>✦</span><h2>{disclosure ? "Notes changed; structure them again" : "Your disclosure will appear here"}</h2><p>{disclosure ? "The previous result belongs to different notes and cannot be saved. Run the structuring step again." : "The assistant will extract a title, problem, operating principle, components, possible differentiators, and open questions."}</p></div> : <>
            <div className="step-label"><span>2</span><p><b>Review the structured disclosure</b><small>{sourceLabel}</small></p></div>
            {activeDisclosure.mode !== "demo-fallback" && <div className="legal-note"><span>i</span><p>Model-assisted text is an unverified draft. Check every factual claim; no scientific, engineering, safety, or novelty assessment was performed.</p></div>}
            <div className="generated-title"><span>POSSIBLE TITLE</span><h2>{activeDisclosure.title}</h2></div>
            <div className="generated-fields">
              <div><span>ABSTRACT</span><p>{activeDisclosure.abstract}</p></div>
              <div><span>PROBLEM</span><p>{activeDisclosure.problem}</p></div>
              <div><span>PROPOSED SOLUTION</span><p>{activeDisclosure.solution}</p></div>
              <div><span>TECHNICAL FIELD</span><p>{activeDisclosure.technicalField}</p></div>
              <div><span>POSSIBLE NOVELTY HYPOTHESIS</span><p>{activeDisclosure.noveltyHypothesis}</p></div>
              <div><span>MAIN COMPONENTS</span><div className="tag-row">{activeDisclosure.components.length ? activeDisclosure.components.map((component) => <span key={component}>{component}</span>) : <span>Not assessed</span>}</div></div>
              <div><span>SUMMARY</span><p>{activeDisclosure.publicSummary}</p></div>
            </div>
            <div className="question-box"><b>{activeDisclosure.missingQuestions.length} open questions to resolve</b>{activeDisclosure.missingQuestions.length ? <ul>{activeDisclosure.missingQuestions.map((question, index) => <li key={`${question}-${index}`}>{question}</li>)}</ul> : <p>No open questions were returned; add a domain review before relying on this draft.</p>}</div>
          </>}
          {error && <p className="form-error" role="alert">{error}</p>}
          {activeDisclosure && <button className="primary" onClick={saveProject} disabled={saving}>{saving ? "Saving workspace…" : "Create private workspace →"}</button>}
        </section>
      </div>
    </main>
  );
}
function Sources() { return <main className="page directory-page"><div className="create-heading"><p className="eyebrow">SEARCH PROVIDER STATUS</p><h1>Prior-art sources, with provenance.</h1><p>No live prior-art search runs in this build. The bundled sample records are for interface demonstration only; they are not search results for a user's project.</p></div><div className="source-grid">{[["DEMO","Illustrative sample records","Bundled UI examples; not live search results","Demo only"],["USPTO","PatentsView adapter","No live API adapter or query path is connected","Not connected"],["EPO","Open Patent Services","European publication records","Planned"],["WIPO","PATENTSCOPE","International PCT publications","Planned"]].map(x=><section className="content-card" key={x[0]}><span>{x[0]}</span><h2>{x[1]}</h2><p>{x[2]}</p><b>{x[3]}</b></section>)}</div></main> }

function ManufacturingDirectory({ open }: { open: (i:Invention)=>void }) { return <main className="page directory-page"><div className="create-heading"><p className="eyebrow">PRODUCTION PIPELINE</p><h1>Open inventions looking for makers.</h1><p>Review manufacturability, safety needs, estimated cost, and transparent commercial terms before expressing interest.</p></div><div className="partner-table content-card"><div className="partner-row head"><span>Invention</span><span>Stage</span><span>Est. unit cost</span><span>Interest</span><span /></div>{inventions.slice(0,4).map((i,n)=><div className="partner-row" key={i.id}><span><b>{i.title}</b><small>{i.category}</small></span><StageBadge stage={i.stage} /><b>{["$31–42","$18–25","$12–19","$7–11"][n]}</b><span>{i.interest} partners</span><button onClick={()=>open(i)}>Review →</button></div>)}</div></main> }

export default function Home() {
  const [view, setView] = useState<View>("studio");
  const [selected, setSelected] = useState(inventions[0]);
  const [items, setItems] = useState<Invention[]>(inventions);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [nextProjectCursor, setNextProjectCursor] = useState<string | null>(null);
  const [loadingMoreProjects, setLoadingMoreProjects] = useState(false);
  const [projectListError, setProjectListError] = useState("");
  useEffect(() => {
    Promise.all([
      fetch("/api/session").then(r => r.json()) as Promise<{ user: SessionUser | null }>,
      fetch("/api/projects").then(r => r.json()) as Promise<{ projects: StoredProject[]; nextCursor?: string | null }>,
    ]).then(([session, data]) => {
      setUser(session.user);
      const stored = (data.projects || []).map(storedProjectToInvention);
      setNextProjectCursor(data.nextCursor ?? null);
      setItems([...stored, ...inventions.filter(seed => !stored.some(project => project.id === seed.id))]);
    }).finally(() => setSessionReady(true));
  }, []);
  async function loadMoreProjects() {
    if (!nextProjectCursor || loadingMoreProjects) return;
    setLoadingMoreProjects(true);
    setProjectListError("");
    try {
      const response = await fetch(`/api/projects?cursor=${encodeURIComponent(nextProjectCursor)}`);
      const data = await response.json() as { projects?: StoredProject[]; nextCursor?: string | null; error?: string };
      if (!response.ok) throw new Error(data.error || "Could not load more workspaces.");
      const nextItems = (data.projects || []).map(storedProjectToInvention);
      setItems((current) => {
        const known = new Set(current.map((item) => item.id));
        return [...current, ...nextItems.filter((item) => !known.has(item.id))];
      });
      setNextProjectCursor(data.nextCursor ?? null);
    } catch (cause) {
      setProjectListError(cause instanceof Error ? cause.message : "Could not load more workspaces.");
    } finally {
      setLoadingMoreProjects(false);
    }
  }
  function open(i: Invention) { setSelected(i); setItems(current => current.some(item => item.id === i.id) ? current : [i, ...current]); setView("workspace"); window.scrollTo({top:0, behavior:"smooth"}); }
  return <div className="app-shell"><Sidebar view={view} setView={setView} /><div className="app-body"><Topbar setView={setView} user={user} sessionReady={sessionReady} />{view === "studio" && <Studio setView={setView} />}{view === "gallery" && <Gallery open={open} setView={setView} items={items} hasMoreProjects={nextProjectCursor !== null} loadingMoreProjects={loadingMoreProjects} projectListError={projectListError} onLoadMoreProjects={loadMoreProjects} />}{view === "workspace" && <Workspace key={selected.id} invention={selected} />}{view === "create" && <CreateInvention onCreated={open} />}{view === "sources" && <Sources />}{view === "manufacturing" && <ManufacturingDirectory open={open} />}<footer><span>Innovator · InventionHub research archive</span><span>Evidence is inspectable; hypotheses are not guarantees.</span></footer></div></div>;
}
