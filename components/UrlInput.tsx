"use client";

import { useState } from "react";
import { Platform } from "@/lib/types";
import { EXAMPLES, Example } from "@/lib/examples";

function detectPlatformFromUrl(url: string): Platform {
  if (/instagram\.com/.test(url)) return "instagram";
  if (/tiktok\.com|vm\.tiktok\.com/.test(url)) return "tiktok";
  return "unknown";
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.54V6.81a4.85 4.85 0 01-1.01-.12z" />
    </svg>
  );
}

function PlatformIcon({ platform }: { platform: Platform }) {
  if (platform === "instagram") return <InstagramIcon />;
  if (platform === "tiktok") return <TikTokIcon />;
  return null;
}

// ── Example card ────────────────────────────────────────────────────────────

const verdictStyle: Record<string, { color: string; label: string }> = {
  MISLEADING:  { color: "#f59e0b", label: "Misleading"  },
  UNVERIFIED:  { color: "#94a3b8", label: "Unverified"  },
  FALSE:       { color: "#ef4444", label: "False"       },
  TRUSTWORTHY: { color: "#22c55e", label: "Trustworthy" },
};

function getExcerpt(text: string, maxLen = 100): string {
  const first = text.split("\n")[0].trim();
  return first.length > maxLen ? first.slice(0, maxLen).trimEnd() + "…" : first;
}

function ExampleCard({ example, onClick }: { example: Example; onClick: () => void }) {
  const vs = verdictStyle[example.result.overallVerdict] ?? verdictStyle.UNVERIFIED;
  const excerpt = getExcerpt(example.result.extractedContent.text);
  const handle = example.result.extractedContent.accountHandle
    ? `@${example.result.extractedContent.accountHandle}`
    : example.result.accountSummary;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col text-left rounded-[18px] border overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{
        borderColor: "#1a1a30",
        backgroundColor: "#0a0a18",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#3b2f6e";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#1a1a30";
      }}
    >
      {/* Verdict colour accent bar */}
      <div className="h-[3px] w-full" style={{ backgroundColor: vs.color, opacity: 0.7 }} />

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">

        {/* Platform + account */}
        <div className="flex items-center gap-2">
          <span
            className={example.platform === "instagram" ? "text-pink-400" : "text-cyan-400"}
            style={{ flexShrink: 0 }}
          >
            {example.platform === "instagram" ? <InstagramIcon /> : <TikTokIcon />}
          </span>
          <span className="text-xs font-mono truncate" style={{ color: "#64748b" }}>
            {handle}
          </span>
        </div>

        {/* Text excerpt */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: "#cbd5e1", fontFamily: "var(--font-lora), serif" }}
        >
          {excerpt}
        </p>

        {/* Footer: verdict + CTA */}
        <div
          className="flex items-center justify-between pt-3 mt-auto border-t"
          style={{ borderColor: "#1a1a30" }}
        >
          <span className="text-xs font-mono font-medium" style={{ color: vs.color }}>
            ● {vs.label}
          </span>
          <span className="text-xs font-mono" style={{ color: "#3a3a55" }}>
            preview →
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  error?: string | null;
  onExample?: (index: number) => void;
  onInfoClick?: () => void;
}

const platformColors: Record<Platform, string> = {
  instagram: "text-pink-400",
  tiktok:    "text-cyan-400",
  unknown:   "text-slate-500",
};

export default function UrlInput({
  onSubmit,
  isLoading,
  error,
  onExample,
  onInfoClick,
}: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleChange(value: string) {
    setUrl(value);
    setPlatform(detectPlatformFromUrl(value));
    setValidationError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      setValidationError("Please enter a URL.");
      return;
    }
    const p = detectPlatformFromUrl(url.trim());
    if (p === "unknown") {
      setValidationError("Please enter an Instagram or TikTok URL.");
      return;
    }
    onSubmit(url.trim());
  }

  const displayError = validationError ?? error;
  const hasPlatform = platform !== "unknown";

  return (
    <form onSubmit={handleSubmit} className="w-full">

      {/* URL input */}
      <div className="relative">
        <div className="relative flex items-center">
          {hasPlatform && (
            <span
              className={`absolute left-4 ${platformColors[platform]} z-10 pointer-events-none`}
            >
              <PlatformIcon platform={platform} />
            </span>
          )}
          <input
            type="text"
            value={url}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Paste an Instagram or TikTok URL…"
            disabled={isLoading}
            className={`
              w-full bg-[#0e0e1c] border border-[#1a1a30] rounded-[14px]
              text-[#e2e8f0] placeholder-[#475569]
              ${hasPlatform ? "pl-11" : "pl-5"} pr-5 py-4
              font-mono text-sm
              focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          />
        </div>
        {displayError && (
          <p className="mt-2 text-sm text-red-400 font-mono">{displayError}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || !url.trim()}
        className={`
          mt-4 w-full py-4 rounded-[14px] font-mono text-sm font-semibold
          transition-all duration-200
          ${
            isLoading || !url.trim()
              ? "bg-[#1a1a30] text-[#475569] cursor-not-allowed"
              : "bg-[#a78bfa] hover:bg-[#9370f5] text-[#070711] cursor-pointer"
          }
        `}
      >
        {isLoading ? "Analysing…" : "Fact Check"}
      </button>

      {/* Example cards */}
      {onExample && (
        <div className="mt-10">
          {/* Section divider */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px" style={{ backgroundColor: "#1a1a30" }} />
            <p className="text-sm font-mono whitespace-nowrap" style={{ color: "#475569" }}>
              Not sure what to paste? try one of these
            </p>
            <div className="flex-1 h-px" style={{ backgroundColor: "#1a1a30" }} />
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-2 gap-4">
            {EXAMPLES.map((ex, i) => (
              <ExampleCard key={i} example={ex} onClick={() => onExample(i)} />
            ))}
          </div>
        </div>
      )}

      {/* Info link */}
      {onInfoClick && (
        <button
          type="button"
          onClick={onInfoClick}
          className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-[12px] border font-mono text-sm transition-all duration-200 hover:border-[#3b2f6e] hover:text-[#a78bfa]"
          style={{ borderColor: "#1a1a30", color: "#64748b", backgroundColor: "transparent" }}
        >
          <span>ⓘ</span>
          <span>Find out how VerifAI works</span>
          <span style={{ color: "#3a3a55" }}>→</span>
        </button>
      )}
    </form>
  );
}
