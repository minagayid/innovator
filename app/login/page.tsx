"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Mode = "login" | "signup";
type Strength = { score: number; label: string };

const STRENGTH_LABELS = ["Too weak", "Getting there", "Okay", "Strong", "Excellent"];

function safeReturnTo(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  return value;
}

function strengthOf(password: string): Strength {
  let score = 0;
  if (password.length >= 10) score += 1;
  if (password.length >= 14) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  score = Math.min(score, 4);
  return { score, label: password ? STRENGTH_LABELS[score] : "" };
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [returnTo, setReturnTo] = useState("/");
  const [providers, setProviders] = useState<{ google: boolean; github: boolean; linkedin: boolean } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Read the return target once after hydration; it only exists on the client.
    setReturnTo(safeReturnTo(params.get("return_to")));
    if (params.get("mode") === "signup") setMode("signup");
    fetch("/api/auth/providers")
      .then((response) => response.ok ? response.json() : null)
      .then((payload: { providers?: { google: boolean; github: boolean; linkedin: boolean } } | null) => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Provider availability is known only after the client fetch.
        setProviders(payload?.providers ?? { google: true, github: true, linkedin: true });
      })
      .catch(() => setProviders({ google: true, github: true, linkedin: true }));
  }, []);

  const strength = useMemo(() => strengthOf(password), [password]);

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/email/login" : "/api/auth/email/signup";
      const payload: Record<string, string> = { email, password, returnTo };
      if (mode === "signup" && displayName.trim()) payload.displayName = displayName.trim();
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: { error?: string; returnTo?: string } = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setBusy(false);
        return;
      }
      setDone(true);
      window.setTimeout(() => window.location.assign(safeReturnTo(data.returnTo ?? null)), 450);
    } catch {
      setError("Network trouble. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <main className={styles.scene}>
      <div className={styles.aurora} aria-hidden="true">
        <span className={styles.blobOne} />
        <span className={styles.blobTwo} />
        <span className={styles.blobThree} />
        <span className={styles.grid} />
      </div>

      <section className={`${styles.card} ${done ? styles.cardDone : ""}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>In</span>
          <span>Innovator <b>Studio</b></span>
        </Link>

        <div className={styles.tabs} role="tablist" aria-label="Authentication mode">
          <span className={`${styles.tabInk} ${mode === "signup" ? styles.tabInkRight : ""}`} aria-hidden="true" />
          <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? styles.tabActive : ""} onClick={() => switchMode("login")}>Sign in</button>
          <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? styles.tabActive : ""} onClick={() => switchMode("signup")}>Create account</button>
        </div>

        <header className={styles.heading}>
          <h1>{mode === "login" ? "Welcome back, inventor" : "Start your studio"}</h1>
          <p>{mode === "login"
            ? "Sign in to pick up your workspace, drafts, and validation runs."
            : "One account for invention candidates, research trails, and peer-review runs."}</p>
        </header>

        <div className={styles.oauth} aria-label="Social sign-in">
          <a
            className={`${styles.oauthBtn} ${providers && !providers.google ? styles.oauthOff : ""}`}
            href={!providers || providers.google ? `/api/auth/google?return_to=${encodeURIComponent(returnTo)}` : undefined}
            aria-disabled={providers ? !providers.google : undefined}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81Z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.87-3c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.27 14.27A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.27v-3.1H1.29a12 12 0 0 0 0 10.74l3.98-3.1Z"/><path fill="#EA4335" d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.63l3.98 3.1C6.22 6.88 8.87 4.77 12 4.77Z"/></svg>
            <span>Continue with Google</span>
            {providers && !providers.google && <em className={styles.soon}>setup pending</em>}
          </a>
          <a
            className={`${styles.oauthBtn} ${providers && !providers.github ? styles.oauthOff : ""}`}
            href={!providers || providers.github ? `/api/auth/github?return_to=${encodeURIComponent(returnTo)}` : undefined}
            aria-disabled={providers ? !providers.github : undefined}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z"/></svg>
            <span>Continue with GitHub</span>
            {providers && !providers.github && <em className={styles.soon}>setup pending</em>}
          </a>
          <a
            className={`${styles.oauthBtn} ${providers && !providers.linkedin ? styles.oauthOff : ""}`}
            href={!providers || providers.linkedin ? `/api/auth/linkedin?return_to=${encodeURIComponent(returnTo)}` : undefined}
            aria-disabled={providers ? !providers.linkedin : undefined}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#0A66C2" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45Z"/></svg>
            <span>Continue with LinkedIn</span>
            {providers && !providers.linkedin && <em className={styles.soon}>setup pending</em>}
          </a>
        </div>

        <div className={styles.divider} role="separator"><span>or continue with email</span></div>

        <form className={`${styles.form} ${error ? styles.formError : ""}`} onSubmit={submit} noValidate>
          <div className={`${styles.slide} ${mode === "signup" ? styles.slideOpen : ""}`}>
            <label className={styles.field}>
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder=" "
                autoComplete="name"
                tabIndex={mode === "signup" ? 0 : -1}
                maxLength={80}
              />
              <span>Name</span>
            </label>
          </div>

          <label className={styles.field}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder=" "
              autoComplete="email"
              required
              maxLength={254}
            />
            <span>Email</span>
          </label>

          <label className={styles.field}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder=" "
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={mode === "signup" ? 10 : undefined}
              maxLength={128}
            />
            <span>Password</span>
            <button
              type="button"
              className={styles.peek}
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </label>

          <div className={`${styles.slide} ${mode === "signup" ? styles.slideOpen : ""}`}>
            <div className={styles.meter} aria-hidden="true">
              {[0, 1, 2, 3].map((index) => (
                <i key={index} className={index < strength.score ? styles.meterFilled : ""} data-score={strength.score} />
              ))}
            </div>
            <p className={styles.hint} aria-live="polite">
              {password ? strength.label : "At least 10 characters with a letter and a number."}
            </p>
          </div>

          {error && <p className={styles.error} role="alert">{error}</p>}
          {done && <p className={styles.success} role="status">You&apos;re in. Opening your studio…</p>}

          <button className={styles.submit} type="submit" disabled={busy || done}>
            <span className={styles.submitLabel}>
              {busy ? "Working…" : done ? "Signed in" : mode === "login" ? "Sign in" : "Create account"}
            </span>
            <span className={styles.submitGlow} aria-hidden="true" />
          </button>
        </form>

        <div className={styles.footer}>
          <p>{mode === "login" ? "New here? " : "Already have an account? "}
            <button type="button" onClick={() => switchMode(mode === "login" ? "signup" : "login")}>
              {mode === "login" ? "Create an account" : "Sign in instead"}
            </button>
          </p>
          <p className={styles.legal}>Accounts keep workspaces private by default. Candidates stay hypotheses until tested.</p>
        </div>
      </section>
    </main>
  );
}
