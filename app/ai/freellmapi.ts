import { readBoundedProviderResponse } from "../api/disclosure/input.ts";

type Message = { role: "system" | "user"; content: string };

export function freeLlmSelected(): boolean {
  return Boolean(process.env.FREELLMAPI_BASE_URL || process.env.FREELLMAPI_API_KEY);
}

// The URL and token are deployment settings, never values accepted from a user request.
export function freeLlmConfig(): { endpoint: string; token: string; model: string } | null {
  const rawUrl = process.env.FREELLMAPI_BASE_URL;
  const token = process.env.FREELLMAPI_API_KEY;
  const model = process.env.FREELLMAPI_MODEL || "auto";
  if (!rawUrl || !token || !/^[A-Za-z0-9][A-Za-z0-9._/:+-]{0,200}$/.test(model)) return null;
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return null;
    url.pathname = `${url.pathname.replace(/\/+$/, "")}/chat/completions`;
    return { endpoint: url.toString(), token, model };
  } catch { return null; }
}

export async function freeLlmChat(messages: Message[], maxTokens: number): Promise<{ text: string; model: string } | null> {
  const config = freeLlmConfig();
  if (!config) return null;
  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.token}` },
      body: JSON.stringify({ model: config.model, max_tokens: maxTokens, messages }),
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return null;
    const payload = JSON.parse(await readBoundedProviderResponse(response)) as { choices?: Array<{ message?: { content?: unknown } }> };
    const text = payload.choices?.[0]?.message?.content;
    return typeof text === "string" ? { text, model: config.model } : null;
  } catch { return null; }
}
