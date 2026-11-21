import { NextResponse } from "next/server";
import { getOAuthConfig } from "../../../auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    providers: {
      google: Boolean(getOAuthConfig("google")),
      github: Boolean(getOAuthConfig("github")),
      linkedin: Boolean(getOAuthConfig("linkedin")),
      orcid: Boolean(getOAuthConfig("orcid")),
    },
  });
}
