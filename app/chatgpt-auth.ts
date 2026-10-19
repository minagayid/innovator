import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  GOOGLE_SESSION_COOKIE,
  isGoogleEmailAllowed,
  safeRelativeReturnPath,
  verifySignedPayload,
  type GoogleSessionPayload,
} from "./auth/session";

export type ChatGPTUser = {
  displayName: string;
  email: string;
  fullName: string | null;
  provider?: "google" | "chatgpt";
};

const USER_EMAIL_HEADER = "oai-authenticated-user-email";
const USER_FULL_NAME_HEADER = "oai-authenticated-user-full-name";
const USER_FULL_NAME_ENCODING_HEADER = "oai-authenticated-user-full-name-encoding";
const PERCENT_ENCODED_UTF8 = "percent-encoded-utf-8";
const CHATGPT_SIGN_IN_PATH = "/signin-with-chatgpt";
const CHATGPT_SIGN_OUT_PATH = "/signout-with-chatgpt";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  const requestHeaders = await headers();
  // These headers are trustworthy only behind an ingress that authenticates users
  // and strips caller-supplied copies. Never enable for a directly public Cloud Run URL.
  if (process.env.AUTH_TRUST_CHATGPT_HEADERS === "true") {
    const email = requestHeaders.get(USER_EMAIL_HEADER)?.trim().toLowerCase();
    if (email && EMAIL_PATTERN.test(email)) {
      const encodedFullName = requestHeaders.get(USER_FULL_NAME_HEADER);
      const fullName =
        encodedFullName && requestHeaders.get(USER_FULL_NAME_ENCODING_HEADER) === PERCENT_ENCODED_UTF8
          ? safeDecodeURIComponent(encodedFullName)
          : null;
      return { displayName: fullName || email, email, fullName, provider: "chatgpt" };
    }
  }

  const cookieStore = await cookies();
  const session = await verifySignedPayload<GoogleSessionPayload>(
    cookieStore.get(GOOGLE_SESSION_COOKIE)?.value,
    process.env.AUTH_SESSION_SECRET,
  );
  if (!session || session.provider !== "google" || typeof session.sub !== "string" || !session.sub
    || typeof session.email !== "string" || !EMAIL_PATTERN.test(session.email)
    || typeof session.displayName !== "string" || typeof session.expiresAt !== "number"
    || typeof session.issuedAt !== "number" || session.expiresAt <= Date.now()
    || session.issuedAt > Date.now() + 60_000
    || !isGoogleEmailAllowed(session.email, process.env.GOOGLE_ALLOWED_EMAILS)) return null;

  return {
    displayName: session.displayName,
    email: session.email.toLowerCase(),
    fullName: session.displayName,
    provider: "google",
  };
}

export async function requireChatGPTUser(returnTo: string): Promise<ChatGPTUser> {
  const user = await getChatGPTUser();
  if (user) return user;
  redirect(chatGPTSignInPath(returnTo));
}

export function chatGPTSignInPath(returnTo: string): string {
  const safeReturnTo = safeRelativeReturnPath(returnTo);
  if (process.env.AUTH_TRUST_CHATGPT_HEADERS === "true") {
    return CHATGPT_SIGN_IN_PATH + "?return_to=" + encodeURIComponent(safeReturnTo);
  }
  return "/api/auth/google?return_to=" + encodeURIComponent(safeReturnTo);
}

export function chatGPTSignOutPath(returnTo = "/"): string {
  const safeReturnTo = safeRelativeReturnPath(returnTo);
  if (process.env.AUTH_TRUST_CHATGPT_HEADERS === "true") {
    return CHATGPT_SIGN_OUT_PATH + "?return_to=" + encodeURIComponent(safeReturnTo);
  }
  return "/api/auth/logout?return_to=" + encodeURIComponent(safeReturnTo);
}

function safeDecodeURIComponent(value: string): string | null {
  try { return decodeURIComponent(value); } catch { return null; }
}
