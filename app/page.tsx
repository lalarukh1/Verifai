"use client";

import { useState, useEffect } from "react";
import UrlInput from "@/components/UrlInput";
import LoadingState from "@/components/LoadingState";
import ResultCard from "@/components/ResultCard";
import InfoModal from "@/components/InfoModal";
import EmailGateModal from "@/components/EmailGateModal";
import PaywallModal from "@/components/PaywallModal";
import { AnalysisResult, CheckResponse } from "@/lib/types";
import { EXAMPLES } from "@/lib/examples";

type Stage = "input" | "loading" | "result";

const LS_EMAIL_KEY = "verifai_email";
const LS_MARKETING_KEY = "verifai_marketing_optin";

export default function Home() {
  const [stage, setStage] = useState<Stage>("input");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  // Prevents email gate flashing on refresh before localStorage is read
  const [mounted, setMounted] = useState(false);

  // On mount: restore saved email from localStorage, then show UI
  useEffect(() => {
    const saved = localStorage.getItem(LS_EMAIL_KEY);
    if (saved) setEmail(saved);
    setMounted(true);
  }, []);

  function handleEmailSubmit(submittedEmail: string, marketingOptIn: boolean) {
    localStorage.setItem(LS_EMAIL_KEY, submittedEmail);
    localStorage.setItem(LS_MARKETING_KEY, String(marketingOptIn));
    setEmail(submittedEmail);

    // Persist to Redis so signups are visible in Upstash console
    // Fire-and-forget — don't block the UI on this
    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: submittedEmail, marketingOptIn }),
    }).catch(() => {/* silent — non-critical */});
  }

  async function handleSubmit(url: string) {
    if (!email) return; // shouldn't happen — gate modal blocks this
    setError(null);
    setStage("loading");

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email }),
      });

      const data = (await res.json()) as CheckResponse;

      if (data.paywalled) {
        setShowPaywall(true);
        setStage("input");
        return;
      }

      if (!data.success || !data.result) {
        setError(data.error ?? "An unexpected error occurred.");
        setStage("input");
        return;
      }

      setResult(data.result);
      setStage("result");
    } catch {
      setError("Failed to connect to the server. Please try again.");
      setStage("input");
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setStage("input");
  }

  function handleExample(index: number) {
    const ex = EXAMPLES[index];
    if (!ex) return;
    setError(null);
    setResult(ex.result);
    setStage("result");
  }

  return (
    <main
      className={`min-h-screen flex flex-col items-center px-4 py-12 ${stage === "result" ? "justify-start" : "justify-center"}`}
      style={{ backgroundColor: "#070711" }}
    >
      <div className="w-full max-w-[760px]">
        {/* Header — hidden on results page (ResultCard has its own) */}
        {stage !== "result" && (
          <div className="text-center mb-10">
            <h1
              className="text-5xl font-bold mb-4 tracking-tight font-mono"
              style={{ color: "#e2e8f0" }}
            >
              Verif<span style={{ color: "#a78bfa" }}>AI</span>
            </h1>
            <p
              className="text-xl"
              style={{
                color: "#a0aec0",
                fontFamily: "var(--font-lora), serif",
              }}
            >
              Fact-check anything. Instantly.
            </p>
            <p
              className="text-sm mt-2"
              style={{
                color: "#64748b",
                fontFamily: "var(--font-lora), serif",
              }}
            >
              Verify news and information in Instagram Reels and TikToks before you share.
            </p>
          </div>
        )}

        {/* Main content area */}
        {stage === "input" && (
          <UrlInput
            onSubmit={handleSubmit}
            isLoading={false}
            error={error}
            onExample={handleExample}
            onInfoClick={() => setShowInfo(true)}
          />
        )}

        {stage === "loading" && <LoadingState />}

        {stage === "result" && result && (
          <ResultCard result={result} onReset={handleReset} onInfoClick={() => setShowInfo(true)} />
        )}
      </div>

      {/* Info modal */}
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

      {/* Email gate — only render after mount so localStorage is read first (no flash) */}
      {mounted && !email && <EmailGateModal onSubmit={handleEmailSubmit} />}

      {/* Paywall — shown when free limit is reached */}
      {showPaywall && email && <PaywallModal email={email} />}
    </main>
  );
}
