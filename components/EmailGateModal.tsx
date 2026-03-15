"use client";

import { useState, FormEvent } from "react";

const FREE_LIMIT = Number(process.env.NEXT_PUBLIC_FREE_CHECK_LIMIT ?? 10);

interface Props {
  onSubmit: (email: string, marketingOptIn: boolean) => void;
}

export default function EmailGateModal({ onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      onSubmit(email.trim().toLowerCase(), marketingOptIn);
    }, 300);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(7, 7, 17, 0.85)", backdropFilter: "blur(8px)" }}
    >
      {/* Card — wider to prevent subtext wrapping */}
      <div
        className="w-full rounded-[24px] border p-8"
        style={{
          maxWidth: "520px",
          backgroundColor: "#0f0f1f",
          borderColor: "#1e1e3a",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <span
            className="text-3xl font-bold font-mono tracking-tight"
            style={{ color: "#e2e8f0" }}
          >
            Verif<span style={{ color: "#a78bfa" }}>AI</span>
          </span>
        </div>

        {/* Headline */}
        <h2
          className="text-xl font-semibold text-center mb-2 tracking-tight"
          style={{ color: "#e2e8f0" }}
        >
          Get {FREE_LIMIT} free fact-checks
        </h2>
        <p
          className="text-sm text-center mb-8 whitespace-nowrap"
          style={{ color: "#64748b", fontFamily: "var(--font-lora), serif" }}
        >
          Enter your email to start verifying news and videos instantly.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email input */}
          <div>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              disabled={loading}
              className="w-full rounded-[12px] px-4 py-3 text-sm outline-none transition-colors"
              style={{
                backgroundColor: "#16162a",
                border: `1px solid ${error ? "#f87171" : "#2e2e50"}`,
                color: "#e2e8f0",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = error ? "#f87171" : "#7c6fe0";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error ? "#f87171" : "#2e2e50";
              }}
            />
            {error && (
              <p className="mt-1.5 text-xs" style={{ color: "#f87171" }}>
                {error}
              </p>
            )}
          </div>

          {/* Marketing opt-in — unchecked by default (GDPR) */}
          <label
            className="flex items-start gap-3 cursor-pointer select-none py-3"
            htmlFor="marketing-optin"
          >
            {/* Custom checkbox */}
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                id="marketing-optin"
                type="checkbox"
                checked={marketingOptIn}
                onChange={(e) => setMarketingOptIn(e.target.checked)}
                className="sr-only"
              />
              <div
                className="w-4 h-4 rounded flex items-center justify-center transition-all"
                style={{
                  backgroundColor: marketingOptIn ? "#7c6fe0" : "transparent",
                  border: `1.5px solid ${marketingOptIn ? "#7c6fe0" : "#2e2e50"}`,
                }}
              >
                {marketingOptIn && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path
                      d="M1 3.5L3.5 6L8 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs leading-relaxed" style={{ color: "#64748b" }}>
              Send me tips on spotting misinformation and occasional product
              updates{" "}
              <span style={{ color: "#3a3a55" }}>(optional)</span>
            </span>
          </label>

          {/* CTA */}
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full rounded-[12px] py-3 text-sm font-semibold transition-opacity"
            style={{
              backgroundColor: "#7c6fe0",
              color: "#ffffff",
              opacity: loading || !email ? 0.6 : 1,
            }}
          >
            {loading ? "Starting…" : "Start fact-checking →"}
          </button>
        </form>

      </div>
    </div>
  );
}
