import assert from "node:assert/strict";
import test from "node:test";
import { buildPatentscopeQuery, buildPatentscopeUrl } from "../app/patentscope.ts";

test("PATENTSCOPE query uses bounded candidate terms and removes query syntax", () => {
  const query = buildPatentscopeQuery({
    title: "Adaptive {water} filter",
    technicalField: "Water treatment",
    keywords: ["membrane", "remote clinics", "claims:unsafe", "\nsecond line"],
  });
  assert.equal(query, "Adaptive water filter Water treatment membrane remote clinics claims unsafe second line");
  assert.ok(query.length <= 500);
});

test("PATENTSCOPE URL targets the public WIPO search interface", () => {
  const url = new URL(buildPatentscopeUrl({ title: "Solar crop dryer", technicalField: "Agriculture", keywords: ["thermal storage"] }));
  assert.equal(url.origin, "https://patentscope.wipo.int");
  assert.equal(url.pathname, "/search/en/result.jsf");
  assert.equal(url.searchParams.get("query"), "Solar crop dryer Agriculture thermal storage");
});
