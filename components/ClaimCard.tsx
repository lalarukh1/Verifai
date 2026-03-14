"use client";

import { useState } from "react";
import { Claim, ClaimVerdict } from "@/lib/types";

const verdictConfig: Record<
  ClaimVerdict,
  { label: string; color: string; bg: string }
> = {
  TRUE:        { label: "True",        color: "#34d399", bg: "rgba(52,211,153,0.10)"  },
  FALSE:       { label: "False",       color: "#ef4444", bg: "rgba(239,68,68,0.10)"   },
  MISLEADING:  { label: "Misleading",  color: "#f97316", bg: "rgba(249,115,22,0.10)"  },
  UNVERIFIED:  { label: "Unverified",  color: "#eab308", bg: "rgba(234,179,8,0.10)"   },
  NO_EVIDENCE: { label: "No evidence", color: "#64748b", bg: "rgba(100,116,139,0.10)" },
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
  ).slice(0, 3);

  return (
    <div
      className="rounded-[16px] border overflow-hidden transition-all duration-200"
      style={{ backgroundColor: "#0c0c1a", borderColor: "#1a1a30" }}
    >
      {/* Verdict accent bar */}
      <div className="h-[3px] w-full" style={{ backgroundColor: cfg.color, opacity: 0.85 }} />

      {/* Clickable header */}
      <button
        type="button"
        className="w-full text-left p-4 flex items-start gap-3 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Verdict pill — fixed width so claim text always starts at same column */}
        <span
          className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5"
          style={{ color: cfg.color, backgroundColor: cfg.bg }}
        >
          {cfg.label}
        </span>

        {/* Claim text + domains */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm leading-relaxed ${expanded ? "" : "line-clamp-2"}`}
            style={{ color: "#e2e8f0", fontFamily: "var(--font-lora), serif" }}
          >
            {claim.text}
          </p>
          {!expanded && domains.length > 0 && (
            <p className="font-mono text-xs mt-1.5" style={{ color: "#475569" }}>
              {domains.join(" · ")}
            </p>
          )}
        </div>

        {/* Chevron */}
        <svg
          className="w-4 h-4 flex-shrink-0 mt-0.5 transition-transform duration-200"
          style={{
            color: "#475569",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded section */}
      {expanded && (
        <div
          className="border-t"
          style={{ borderColor: "#1a1a30" }}
        >
          {/* Explanation */}
          <div className="px-4 pt-4 pb-4">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>
              Explanation
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#cbd5e1", fontFamily: "var(--font-lora), serif" }}
            >
              {claim.explanation}
            </p>
          </div>

          {/* Confidence — own section with top divider for clear separation */}
          <div
            className="px-4 py-4 border-t"
            style={{ borderColor: "#1a1a30", backgroundColor: "rgba(167,139,250,0.03)" }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: "#7c6faa" }}>
                  AI confidence in this verdict
                </p>
                <p className="text-xs font-mono mt-1" style={{ color: "#3a3a55" }}>
                  How certain the AI is that the claim is {cfg.label.toLowerCase()}
                </p>
              </div>
              <span className="text-lg font-mono font-bold flex-shrink-0" style={{ color: cfg.color }}>
                {Math.round(claim.confidence * 100)}%
              </span>
            </div>
            <div className="bg-[#1a1a30] rounded-full h-2">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.round(claim.confidence * 100)}%`,
                  backgroundColor: cfg.color,
                }}
              />
            </div>
          </div>

          {/* Sources */}
          {claim.sources && claim.sources.some(s => isValidUrl(s.url)) && (
            <div
              className="px-4 py-4 border-t"
              style={{ borderColor: "#1a1a30" }}
            >
              <p className="text-xs font-mono font-semibold uppercase tracking-widest mb-3" style={{ color: "#475569" }}>
                Resources
              </p>
              <div className="space-y-2">
                {claim.sources
                  .filter(s => isValidUrl(s.url))
                  .map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 group"
                      onClick={e => e.stopPropagation()}
                    >
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                        style={{ color: "#a78bfa" }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="flex flex-col min-w-0">
                        <span
                          className="font-mono text-sm truncate transition-colors group-hover:text-[#c4b5fd]"
                          style={{ color: "#a78bfa" }}
                        >
                          {source.name}
                        </span>
                        {source.date && (
                          <span className="font-mono text-xs mt-0.5" style={{ color: "#475569" }}>
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
