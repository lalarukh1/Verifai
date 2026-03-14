"use client";

import { useState } from "react";
import UrlInput from "@/components/UrlInput";
import LoadingState from "@/components/LoadingState";
import ResultCard from "@/components/ResultCard";
import InfoModal from "@/components/InfoModal";
import { AnalysisResult, CheckResponse } from "@/lib/types";
import { EXAMPLES } from "@/lib/examples";

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

  function handleExample(index: number) {
    const ex = EXAMPLES[index];
    if (!ex) return;
    setError(null);
    setResult(ex.result);
    setStage("result");
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#070711" }}
    >
      <div className="w-full max-w-[760px]">
        {/* Header */}
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
          <ResultCard result={result} onReset={handleReset} />
        )}
      </div>

      {/* Info modal */}
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
    </main>
  );
}
