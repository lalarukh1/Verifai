"use client";

import { useState } from "react";
import { AnalysisResult, OverallVerdict } from "@/lib/types";
import ScoreRing from "./ScoreRing";
import ClaimCard from "./ClaimCard";

const verdictConfig: Record<
  OverallVerdict,
  { label: string; color: string; glow: string; bg: string }
> = {
  TRUSTWORTHY: {
    label: "TRUSTWORTHY",
    color: "#34d399",
    glow: "0 0 32px rgba(52,211,153,0.25)",
    bg: "rgba(52,211,153,0.07)",
  },
  MISLEADING: {
    label: "MISLEADING",
    color: "#f97316",
    glow: "0 0 32px rgba(249,115,22,0.25)",
    bg: "rgba(249,115,22,0.07)",
  },
  FALSE: {
    label: "FALSE",
    color: "#ef4444",
    glow: "0 0 32px rgba(239,68,68,0.25)",
    bg: "rgba(239,68,68,0.07)",
  },
  UNVERIFIED: {
    label: "UNVERIFIED",
    color: "#eab308",
    glow: "0 0 32px rgba(234,179,8,0.25)",
    bg: "rgba(234,179,8,0.07)",
  },
};

const platformIcon: Record<string, string> = {
  instagram: "IG",
  tiktok: "TT",
};

const sourceLabel: Record<string, string> = {
  audio: "Audio transcript",
  caption: "Video caption",
  web: "Web content",
  manual: "Manual input",
};

/** Returns true only for safe absolute http/https URLs */
function isValidUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

/** Strip em dashes and en dashes from AI-generated text */
function clean(text: string): string {
  return text.replace(/\u2014/g, ",").replace(/\u2013/g, "-").trim();
}

/** Format an ISO timestamp into a readable date + time */
function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

/** Compact follower count: 1200000 → 1.2M */
function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

interface ResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const [thumbError, setThumbError] = useState(false);
  const cfg =
    verdictConfig[result.overallVerdict] ?? verdictConfig.UNVERIFIED;
  const ec = result.extractedContent;

  const excerpt = (ec.transcript ?? ec.rawCaption ?? ec.text ?? "")
    .trim()
    .slice(0, 240);

  const showThumb = !!ec.thumbnailUrl && !thumbError;
  const timestamp = ec.postTimestamp ? formatTimestamp(ec.postTimestamp) : null;

  // Score breakdown factors
  const hasLargeAccount = (ec.accountFollowers ?? 0) > 100_000;
  const hasSources = result.claims.some(
    (c) => c.sources?.some((s) => isValidUrl(s.url))
  );
  const hasNegativeVerdict =
    result.overallVerdict === "FALSE" || result.overallVerdict === "MISLEADING";

  const scoreFactors = [
    { label: "Large account", delta: "+20", active: hasLargeAccount, positive: true },
    { label: "Sources found", delta: "+10", active: hasSources, positive: true },
    {
      label: `${result.overallVerdict === "FALSE" ? "False" : "Misleading"} verdict`,
      delta: "−20",
      active: hasNegativeVerdict,
      positive: false,
    },
  ];

  // Aggregate unique sources across all claims
  const seenUrls = new Set<string>();
  const uniqueSources = result.claims
    .flatMap((c) => c.sources ?? [])
    .filter((s) => {
      if (!isValidUrl(s.url) || seenUrls.has(s.url)) return false;
      seenUrls.add(s.url);
      return true;
    });

  return (
    <div className="w-full space-y-4">

      {/* ── Checked Post Card ─────────────────────────────── */}
      <div className="rounded-[12px] bg-[#0e0e1c] border border-[#1a1a30] overflow-hidden">

        {/* Header row */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-2.5 border-b border-[#1a1a30]">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1a1a30] text-[#a78bfa] uppercase tracking-wider">
            {platformIcon[ec.platform] ?? ec.platform}
          </span>
          <span className="text-xs font-mono text-[#64748b] uppercase tracking-wider">
            Checked post
          </span>
          {result.processingTimeMs > 0 && (
            <span className="ml-auto text-xs font-mono text-[#3a3a55]">
              {(result.processingTimeMs / 1000).toFixed(1)}s
            </span>
          )}
        </div>

        {/* Compact info row: thumbnail + account + badges */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Thumbnail */}
          {showThumb ? (
            <img
              src={ec.thumbnailUrl}
              alt="Post thumbnail"
              className="w-14 h-14 rounded-[6px] object-cover flex-shrink-0 bg-[#1a1a30]"
              onError={() => setThumbError(true)}
            />
          ) : (
            <div className="w-14 h-14 rounded-[6px] bg-[#1a1a30] flex items-center justify-center flex-shrink-0">
              <span className="text-[#3a3a55] font-mono text-xs">
                {platformIcon[ec.platform] ?? "?"}
              </span>
            </div>
          )}

          {/* Account info */}
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            {/* Row 1: handle + followers + source badge */}
            <div className="flex items-center gap-2 flex-wrap">
              {ec.accountHandle && (
                <span className="font-mono text-sm text-[#e2e8f0] truncate">
                  @{ec.accountHandle}
                </span>
              )}
              {ec.accountFollowers != null && (
                <span className="font-mono text-xs text-[#64748b] flex-shrink-0">
                  · {formatFollowers(ec.accountFollowers)} followers
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-[#1a1a30] text-[#a78bfa] flex-shrink-0">
                <span className="w-1 h-1 rounded-full bg-[#a78bfa] inline-block" />
                {sourceLabel[ec.source] ?? ec.source}
              </span>
            </div>
            {/* Row 2: timestamp */}
            {timestamp && (
              <span className="font-mono text-[10px] text-[#3a3a55]">
                {timestamp}
              </span>
            )}
          </div>
        </div>

        {/* Text excerpt */}
        {excerpt && (
          <div className="px-4 pb-3">
            <p className="text-[#64748b] text-xs leading-relaxed font-mono line-clamp-3 bg-[#070711] rounded-[6px] p-3 border border-[#1a1a30]">
              &ldquo;{excerpt}{excerpt.length < (ec.transcript ?? ec.rawCaption ?? ec.text ?? "").trim().length ? "…" : ""}&rdquo;
            </p>
          </div>
        )}

        {/* Link */}
        <div className="px-4 pb-3">
          <a
            href={ec.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#64748b] hover:text-[#a78bfa] transition-colors truncate max-w-full"
          >
            View original post
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="flex-shrink-0">
              <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      {/* ── Verdict Banner ────────────────────────────────── */}
      <div
        className="rounded-[14px] p-6 border"
        style={{
          backgroundColor: cfg.bg,
          borderColor: cfg.color + "50",
          boxShadow: cfg.glow,
        }}
      >
        <p
          className="text-[#e2e8f0] text-base leading-relaxed"
          style={{ fontFamily: "var(--font-lora), serif" }}
        >
          {clean(result.verdictReason)}
        </p>
      </div>

      {/* ── Credibility Score ─────────────────────────────── */}
      <div className="rounded-[12px] bg-[#0e0e1c] border border-[#1a1a30] p-6">
        <div className="flex flex-col items-center gap-4">
          <ScoreRing
            value={result.credibilityScore}
            label="Credibility"
            color="#a78bfa"
          />
          <div className="w-full space-y-2">
            {scoreFactors.map((f) => (
              <div key={f.label} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-xs w-3 text-center"
                    style={{ color: f.active ? (f.positive ? "#34d399" : "#f97316") : "#3a3a55" }}
                  >
                    {f.active ? (f.positive ? "✓" : "✗") : "–"}
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: f.active ? "#94a3b8" : "#3a3a55" }}
                  >
                    {f.label}
                  </span>
                </div>
                <span
                  className="font-mono text-xs font-medium"
                  style={{ color: f.active ? (f.positive ? "#34d399" : "#f97316") : "#3a3a55" }}
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
          <p className="font-mono text-xs uppercase tracking-wider text-[#64748b]">
            {result.claims.length} Claim
            {result.claims.length !== 1 ? "s" : ""} Analysed
          </p>
          {result.claims.map((claim, idx) => (
            <ClaimCard key={idx} claim={claim} />
          ))}
        </div>
      ) : (
        <div className="rounded-[12px] bg-[#0e0e1c] border border-[#1a1a30] p-6 text-center space-y-2">
          <p className="text-[#e2e8f0] font-mono text-sm font-medium">
            No checkable claims found
          </p>
          <p
            className="text-[#64748b] text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            This video doesn&apos;t appear to contain specific factual statements — it may be entertainment, personal content, or opinion. Try a news or educational video for best results.
          </p>
        </div>
      )}

      {/* ── Sources ───────────────────────────────────────── */}
      {uniqueSources.length > 0 && (
        <div className="rounded-[12px] bg-[#0e0e1c] border border-[#1a1a30] overflow-hidden">
          <div className="px-4 pt-3 pb-2.5 border-b border-[#1a1a30]">
            <p className="font-mono text-xs uppercase tracking-wider text-[#64748b]">
              Sources checked
            </p>
          </div>
          <div className="px-4 py-3 space-y-2">
            {uniqueSources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 group"
              >
                <svg
                  className="w-3 h-3 flex-shrink-0 mt-0.5 text-[#3a3a55] group-hover:text-[#a78bfa] transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-xs text-[#64748b] group-hover:text-[#a78bfa] transition-colors truncate">
                    {source.name}
                  </span>
                  {source.date && (
                    <span className="font-mono text-[10px] text-[#3a3a55]">
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
        className="w-full py-3.5 rounded-[12px] font-mono text-sm font-medium bg-[#0e0e1c] border border-[#1a1a30] text-[#64748b] hover:border-[#a78bfa] hover:text-[#a78bfa] transition-all duration-200 flex items-center justify-center gap-2"
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
