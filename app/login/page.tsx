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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Read the return target once after hydration; it only exists on the client.
    setReturnTo(safeReturnTo(params.get("return_to")));
    if (params.get("mode") === "signup") setMode("signup");
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
