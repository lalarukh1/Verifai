"use client";

import { useState } from "react";
import UrlInput from "@/components/UrlInput";
import LoadingState from "@/components/LoadingState";
import ResultCard from "@/components/ResultCard";
import InfoModal from "@/components/InfoModal";
import { AnalysisResult, CheckResponse } from "@/lib/types";

type Stage = "input" | "loading" | "result";

export default function Home() {
  const [stage, setStage] = useState<Stage>("input");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  async function handleSubmit(url: string) {
    setError(null);
    setStage("loading");

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = (await res.json()) as CheckResponse;

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

  return (
    <main
      className="min-h-screen flex flex-col items-center px-4 py-12"
      style={{ backgroundColor: "#070711" }}
    >
      <div className="w-full max-w-[680px]">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <h1
            className="text-4xl font-bold mb-3 tracking-tight font-mono"
            style={{ color: "#e2e8f0" }}
          >
            Verif<span style={{ color: "#a78bfa" }}>AI</span>
          </h1>
          <p
            className="text-base"
            style={{
              color: "#64748b",
              fontFamily: "var(--font-lora), serif",
            }}
          >
            Fact-check anything. Instantly.
          </p>
          <p
            className="text-sm mt-1"
            style={{
              color: "#3a3a55",
              fontFamily: "var(--font-lora), serif",
            }}
          >
            Works best with news and educational videos.
          </p>
          {/* Info button */}
          <button
            onClick={() => setShowInfo(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full border font-mono text-sm transition-all duration-200 hover:border-[#3b2f6e] hover:text-[#a78bfa]"
            style={{ borderColor: "#1a1a30", color: "#475569" }}
            aria-label="How it works"
          >
            ⓘ
          </button>
        </div>

        {/* Main content area */}
        {stage === "input" && (
          <UrlInput
            onSubmit={handleSubmit}
            isLoading={false}
            error={error}
          />
        )}

        {stage === "loading" && <LoadingState />}

        {stage === "result" && result && (
          <ResultCard result={result} onReset={handleReset} />
        )}
      </div>

      {/* Info modal */}
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
    </main>
  );
}
