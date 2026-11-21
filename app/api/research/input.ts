export const MAX_RESEARCH_QUERY = 180;
export function parseResearchQuery(value: unknown): { ok: true; query: string } | { ok: false; error: string } { const query = typeof value === "string" ? value.replace(/[\u0000-\u001f]/g, " ").trim() : ""; if (!query) return { ok: false, error: "A research query is required." }; if (query.length > MAX_RESEARCH_QUERY) return { ok: false, error: "Research queries must be 180 characters or fewer." }; return { ok: true, query }; }


export type ResearchSourceItem = {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  venue: string;
  url: string;
  source: "OpenAlex" | "Crossref";
  evidence: "sourced";
};

type SourceOutcome = PromiseSettledResult<ResearchSourceItem[]>;

export function buildResearchResponse(query: string, alex: SourceOutcome, cref: SourceOutcome) {
  const results = [
    ...(alex.status === "fulfilled" ? alex.value : []),
    ...(cref.status === "fulfilled" ? cref.value : []),
  ].filter((item, index, all) =>
    all.findIndex((other) => other.title.toLowerCase() === item.title.toLowerCase()) === index
  ).slice(0, 10);

  const sourceStatus = {
    OpenAlex: { status: alex.status === "fulfilled" ? "ok" : "error", count: alex.status === "fulfilled" ? alex.value.length : 0 },
    Crossref: { status: cref.status === "fulfilled" ? "ok" : "error", count: cref.status === "fulfilled" ? cref.value.length : 0 },
  } as const;
  const errors = [
    ...(alex.status === "rejected" ? ["OpenAlex unavailable (network, timeout, or HTTP error)."] : []),
    ...(cref.status === "rejected" ? ["Crossref unavailable (network, timeout, or HTTP error)."] : []),
  ];
  return {
    query,
    results,
    sources: ["OpenAlex", "Crossref"],
    sourceStatus,
    errors,
    evidenceBoundary: "These are sourced records for research navigation, not peer-review, truth, novelty, or patentability determinations.",
  };
}
