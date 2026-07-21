import { NextResponse } from "next/server";
import { getChatGPTUser } from "../../chatgpt-auth";
import { upsertUser } from "../../../db";

export const dynamic = "force-dynamic";

export async function GET() {
  const identity = await getChatGPTUser();
  if (!identity) return NextResponse.json({ user: null });
  const user = await upsertUser(identity.email, identity.displayName);
  return NextResponse.json({ user: { id: user.id, email: user.email, displayName: user.displayName } });
}
