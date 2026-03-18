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

const IS_FREE_MODE = process.env.NEXT_PUBLIC_MODE !== "paid";
const LS_EMAIL_KEY = "verifai_email";
const LS_MARKETING_KEY = "verifai_marketing_optin";

export default function Home() {
  const [stage, setStage] = useState<Stage>("input");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LS_EMAIL_KEY);
    if (saved) setEmail(saved);
    setMounted(true);
  }, []);

  function handleEmailSubmit(submittedEmail: string, marketingOptIn: boolean) {
    localStorage.setItem(LS_EMAIL_KEY, submittedEmail);
    localStorage.setItem(LS_MARKETING_KEY, String(marketingOptIn));
    setEmail(submittedEmail);
    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: submittedEmail, marketingOptIn }),
    }).catch(() => {});
  }

  async function handleSubmit(url: string) {
    if (!email) return;
    setError(null);
    setStage("loading");
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email }),
      });
      const data = (await res.json()) as CheckResponse;
      if (data.paywalled && !IS_FREE_MODE) {
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
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "#060E1A" }}
    >
      {/* ── Decorative background blobs ─────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* Top-right teal blob */}
        <div
          className="absolute animate-float"
          style={{
            top: "-15%",
            right: "-10%",
            width: "55vw",
            height: "55vw",
            maxWidth: "600px",
            maxHeight: "600px",
            background: "radial-gradient(circle, rgba(45,212,191,0.15) 0%, rgba(34,211,238,0.06) 50%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(1px)",
          }}
        />
        {/* Bottom-left purple blob */}
        <div
          className="absolute animate-float"
          style={{
            bottom: "-20%",
            left: "-15%",
            width: "60vw",
            height: "60vw",
            maxWidth: "650px",
            maxHeight: "650px",
            background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(1px)",
            animationDelay: "3s",
          }}
        />
        {/* Centre subtle blue */}
        <div
          className="absolute"
          style={{
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80vw",
            height: "40vw",
            background: "radial-gradient(ellipse, rgba(96,165,250,0.05) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center px-4"
        style={{
          zIndex: 1,
          minHeight: "100vh",
          paddingTop: stage === "result" ? "24px" : "80px",
          paddingBottom: "48px",
          justifyContent: stage === "result" ? "flex-start" : "center",
          alignItems: "center",
        }}
      >
        <div className="w-full max-w-xl">

          {/* ── Hero (input/loading only) ──────────────── */}
          {stage !== "result" && (
            <div className="text-center mb-12 animate-fade-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(45,212,191,0.08)",
                  border: "1px solid rgba(45,212,191,0.2)",
                }}>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-glow inline-block" />
                <span className="text-xs font-mono text-teal-400 tracking-wider uppercase">AI Fact-Checker</span>
              </div>

              {/* Title */}
              <h1 className="font-bold tracking-tight mb-4 leading-none" style={{ fontSize: "clamp(3rem, 10vw, 5rem)" }}>
                <span className="gradient-text font-mono">Verif</span>
                <span style={{
                  background: "linear-gradient(135deg, #22D3EE 0%, #60A5FA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "var(--font-dm-mono)",
                }}>AI</span>
              </h1>

              {/* Subtitle — slightly asymmetric */}
              <div className="relative">
                <p className="text-xl font-semibold text-white/90 mb-2">
                  Fact-check anything. <span className="gradient-text">Instantly.</span>
                </p>
                <p className="text-sm text-white/40 leading-relaxed max-w-sm mx-auto">
                  Verify news and information in Instagram Reels<br className="hidden sm:block" /> and TikToks before you share.
                </p>
                {/* Decorative dash — offset right */}
                <div
                  className="absolute hidden sm:block"
                  style={{
                    right: "-20px",
                    top: "50%",
                    width: "40px",
                    height: "2px",
                    background: "linear-gradient(90deg, rgba(45,212,191,0.6), transparent)",
                    transform: "translateY(-50%)",
                  }}
                />
              </div>
            </div>
          )}

          {/* ── Main stages ───────────────────────────── */}
          <div className={stage !== "result" ? "animate-fade-up delay-200" : ""}>
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
        </div>
      </div>

      {/* ── Overlays ──────────────────────────────────── */}
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
      {mounted && !email && <EmailGateModal onSubmit={handleEmailSubmit} />}
      {!IS_FREE_MODE && showPaywall && email && <PaywallModal email={email} />}
    </main>
  );
}
