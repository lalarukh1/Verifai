import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const VERDICT_CONFIG: Record<string, { label: string; color: string; bg: string; bar: string }> = {
  TRUSTWORTHY: { label: "TRUSTWORTHY",  color: "#4ADE80", bg: "rgba(74,222,128,0.12)",  bar: "#4ADE80" },
  MISLEADING:  { label: "MISLEADING",   color: "#FB923C", bg: "rgba(251,146,60,0.12)",  bar: "#FB923C" },
  FALSE:       { label: "FALSE",        color: "#F87171", bg: "rgba(248,113,113,0.12)", bar: "#F87171" },
  UNVERIFIED:  { label: "UNVERIFIED",   color: "#94A3B8", bg: "rgba(148,163,184,0.12)", bar: "#94A3B8" },
};

const CLAIM_VERDICT_CONFIG: Record<string, { icon: string; color: string }> = {
  TRUE:        { icon: "✓", color: "#4ADE80" },
  MISLEADING:  { icon: "~", color: "#FB923C" },
  FALSE:       { icon: "✗", color: "#F87171" },
  UNVERIFIED:  { icon: "?", color: "#94A3B8" },
  NO_EVIDENCE: { icon: "?", color: "#94A3B8" },
};

export async function POST(req: NextRequest) {
  try {
    const {
      overallVerdict,
      verdictReason,
      credibilityScore,
      accountSummary,
      claims,
    } = await req.json();

    const cfg = VERDICT_CONFIG[overallVerdict] ?? VERDICT_CONFIG.UNVERIFIED;
    const score = Math.max(0, Math.min(100, credibilityScore ?? 50));
    const scorePct = `${score}%`;

    // Truncate verdict reason
    const reason = (verdictReason ?? "").trim();
    const reasonText = reason.length > 200 ? reason.slice(0, 197) + "…" : reason;

    // Top 3 claims only
    const topClaims = (claims ?? []).slice(0, 3) as Array<{
      text: string;
      verdict: string;
    }>;

    // Inter font
    const interBold = await fetch(
      "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZJhiI2B.woff2"
    ).then((r) => r.arrayBuffer());

    const interRegular = await fetch(
      "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhiI2B.woff2"
    ).then((r) => r.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            width: 1080,
            height: 1080,
            background: "#060E1A",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Inter",
            padding: "72px",
            position: "relative",
          }}
        >
          {/* Subtle glow */}
          <div
            style={{
              position: "absolute",
              top: -200,
              right: -200,
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${cfg.color}18 0%, transparent 70%)`,
            }}
          />

          {/* Header: logo + verdict badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 56 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #38BDF8, #3B82F6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  color: "white",
                  fontWeight: 700,
                }}
              >
                ✓
              </div>
              <span style={{ fontSize: 30, fontWeight: 700, color: "#F0F9FF", letterSpacing: -0.5 }}>
                VerifAI
              </span>
            </div>

            {/* Verdict badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: cfg.bg,
                border: `1.5px solid ${cfg.color}40`,
                borderRadius: 100,
                padding: "12px 28px",
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 800, color: cfg.color, letterSpacing: 1.5 }}>
                {cfg.label}
              </span>
            </div>
          </div>

          {/* Account */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <span style={{ fontSize: 20, color: "#4DA6FF", fontWeight: 600 }}>
              {accountSummary ?? ""}
            </span>
          </div>

          {/* Credibility score bar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 44 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", fontWeight: 500, letterSpacing: 1, textTransform: "uppercase" }}>
                Credibility Score
              </span>
              <span style={{ fontSize: 20, color: cfg.color, fontWeight: 700 }}>
                {score}/100
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: 8,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 100,
                overflow: "hidden",
                display: "flex",
              }}
            >
              <div
                style={{
                  width: scorePct,
                  height: "100%",
                  background: `linear-gradient(90deg, ${cfg.bar}80, ${cfg.bar})`,
                  borderRadius: 100,
                }}
              />
            </div>
          </div>

          {/* Verdict reason */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: "28px 32px",
              marginBottom: 36,
              flex: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 22,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.55,
                fontWeight: 400,
              }}
            >
              {reasonText}
            </span>
          </div>

          {/* Claims */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 48 }}>
            {topClaims.map((claim, i) => {
              const claimCfg = CLAIM_VERDICT_CONFIG[claim.verdict] ?? CLAIM_VERDICT_CONFIG.UNVERIFIED;
              const claimText = claim.text.length > 80 ? claim.text.slice(0, 77) + "…" : claim.text;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: `${claimCfg.color}18`,
                      border: `1.5px solid ${claimCfg.color}50`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: 700,
                      color: claimCfg.color,
                      flexShrink: 0,
                    }}
                  >
                    {claimCfg.icon}
                  </div>
                  <span style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>
                    {claimText}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 28,
            }}
          >
            <span style={{ fontSize: 18, color: "#4DA6FF", fontWeight: 600 }}>verifai-it.com</span>
            <span style={{ fontSize: 16, color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>
              Fact-checked with VerifAI · Free to use
            </span>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1080,
        fonts: [
          { name: "Inter", data: interRegular, weight: 400 },
          { name: "Inter", data: interBold,    weight: 700 },
        ],
      }
    );
  } catch (err) {
    console.error("Share card error:", err);
    return new Response("Failed to generate image", { status: 500 });
  }
}
