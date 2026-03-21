import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const VERDICT_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  TRUSTWORTHY: { label: "TRUSTWORTHY", color: "#4ADE80", bg: "#4ADE8020" },
  MISLEADING:  { label: "MISLEADING",  color: "#FB923C", bg: "#FB923C20" },
  FALSE:       { label: "FALSE",       color: "#F87171", bg: "#F8717120" },
  UNVERIFIED:  { label: "UNVERIFIED",  color: "#94A3B8", bg: "#94A3B820" },
};

const CLAIM_CFG: Record<string, { icon: string; color: string }> = {
  TRUE:        { icon: "✓", color: "#4ADE80" },
  MISLEADING:  { icon: "~", color: "#FB923C" },
  FALSE:       { icon: "✗", color: "#F87171" },
  UNVERIFIED:  { icon: "?", color: "#94A3B8" },
  NO_EVIDENCE: { icon: "?", color: "#94A3B8" },
};

export async function POST(req: NextRequest) {
  try {
    const { overallVerdict, verdictReason, credibilityScore, accountSummary, claims } =
      await req.json();

    const cfg   = VERDICT_CONFIG[overallVerdict] ?? VERDICT_CONFIG.UNVERIFIED;
    const score = Math.max(0, Math.min(100, credibilityScore ?? 50));
    const reason = ((verdictReason ?? "") as string).trim();
    const reasonText = reason.length > 210 ? reason.slice(0, 207) + "…" : reason;
    const topClaims  = ((claims ?? []) as Array<{ text: string; verdict: string }>).slice(0, 3);

    return new ImageResponse(
      (
        <div
          style={{
            width: 1080,
            height: 1080,
            background: "#060E1A",
            display: "flex",
            flexDirection: "column",
            padding: "64px 72px",
          }}
        >
          {/* ── Header ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #38BDF8, #3B82F6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                ✓
              </div>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#F0F9FF" }}>VerifAI</span>
            </div>

            {/* Verdict pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 26px",
                borderRadius: 100,
                background: cfg.bg,
                border: `1.5px solid ${cfg.color}`,
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 800, color: cfg.color, letterSpacing: 2 }}>
                {cfg.label}
              </span>
            </div>
          </div>

          {/* ── Account ── */}
          <div style={{ display: "flex", marginBottom: 28 }}>
            <span style={{ fontSize: 19, color: "#4DA6FF", fontWeight: 600 }}>
              {accountSummary ?? ""}
            </span>
          </div>

          {/* ── Score bar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#64748B", fontWeight: 500, letterSpacing: 1 }}>
                CREDIBILITY SCORE
              </span>
              <span style={{ fontSize: 20, color: cfg.color, fontWeight: 700 }}>
                {score}/100
              </span>
            </div>
            {/* Track */}
            <div style={{ display: "flex", width: "100%", height: 8, background: "#1E2D40", borderRadius: 8 }}>
              {/* Fill - use a separate div for the fill, no overflow needed */}
              <div
                style={{
                  width: `${score}%`,
                  height: 8,
                  background: cfg.color,
                  borderRadius: 8,
                }}
              />
            </div>
          </div>

          {/* ── Verdict reason ── */}
          <div
            style={{
              display: "flex",
              background: "#0D1B2A",
              border: "1px solid #1E2D40",
              borderRadius: 20,
              padding: "26px 30px",
              marginBottom: 36,
              height: 200,
            }}
          >
            <span style={{ fontSize: 20, color: "#A0B4C8", lineHeight: 1.6, fontWeight: 400 }}>
              {reasonText}
            </span>
          </div>

          {/* ── Claims ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
            {topClaims.map((claim, i) => {
              const cc = CLAIM_CFG[claim.verdict] ?? CLAIM_CFG.UNVERIFIED;
              const text = claim.text.length > 85 ? claim.text.slice(0, 82) + "…" : claim.text;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "#0D1B2A",
                      border: `1.5px solid ${cc.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 700,
                      color: cc.color,
                      flexShrink: 0,
                    }}
                  >
                    {cc.icon}
                  </div>
                  <span style={{ fontSize: 17, color: "#7A92A8", fontWeight: 400 }}>{text}</span>
                </div>
              );
            })}
          </div>

          {/* ── Footer ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #1E2D40",
              paddingTop: 26,
            }}
          >
            <span style={{ fontSize: 17, color: "#4DA6FF", fontWeight: 600 }}>verifai-it.com</span>
            <span style={{ fontSize: 15, color: "#2A3D50", fontWeight: 400 }}>
              Fact-checked with VerifAI · Free to use
            </span>
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
