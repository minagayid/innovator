import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isGoogleEmailAllowed, safeRelativeReturnPath, sessionCookieName, verifySignedPayload, type AuthProvider, type AuthSessionPayload } from "./auth/session";
export type ChatGPTUser = { displayName: string; email: string; fullName: string | null; provider?: AuthProvider | "chatgpt" };
const USER_EMAIL_HEADER = "oai-authenticated-user-email";
const USER_FULL_NAME_HEADER = "oai-authenticated-user-full-name";
const USER_FULL_NAME_ENCODING_HEADER = "oai-authenticated-user-full-name-encoding";
const PERCENT_ENCODED_UTF8 = "percent-encoded-utf-8";
const CHATGPT_SIGN_IN_PATH = "/signin-with-chatgpt";
const CHATGPT_SIGN_OUT_PATH = "/signout-with-chatgpt";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PROVIDERS: AuthProvider[] = ["google", "github", "linkedin", "orcid"];
function safeDecodeURIComponent(value: string): string | null { try { return decodeURIComponent(value); } catch { return null; } }
function validSession(session: AuthSessionPayload | null): session is AuthSessionPayload { return Boolean(session && PROVIDERS.includes(session.provider) && typeof session.sub === "string" && session.sub && typeof session.email === "string" && EMAIL_PATTERN.test(session.email) && typeof session.displayName === "string" && typeof session.expiresAt === "number" && session.expiresAt > Date.now() && typeof session.issuedAt === "number" && session.issuedAt <= Date.now() + 60000 && (session.provider !== "google" || isGoogleEmailAllowed(session.email, process.env.GOOGLE_ALLOWED_EMAILS))); }
export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  const requestHeaders = await headers();
  if (process.env.AUTH_TRUST_CHATGPT_HEADERS === "true") { const email = requestHeaders.get(USER_EMAIL_HEADER)?.trim().toLowerCase(); if (email && EMAIL_PATTERN.test(email)) { const encoded = requestHeaders.get(USER_FULL_NAME_HEADER); const fullName = encoded && requestHeaders.get(USER_FULL_NAME_ENCODING_HEADER) === PERCENT_ENCODED_UTF8 ? safeDecodeURIComponent(encoded) : null; return { displayName: fullName || email, email, fullName, provider: "chatgpt" }; } }
  const cookieStore = await cookies();
  for (const provider of PROVIDERS) { const session = await verifySignedPayload<AuthSessionPayload>(cookieStore.get(sessionCookieName(provider))?.value, process.env.AUTH_SESSION_SECRET); if (validSession(session)) return { displayName: session.displayName, email: session.email.toLowerCase(), fullName: session.displayName, provider: session.provider }; }
  return null;
}
export async function requireChatGPTUser(returnTo: string): Promise<ChatGPTUser> { const user = await getChatGPTUser(); if (user) return user; redirect(chatGPTSignInPath(returnTo)); }
export function chatGPTSignInPath(returnTo: string): string { const safe = safeRelativeReturnPath(returnTo); if (process.env.AUTH_TRUST_CHATGPT_HEADERS === "true") return CHATGPT_SIGN_IN_PATH + "?return_to=" + encodeURIComponent(safe); return "/api/auth/google?return_to=" + encodeURIComponent(safe); }
export function chatGPTSignOutPath(returnTo = "/"): string { const safe = safeRelativeReturnPath(returnTo); if (process.env.AUTH_TRUST_CHATGPT_HEADERS === "true") return CHATGPT_SIGN_OUT_PATH + "?return_to=" + encodeURIComponent(safe); return "/api/auth/logout?return_to=" + encodeURIComponent(safe); }
