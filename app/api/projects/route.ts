import { NextRequest, NextResponse } from "next/server";
import { getChatGPTUser } from "../../chatgpt-auth";
import { createProject, getDatabase, listProjects, upsertUser } from "../../../db";
import { parseProjectBody } from "./input";
import { readBoundedBody, RequestBodyTooLargeError } from "../disclosure/input";
import { runProjectCreationIfQuotaAllows } from "../../../db/project-quota.ts";
import { parseProjectListOptions } from "../../../db/project-pagination.ts";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const options = parseProjectListOptions(request.nextUrl.searchParams);
  if (!options.ok) return NextResponse.json({ error: options.error }, { status: 400 });
  const identity = await getChatGPTUser();
  const user = identity ? await upsertUser(identity.email, identity.displayName) : null;
  const page = await listProjects(user?.id, options.value);
  return NextResponse.json({
    projects: page.projects,
    nextCursor: page.nextCursor,
    hasMore: page.nextCursor !== null,
    authenticated: Boolean(user),
  });
}

export async function POST(request: NextRequest) {
  const identity = await getChatGPTUser();
  if (!identity) return NextResponse.json({ error: "Sign in to create a project.", signIn: "/signin-with-chatgpt?return_to=%2F" }, { status: 401 });
  let bodyText: string;
  try {
    bodyText = await readBoundedBody(request);
  } catch (error) {
    const tooLarge = error instanceof RequestBodyTooLargeError;
    return NextResponse.json(
      { error: tooLarge ? "Request body is too large." : "Request body could not be read." },
      { status: tooLarge ? 413 : 400 },
    );
  }
  const parsed = parseProjectBody(bodyText);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  try {
    const user = await upsertUser(identity.email, identity.displayName);
    const result = await runProjectCreationIfQuotaAllows(
      getDatabase(),
      user.id,
      () => createProject(user, parsed.value),
    );
    if (result.status === "denied") {
      return NextResponse.json(
        { error: "Project creation limit reached. Try again after the quota window resets." },
        { status: 429 },
      );
    }
    if (result.status === "unavailable") {
      return NextResponse.json({ error: "Project storage is temporarily unavailable." }, { status: 503 });
    }
    return NextResponse.json({ project: result.value }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Project storage is temporarily unavailable." }, { status: 503 });
  }
}
