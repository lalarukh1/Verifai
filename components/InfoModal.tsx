"use client";

interface InfoModalProps {
  onClose: () => void;
}

interface Section {
  icon: string;
  title: string;
  body: string;
}

const FREE_LIMIT = Number(process.env.NEXT_PUBLIC_FREE_CHECK_LIMIT ?? 10);

const sections: Section[] = [
  {
    icon: "🤖",
    title: "The AI",
    body: "Analysis is powered by Claude (claude-sonnet-4-6) by Anthropic, one of the most capable AI models available. Claude reads the post caption and any spoken audio, identifies specific factual claims, and evaluates each one based on what credible evidence says. It is built to be compassionate: emotional appeals and calls for humanity are never labelled as misinformation.",
  },
  {
    icon: "📥",
    title: "Content extraction",
    body: "VerifAI uses Apify to extract captions and metadata from Instagram and TikTok posts. For video posts, Deepgram transcribes the audio so that claims spoken in the video, not just the caption, are also checked.",
  },
  {
    icon: "🔍",
    title: "Where sources come from",
    body: "For each claim, VerifAI searches in three passes. First: Google News for recent reporting. Second: trusted authorities including WHO, CDC, Reuters, AP, BBC, The Guardian, and government sources. Third: a broad web search as a fallback. Up to 5 real sources are returned per claim, with links so you can read them yourself.",
  },
  {
    icon: "📊",
    title: "How the credibility score works",
    body: "The score starts at 50 (neutral). It goes up by 20 if the account has over 100,000 followers, and up by 10 if the claims have verifiable sources. It goes down by 20 if the overall verdict is False or Misleading. The final number sits between 0 and 100.",
  },
  {
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
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(7, 7, 17, 0.9)", backdropFilter: "blur(6px)" }}
      />

      {/* Sheet */}
      <div
        className="relative w-full sm:max-w-[600px] rounded-t-[24px] sm:rounded-[24px] overflow-hidden"
        style={{ backgroundColor: "#0e0e1c", border: "1px solid #252540", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-7 py-6 border-b"
          style={{ borderColor: "#1a1a30" }}
        >
          <div>
            <h2 className="text-xl font-mono font-bold" style={{ color: "#e2e8f0" }}>
              How VerifAI works
            </h2>
            <p className="text-sm mt-1" style={{ color: "#64748b", fontFamily: "var(--font-lora), serif" }}>
              The AI, the sources, the score — explained.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200 hover:border-[#3b2f6e] hover:text-[#a78bfa]"
            style={{ borderColor: "#1a1a30", color: "#64748b" }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-7 py-6 space-y-7" style={{ maxHeight: "calc(92vh - 90px)" }}>
          {sections.map((s) => (
            <div key={s.title} className="flex gap-5">
              {/* Icon bubble */}
              <div
                className="w-11 h-11 rounded-[12px] flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: "#13132a", border: "1px solid #1a1a30" }}
              >
                {s.icon}
              </div>

              <div className="pt-0.5">
                <p className="text-base font-mono font-semibold mb-2" style={{ color: "#e2e8f0" }}>
                  {s.title}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#94a3b8", fontFamily: "var(--font-lora), serif" }}
                >
                  {s.body}
                </p>
              </div>
            </div>
          ))}

          {/* Footer note */}
          <div
            className="px-5 py-4 rounded-[12px] border"
            style={{ backgroundColor: "#080815", borderColor: "#1a1a30" }}
          >
            <p className="text-sm font-mono text-center" style={{ color: "#475569" }}>
              VerifAI does not store your searches or share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
