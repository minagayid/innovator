import type { StructuredDisclosure } from "./api/disclosure/input";

export const PATENTSCOPE_SEARCH_URL = "https://patentscope.wipo.int/search/en/result.jsf";

function cleanTerm(value: string): string {
  return value.replace(/[\r\n]+/g, " ").replace(/[{}()[\]":]/g, " ").replace(/\s+/g, " ").trim();
}

export function buildPatentscopeQuery(disclosure: Pick<StructuredDisclosure, "title" | "keywords" | "technicalField">): string {
  const terms = [disclosure.title, disclosure.technicalField, ...disclosure.keywords]
    .map(cleanTerm)
    .filter(Boolean)
    .slice(0, 8);
  return terms.join(" ").slice(0, 500);
}

export function buildPatentscopeUrl(disclosure: Pick<StructuredDisclosure, "title" | "keywords" | "technicalField">): string {
  const url = new URL(PATENTSCOPE_SEARCH_URL);
  url.searchParams.set("query", buildPatentscopeQuery(disclosure));
  return url.toString();
}
