"use client";

interface InfoModalProps { onClose: () => void; }
interface Section { icon: string; title: string; body: string; }

const IS_FREE_MODE = process.env.NEXT_PUBLIC_MODE !== "paid";
const FREE_LIMIT = Number(process.env.NEXT_PUBLIC_FREE_CHECK_LIMIT ?? 10);

const sections: Section[] = [
  {
    icon: "🤖",
    title: "The AI",
    body: "VerifAI uses a state-of-the-art large language model to read the post, pull out specific factual claims, and assess each one against real evidence. It reasons about what's supported, what's contested, and what simply can't be verified.",
  },
  {
    icon: "📥",
    title: "How posts are read",
    body: "When you paste a link, we extract the caption and any on-screen text from the post. For videos, we also transcribe the spoken audio, so claims said out loud are checked too, not just what's written.",
  },
  {
    icon: "🔍",
    title: "Where sources come from",
    body: "For each claim, we search across news outlets, public health bodies, and the broader web to find relevant evidence. Up to 5 real sources are returned per claim with links so you can read them yourself.",
  },
  {
    icon: "📊",
    title: "How the credibility score works",
    body: "The score starts at 50. It rises when claims are backed by verifiable sources or confirmed true. It falls when the verdict is False or Misleading, or when no supporting evidence can be found.",
  },
  IS_FREE_MODE
    ? {
        icon: "✨",
        title: "Free during beta",
        body: "VerifAI is free to use during early access. No credit card, no catch. We only ask for your email so we can share updates as we improve the product. We never spam or share your data.",
      }
    : {
        icon: "✨",
        title: "Free & paid",
        body: `Your first ${FREE_LIMIT} checks are completely free, no credit card required. After that, VerifAI is £4.99/month for unlimited checks. Cancel anytime.`,
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
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>The AI, the sources, the score, explained.</p>
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
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
              VerifAI does not store your searches or share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
