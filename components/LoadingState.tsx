"use client";

import { useEffect, useState } from "react";

const STAGES = [
  { label: "Extracting content", description: "Fetching post data from platform" },
  { label: "Analysing claims", description: "Running AI fact-check pipeline" },
  { label: "Checking sources", description: "Cross-referencing with fact databases" },
];

export default function LoadingState() {
  const [currentStage, setCurrentStage] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => Math.min(prev + 1, 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (elapsed >= 8 && currentStage < 1) setCurrentStage(1);
    if (elapsed >= 20 && currentStage < 2) setCurrentStage(2);
  }, [elapsed, currentStage]);

  const displayTime = elapsed < 15 ? `${elapsed}s elapsed` : "Almost there...";

  return (
    <div className="w-full flex flex-col items-center gap-6 py-8">
      <div className="flex flex-col gap-3 w-full">
        {STAGES.map((stage, idx) => {
          const isActive = idx === currentStage;
          const isDone = idx < currentStage;

          return (
            <div
              key={stage.label}
              className={`
                flex items-center gap-4 p-4 rounded-[12px] border transition-all duration-500
                ${
                  isActive
                    ? "border-[#a78bfa] bg-[#a78bfa]/10"
                    : isDone
                    ? "border-[#34d399]/40 bg-[#34d399]/5"
                    : "border-[#1a1a30] bg-[#0e0e1c]"
                }
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0
                  ${
                    isActive
                      ? "bg-[#a78bfa]/20"
                      : isDone
                      ? "bg-[#34d399]/20"
                      : "bg-[#1a1a30]"
                  }
                `}
              >
                {isDone ? (
                  <span className="text-[#34d399] text-base">✓</span>
                ) : isActive ? (
                  <svg
                    className="w-4 h-4 text-[#a78bfa] animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <span className="text-[#64748b] text-xs font-mono">
                    {idx + 1}
                  </span>
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <span
                  className={`font-mono text-sm ${
                    isActive
                      ? "text-[#e2e8f0]"
                      : isDone
                      ? "text-[#34d399]"
                      : "text-[#64748b]"
                  }`}
                >
                  {stage.label}
                </span>
                {isActive && (
                  <span className="text-[#64748b] font-mono text-xs mt-0.5 animate-pulse">
                    {stage.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[#64748b] font-mono text-sm">{displayTime}</p>
    </div>
  );
}
