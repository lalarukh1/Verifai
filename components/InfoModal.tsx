"use client";

interface InfoModalProps {
  onClose: () => void;
}

interface Section {
  icon: string;
  title: string;
  body: string;
}

const sections: Section[] = [
  {
    icon: "🤖",
    title: "The AI",
    body: "Analysis is powered by Claude (claude-sonnet-4-6) by Anthropic, one of the most capable AI models available. Claude reads the post caption and any spoken audio, identifies specific factual claims, and evaluates each one based on what credible evidence says. It is built to be compassionate: emotional appeals and calls for humanity are never labelled as misinformation.",
  },
  {
    icon: "📥",
    title: "Content extraction",
    body: "VerifAI uses Apify to extract captions and metadata from Instagram, TikTok, and YouTube posts. For video posts, Deepgram transcribes the audio so that claims spoken in the video, not just the caption, are also checked.",
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
    icon: "⚠️",
    title: "Limitations",
    body: "VerifAI can only check public posts on Instagram, TikTok, and YouTube. It cannot access private accounts. Sources are drawn from what is publicly indexed at the time of the check. Very recent events may have limited coverage. Always read the linked sources yourself before drawing conclusions.",
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
        style={{ backgroundColor: "rgba(7, 7, 17, 0.85)", backdropFilter: "blur(4px)" }}
      />

      {/* Sheet */}
      <div
        className="relative w-full sm:max-w-[560px] rounded-t-[20px] sm:rounded-[20px] overflow-hidden"
        style={{ backgroundColor: "#0e0e1c", border: "1px solid #1a1a30", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: "#1a1a30" }}
        >
          <div>
            <h2 className="text-base font-mono font-semibold" style={{ color: "#e2e8f0" }}>
              How VerifAI works
            </h2>
            <p className="text-xs font-mono mt-0.5" style={{ color: "#64748b" }}>
              What it uses, how it decides, where sources come from
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[#1a1a30]"
            style={{ color: "#64748b" }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5" style={{ maxHeight: "calc(90vh - 80px)" }}>
          {sections.map((s) => (
            <div key={s.title} className="flex gap-4">
              <span className="text-xl mt-0.5 shrink-0">{s.icon}</span>
              <div>
                <p className="text-sm font-mono font-semibold mb-1.5" style={{ color: "#e2e8f0" }}>
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
            className="mt-2 px-4 py-3 rounded-[10px] border"
            style={{ backgroundColor: "#0a0a18", borderColor: "#1a1a30" }}
          >
            <p className="text-xs font-mono text-center" style={{ color: "#475569" }}>
              VerifAI does not store your searches or share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
