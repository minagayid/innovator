import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

const UA = { Accept: "application/json", "User-Agent": "Innovator research studio (mailto:research@innovator.local)" };

function clean(value: unknown, max = 300): string {
  return typeof value === "string" ? value.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max) : "";
}

function reconstructAbstract(index: unknown, max = 1400): string {
  if (!index || typeof index !== "object" || Array.isArray(index)) return "";
  const positions: Array<[number, string]> = [];
  for (const [word, places] of Object.entries(index as Record<string, unknown>)) {
    if (!Array.isArray(places)) continue;
    for (const place of places) if (typeof place === "number") positions.push([place, word]);
  }
  positions.sort((a, b) => a[0] - b[0]);
  const text = positions.map(([, word]) => word).join(" ");
  return text.slice(0, max);
}

function toPaper(row: Record<string, unknown>, withAbstract: boolean): ScholarPaper | null {
  const title = clean(row.display_name ?? row.title, 300);
  const id = clean(row.id, 300);
  if (!title || !id) return null;
  const location = row.primary_location as Record<string, unknown> | null;
  const source = location?.source as Record<string, unknown> | null;
  const authorships = Array.isArray(row.authorships) ? row.authorships : [];
  const authors = authorships.slice(0, 5).map((item) => {
    const record = item as Record<string, unknown>;
    return clean(record.author && (record.author as Record<string, unknown>).display_name, 120);
  }).filter(Boolean);
  const doiValue = clean(row.doi, 200);
  const oa = row.open_access as Record<string, unknown> | null;
  const url = clean(oa?.oa_url || location?.landing_page_url || doiValue || id, 500);
  return {
    id,
    title,
    authors,
    year: typeof row.publication_year === "number" ? row.publication_year : null,
    venue: clean(source?.display_name || "Indexed record", 160),
    url,
    doi: doiValue ? doiValue.replace("https://doi.org/", "") : null,
    citedBy: typeof row.cited_by_count === "number" ? row.cited_by_count : null,
    abstract: withAbstract ? reconstructAbstract(row.abstract_inverted_index) : "",
  };
}

async function fetchJson(url: URL, attempt = 0): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(url, { headers: UA, signal: AbortSignal.timeout(9000) });
    if (!response.ok) {
      console.log("scholar fetch status", response.status, url.toString().slice(0, 140));
      if ((response.status === 429 || response.status >= 500) && attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1200 * (attempt + 1)));
        return fetchJson(url, attempt + 1);
      }
      return null;
    }
    return await response.json() as Record<string, unknown>;
  } catch (cause) {
    console.log("scholar fetch error", cause instanceof Error ? cause.message : String(cause), url.toString().slice(0, 140));
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 1200 * (attempt + 1)));
      return fetchJson(url, attempt + 1);
    }
    return null;
  }
}

function extractRelatedIds(row: Record<string, unknown>): string[] {
  const related = Array.isArray(row.related_works) ? row.related_works : [];
  return related.slice(0, 8).map((item) => clean(item, 60).replace("https://openalex.org/", "")).filter(Boolean);
}

async function resolvePaper(input: string): Promise<{ paper: ScholarPaper; relatedIds: string[] } | null> {
  const doiMatch = input.match(/10\.\d{4,9}\/[^\s"<>]+/i);
  const select = "id,display_name,publication_year,authorships,primary_location,abstract_inverted_index,related_works,doi,cited_by_count,open_access";
  if (doiMatch) {
    const doi = doiMatch[0].replace(/[.,;)\]]+$/, "");
    const url = new URL(`https://api.openalex.org/works/doi:${encodeURIComponent(doi)}`);
    url.searchParams.set("select", select);
    const payload = await fetchJson(url);
    const paper = payload ? toPaper(payload, true) : null;
    if (paper) return { paper, relatedIds: extractRelatedIds(payload!) };
  }
  const url = new URL("https://api.openalex.org/works");
  url.searchParams.set("search", input);
  url.searchParams.set("per-page", "3");
  url.searchParams.set("select", select);
  const payload = await fetchJson(url);
  console.log('scholar related fetch', url.toString().slice(0,200), 'payload?', !!payload);
  const results = Array.isArray(payload?.results) ? payload.results : [];
  for (const row of results) {
    const paper = toPaper(row as Record<string, unknown>, true);
    if (paper) return { paper, relatedIds: extractRelatedIds(row as Record<string, unknown>) };
  }
  return null;
}

async function fetchRelated(ids: string[]): Promise<ScholarPaper[]> {
  if (ids.length === 0) return [];
  const url = new URL("https://api.openalex.org/works");
  url.searchParams.set("filter", `ids.openalex:${ids.join("|")}`);
  url.searchParams.set("per-page", "8");
  url.searchParams.set("select", "id,display_name,publication_year,authorships,primary_location,doi,cited_by_count,open_access");
  const payload = await fetchJson(url);
  console.log("scholar related fetch", "payload?", Boolean(payload));
  const results = Array.isArray(payload?.results) ? payload.results : [];
  return results.flatMap((row) => {
    const paper = toPaper(row as Record<string, unknown>, false);
    return paper ? [paper] : [];
  });
}

async function crossrefFallback(title: string, excludeDoi: string | null): Promise<ScholarPaper[]> {
  const terms = title.split(/\s+/).filter((word) => word.length > 3).slice(0, 6).join(" ");
  if (!terms) return [];
  const url = new URL("https://api.crossref.org/works");
  url.searchParams.set("query.bibliographic", terms);
  url.searchParams.set("rows", "8");
  url.searchParams.set("select", "DOI,title,author,published,container-title,URL");
  const payload = await fetchJson(url);
  const items = Array.isArray((payload?.message as Record<string, unknown> | undefined)?.items) ? ((payload!.message as Record<string, unknown>).items as Array<Record<string, unknown>>) : [];
  return items.flatMap((row) => {
    const titles = Array.isArray(row.title) ? row.title : [];
    const titleValue = clean(titles[0], 300);
    const doi = clean(row.DOI, 200);
    if (!titleValue || !doi || doi.toLowerCase() === (excludeDoi ?? "").toLowerCase()) return [];
    const authors = Array.isArray(row.author) ? row.author.slice(0, 5).map((item) => {
      const author = item as Record<string, unknown>;
      return clean(`${author.given || ""} ${author.family || ""}`, 120);
    }).filter(Boolean) : [];
    const date = row.published as Record<string, unknown> | undefined;
    const parts = Array.isArray(date?.["date-parts"]) ? date?.["date-parts"] as unknown[] : [];
    const year = Array.isArray(parts[0]) && typeof parts[0][0] === "number" ? parts[0][0] : null;
    return [{
      id: `doi:${doi}`,
      title: titleValue,
      authors,
      year,
      venue: clean(Array.isArray(row["container-title"]) ? row["container-title"][0] : "Crossref record", 160),
      url: clean(row.URL || `https://doi.org/${doi}`, 500),
      doi,
      citedBy: null,
      abstract: "",
    }];
  });
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("paper") ?? "";
  const input = clean(raw, 300);
  if (input.length < 3) {
    return NextResponse.json({ error: "Give me a DOI, a paper URL, or at least a few words of the title." }, { status: 400 });
  }
  const resolved = await resolvePaper(input);
  if (!resolved) {
    return NextResponse.json({ error: "No indexed record matched that paper. Try the exact title or DOI." }, { status: 404 });
  }
  const { paper, relatedIds } = resolved;
  let related = await fetchRelated(relatedIds);
  if (related.length === 0) {
    related = await crossrefFallback(paper.title, paper.doi);
  }
  return NextResponse.json({
    paper,
    related,
    source: "OpenAlex",
    evidenceBoundary: "These are sourced index records for research navigation - not peer review, truth, novelty, or patentability determinations.",
  });
}
