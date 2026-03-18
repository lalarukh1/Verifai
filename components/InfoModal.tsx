"use client";

interface InfoModalProps { onClose: () => void; }
interface Section { icon: string; title: string; body: string; }

const IS_FREE_MODE = process.env.NEXT_PUBLIC_MODE !== "paid";
const FREE_LIMIT = Number(process.env.NEXT_PUBLIC_FREE_CHECK_LIMIT ?? 10);

const sections: Section[] = [
  {
    icon: "🤖",
    title: "The AI",
    body: "Analysis is powered by Claude (claude-sonnet-4-6) by Anthropic, one of the most capable AI models available. Claude reads the post caption and any spoken audio, identifies specific factual claims, and evaluates each one based on what credible evidence says.",
  },
  {
    icon: "📥",
    title: "Content extraction",
    body: "VerifAI uses Apify to extract captions and metadata from Instagram and TikTok posts. For video posts, Deepgram transcribes the audio so that claims spoken in the video are also checked.",
  },
  {
    icon: "🔍",
    title: "Where sources come from",
    body: "For each claim, VerifAI searches Google News, trusted authorities (WHO, CDC, Reuters, AP, BBC), and a broad web fallback. Up to 5 real sources are returned per claim with links so you can read them yourself.",
  },
  {
    icon: "📊",
    title: "How the credibility score works",
    body: "The score starts at 50. It goes up by 20 if the account has over 100K followers, and by 10 if claims have verifiable sources. It goes down by 20 if the verdict is False or Misleading.",
  },
  IS_FREE_MODE
    ? {
        icon: "✨",
        title: "Free to use",
        body: "VerifAI is currently free to use — just add your email to get started. We only use it to track how many people are using the app and send occasional updates. We never spam or share your data.",
      }
    : {
        icon: "✨",
        title: "Free & paid",
        body: `Your first ${FREE_LIMIT} checks are completely free — no credit card required. After that, VerifAI is £4.99/month for unlimited checks. Cancel anytime.`,
      },
];

export default function InfoModal({ onClose }: InfoModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(6,14,26,0.85)", backdropFilter: "blur(16px)" }} />

      <div
        className="animate-scale-in relative w-full sm:max-w-[580px] rounded-t-[22px] sm:rounded-[12px] overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(32px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient top strip */}
        <div
          className="h-[2px] w-full animate-ocean"
          style={{ background: "linear-gradient(90deg, #2DD4BF, #22D3EE, #60A5FA, #A78BFA, #2DD4BF)", backgroundSize: "300% auto" }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#F0F9FF" }}>How VerifAI works</h2>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>The AI, the sources, the score — explained.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-6 space-y-6" style={{ maxHeight: "calc(90vh - 90px)" }}>
          {sections.map((s) => (
            <div key={s.title} className="flex gap-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0"
                style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.15)" }}
              >
                {s.icon}
              </div>
              <div className="pt-0.5">
                <p className="text-sm font-semibold mb-1.5" style={{ color: "#F0F9FF" }}>{s.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{s.body}</p>
              </div>
            </div>
          ))}

          <div
            className="px-4 py-3.5 rounded-2xl text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              VerifAI does not store your searches or share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
