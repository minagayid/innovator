import { NextRequest, NextResponse } from "next/server";
import { getChatGPTUser } from "../../chatgpt-auth";
import { createProject, listProjects, upsertUser } from "../../../db";

export const dynamic = "force-dynamic";

export async function GET() {
  const identity = await getChatGPTUser();
  const user = identity ? await upsertUser(identity.email, identity.displayName) : null;
  const projects = await listProjects(user?.id);
  return NextResponse.json({ projects, authenticated: Boolean(user) });
}

export async function POST(request: NextRequest) {
  const identity = await getChatGPTUser();
  if (!identity) return NextResponse.json({ error: "Sign in to create a project.", signIn: "/signin-with-chatgpt?return_to=%2F" }, { status: 401 });
  const body = await request.json() as { title?: string; summary?: string; category?: string; visibility?: string; document?: Record<string, unknown> };
  if (!body.title?.trim() || !body.summary?.trim()) return NextResponse.json({ error: "Title and summary are required." }, { status: 400 });
  const user = await upsertUser(identity.email, identity.displayName);
  const project = await createProject(user, {
    title: body.title.trim(), summary: body.summary.trim(), category: body.category?.trim() || "Uncategorized",
    visibility: body.visibility, document: body.document || {},
  });
  return NextResponse.json({ project }, { status: 201 });
}
