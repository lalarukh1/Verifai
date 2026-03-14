"use client";

import { useState } from "react";
import { Claim, ClaimVerdict } from "@/lib/types";

const verdictConfig: Record<
  ClaimVerdict,
  { label: string; color: string; bg: string }
> = {
  TRUE:        { label: "True",        color: "#34d399", bg: "rgba(52,211,153,0.08)"  },
  FALSE:       { label: "False",       color: "#ef4444", bg: "rgba(239,68,68,0.08)"   },
  MISLEADING:  { label: "Misleading",  color: "#f97316", bg: "rgba(249,115,22,0.08)"  },
  UNVERIFIED:  { label: "Unverified",  color: "#eab308", bg: "rgba(234,179,8,0.08)"   },
  NO_EVIDENCE: { label: "No evidence", color: "#64748b", bg: "rgba(100,116,139,0.08)" },
};

interface ClaimCardProps {
  claim: Claim;
}

function isValidUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch { return false; }
}

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return ""; }
}

export default function ClaimCard({ claim }: ClaimCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cfg = verdictConfig[claim.verdict] ?? verdictConfig.NO_EVIDENCE;

  const domains = Array.from(
    new Set(
      (claim.sources ?? [])
        .filter((s) => isValidUrl(s.url))
        .map((s) => getDomain(s.url))
        .filter(Boolean)
    )
  ).slice(0, 2);

  return (
    <div
      className="rounded-[16px] border overflow-hidden cursor-pointer transition-all duration-200"
      style={{ backgroundColor: "#0a0a18", borderColor: "#1a1a30" }}
      onClick={() => setExpanded((v) => !v)}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "#252540")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "#1a1a30")}
    >
      {/* Verdict accent bar */}
      <div className="h-[3px] w-full" style={{ backgroundColor: cfg.color, opacity: 0.8 }} />

      {/* Body */}
      <div className="p-3.5 flex flex-col gap-2.5">

        {/* Verdict pill + chevron */}
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
            style={{ color: cfg.color, backgroundColor: cfg.bg }}
          >
            {cfg.label}
          </span>
          <svg
            className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200`}
            style={{ color: "#475569", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Claim text */}
        <p
          className={`text-xs leading-relaxed ${expanded ? "" : "line-clamp-3"}`}
          style={{ color: "#cbd5e1", fontFamily: "var(--font-lora), serif" }}
        >
          {claim.text}
        </p>

        {/* Source domains */}
        {domains.length > 0 && (
          <p className="font-mono text-[10px]" style={{ color: "#3a3a55" }}>
            {domains.join(" · ")}
          </p>
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          className="px-3.5 pb-3.5 pt-0 space-y-3 border-t"
          style={{ borderColor: "#1a1a30" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Explanation */}
          <div className="pt-3">
            <p className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: "#3a3a55" }}>
              Explanation
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "#94a3b8", fontFamily: "var(--font-lora), serif" }}
            >
              {claim.explanation}
            </p>
          </div>

          {/* Confidence bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "#3a3a55" }}>
                Confidence
              </p>
              <span className="text-[10px] font-mono" style={{ color: cfg.color }}>
                {Math.round(claim.confidence * 100)}%
              </span>
            </div>
            <div className="bg-[#1a1a30] rounded-full h-1">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.round(claim.confidence * 100)}%`, backgroundColor: cfg.color }}
              />
            </div>
          </div>

          {/* Sources */}
          {claim.sources && claim.sources.some(s => isValidUrl(s.url)) && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: "#3a3a55" }}>
                Sources
              </p>
              <div className="space-y-1.5">
                {claim.sources
                  .filter(s => isValidUrl(s.url))
                  .map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-start gap-1.5 group"
                    >
                      <svg className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: "#a78bfa" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="flex flex-col min-w-0">
                        <span
                          className="font-mono text-[11px] truncate transition-colors group-hover:text-[#c4b5fd]"
                          style={{ color: "#a78bfa" }}
                        >
                          {source.name}
                        </span>
                        {source.date && (
                          <span className="font-mono text-[10px] mt-0.5" style={{ color: "#475569" }}>
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
