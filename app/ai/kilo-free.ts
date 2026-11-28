import { parseHuggingFaceChatCompletion, readBoundedProviderResponse } from "../api/disclosure/input.ts";

// A specific no-cost model; do not allow request data to choose a provider or URL.
export const KILO_FREE_MODEL = "baidu/ernie-5.5-flash-preview:free";
const ENDPOINT = "https://ai-gateway.kilo.ai/api/v1/chat/completions";

export async function callKiloFree(system: string, prompt: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: KILO_FREE_MODEL, max_tokens: 1200, messages: [{ role: "system", content: system }, { role: "user", content: prompt }] }),
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return null;
    return parseHuggingFaceChatCompletion(await readBoundedProviderResponse(response));
  } catch { return null; }
}
