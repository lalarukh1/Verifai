"use client";

import { useState } from "react";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: text, source: "App" }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Could not send feedback. Please try again.");
      setStatus("error");
    }
  }

  function handleClose() {
    setOpen(false);
    setStatus("idle");
    setText("");
    setErrorMsg("");
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      {open && (
        <div
          className="mb-3 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: 300,
            background: "linear-gradient(160deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(32px)",
          }}
        >
          {/* Gradient strip */}
          <div
            className="h-[2px] w-full animate-ocean"
            style={{ background: "linear-gradient(90deg, #2DD4BF, #22D3EE, #60A5FA, #A78BFA, #2DD4BF)", backgroundSize: "300% auto" }}
          />

          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-sm font-bold" style={{ color: "#F0F9FF" }}>Share feedback</p>
            <button
              onClick={handleClose}
              style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1 }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="p-4">
            {status === "success" ? (
              <div className="text-center py-4">
                <p style={{ fontSize: 28 }}>🙏</p>
                <p className="text-sm font-semibold mt-2" style={{ color: "#2DD4BF" }}>Thank you!</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>We read every message.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="We appreciate any kind of feedback. Bugs, ideas, impressions, anything goes!"
                  rows={4}
                  disabled={status === "loading"}
                  style={{
                    width: "100%", resize: "none", borderRadius: 10, padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#F0F9FF", fontSize: 13, outline: "none", lineHeight: 1.6,
                  }}
                />
                {status === "error" && (
                  <p className="text-xs mt-1" style={{ color: "#EF4444" }}>{errorMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading" || !text.trim()}
                  className="w-full mt-3 py-2.5 rounded-full text-sm font-bold transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #2DD4BF, #22D3EE)",
                    color: "#060E1A",
                    opacity: (status === "loading" || !text.trim()) ? 0.5 : 1,
                    cursor: (status === "loading" || !text.trim()) ? "not-allowed" : "pointer",
                    border: "none",
                  }}
                >
                  {status === "loading" ? "Sending..." : "Send feedback"}
                </button>
                <p className="text-xs mt-2 text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
                  We read every message and will personally reach out if you asked us to.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold shadow-lg transition-all hover:opacity-90 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #7C3AED, #BE185D)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1h12v8.5H8L5 13v-3.5H1V1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        {open ? "Close" : "Give feedback"}
      </button>
    </div>
  );
}
