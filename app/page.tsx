"use client";

import { FormEvent, useMemo, useState } from "react";
import { inventions, priorArt, type Invention } from "./seed-data";

type View = "gallery" | "workspace" | "create" | "sources" | "manufacturing";
type Tab = "Overview" | "Prior Art" | "Files" | "BOM" | "Prototype Plan" | "Collaborators" | "Manufacturing" | "License & Terms";

const tabs: Tab[] = ["Overview", "Prior Art", "Files", "BOM", "Prototype Plan", "Collaborators", "Manufacturing", "License & Terms"];

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

function Sidebar({ view, setView }: { view: View; setView: (v: View) => void }) {
  const nav: [View, string, string][] = [
    ["gallery", "Gallery", "▦"], ["create", "New invention", "+"], ["workspace", "My workspaces", "⌂"],
    ["sources", "Patent sources", "⌕"], ["manufacturing", "Manufacturing", "⚙"],
  ];
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => setView("gallery")}><span className="brand-mark">IH</span><span>Invention<b>Hub</b></span></button>
      <nav>
        <p className="nav-label">WORKSPACE</p>
        {nav.map(([key, label, icon]) => <button key={key} className={view === key ? "active" : ""} onClick={() => setView(key)}><span className="nav-icon">{icon}</span>{label}{key === "workspace" && <em>3</em>}</button>)}
        <p className="nav-label community">COMMUNITY</p>
        <button><span className="nav-icon">◉</span>Collaborations</button>
        <button><span className="nav-icon">♢</span>Open challenges</button>
      </nav>
      <div className="sidebar-bottom">
        <div className="progress-card"><div><span>Build Week demo</span><b>82%</b></div><div className="progress"><i /></div><small>Vertical slice ready</small></div>
        <button className="help"><span>?</span>Documentation</button>
      </div>
    </aside>
  );
}

function Topbar({ setView }: { setView: (v: View) => void }) {
  return <header className="topbar"><div className="global-search"><span>⌕</span><input aria-label="Search inventions" placeholder="Search inventions, components, inventors…" /><kbd>⌘ K</kbd></div><button className="icon-button" aria-label="Notifications">♢<i /></button><button className="new-button" onClick={() => setView("create")}>＋ New invention</button><button className="user-menu"><span>AK</span><span><b>Amir Khalil</b><small>Inventor</small></span><span>⌄</span></button></header>;
}

function Gallery({ open, setView }: { open: (i: Invention) => void; setView: (v: View) => void }) {
  const [filter, setFilter] = useState("All inventions");
  const [sort, setSort] = useState("Recently updated");
  const shown = useMemo(() => filter === "All inventions" ? inventions : inventions.filter(i => i.category.includes(filter.replace(" & ", " and "))), [filter]);
  return <main className="page gallery-page">
    <section className="page-heading"><div><p className="eyebrow">OPEN INVENTION NETWORK</p><h1>Ideas worth building,<br /><em>together.</em></h1><p>Discover open physical inventions, contribute your expertise, and help move useful ideas from sketch to production.</p></div><div className="heading-metrics"><div><b>248</b><span>Open inventions</span></div><div><b>1,492</b><span>Contributors</span></div><div><b>37</b><span>In production</span></div></div></section>
    <section className="filter-row"><div className="filters">{["All inventions", "Health & accessibility", "Climate & energy", "Agriculture", "Education hardware"].map(x => <button key={x} className={filter === x ? "selected" : ""} onClick={() => setFilter(x)}>{x}</button>)}</div><label className="sort">Sort by <select value={sort} onChange={e => setSort(e.target.value)}><option>Recently updated</option><option>Lowest risk</option><option>Most interest</option></select></label></section>
    <section className="gallery-grid">{shown.map(i => <InventionCard key={i.id} invention={i} onOpen={() => open(i)} />)}<button className="start-card" onClick={() => setView("create")}><span>＋</span><h3>Start a new invention</h3><p>Turn rough notes into a structured, shareable workspace.</p><b>Open the invention assistant →</b></button></section>
    <div className="gallery-note"><span>✦</span><p><b>Built for useful, open hardware.</b> Every invention includes transparent licensing, attribution, and prior-art context.</p><button>How InventionHub works →</button></div>
  </main>;
}

function Workspace({ invention }: { invention: Invention }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [interest, setInterest] = useState(false);
  return <main className="page workspace-page">
    <div className="crumbs">Gallery <span>›</span> {invention.category} <span>›</span> {invention.title}</div>
    <section className="workspace-hero"><div className={`workspace-symbol art-${invention.art}`}>{invention.symbol}</div><div className="workspace-title"><div className="workspace-kicker"><span>PUBLIC INVENTION</span><span>Version 1.4</span></div><h1>{invention.title}</h1><p>{invention.summary}</p><div className="workspace-meta"><div className="author"><span className="avatar">{invention.owner.initials}</span><span><b>{invention.owner.name}</b><small>Lead inventor · Cairo, Egypt</small></span></div><span className="meta-divider" /><StageBadge stage={invention.stage} /><RiskBadge risk={invention.risk} /><span className="watch">◉ {invention.interest} watching</span></div></div><div className="hero-actions"><button className="secondary">↗ Share</button><button className="primary">＋ Contribute</button></div></section>
    <div className="tabs" role="tablist">{tabs.map(t => <button role="tab" aria-selected={tab === t} key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}{t === "Prior Art" && <span>3</span>}{t === "BOM" && <span>8</span>}</button>)}</div>
    {tab === "Overview" && <Overview invention={invention} onPriorArt={() => setTab("Prior Art")} />}
    {tab === "Prior Art" && <PriorArt />}
    {tab === "Files" && <Files />}
    {tab === "BOM" && <Bom />}
    {tab === "Prototype Plan" && <Prototype />}
    {tab === "Collaborators" && <Collaborators />}
    {tab === "Manufacturing" && <Manufacturing interest={interest} setInterest={setInterest} />}
    {tab === "License & Terms" && <License />}
  </main>;
}

function Overview({ invention, onPriorArt }: { invention: Invention; onPriorArt: () => void }) {
  return <div className="workspace-layout"><div className="workspace-main"><section className="content-card readme"><div className="card-header"><span><b>README</b><small>Last edited 2 days ago</small></span><button>✎ Edit</button></div><article><p className="doc-label">THE PROBLEM</p><h2>Affordable, maintainable assistive devices are still out of reach for millions.</h2><p>Most advanced prosthetic hands are costly, difficult to repair locally, and built around proprietary parts. This project explores a modular alternative that can be assembled with common tools and adapted as a user’s needs change.</p><div className="callout"><span>✦</span><div><b>Possible novelty hypothesis</b><p>A tool-free tensioning cartridge and interchangeable grip modules may reduce fitting time while keeping all high-wear parts field-replaceable.</p></div></div><p className="doc-label">HOW IT WORKS</p><div className="steps"><div><span>01</span><b>Fit</b><p>A thermoformable socket adapts to the user without specialized equipment.</p></div><div><span>02</span><b>Configure</b><p>Grip modules snap onto a common palm chassis for different daily tasks.</p></div><div><span>03</span><b>Repair</b><p>Cables and joints can be replaced individually using standard fasteners.</p></div></div><p className="doc-label">KEY COMPONENTS</p><div className="component-grid">{["Palm chassis", "Tension cartridge", "Finger modules", "Adaptive socket"].map((x,i) => <div key={x}><span>{["▦","≋","⌁","◒"][i]}</span><b>{x}</b><small>{["Printed PETG", "Spring steel", "TPU + cable", "Thermoplastic"][i]}</small></div>)}</div></article></section></div><aside className="insight-rail"><section className="insight-card risk-report"><div className="insight-title"><span>PRIOR-ART RISK</span><RiskBadge risk={invention.risk} /></div><div className="risk-score"><b>42</b><span>/100</span><div><strong>Manageable overlap</strong><small>3 related records found</small></div></div><div className="score-bar"><i style={{width:"42%"}} /></div><p>Closest overlap is a cable-driven hand published in 2018. Your cartridge mechanism appears meaningfully different.</p><button onClick={onPriorArt}>View full risk report →</button></section><section className="insight-card readiness"><div className="insight-title"><span>READINESS</span><b>3 of 6</b></div>{["Concept defined", "Initial CAD", "Bench prototype", "User testing", "Design for manufacture", "Production ready"].map((x,i) => <div className={i < 3 ? "done" : ""} key={x}><span>{i < 3 ? "✓" : i+1}</span><p><b>{x}</b>{i===2 && <small>Current stage</small>}</p></div>)}</section><section className="insight-card terms"><span>COMMERCIALIZATION</span><div><b>50%</b><i /><b>50%</b></div><p><span>Inventor team</span><span>InventionHub</span></p><small>Proposed net-profit split. Final terms require a separate agreement.</small></section></aside></div>;
}

function PriorArt() { return <div className="report-layout"><section className="content-card report-summary"><div className="report-heading"><div><p className="doc-label">REPETITION RISK REPORT</p><h2>Distinct mechanism, familiar category.</h2><p>The search found meaningful overlap in cable actuation and modular fingers, but no close match for the tool-free tension cartridge.</p></div><div className="report-dial"><b>42</b><span>MEDIUM</span></div></div><div className="legal-note"><span>i</span><p><b>Informational only.</b> Prior-art results are not legal advice. A low score does not guarantee patentability or freedom to operate.</p></div><div className="novelty-grid"><div><span>LIKELY OVERLAP</span><ul><li>Cable-driven finger flexion</li><li>3D-printed palm chassis</li><li>Modular fingertip replacement</li></ul></div><div><span>POSSIBLE DIFFERENTIATORS</span><ul><li>Tool-free tensioning cartridge</li><li>Unified interface across grip modules</li><li>Field repair without adhesives</li></ul></div></div></section><section className="content-card matches"><div className="card-header"><span><b>Top matching records</b><small>Demo dataset · searched 24 records</small></span><button>↻ Run search again</button></div>{priorArt.map((p) => <article className="match" key={p.number}><div className="match-score">{p.score}<small>%</small></div><div><div className="match-meta"><span>{p.source}</span><b>{p.number}</b><span>{p.date}</span></div><h3>{p.title}</h3><p>{p.abstract}</p><div className="concepts">{p.concepts.map(x => <span key={x}>{x}</span>)}</div><details><summary>Why this may overlap <span>⌄</span></summary><p>{p.overlap}</p></details></div><a href={p.url} target="_blank" rel="noreferrer" aria-label={`Open source for ${p.number}`}>↗</a></article>)}</section></div> }

function Files() { return <section className="content-card simple-panel"><div className="panel-heading"><div><p className="doc-label">PROJECT FILES</p><h2>Design artifacts</h2></div><button className="primary">＋ Upload file</button></div><div className="file-list">{[["Palm chassis v4","STEP · 2.8 MB","CAD"],["Grip module drawings","PDF · 4.1 MB","DOC"],["Tension cartridge","STL · 1.2 MB","3D"],["Assembly guide","PDF · 860 KB","DOC"]].map(x=><div key={x[0]}><span>{x[2]}</span><p><b>{x[0]}</b><small>{x[1]} · Updated 2 days ago</small></p><button>↓</button></div>)}</div></section> }

function Bom() { return <section className="content-card simple-panel"><div className="panel-heading"><div><p className="doc-label">BILL OF MATERIALS</p><h2>Prototype bill</h2><p>Estimated prototype total: <b>$38.40</b></p></div><button className="primary">＋ Add item</button></div><table><thead><tr><th>Part</th><th>Qty</th><th>Material / source</th><th>Unit cost</th></tr></thead><tbody>{[["Palm chassis",1,"PETG, locally printed","$6.80"],["Finger module",5,"TPU + PETG","$2.40"],["Tension spring",5,"302 stainless steel","$0.90"],["Dyneema cable",2,"1.2 mm, per metre","$3.10"],["Socket sheet",1,"Low-temp thermoplastic","$8.40"]].map(x=><tr key={x[0]}>{x.map((v,i)=><td key={v}>{i===0?<b>{v}</b>:v}</td>)}</tr>)}</tbody></table></section> }

function Prototype() { return <section className="content-card simple-panel"><div className="panel-heading"><div><p className="doc-label">PROTOTYPE PLAN</p><h2>From bench to field test</h2></div><button className="primary">＋ Add step</button></div><div className="timeline">{[["01","Print structural parts","Complete","Verify dimensional tolerance across two printers."],["02","Bench-load test","Complete","Cycle each finger module 5,000 times at 30 N."],["03","Fit and comfort study","In progress","Run supervised fitting with five adult volunteers."],["04","Design-for-manufacture review","Planned","Assess injection moulding and assembly constraints."]].map(x=><div key={x[0]}><span>{x[0]}</span><p><b>{x[1]}</b><small>{x[3]}</small></p><em>{x[2]}</em></div>)}</div></section> }

function Collaborators() { return <section className="content-card simple-panel"><div className="panel-heading"><div><p className="doc-label">CONTRIBUTORS</p><h2>Built in the open</h2></div><button className="primary">Invite contributor</button></div><div className="people-list">{[["AK","Amir Khalil","Lead inventor · Mechanical design"],["LN","Lina Nassar","Occupational therapy advisor"],["RM","Rami Mansour","Materials & testing"],["SC","Sofia Chen","Technical documentation"]].map(x=><div key={x[1]}><span className="avatar">{x[0]}</span><p><b>{x[1]}</b><small>{x[2]}</small></p><button>View contributions</button></div>)}</div></section> }

function Manufacturing({ interest, setInterest }: { interest: boolean; setInterest: (v:boolean)=>void }) { return <div className="manufacturing-grid"><section className="content-card simple-panel"><div className="panel-heading"><div><p className="doc-label">MANUFACTURING BRIEF</p><h2>Small-batch ready for review</h2></div><StageBadge stage="Bench prototype" /></div><div className="metric-grid"><div><span>EST. UNIT COST</span><b>$31–42</b><small>at 100 units</small></div><div><span>COMPLEXITY</span><b>Moderate</b><small>14 unique parts</small></div><div><span>LEAD TIME</span><b>3–4 weeks</b><small>prototype batch</small></div><div><span>MATERIALS</span><b>Available</b><small>no constrained inputs</small></div></div><h3>Partner requirements</h3><ul className="check-list"><li>FDM or SLS additive manufacturing</li><li>Low-volume mechanical assembly</li><li>ISO 13485 experience preferred</li><li>Documented material traceability</li></ul><div className="legal-note"><span>!</span><p>Safety-critical inventions require qualified review before use. Manufacturing interest does not create a binding agreement.</p></div></section><aside className="interest-card"><span>MANUFACTURING PARTNERS</span><h2>Help bring this invention to people who need it.</h2><p>Review the files and requirements, then tell the inventor what capabilities you can offer.</p><div className="split"><div><b>50%</b><span>Inventor team</span></div><i /><div><b>50%</b><span>InventionHub</span></div></div><small>Default proposed split of net profit. Final terms require mutual agreement.</small><button className="primary" onClick={() => setInterest(true)}>{interest ? "✓ Interest registered" : "Express manufacturing interest"}</button>{interest && <p className="success">Thanks — the inventor will receive your demo enquiry.</p>}</aside></div> }

function License() { return <section className="content-card simple-panel"><div className="panel-heading"><div><p className="doc-label">LICENSE & TERMS</p><h2>CERN Open Hardware Licence v2 — Strongly Reciprocal</h2></div><span className="license-badge">CERN-OHL-S-2.0</span></div><div className="terms-copy"><p>You may study, modify, manufacture, and distribute this invention under the terms of the license. Modified design documentation must remain available under the same license.</p><div><h3>Attribution</h3><p>Credit the listed contributors and link to this project page in derived documentation.</p></div><div><h3>Commercialization</h3><p>Independent use follows the open-hardware license. Commercialization arranged through InventionHub uses the proposed 50/50 net-profit split, subject to a separate signed agreement.</p></div></div></section> }

function CreateInvention({ onCreated }: { onCreated: (i: Invention) => void }) {
  const [notes, setNotes] = useState("A low-cost hand prosthesis that can be repaired without specialist tools. Interchangeable grips, cable driven, printable parts, and a socket that can be fitted in local clinics.");
  const [category, setCategory] = useState("Health and accessibility");
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  async function structure(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/disclosure", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes, category }) });
      setGenerated(true);
    } finally { setLoading(false); }
  }
  return <main className="page create-page"><div className="create-heading"><p className="eyebrow">GPT DISCLOSURE ASSISTANT</p><h1>Turn a rough idea into a clear invention record.</h1><p>Describe the problem, your proposed solution, and anything you have already tried. The assistant will structure—not judge—your possible novelty.</p></div><div className="create-grid"><form className="content-card idea-form" onSubmit={structure}><div className="step-label"><span>1</span><p><b>Start with your own words</b><small>Messy notes are welcome.</small></p></div><label>What are you building?<textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={9} /></label><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option>Health and accessibility</option><option>Climate and energy</option><option>Agriculture</option><option>Education hardware</option></select></label><div className="privacy-note">⌁ Your draft stays private until you choose to publish.</div><button className="primary generate" disabled={loading || !notes.trim()}>{loading ? "Structuring disclosure…" : "✦ Structure with GPT-5.6"}</button></form><section className={`content-card disclosure-preview ${generated ? "ready" : ""}`}>{!generated ? <div className="empty-preview"><span>✦</span><h2>Your disclosure will appear here</h2><p>The assistant will extract a title, problem, operating principle, components, possible differentiators, and open questions.</p></div> : <><div className="step-label"><span>2</span><p><b>Review the structured disclosure</b><small>Demo fallback generated · Edit anything</small></p></div><div className="generated-title"><span>POSSIBLE TITLE</span><h2>Field-Repairable Modular Prosthetic Hand</h2></div><div className="generated-fields"><div><span>PROBLEM</span><p>Affordable upper-limb prostheses are difficult to fit, adapt, and repair in resource-limited clinics.</p></div><div><span>OPERATING PRINCIPLE</span><p>Body-powered cables actuate interchangeable grip modules mounted to a printable common chassis.</p></div><div><span>POSSIBLE NOVELTY</span><p>A tool-free cable tension cartridge combined with a standardized grip-module interface.</p></div><div><span>MAIN COMPONENTS</span><div className="tag-row"><span>Palm chassis</span><span>Grip modules</span><span>Cable cartridge</span><span>Adaptive socket</span></div></div></div><div className="question-box"><b>3 questions to strengthen the disclosure</b><p>How is tension retained under repeated loading? What grip forces are targeted? Which parts contact skin?</p></div><button className="primary" onClick={() => onCreated(inventions[0])}>Create private workspace →</button></>}</section></div></main>;
}

function Sources() { return <main className="page directory-page"><div className="create-heading"><p className="eyebrow">SEARCH PROVIDERS</p><h1>Prior-art sources, with provenance.</h1><p>InventionHub separates search adapters from similarity analysis so every result keeps a visible source.</p></div><div className="source-grid">{[["DEMO","Curated demo dataset","24 reliable sample records","Connected"],["USPTO","PatentsView adapter","US patent research interface","Adapter ready"],["EPO","Open Patent Services","European publication records","Planned"],["WIPO","PATENTSCOPE","International PCT publications","Planned"]].map(x=><section className="content-card" key={x[0]}><span>{x[0]}</span><h2>{x[1]}</h2><p>{x[2]}</p><b>{x[3]}</b></section>)}</div></main> }

function ManufacturingDirectory({ open }: { open: (i:Invention)=>void }) { return <main className="page directory-page"><div className="create-heading"><p className="eyebrow">PRODUCTION PIPELINE</p><h1>Open inventions looking for makers.</h1><p>Review manufacturability, safety needs, estimated cost, and transparent commercial terms before expressing interest.</p></div><div className="partner-table content-card"><div className="partner-row head"><span>Invention</span><span>Stage</span><span>Est. unit cost</span><span>Interest</span><span /></div>{inventions.slice(0,4).map((i,n)=><div className="partner-row" key={i.id}><span><b>{i.title}</b><small>{i.category}</small></span><StageBadge stage={i.stage} /><b>{["$31–42","$18–25","$12–19","$7–11"][n]}</b><span>{i.interest} partners</span><button onClick={()=>open(i)}>Review →</button></div>)}</div></main> }

export default function Home() {
  const [view, setView] = useState<View>("gallery");
  const [selected, setSelected] = useState(inventions[0]);
  function open(i: Invention) { setSelected(i); setView("workspace"); window.scrollTo({top:0, behavior:"smooth"}); }
  return <div className="app-shell"><Sidebar view={view} setView={setView} /><div className="app-body"><Topbar setView={setView} />{view === "gallery" && <Gallery open={open} setView={setView} />}{view === "workspace" && <Workspace invention={selected} />}{view === "create" && <CreateInvention onCreated={open} />}{view === "sources" && <Sources />}{view === "manufacturing" && <ManufacturingDirectory open={open} />}<footer><span>InventionHub · Open physical innovation</span><span>Prior-art results are informational and not legal advice.</span></footer></div></div>;
}
