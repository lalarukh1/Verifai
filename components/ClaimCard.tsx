"use client";

import { useState } from "react";
import { Claim, ClaimVerdict } from "@/lib/types";

const verdictConfig: Record<ClaimVerdict, { label: string; color: string; darkBg: string; glow: string }> = {
  TRUE:        { label: "True",        color: "#34D399", darkBg: "rgba(52,211,153,0.1)",  glow: "rgba(52,211,153,0.2)"  },
  FALSE:       { label: "False",       color: "#F87171", darkBg: "rgba(248,113,113,0.1)", glow: "rgba(248,113,113,0.2)" },
  MISLEADING:  { label: "Misleading",  color: "#FBBF24", darkBg: "rgba(251,191,36,0.1)",  glow: "rgba(251,191,36,0.2)"  },
  UNVERIFIED:  { label: "Unverified",  color: "#94A3B8", darkBg: "rgba(148,163,184,0.08)", glow: "rgba(148,163,184,0.1)" },
  NO_EVIDENCE: { label: "No evidence", color: "#64748B", darkBg: "rgba(100,116,139,0.08)", glow: "rgba(100,116,139,0.1)" },
};

interface ClaimCardProps { claim: Claim; }

function isValidUrl(url: string): boolean {
  try { const { protocol } = new URL(url); return protocol === "https:" || protocol === "http:"; }
  catch { return false; }
}

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return ""; }
}

export default function ClaimCard({ claim }: ClaimCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cfg = verdictConfig[claim.verdict] ?? verdictConfig.NO_EVIDENCE;

  const domains = Array.from(
    new Set((claim.sources ?? []).filter((s) => isValidUrl(s.url)).map((s) => getDomain(s.url)).filter(Boolean))
  ).slice(0, 3);

  return (
    <div
      className="rounded-[12px] overflow-hidden transition-all duration-200 relative"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 0% 0%, ${cfg.glow.replace("0.2", "0.08").replace("0.1", "0.05")} 0%, transparent 70%), rgba(255,255,255,0.03)`,
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: expanded ? `0 8px 32px ${cfg.glow}` : "none",
      }}
    >
      {/* Top accent line — verdict color fading to transparent */}
      <div className="h-[1.5px] w-full" style={{ background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}55 40%, transparent)` }} />
      {/* Clickable header */}
      <button
        type="button"
        className="w-full text-left p-4 flex flex-col gap-2 cursor-pointer transition-colors"
        style={{ background: "transparent" }}
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Top row: badge + chevron */}
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 font-mono"
            style={{ color: cfg.color, backgroundColor: cfg.darkBg }}
          >
            {cfg.label}
          </span>
          <svg
            className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
            style={{ color: "rgba(255,255,255,0.55)", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Claim text + domains */}
        <div className="min-w-0">
          <p className={`text-sm leading-relaxed ${expanded ? "" : "line-clamp-2"}`}
            style={{ color: "rgba(255,255,255,0.8)" }}>
            {claim.text}
          </p>
          {!expanded && domains.length > 0 && (
            <p className="text-xs mt-1.5 font-mono" style={{ color: "rgba(255,255,255,0.55)" }}>
              {domains.join(" · ")}
            </p>
          )}
        </div>
      </button>

      {/* Expanded section */}
      {expanded && (
        <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {/* Explanation */}
          <div className="px-4 pt-4 pb-4">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.55)" }}>Explanation</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              {claim.explanation}
            </p>
          </div>

          {/* Confidence */}
          <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.55)" }}>
                  AI confidence
                </p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                  How certain the AI is this claim is {cfg.label.toLowerCase()}
                </p>
              </div>
              <span className="text-lg font-bold font-mono flex-shrink-0" style={{ color: cfg.color }}>
                {Math.round(claim.confidence * 100)}%
              </span>
            </div>
            <div className="rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.round(claim.confidence * 100)}%`,
                  background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}99)`,
                  boxShadow: `0 0 8px ${cfg.glow}`,
                }}
              />
            </div>
          </div>

          {/* Sources */}
          {claim.sources && claim.sources.some((s) => isValidUrl(s.url)) && (
            <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <p className="text-xs font-mono font-semibold uppercase tracking-widest mb-3"
                style={{ color: "rgba(255,255,255,0.55)" }}>Sources</p>
              <div className="space-y-2">
                {claim.sources.filter((s) => isValidUrl(s.url)).map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 transition-colors"
                      style={{ color: "#2DD4BF" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="flex flex-col min-w-0">
                      <span className="text-sm truncate" style={{ color: "#2DD4BF" }}>{source.name}</span>
                      {source.date && (
                        <span className="text-xs mt-0.5 font-mono" style={{ color: "rgba(255,255,255,0.55)" }}>
                          {source.date}
                        </span>
                      )}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
