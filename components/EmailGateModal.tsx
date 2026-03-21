"use client";

import { useState, FormEvent } from "react";

const IS_FREE_MODE = process.env.NEXT_PUBLIC_MODE !== "paid";

interface Props {
  onSubmit: (email: string, marketingOptIn: boolean) => void;
  onSkip: () => void;
}

export default function EmailGateModal({ onSubmit, onSkip }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) { setError("Please enter a valid email address."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { onSubmit(email.trim().toLowerCase(), marketingOptIn); }, 300);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(6,14,26,0.85)", backdropFilter: "blur(16px)" }}
    >
      {/* Card */}
      <div
        className="animate-scale-in w-full sm:max-w-[460px] rounded-t-[24px] sm:rounded-[14px] relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(32px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(45,212,191,0.08)",
        }}
      >
        {/* Gradient accent top strip */}
        <div
          className="h-[2px] w-full animate-ocean"
          style={{
            background: "linear-gradient(90deg, #2DD4BF, #22D3EE, #60A5FA, #A78BFA, #2DD4BF)",
            backgroundSize: "300% auto",
          }}
        />

        {/* Skip button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-95"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
          aria-label="Skip"
        >
          ✕
        </button>

        <div className="px-7 pt-8 pb-9 sm:px-9 sm:pt-10 sm:pb-11">
          {/* Logo */}
          <div className="text-center mb-7">
            <span className="text-3xl font-bold tracking-tight font-mono">
              <span className="gradient-text">Verif</span>
              <span style={{
                background: "linear-gradient(135deg, #22D3EE, #60A5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>AI</span>
            </span>
          </div>

          {/* Headline */}
          {IS_FREE_MODE ? (
            <>
              <h2 className="text-xl font-bold text-center mb-2.5" style={{ color: "#F0F9FF" }}>
                Free during early access
              </h2>
              <p className="text-sm text-center mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Drop your email to stay in the loop as we improve VerifAI. We never spam, never share your data.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-center mb-2.5" style={{ color: "#F0F9FF" }}>
                Get {Number(process.env.NEXT_PUBLIC_FREE_CHECK_LIMIT ?? 10)} free fact-checks
              </h2>
              <p className="text-sm text-center mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
                Enter your email to start verifying news and videos instantly.
              </p>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                disabled={loading}
                className="w-full rounded-2xl px-4 py-3.5 text-base outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${error ? "#F87171" : "rgba(255,255,255,0.1)"}`,
                  color: "#F0F9FF",
                  caretColor: "#2DD4BF",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = error ? "#F87171" : "rgba(45,212,191,0.5)";
                  e.currentTarget.style.boxShadow = error ? "" : "0 0 0 3px rgba(45,212,191,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = error ? "#F87171" : "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {error && <p className="mt-1.5 text-xs" style={{ color: "#F87171" }}>{error}</p>}
            </div>

            {/* Marketing opt-in */}
            <label className="flex items-start gap-3 cursor-pointer select-none py-1" htmlFor="marketing-optin">
              <div className="relative flex-shrink-0 mt-0.5">
                <input id="marketing-optin" type="checkbox" checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)} className="sr-only" />
                <div
                  className="w-4 h-4 rounded flex items-center justify-center transition-all"
                  style={{
                    background: marketingOptIn ? "linear-gradient(135deg, #2DD4BF, #22D3EE)" : "transparent",
                    border: `1.5px solid ${marketingOptIn ? "#2DD4BF" : "rgba(255,255,255,0.2)"}`,
                  }}
                >
                  {marketingOptIn && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#060E1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                Send me tips on spotting misinformation and occasional product updates{" "}
                <span style={{ color: "rgba(255,255,255,0.2)" }}>(optional)</span>
              </span>
            </label>

            {/* CTA */}
            <button
              type="submit"
              disabled={loading || !email}
              className="relative w-full rounded-2xl py-4 text-sm font-bold text-[#060E1A] overflow-hidden transition-all active:scale-[0.98]"
              style={{
                background: loading || !email
                  ? "rgba(255,255,255,0.08)"
                  : "linear-gradient(135deg, #2DD4BF 0%, #22D3EE 50%, #60A5FA 100%)",
                backgroundSize: "200% auto",
                animation: !loading && email ? "shimmer 3s linear infinite" : "none",
                color: loading || !email ? "rgba(255,255,255,0.3)" : "#060E1A",
                cursor: loading || !email ? "not-allowed" : "pointer",
                boxShadow: !loading && email ? "0 8px 32px rgba(45,212,191,0.3)" : "none",
              }}
            >
              {loading ? "Starting…" : IS_FREE_MODE ? "Start fact-checking for free →" : "Start fact-checking →"}
            </button>
          </form>

          <p className="mt-5 text-xs text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
            🔒 We never share your email or sell your data.
          </p>
        </div>
      </div>
    </div>
  );
}
