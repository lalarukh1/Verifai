"use client";

import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { toPng } from "html-to-image";
import { AnalysisResult, OverallVerdict } from "@/lib/types";
import ScoreRing from "./ScoreRing";
import ClaimCard from "./ClaimCard";

// ── Verdict config ───────────────────────────────────────────────────────────

const verdictConfig: Record<OverallVerdict, {
  label: string; color: string; glow: string;
  gradient: string; darkBg: string; textMuted: string;
}> = {
  TRUSTWORTHY: {
    label: "Trustworthy",
    color: "#34D399",
    glow: "0 0 60px rgba(52,211,153,0.2)",
    gradient: "linear-gradient(135deg, rgba(52,211,153,0.12), rgba(16,185,129,0.06))",
    darkBg: "rgba(52,211,153,0.08)",
    textMuted: "rgba(52,211,153,0.6)",
  },
  MISLEADING: {
    label: "Misleading",
    color: "#FBBF24",
    glow: "0 0 60px rgba(251,191,36,0.2)",
    gradient: "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.06))",
    darkBg: "rgba(251,191,36,0.08)",
    textMuted: "rgba(251,191,36,0.6)",
  },
  FALSE: {
    label: "False",
    color: "#F87171",
    glow: "0 0 60px rgba(248,113,113,0.2)",
    gradient: "linear-gradient(135deg, rgba(248,113,113,0.12), rgba(239,68,68,0.06))",
    darkBg: "rgba(248,113,113,0.08)",
    textMuted: "rgba(248,113,113,0.6)",
  },
  UNVERIFIED: {
    label: "Unverified",
    color: "#94A3B8",
    glow: "0 0 40px rgba(148,163,184,0.1)",
    gradient: "linear-gradient(135deg, rgba(148,163,184,0.08), rgba(100,116,139,0.04))",
    darkBg: "rgba(148,163,184,0.06)",
    textMuted: "rgba(148,163,184,0.5)",
  },
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
  audio: "Audio transcript", caption: "Video caption", web: "Web content", manual: "Manual input",
};

function isValidUrl(url: string): boolean {
  try { const { protocol } = new URL(url); return protocol === "https:" || protocol === "http:"; }
  catch { return false; }
}

function clean(text: string): string {
  return text.replace(/\u2014/g, ",").replace(/\u2013/g, "-").trim();
}

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch { return ""; }
}

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

// ── Glassmorphism card wrapper ────────────────────────────────────────────────

function GlassCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-[14px] overflow-hidden ${className}`}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

interface ResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
  onInfoClick?: () => void;
}

export default function ResultCard({ result, onReset, onInfoClick }: ResultCardProps) {
  const [thumbError, setThumbError]   = useState(false);
  const [downloading, setDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const checkedAt = useRef(new Date());

  async function handleDownload() {
    if (!contentRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(contentRef.current, {
        backgroundColor: "#060E1A",
        pixelRatio: 2,
        style: { borderRadius: "0" },
      });
      // iOS Safari doesn't support the download attribute on data URLs — open in new tab so user can long-press save
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isIOS) {
        window.open(dataUrl, "_blank");
        return;
      }
      const link = document.createElement("a");
      link.download = `verifai-${result.extractedContent.accountHandle ?? "post"}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally { setDownloading(false); }
  }

  const cfg = verdictConfig[result.overallVerdict] ?? verdictConfig.UNVERIFIED;
  const ec  = result.extractedContent;
  const rawText   = ec.transcript ?? ec.rawCaption ?? ec.text ?? "";
  const excerpt   = rawText.trim().slice(0, 220);
  const showThumb = !!ec.thumbnailUrl && !thumbError;
  const timestamp = ec.postTimestamp ? formatTimestamp(ec.postTimestamp) : null;
  const isInstagram = ec.platform === "instagram";

  const hasLargeAccount    = (ec.accountFollowers ?? 0) > 100_000;
  const hasSources         = result.claims.some((c) => c.sources?.some((s) => isValidUrl(s.url)));
  const hasNegativeVerdict = result.overallVerdict === "FALSE" || result.overallVerdict === "MISLEADING";

  const scoreFactors = [
    { label: "Large account",    delta: "+20", active: hasLargeAccount,    positive: true  },
    { label: "Sources found",    delta: "+10", active: hasSources,          positive: true  },
    {
      label: `${result.overallVerdict === "FALSE" ? "False" : "Misleading"} verdict`,
      delta: "−20", active: hasNegativeVerdict, positive: false,
    },
  ];

  const seenUrls = new Set<string>();
  const uniqueSources = result.claims
    .flatMap((c) => c.sources ?? [])
    .filter((s) => {
      if (!isValidUrl(s.url) || seenUrls.has(s.url)) return false;
      seenUrls.add(s.url);
      return true;
    });

  return (
    <div className="w-full space-y-3 animate-fade-up">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="grid grid-cols-3 items-center mb-5">
        <div className="flex justify-start">
          <button
            onClick={onReset}
            className="flex items-center gap-2 transition-all active:scale-95 active:opacity-60"
            style={{ color: "rgba(255,255,255,0.65)", background: "none", border: "none", padding: "4px 0" }}
          >
            <ArrowLeft size={20} strokeWidth={1.8} />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        <div className="flex justify-center">
          <span className="font-mono text-lg font-bold tracking-tight">
            <span className="gradient-text">Verif</span>
            <span style={{ background: "linear-gradient(135deg, #22D3EE, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>AI</span>
          </span>
        </div>

        <div className="flex justify-end items-center gap-2.5">
          {/* Download button — round pill with gradient border */}
          <div className="relative" style={{ padding: "1px", borderRadius: "9999px" }}>
            <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(45,212,191,0.5), rgba(96,165,250,0.3))" }} />
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 active:opacity-75 disabled:opacity-40"
              style={{ background: "#0A1628", color: "#2DD4BF" }}
              aria-label="Save as image"
            >
              {downloading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M7.5 1.5v8M7.5 9.5l-3-3M7.5 9.5l3-3M2 12v1.5a.5.5 0 00.5.5h10a.5.5 0 00.5-.5V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>

          {/* Info button — round with matching gradient border */}
          {onInfoClick && (
            <div className="relative" style={{ padding: "1px", borderRadius: "9999px" }}>
              <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(45,212,191,0.5), rgba(96,165,250,0.3))" }} />
              <button
                onClick={onInfoClick}
                className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 active:opacity-75"
                style={{ background: "#0A1628", color: "#2DD4BF" }}
                aria-label="How it works"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Capturable content ─────────────────────────────── */}
      <div ref={contentRef} className="space-y-3" style={{ background: "#060E1A", padding: "1px", borderRadius: "14px" }}>

        {/* ── Post card ───────────────────────────────────── */}
        <GlassCard>
          {/* Verdict accent bar — gradient line */}
          <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}44, transparent)` }} />

          <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3 mb-3">
              {showThumb && (
                <img
                  src={ec.thumbnailUrl}
                  alt="Post thumbnail"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover flex-shrink-0"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  onError={() => setThumbError(true)}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span style={{ color: isInstagram ? "#F472B6" : "#22D3EE" }} className="flex-shrink-0">
                      {isInstagram ? <InstagramIcon className="w-4 h-4" /> : <TikTokIcon className="w-4 h-4" />}
                    </span>
                    <span className="font-semibold text-sm sm:text-base" style={{ color: "#F0F9FF" }}>
                      {ec.accountHandle ? `@${ec.accountHandle}` : "Unknown account"}
                    </span>
                    {ec.accountFollowers != null && (
                      <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {formatFollowers(ec.accountFollowers)} followers
                      </span>
                    )}
                  </div>
                  <a
                    href={ec.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs flex-shrink-0 transition-colors"
                    style={{ color: "#2DD4BF" }}
                  >
                    <span className="hidden sm:inline">View post</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-mono"
                    style={{ background: "rgba(45,212,191,0.1)", color: "#2DD4BF", border: "1px solid rgba(45,212,191,0.2)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
                    {sourceLabel[ec.source] ?? ec.source}
                  </span>
                  {timestamp && (
                    <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{timestamp}</span>
                  )}
                </div>
              </div>
            </div>
            {excerpt && (
              <p className="text-sm leading-relaxed line-clamp-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                &ldquo;{excerpt}{rawText.trim().length > 220 ? "…" : ""}&rdquo;
              </p>
            )}
          </div>
        </GlassCard>

        {/* ── Verdict card — asymmetric clip-path ─────────── */}
        <div
          className="overflow-hidden relative"
          style={{
            borderRadius: "14px",
            background: cfg.gradient,
            border: `1px solid ${cfg.color}30`,
            boxShadow: cfg.glow,
          }}
        >
          {/* Diagonal accent strip — skewed */}
          <div
            className="absolute"
            style={{
              top: 0, right: "-20px",
              width: "120px", height: "100%",
              background: `linear-gradient(135deg, transparent, ${cfg.color}12)`,
              transform: "skewX(-12deg)",
              pointerEvents: "none",
            }}
          />

          {/* Header with angled clip */}
          <div
            className="px-5 py-3.5 flex items-center gap-3"
            style={{
              background: cfg.darkBg,
              borderBottom: `1px solid ${cfg.color}20`,
              clipPath: "polygon(0 0, 100% 0, 97% 100%, 0 100%)",
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
            <span className="text-sm font-bold tracking-wide" style={{ color: cfg.color }}>{cfg.label}</span>
            <span className="text-xs ml-auto font-mono" style={{ color: cfg.textMuted }}>Overall verdict</span>
          </div>

          {/* Body */}
          <div className="px-5 py-4 relative">
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
              {clean(result.verdictReason)}
            </p>
          </div>
        </div>

        {/* ── Credibility score ───────────────────────────── */}
        <GlassCard>
          <div
            className="flex items-center gap-2.5 px-5 py-3.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg, #2DD4BF, #60A5FA)" }} />
            <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>Credibility Score</span>
            <span className="text-xs ml-auto font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>out of 100</span>
          </div>
          <div className="p-5">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <ScoreRing value={result.credibilityScore} label="Credibility" color="#2DD4BF" />
              <div className="flex-1 space-y-3.5 w-full">
                {scoreFactors.map((f) => (
                  <div key={f.label} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="text-sm w-4 text-center flex-shrink-0 font-semibold"
                        style={{ color: f.active ? (f.positive ? "#34D399" : "#F87171") : "rgba(255,255,255,0.15)" }}
                      >
                        {f.active ? (f.positive ? "✓" : "✗") : "–"}
                      </span>
                      <span className="text-sm" style={{ color: f.active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)" }}>
                        {f.label}
                      </span>
                    </div>
                    <span
                      className="text-sm font-semibold font-mono flex-shrink-0"
                      style={{ color: f.active ? (f.positive ? "#34D399" : "#F87171") : "rgba(255,255,255,0.15)" }}
                    >
                      {f.active ? f.delta : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* ── Claims ─────────────────────────────────────── */}
        {result.claims.length > 0 ? (
          <GlassCard>
            <div
              className="flex items-start justify-between gap-3 px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {result.claims.length} Claim{result.claims.length !== 1 ? "s" : ""} Analysed
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono flex-shrink-0 mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                tap to expand
              </span>
            </div>
            <div className="p-3 flex flex-col gap-2.5">
              {result.claims.map((claim, idx) => <ClaimCard key={idx} claim={claim} />)}
            </div>
          </GlassCard>
        ) : (
          <GlassCard>
            <div className="p-7 text-center space-y-2">
              <p className="text-base font-semibold" style={{ color: "#F0F9FF" }}>No checkable claims found</p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                This post doesn&apos;t appear to contain specific factual statements.
              </p>
            </div>
          </GlassCard>
        )}

        {/* ── Sources ────────────────────────────────────── */}
        {uniqueSources.length > 0 && (
          <GlassCard>
            <div
              className="px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: "#2DD4BF" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>Sources</span>
              </div>
              <p className="text-xs mt-1 font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                Read the articles the AI used to reach this verdict
              </p>
            </div>

            {/* Responsive grid: 1 col mobile → 2 col sm → 3 col md */}
            <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {uniqueSources.map((source, idx) => {
                const domain = (() => { try { return new URL(source.url).hostname.replace(/^www\./, ""); } catch { return ""; } })();
                return (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col rounded-2xl p-3 transition-all duration-200 active:scale-[0.97] active:opacity-75"
                    style={{
                      background: "rgba(45,212,191,0.03)",
                      border: "1px solid rgba(45,212,191,0.12)",
                      minHeight: "80px",
                    }}
                  >
                    <div className="flex items-start gap-2 flex-1 mb-2">
                      <span
                        className="text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-mono font-bold"
                        style={{ background: "rgba(45,212,191,0.15)", color: "#2DD4BF" }}
                      >
                        {idx + 1}
                      </span>
                      <p
                        className="text-xs leading-snug line-clamp-3 flex-1"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {source.name}
                      </p>
                      <svg
                        width="10" height="10" viewBox="0 0 10 10" fill="none"
                        className="flex-shrink-0 opacity-35"
                        style={{ color: "#2DD4BF" }}
                      >
                        <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="space-y-0.5">
                      {domain && <p className="text-xs font-mono truncate" style={{ color: "rgba(45,212,191,0.5)" }}>{domain}</p>}
                      {source.date && <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>{source.date}</p>}
                    </div>
                  </a>
                );
              })}
            </div>
          </GlassCard>
        )}

        {/* ── Checked at ─────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3 pt-2 pb-6">
          <div className="w-16 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
          <div className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "rgba(255,255,255,0.2)" }}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
              Checked {checkedAt.current.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} at {checkedAt.current.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

      </div>{/* end contentRef */}
    </div>
  );
}
