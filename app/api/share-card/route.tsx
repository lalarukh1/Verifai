import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const VERDICT_CFG: Record<string, { label: string; color: string }> = {
  TRUSTWORTHY: { label: "Trustworthy", color: "#34D399" },
  MISLEADING:  { label: "Misleading",  color: "#F97316" },
  FALSE:       { label: "False",       color: "#F87171" },
  UNVERIFIED:  { label: "Unverified",  color: "#94A3B8" },
};

const CLAIM_COLOR: Record<string, string> = {
  TRUE: "#34D399", FALSE: "#F87171", MISLEADING: "#F97316",
  UNVERIFIED: "#94A3B8", NO_EVIDENCE: "#94A3B8",
};

const CLAIM_LABEL: Record<string, string> = {
  TRUE: "True", FALSE: "False", MISLEADING: "Misleading",
  UNVERIFIED: "Unverified", NO_EVIDENCE: "No Evidence",
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

function scoreGrad(s: number) {
  if (s > 65) return "linear-gradient(90deg, #34D399, #22C55E)";
  if (s > 35) return "linear-gradient(90deg, #FBBF24, #F97316)";
  return "linear-gradient(90deg, #F97316, #EC4899)";
}

const IG_PATH = "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z";
const TT_PATH = "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.54V6.81a4.85 4.85 0 01-1.01-.12z";

const VALID_VERDICTS = new Set(["TRUSTWORTHY", "MISLEADING", "FALSE", "UNVERIFIED"]);
const VALID_PLATFORMS = new Set(["instagram", "tiktok"]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { overallVerdict, credibilityScore, accountHandle, accountFollowers, platform, claims, sourceCount } = body;

    // Input validation
    if (overallVerdict !== undefined && !VALID_VERDICTS.has(overallVerdict)) {
      return new Response("Invalid verdict", { status: 400 });
    }
    if (platform !== undefined && !VALID_PLATFORMS.has(platform)) {
      return new Response("Invalid platform", { status: 400 });
    }
    if (credibilityScore !== undefined && (typeof credibilityScore !== "number" || credibilityScore < 0 || credibilityScore > 100)) {
      return new Response("Invalid credibilityScore", { status: 400 });
    }
    if (accountHandle !== undefined && (typeof accountHandle !== "string" || accountHandle.length > 100)) {
      return new Response("Invalid accountHandle", { status: 400 });
    }
    if (claims !== undefined && !Array.isArray(claims)) {
      return new Response("Invalid claims", { status: 400 });
    }

    const cfg = VERDICT_CFG[overallVerdict] ?? VERDICT_CFG.UNVERIFIED;
    const score = Math.max(0, Math.min(100, credibilityScore ?? 50));
    const isIG = platform === "instagram";
    const topClaims = ((claims ?? []) as Array<{ text: string; verdict: string }>).slice(0, 4);
    const totalSources = sourceCount ?? 0;
    const claimCount = topClaims.length;
    const footerText = totalSources > 0
      ? `${totalSources} source${totalSources !== 1 ? "s" : ""} across ${claimCount} claim${claimCount !== 1 ? "s" : ""}`
      : claimCount > 0 ? `${claimCount} claim${claimCount !== 1 ? "s" : ""} analysed` : "Verified by VerifAI";

    // Pre-render claims to avoid conditional JSX issues
    const claimItems = topClaims.map((claim, idx) => {
      const color = CLAIM_COLOR[claim.verdict] ?? "#94A3B8";
      const label = CLAIM_LABEL[claim.verdict] ?? claim.verdict;
      const text = claim.text.length > 85 ? claim.text.slice(0, 82) + "..." : claim.text;
      return (
        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 22px", borderRadius: 18, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: idx < topClaims.length - 1 ? 12 : 0 }}>
          <div style={{ display: "flex", width: 14, height: 14, borderRadius: "50%", background: color, flexShrink: 0 }} />
          <span style={{ display: "flex", fontSize: 18, color: "rgba(255,255,255,0.75)", fontWeight: 400, flex: 1 }}>{text}</span>
          <div style={{ display: "flex", padding: "5px 16px", borderRadius: 100, background: `${color}22`, border: `1px solid ${color}55`, flexShrink: 0 }}>
            <span style={{ display: "flex", fontSize: 14, fontWeight: 700, color }}>{label}</span>
          </div>
        </div>
      );
    });

    return new ImageResponse(
      (
        <div style={{ display: "flex", width: 1080, height: 1080, background: "#060E1A", alignItems: "center", justifyContent: "center", padding: "36px" }}>
          {/* Card */}
          <div style={{ display: "flex", flexDirection: "column", width: "100%", borderRadius: 24, background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.09)" }}>

            {/* Top strip */}
            <div style={{ display: "flex", height: 6, width: "100%", background: "linear-gradient(90deg, #2DD4BF, #22D3EE, #60A5FA, #A78BFA, #2DD4BF)", borderRadius: "24px 24px 0 0" }} />

            {/* Body */}
            <div style={{ display: "flex", flexDirection: "column", padding: "48px 56px" }}>

              {/* Account row */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36 }}>
                <div style={{ display: "flex", width: 64, height: 64, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: isIG ? "linear-gradient(135deg, #F97316, #EC4899)" : "linear-gradient(135deg, #010101, #1a1a2e)", flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" width={34} height={34} fill="white">
                    <path d={isIG ? IG_PATH : TT_PATH} />
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#F0F9FF" }}>
                    {accountHandle ? `@${accountHandle}` : "Unknown account"}
                  </span>
                  {accountFollowers != null ? (
                    <span style={{ display: "flex", fontSize: 18, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                      {fmt(accountFollowers)} followers
                    </span>
                  ) : null}
                </div>
                <div style={{ display: "flex", marginLeft: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 22px", borderRadius: 100, background: `${cfg.color}22`, border: `1px solid ${cfg.color}55` }}>
                    <div style={{ display: "flex", width: 10, height: 10, borderRadius: "50%", background: cfg.color }} />
                    <span style={{ display: "flex", fontSize: 20, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                  </div>
                </div>
              </div>

              {/* Score bar */}
              <div style={{ display: "flex", flexDirection: "column", marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ display: "flex", fontSize: 16, color: "rgba(255,255,255,0.55)" }}>Credibility score</span>
                  <span style={{ display: "flex", fontSize: 22, fontWeight: 900, color: cfg.color }}>{score} / 100</span>
                </div>
                <div style={{ display: "flex", width: "100%", height: 14, background: "rgba(255,255,255,0.08)", borderRadius: 100 }}>
                  <div style={{ display: "flex", width: `${score}%`, height: 14, borderRadius: 100, background: scoreGrad(score) }} />
                </div>
              </div>

              {/* Claims */}
              <div style={{ display: "flex", flexDirection: "column", marginBottom: 32 }}>
                {claimItems}
              </div>

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
                <span style={{ display: "flex", fontSize: 16, color: "rgba(255,255,255,0.35)" }}>{footerText}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", width: 26, height: 26, borderRadius: "6px", background: "linear-gradient(135deg, #2DD4BF, #22D3EE, #60A5FA)", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 96 96" fill="none">
                      <path d="M20 52 C23 52 30 61 36 67 C42 73 68 18 96 0" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ display: "flex", fontSize: 16, fontWeight: 700, color: "#4DA6FF" }}>VerifAI</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      ),
      { width: 1080, height: 1080 }
    );
  } catch (err) {
    console.error("Share card error:", err);
    return new Response("Failed to generate image", { status: 500 });
  }
}
