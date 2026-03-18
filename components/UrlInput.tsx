"use client";

import { useState } from "react";
import { Platform } from "@/lib/types";
import { EXAMPLES, Example } from "@/lib/examples";

function detectPlatformFromUrl(url: string): Platform {
  if (/instagram\.com/.test(url)) return "instagram";
  if (/tiktok\.com|vm\.tiktok\.com/.test(url)) return "tiktok";
  return "unknown";
}

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

// ── Verdict styles ───────────────────────────────────────────────────────────

const verdictStyle: Record<string, { color: string; glow: string; label: string; darkBg: string }> = {
  MISLEADING:  { color: "#FBBF24", glow: "rgba(251,191,36,0.3)",  label: "Misleading",  darkBg: "rgba(251,191,36,0.1)"  },
  UNVERIFIED:  { color: "#94A3B8", glow: "rgba(148,163,184,0.2)", label: "Unverified",  darkBg: "rgba(148,163,184,0.08)" },
  FALSE:       { color: "#F87171", glow: "rgba(248,113,113,0.3)", label: "False",       darkBg: "rgba(248,113,113,0.1)"  },
  TRUSTWORTHY: { color: "#34D399", glow: "rgba(52,211,153,0.3)",  label: "Trustworthy", darkBg: "rgba(52,211,153,0.1)"   },
};

function getExcerpt(text: string, maxLen = 90): string {
  const first = text.split("\n")[0].trim();
  return first.length > maxLen ? first.slice(0, maxLen).trimEnd() + "…" : first;
}

function ExampleCard({ example, onClick, tilt }: { example: Example; onClick: () => void; tilt: number }) {
  const vs = verdictStyle[example.result.overallVerdict] ?? verdictStyle.UNVERIFIED;
  const excerpt = getExcerpt(example.result.extractedContent.text);
  const handle = example.result.extractedContent.accountHandle
    ? `@${example.result.extractedContent.accountHandle}`
    : example.result.accountSummary;
  const isIG = example.platform === "instagram";

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex flex-col text-left overflow-hidden transition-all duration-200 active:scale-[0.97] active:opacity-80"
      style={{
        borderRadius: "12px",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${vs.color}28`,
        backdropFilter: "blur(16px)",
        transform: `rotate(${tilt}deg)`,
        transformOrigin: "center bottom",
        boxShadow: `0 8px 24px ${vs.glow.replace("0.3", "0.12")}`,
      }}
    >
      {/* Verdict glow line at top */}
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${vs.color}, transparent)` }} />

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Platform + account */}
        <div className="flex items-center gap-2">
          <span style={{ color: isIG ? "#F472B6" : "#22D3EE" }}>
            {isIG ? <InstagramIcon className="w-3.5 h-3.5" /> : <TikTokIcon className="w-3.5 h-3.5" />}
          </span>
          <span className="text-xs font-mono truncate" style={{ color: "rgba(255,255,255,0.6)" }}>{handle}</span>
        </div>

        {/* Excerpt */}
        <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.7)" }}>{excerpt}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ color: vs.color, backgroundColor: vs.darkBg }}
          >
            {vs.label}
          </span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>preview →</span>
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

export default function UrlInput({ onSubmit, isLoading, error, onExample, onInfoClick }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  function handleChange(value: string) {
    setUrl(value);
    setPlatform(detectPlatformFromUrl(value));
    setValidationError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) { setValidationError("Please enter a URL."); return; }
    const p = detectPlatformFromUrl(url.trim());
    if (p === "unknown") { setValidationError("Please enter an Instagram or TikTok URL."); return; }
    onSubmit(url.trim());
  }

  const displayError = validationError ?? error;
  const isIG = platform === "instagram";
  const hasPlatform = platform !== "unknown";

  return (
    <form onSubmit={handleSubmit} className="w-full">

      {/* ── Gradient border input wrapper ─────────────── */}
      <div className="relative" style={{ padding: "1px", borderRadius: "12px" }}>
        {/* Animated gradient border */}
        <div
          className="absolute inset-0 rounded-[12px] transition-opacity duration-300 animate-ocean"
          style={{
            background: focused
              ? "linear-gradient(135deg, #2DD4BF, #22D3EE, #60A5FA, #2DD4BF)"
              : "linear-gradient(135deg, rgba(45,212,191,0.3), rgba(34,211,238,0.1), rgba(96,165,250,0.3))",
            backgroundSize: "300% 300%",
            opacity: focused ? 1 : 0.6,
          }}
        />
        {/* Input inner */}
        <div
          className="relative flex items-center gap-3 px-4 rounded-[11px]"
          style={{ background: "#0A1628", backdropFilter: "blur(20px)" }}
        >
          {hasPlatform ? (
            <span className="flex-shrink-0" style={{ color: isIG ? "#F472B6" : "#22D3EE" }}>
              {isIG ? <InstagramIcon className="w-5 h-5" /> : <TikTokIcon className="w-5 h-5" />}
            </span>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
          <input
            type="text"
            value={url}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Paste an Instagram or TikTok URL…"
            disabled={isLoading}
            className="flex-1 py-4 text-base bg-transparent outline-none disabled:opacity-50"
            style={{ color: "rgba(255,255,255,0.9)", caretColor: "#2DD4BF" }}
          />
        </div>
      </div>

      {displayError && (
        <p className="mt-2 text-sm" style={{ color: "#F87171" }}>{displayError}</p>
      )}

      {/* ── Animated gradient CTA button ──────────────── */}
      <button
        type="submit"
        disabled={isLoading || !url.trim()}
        className="relative mt-3 w-full py-4 rounded-[12px] text-sm font-bold text-white overflow-hidden transition-all duration-300 active:scale-[0.98]"
        style={{
          background: isLoading || !url.trim()
            ? "rgba(255,255,255,0.06)"
            : "linear-gradient(135deg, #2DD4BF 0%, #22D3EE 40%, #60A5FA 100%)",
          backgroundSize: "200% auto",
          animation: !isLoading && url.trim() ? "shimmer 3s linear infinite" : "none",
          color: isLoading || !url.trim() ? "rgba(255,255,255,0.55)" : "#060E1A",
          cursor: isLoading || !url.trim() ? "not-allowed" : "pointer",
          boxShadow: !isLoading && url.trim() ? "0 8px 32px rgba(45,212,191,0.3)" : "none",
        }}
      >
        {/* Shimmer overlay */}
        {!isLoading && url.trim() && (
          <span
            className="absolute inset-0 rounded-[12px]"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
              backgroundSize: "200% auto",
              animation: "shimmer 2s linear infinite",
            }}
          />
        )}
        <span className="relative">{isLoading ? "Analysing…" : "Fact Check"}</span>
      </button>

      {/* ── Example cards ─────────────────────────────── */}
      {onExample && (
        <div className="mt-12">
          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08))" }} />
            <p className="text-xs font-mono whitespace-nowrap" style={{ color: "rgba(255,255,255,0.55)" }}>
              try an example
            </p>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)" }} />
          </div>

          {/* Cards with alternating tilts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EXAMPLES.map((ex, i) => (
              <ExampleCard
                key={i}
                example={ex}
                onClick={() => onExample(i)}
                tilt={i % 2 === 0 ? -0.8 : 0.8}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Info link ─────────────────────────────────── */}
      {onInfoClick && (
        <button
          type="button"
          onClick={onInfoClick}
          className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-mono transition-all duration-200 active:scale-[0.98] active:opacity-75"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <span>ⓘ</span>
          <span>How VerifAI works</span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>→</span>
        </button>
      )}
    </form>
  );
}
