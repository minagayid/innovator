import assert from "node:assert/strict";
import test from "node:test";
import { buildInventionMediaPrompts } from "../app/media-prompts.ts";

test("media briefs preserve the invention mechanism while separating visual output from evidence", () => {
  const prompts = buildInventionMediaPrompts({
    title: "Adaptive clinic filter",
    problem: "Remote clinics lack reliable clean water.",
    solution: "A staged filter changes flow when pressure rises.",
    technicalField: "Water treatment",
    components: ["membrane", "pressure sensor"],
  });
  assert.match(prompts.conceptImage, /Adaptive clinic filter/);
  assert.match(prompts.prototypeVideo, /A staged filter changes flow/);
  assert.match(prompts.validationDiagram, /negative controls/);
  assert.match(prompts.prototypeVideo, /Do not imply proven performance/);
});
