"use client";

import { useState } from "react";
import { AnalysisResult, OverallVerdict } from "@/lib/types";
import ScoreRing from "./ScoreRing";
import ClaimCard from "./ClaimCard";

// ── Verdict config ───────────────────────────────────────────────────────────

const verdictConfig: Record<
  OverallVerdict,
  { label: string; color: string; glow: string; bg: string }
> = {
  TRUSTWORTHY: { label: "Trustworthy", color: "#34d399", glow: "0 0 40px rgba(52,211,153,0.2)",  bg: "rgba(52,211,153,0.06)"  },
  MISLEADING:  { label: "Misleading",  color: "#f97316", glow: "0 0 40px rgba(249,115,22,0.2)",  bg: "rgba(249,115,22,0.06)"  },
  FALSE:       { label: "False",       color: "#ef4444", glow: "0 0 40px rgba(239,68,68,0.2)",   bg: "rgba(239,68,68,0.06)"   },
  UNVERIFIED:  { label: "Unverified",  color: "#eab308", glow: "0 0 40px rgba(234,179,8,0.2)",   bg: "rgba(234,179,8,0.06)"   },
};

// ── Platform icons ───────────────────────────────────────────────────────────

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.54V6.81a4.85 4.85 0 01-1.01-.12z" />
    </svg>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const sourceLabel: Record<string, string> = {
  audio:   "Audio transcript",
  caption: "Video caption",
  web:     "Web content",
  manual:  "Manual input",
};

function isValidUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch { return false; }
}

function clean(text: string): string {
  return text.replace(/\u2014/g, ",").replace(/\u2013/g, "-").trim();
}

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return ""; }
}

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

// ── Component ────────────────────────────────────────────────────────────────

interface ResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const [thumbError, setThumbError] = useState(false);
  const cfg = verdictConfig[result.overallVerdict] ?? verdictConfig.UNVERIFIED;
  const ec  = result.extractedContent;

  const rawText  = ec.transcript ?? ec.rawCaption ?? ec.text ?? "";
  const excerpt  = rawText.trim().slice(0, 220);
  const showThumb = !!ec.thumbnailUrl && !thumbError;
  const timestamp = ec.postTimestamp ? formatTimestamp(ec.postTimestamp) : null;

  const isInstagram = ec.platform === "instagram";
  const platformColor = isInstagram ? "#f472b6" : "#22d3ee";

  // Score factors
  const hasLargeAccount    = (ec.accountFollowers ?? 0) > 100_000;
  const hasSources         = result.claims.some(c => c.sources?.some(s => isValidUrl(s.url)));
  const hasNegativeVerdict = result.overallVerdict === "FALSE" || result.overallVerdict === "MISLEADING";

  const scoreFactors = [
    { label: "Large account",    delta: "+20", active: hasLargeAccount,    positive: true  },
    { label: "Sources found",    delta: "+10", active: hasSources,          positive: true  },
    {
      label: `${result.overallVerdict === "FALSE" ? "False" : "Misleading"} verdict`,
      delta: "−20", active: hasNegativeVerdict, positive: false,
    },
  ];

  // Unique sources
  const seenUrls = new Set<string>();
  const uniqueSources = result.claims
    .flatMap(c => c.sources ?? [])
    .filter(s => {
      if (!isValidUrl(s.url) || seenUrls.has(s.url)) return false;
      seenUrls.add(s.url);
      return true;
    });

  return (
    <div className="w-full space-y-4">

      {/* ── Post card (ExampleCard style) ─────────────────── */}
      <div
        className="rounded-[18px] border overflow-hidden"
        style={{ borderColor: "#1a1a30", backgroundColor: "#0a0a18" }}
      >
        {/* Verdict accent bar */}
        <div className="h-[3px] w-full" style={{ backgroundColor: cfg.color, opacity: 0.8 }} />

        {/* Body */}
        <div className="p-5">

          {/* Platform + account row */}
          <div className="flex items-start gap-3 mb-4">
            {/* Thumbnail or platform icon block */}
            <div className="relative flex-shrink-0">
              {showThumb ? (
                <img
                  src={ec.thumbnailUrl}
                  alt="Post thumbnail"
                  className="w-14 h-14 rounded-[12px] object-cover"
                  style={{ border: "1px solid #1a1a30" }}
                  onError={() => setThumbError(true)}
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-[12px] flex items-center justify-center"
                  style={{ backgroundColor: "#13132a", border: "1px solid #1a1a30", color: platformColor }}
                >
                  {isInstagram ? <InstagramIcon className="w-6 h-6" /> : <TikTokIcon className="w-6 h-6" />}
                </div>
              )}
              {/* Platform badge overlay (only when thumbnail is showing) */}
              {showThumb && (
                <div
                  className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#0a0a18", border: `1.5px solid ${platformColor}`, color: platformColor }}
                >
                  {isInstagram
                    ? <InstagramIcon className="w-3 h-3" />
                    : <TikTokIcon className="w-3 h-3" />}
                </div>
              )}
            </div>

            {/* Account info */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-mono text-base font-semibold"
                  style={{ color: "#e2e8f0" }}
                >
                  {ec.accountHandle ? `@${ec.accountHandle}` : "Unknown account"}
                </span>
                {ec.accountFollowers != null && (
                  <span className="font-mono text-xs" style={{ color: "#64748b" }}>
                    {formatFollowers(ec.accountFollowers)} followers
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span
                  className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#13132a", color: "#a78bfa", border: "1px solid #252540" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] inline-block" />
                  {sourceLabel[ec.source] ?? ec.source}
                </span>
                {timestamp && (
                  <span className="font-mono text-xs" style={{ color: "#475569" }}>
                    {timestamp}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Text excerpt */}
          {excerpt && (
            <p
              className="text-sm leading-relaxed mb-4 line-clamp-4"
              style={{ color: "#94a3b8", fontFamily: "var(--font-lora), serif" }}
            >
              &ldquo;{excerpt}{rawText.trim().length > 220 ? "…" : ""}&rdquo;
            </p>
          )}

          {/* Footer: verdict + view original */}
          <div
            className="flex items-center justify-between pt-3 border-t"
            style={{ borderColor: "#1a1a30" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-semibold" style={{ color: cfg.color }}>
                ● {cfg.label}
              </span>
              <span className="text-xs font-mono" style={{ color: "#3a3a55" }}>
                · {result.claims.length} claim{result.claims.length !== 1 ? "s" : ""}
              </span>
            </div>
            <a
              href={ec.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-mono transition-colors duration-200 hover:text-[#a78bfa]"
              style={{ color: "#475569" }}
            >
              View post
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="flex-shrink-0">
                <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Verdict reason ────────────────────────────────── */}
      <div
        className="rounded-[18px] border overflow-hidden"
        style={{ backgroundColor: "#0a0a18", borderColor: cfg.color + "50", boxShadow: cfg.glow }}
      >
        {/* Card header */}
        <div
          className="flex items-center gap-3 px-5 py-3.5 border-b"
          style={{ backgroundColor: cfg.bg, borderColor: cfg.color + "30" }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: cfg.color }}
          />
          <span className="font-mono text-sm font-semibold" style={{ color: cfg.color }}>
            {cfg.label}
          </span>
          <span className="font-mono text-xs ml-auto" style={{ color: cfg.color + "80" }}>
            Overall verdict
          </span>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p
            className="text-base leading-relaxed"
            style={{ color: "#e2e8f0", fontFamily: "var(--font-lora), serif" }}
          >
            {clean(result.verdictReason)}
          </p>
        </div>
      </div>

      {/* ── Credibility score ─────────────────────────────── */}
      <div
        className="rounded-[18px] border p-5"
        style={{ backgroundColor: "#0a0a18", borderColor: "#1a1a30" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#475569" }}>
          Credibility Score
        </p>
        <div className="flex items-center gap-6">
          <ScoreRing value={result.credibilityScore} label="Credibility" color="#a78bfa" />
          <div className="flex-1 space-y-3">
            {scoreFactors.map((f) => (
              <div key={f.label} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-sm w-4 text-center"
                    style={{ color: f.active ? (f.positive ? "#34d399" : "#f97316") : "#2a2a45" }}
                  >
                    {f.active ? (f.positive ? "✓" : "✗") : "–"}
                  </span>
                  <span
                    className="font-mono text-sm"
                    style={{ color: f.active ? "#94a3b8" : "#3a3a55" }}
                  >
                    {f.label}
                  </span>
                </div>
                <span
                  className="font-mono text-sm font-medium"
                  style={{ color: f.active ? (f.positive ? "#34d399" : "#f97316") : "#2a2a45" }}
                >
                  {f.active ? f.delta : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Claims ────────────────────────────────────────── */}
      {result.claims.length > 0 ? (
        <div className="space-y-3">
          <p className="font-mono text-sm font-semibold" style={{ color: "#64748b" }}>
            {result.claims.length} Claim{result.claims.length !== 1 ? "s" : ""} Analysed
          </p>
          {result.claims.map((claim, idx) => (
            <ClaimCard key={idx} claim={claim} />
          ))}
        </div>
      ) : (
        <div
          className="rounded-[18px] border p-6 text-center space-y-2"
          style={{ backgroundColor: "#0a0a18", borderColor: "#1a1a30" }}
        >
          <p className="font-mono text-base font-semibold" style={{ color: "#e2e8f0" }}>
            No checkable claims found
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#64748b", fontFamily: "var(--font-lora), serif" }}
          >
            This post doesn&apos;t appear to contain specific factual statements. It may be entertainment, personal content, or opinion. Try a news or educational post for best results.
          </p>
        </div>
      )}

      {/* ── Sources ───────────────────────────────────────── */}
      {uniqueSources.length > 0 && (
        <div
          className="rounded-[18px] border overflow-hidden"
          style={{ backgroundColor: "#0a0a18", borderColor: "#1a1a30" }}
        >
          <div className="px-5 pt-4 pb-3 border-b" style={{ borderColor: "#1a1a30" }}>
            <p className="font-mono text-sm font-semibold" style={{ color: "#64748b" }}>
              Sources checked
            </p>
          </div>
          <div className="px-5 py-4 space-y-3">
            {uniqueSources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <svg
                  className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 transition-colors"
                  style={{ color: "#3a3a55" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onMouseEnter={e => (e.currentTarget.style.color = "#a78bfa")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#3a3a55")}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <div className="flex flex-col min-w-0">
                  <span
                    className="font-mono text-sm truncate transition-colors group-hover:text-[#a78bfa]"
                    style={{ color: "#94a3b8" }}
                  >
                    {source.name}
                  </span>
                  {source.date && (
                    <span className="font-mono text-xs mt-0.5" style={{ color: "#475569" }}>
                      {source.date}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Reset ─────────────────────────────────────────── */}
      <button
        onClick={onReset}
        className="w-full py-4 rounded-[14px] font-mono text-sm font-medium border transition-all duration-200 flex items-center justify-center gap-2 hover:text-[#a78bfa]"
        style={{ backgroundColor: "#0a0a18", borderColor: "#1a1a30", color: "#64748b" }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "#3b2f6e")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "#1a1a30")}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
          <path d="M1 7A6 6 0 0 1 12.5 4M12.5 4V1M12.5 4H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 7A6 6 0 0 1 1.5 10M1.5 10V13M1.5 10H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Check another post
      </button>

    </div>
  );
}
