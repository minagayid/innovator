import { NextRequest, NextResponse } from "next/server";

const demo = {
  title: "Field-Repairable Modular Prosthetic Hand",
  abstract: "A body-powered prosthetic hand designed around locally printable, independently replaceable modules.",
  problem: "Affordable prostheses are difficult to fit, adapt, and repair in resource-limited clinics.",
  solution: "A printable common chassis accepts task-specific grip modules and a tool-free cable-tension cartridge.",
  technicalField: "Assistive devices; upper-limb prosthetics; body-powered mechanisms",
  noveltyHypothesis: "Possible novelty may lie in the combination of the standardized grip interface and removable tension cartridge.",
  components: ["palm chassis", "grip modules", "cable cartridge", "adaptive socket"],
  keywords: ["body-powered prosthetic", "modular hand", "field repair", "cable tension cartridge"],
  missingQuestions: ["How is tension retained under repeated loading?", "What grip forces are targeted?", "Which parts contact skin?"],
  publicSummary: "An open, repairable prosthetic-hand platform intended for local fabrication and maintenance.",
  mode: "demo",
};

export async function POST(request: NextRequest) {
  const { notes, category } = await request.json() as { notes?: string; category?: string };
  if (!notes?.trim()) return NextResponse.json({ error: "Notes are required." }, { status: 400 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json(demo);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.6",
      input: [
        { role: "system", content: "You structure rough physical-invention notes. Never claim patentability. Use phrases such as possible novelty. Return concise JSON only with title, abstract, problem, solution, technicalField, noveltyHypothesis, components, keywords, missingQuestions, and publicSummary." },
        { role: "user", content: `Category: ${category || "unspecified"}\nNotes: ${notes}` },
      ],
      text: { format: { type: "json_object" } },
    }),
  });
  if (!response.ok) return NextResponse.json({ ...demo, mode: "demo-fallback" });
  const payload = await response.json() as { output_text?: string };
  try { return NextResponse.json({ ...JSON.parse(payload.output_text || "{}"), mode: "live" }); }
  catch { return NextResponse.json({ ...demo, mode: "demo-fallback" }); }
}
