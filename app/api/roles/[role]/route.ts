import { NextRequest, NextResponse } from "next/server";
import { fallbackRole, isRole, runRoleProvider, type RoleName } from "../../../ai/roles";
import { authenticatedDisclosureCallerHash, runDisclosureProviderIfQuotaAllows, trustedDisclosureCallerHash } from "../../../../db/disclosure-quota.ts";
import { getDatabase } from "../../../../db/index.ts";
import { getChatGPTUser } from "../../../chatgpt-auth";
import { freeLlmSelected } from "../../../ai/freellmapi.ts";
export const dynamic = "force-dynamic";
const MAX_BRIEF_BYTES = 12000;
export async function POST(request: NextRequest, context: { params: Promise<{ role: string }> }) {
  const { role: rawRole } = await context.params;
  if (!isRole(rawRole)) return NextResponse.json({ error: "Unknown role." }, { status: 404 });

  let body: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > MAX_BRIEF_BYTES) return NextResponse.json({ error: "Role brief is too large." }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Role body must be valid JSON." }, { status: 400 });
  }
  const brief = body && typeof body === "object" && !Array.isArray(body) && typeof (body as Record<string, unknown>).brief === "string"
    ? (body as Record<string, unknown>).brief as string
    : "";
  if (!brief.trim()) return NextResponse.json({ error: "A role brief is required." }, { status: 400 });

  // Paid role calls use the same verified identity and D1 quota boundary as disclosure.
  // If any control is missing, return the deterministic scaffold instead of spending anonymously.
  if (process.env.OPENAI_API_KEY || process.env.HF_TOKEN || freeLlmSelected()) {
    const identity = await getChatGPTUser();
    const callerHash = identity
      ? await authenticatedDisclosureCallerHash(identity.email, process.env.DISCLOSURE_RATE_LIMIT_HMAC_SECRET)
      : await trustedDisclosureCallerHash(request, process.env.DISCLOSURE_TRUST_CF_EDGE, process.env.DISCLOSURE_RATE_LIMIT_HMAC_SECRET);
    const gated = await runDisclosureProviderIfQuotaAllows(
      callerHash,
      getDatabase,
      () => runRoleProvider(rawRole as RoleName, brief),
    );
    if (gated.allowed && gated.value) return NextResponse.json(gated.value);
  }

  return NextResponse.json(fallbackRole(rawRole as RoleName, brief));
}

