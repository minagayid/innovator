"use client";

import Link from "next/link";
import { CSSProperties, FormEvent, useState } from "react";
import styles from "./page.module.css";

type ScholarPaper = {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  venue: string;
  url: string;
  doi: string | null;
  citedBy: number | null;
  abstract: string;
};
type ScholarResponse = { paper?: ScholarPaper; related?: ScholarPaper[]; error?: string };

export default function ResearchLab() {
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [paper, setPaper] = useState<ScholarPaper | null>(null);
  const [related, setRelated] = useState<ScholarPaper[]>([]);
  const [seeded, setSeeded] = useState(false);

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (value.length < 3) {
      setError("Give me a DOI, a paper URL, or at least a few words of the title.");
      return;
    }
    setError("");
    setBusy(true);
    setSeeded(false);
    try {
      const response = await fetch(`/api/scholar?paper=${encodeURIComponent(value)}`);
      const payload: ScholarResponse = await response.json();
      if (!response.ok || !payload.paper) throw new Error(payload.error || "No record matched that paper.");
      setPaper(payload.paper);
      setRelated(payload.related ?? []);
    } catch (cause) {
      setPaper(null);
      setRelated([]);
      setError(cause instanceof Error ? cause.message : "The lookup failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function seedStudio() {
    if (!paper) return;
    try {
      sessionStorage.setItem("innovator-paper-seed-v1", JSON.stringify({
        title: paper.title,
        url: paper.url,
        venue: paper.venue,
        year: paper.year,
        abstract: paper.abstract,
        similar: related.map((item) => `${item.title}${item.year ? ` (${item.year})` : ""}`),
      }));
      setSeeded(true);
      window.setTimeout(() => window.location.assign("/"), 650);
    } catch {
      window.location.assign("/");
    }
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Innovator home">
          <span className={styles.brandMark}>IN</span>
          <span>INNOVATOR<small>RESEARCH LAB</small></span>
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <Link className={styles.navLink} href="/">Studio</Link>
          <Link className={`${styles.navLink} ${styles.navLinkActive}`} href="/research">Research lab</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={`${styles.hero} reveal`}>
          <p className={styles.eyebrow}>Paper to invention</p>
          <h1>Start from a paper, <em>not a blank page.</em></h1>
          <p className={styles.heroCopy}>
            Drop in a DOI, a link, or a title. The lab finds the indexed record and the closest related work,
            then hands everything to the studio as the evidence base for a new invention candidate.
          </p>
        </section>

        <form className={`${styles.search} reveal`} style={{ "--d": "80ms" } as CSSProperties} onSubmit={search}>
          <input
            className={styles.input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="DOI, paper URL, or title — e.g. 10.1126/scirobotics.adt5254"
            maxLength={300}
            aria-label="Paper DOI, URL, or title"
          />
          <button className={styles.primary} type="submit" disabled={busy}>{busy ? "Searching…" : "Find similar research"}</button>
        </form>

        {error && <p className={styles.error} role="alert">{error}</p>}
        {busy && <p className={styles.notice} role="status">Checking the OpenAlex index…</p>}

        {paper && (
          <section className={`${styles.panel} reveal`} aria-live="polite">
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.kicker}>Seed paper · sourced record</p>
                <h2>{paper.title}</h2>
                <p>{paper.authors.join(", ") || "authors unlisted"} · {paper.venue}{paper.year ? ` · ${paper.year}` : ""}{paper.citedBy !== null ? ` · ${paper.citedBy} citations` : ""}</p>
              </div>
            </div>
            {paper.abstract && <p className={styles.abstract}>{paper.abstract}{paper.abstract.length >= 1400 ? "…" : ""}</p>}
            <div className={styles.actions}>
              <button className={styles.primary} type="button" onClick={seedStudio}>{seeded ? "Opening the studio…" : "Build invention ideas from this paper"}</button>
              <a className={styles.secondary} href={paper.url} target="_blank" rel="noopener noreferrer">Open source ↗</a>
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className={styles.relatedWrap} aria-label="Similar research">
            <h2 className={styles.relatedTitle}>Closest related work <span>{related.length} records</span></h2>
            <div className={styles.grid}>
              {related.map((item, index) => (
                <article className={`${styles.card} reveal`} style={{ "--d": `${index * 60}ms` } as CSSProperties} key={item.id}>
                  <div className={styles.cardMeta}><b>OpenAlex</b><span>{item.year || "year unlisted"}</span>{item.citedBy !== null && <span>· {item.citedBy} citations</span>}</div>
                  <h3>{item.title}</h3>
                  <p>{item.venue} · {item.authors.slice(0, 3).join(", ") || "authors unlisted"}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">Open source ↗</a>
                </article>
              ))}
            </div>
            <p className={styles.boundary}>Sourced index records for navigation — not peer review, truth, novelty, or patentability determinations.</p>
          </section>
        )}

        {!paper && !busy && !error && (
          <section className={`${styles.hints} reveal`} style={{ "--d": "140ms" } as CSSProperties}>
            <article><strong>1 · Supply the paper</strong><p>Paste a DOI or link for an exact match, or a title for a best-effort match.</p></article>
            <article><strong>2 · Review the neighborhood</strong><p>The lab pulls the closest related records from the OpenAlex index.</p></article>
            <article><strong>3 · Seed the studio</strong><p>One click sends the paper and its neighborhood into your invention brief.</p></article>
          </section>
        )}
      </main>
    </div>
  );
}
