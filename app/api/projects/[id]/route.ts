import { NextResponse } from "next/server";
import { getChatGPTUser } from "../../../chatgpt-auth";
import { getProjectStore, getProjectVisibleToUser, upsertUser } from "../../../../db";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getChatGPTUser();

  try {
    const user = identity ? await upsertUser(identity.email, identity.displayName) : null;
    const { id } = await context.params;
    const project = await getProjectVisibleToUser(user?.id, id);
    if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

    const object = await getProjectStore().get(project.documentKey);
    if (!object) return NextResponse.json({ error: "Saved project document is unavailable." }, { status: 503 });
    const document = await object.json<Record<string, unknown>>();
    if (!document || typeof document !== "object" || Array.isArray(document)) {
      return NextResponse.json({ error: "Saved project document is invalid." }, { status: 503 });
    }
    return NextResponse.json({ document });
  } catch {
    return NextResponse.json({ error: "Project storage is temporarily unavailable." }, { status: 503 });
  }
}
