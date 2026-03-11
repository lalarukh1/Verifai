"use client";

import { useState } from "react";
import { Claim, ClaimVerdict } from "@/lib/types";

const verdictConfig: Record<
  ClaimVerdict,
  { label: string; color: string; bg: string; border: string }
> = {
  TRUE: {
    label: "TRUE",
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.25)",
  },
  FALSE: {
    label: "FALSE",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
  },
  MISLEADING: {
    label: "MISLEADING",
    color: "#f97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.25)",
  },
  UNVERIFIED: {
    label: "UNVERIFIED",
    color: "#eab308",
    bg: "rgba(234,179,8,0.08)",
    border: "rgba(234,179,8,0.25)",
  },
  NO_EVIDENCE: {
    label: "NO EVIDENCE",
    color: "#64748b",
    bg: "rgba(100,116,139,0.08)",
    border: "rgba(100,116,139,0.25)",
  },
};

interface ClaimCardProps {
  claim: Claim;
}

/** Returns true only for safe absolute http/https URLs */
function isValidUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

export default function ClaimCard({ claim }: ClaimCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cfg = verdictConfig[claim.verdict] ?? verdictConfig.NO_EVIDENCE;

  return (
    <div
      className="rounded-[12px] border p-4 cursor-pointer transition-all duration-200 hover:brightness-110"
      style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span
            className="text-xs font-mono font-bold px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5 border"
            style={{
              color: cfg.color,
              borderColor: cfg.border,
              backgroundColor: cfg.bg,
            }}
          >
            {cfg.label}
          </span>
          <p
            className="text-[#e2e8f0] text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            {claim.text}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
          {claim.category && (
            <span className="text-xs text-[#64748b] font-mono bg-[#1a1a30] px-2 py-0.5 rounded-md hidden sm:block">
              {claim.category}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-[#64748b] transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-4 space-y-4 border-t border-[#1a1a30] pt-4">
          <div>
            <p className="text-xs font-mono text-[#64748b] uppercase tracking-wider mb-1">
              Explanation
            </p>
            <p
              className="text-[#e2e8f0] text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              {claim.explanation}
            </p>
          </div>

          <div>
            <p className="text-xs font-mono text-[#64748b] uppercase tracking-wider mb-2">
              Confidence
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#1a1a30] rounded-full h-1.5">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.round(claim.confidence * 100)}%`,
                    backgroundColor: cfg.color,
                  }}
                />
              </div>
              <span
                className="text-xs font-mono w-8 text-right"
                style={{ color: cfg.color }}
              >
                {Math.round(claim.confidence * 100)}%
              </span>
            </div>
          </div>

          {claim.sources && claim.sources.some((s) => isValidUrl(s.url)) && (
            <div>
              <p className="text-xs font-mono text-[#64748b] uppercase tracking-wider mb-2">
                Sources
              </p>
              <div className="space-y-1.5">
                {claim.sources
                  .filter((source) => isValidUrl(source.url))
                  .map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-start gap-2 text-sm text-[#a78bfa] hover:text-[#c4b5fd] font-mono transition-colors"
                    >
                      <svg
                        className="w-3 h-3 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      <span className="flex flex-col min-w-0">
                        <span className="truncate">{source.name}</span>
                        {source.date && (
                          <span className="text-[10px] text-[#64748b] mt-0.5">{source.date}</span>
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
