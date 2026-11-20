import { NextRequest, NextResponse } from "next/server";
import { buildManufacturingHandoff, parseManufacturingBody } from "./input";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let text: string;
  try { text = await request.text(); } catch { return NextResponse.json({ error: "Manufacturing handoff body could not be read." }, { status: 400 }); }
  const parsed = parseManufacturingBody(text);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  return NextResponse.json(buildManufacturingHandoff(parsed.value));
}
