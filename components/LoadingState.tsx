"use client";

import { useEffect, useState } from "react";

const STAGES = [
  { label: "Extracting content",  description: "Fetching post data from platform" },
  { label: "Analysing claims",    description: "Running AI fact-check pipeline"   },
  { label: "Checking sources",    description: "Cross-referencing with databases" },
];

export default function LoadingState() {
  const [currentStage, setCurrentStage] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((p) => Math.min(p + 1, 60)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (elapsed >= 8  && currentStage < 1) setCurrentStage(1);
    if (elapsed >= 20 && currentStage < 2) setCurrentStage(2);
  }, [elapsed, currentStage]);

  const messages = [
    { until: 5,        text: "Reading the post…"               },
    { until: 10,       text: "Identifying factual claims…"      },
    { until: 16,       text: "Consulting trusted sources…"      },
    { until: 22,       text: "Weighing the evidence…"           },
    { until: 30,       text: "Double-checking a few sources…"   },
    { until: 40,       text: "This one has a lot to unpack…"    },
    { until: Infinity, text: "Still on it, almost there…"       },
  ];
  const displayMsg = messages.find((m) => elapsed < m.until)!.text;

  return (
    <div className="w-full flex flex-col items-center gap-5 py-6">
      {STAGES.map((stage, idx) => {
        const isActive = idx === currentStage;
        const isDone   = idx < currentStage;

        return (
          <div
            key={stage.label}
            className="w-full flex items-center gap-4 p-4 rounded-[12px] transition-all duration-500 relative overflow-hidden"
            style={{
              background: isActive
                ? "rgba(45,212,191,0.06)"
                : isDone
                ? "rgba(52,211,153,0.04)"
                : "rgba(255,255,255,0.03)",
              border: `1px solid ${isActive ? "rgba(45,212,191,0.3)" : isDone ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.06)"}`,
              boxShadow: isActive ? "0 0 24px rgba(45,212,191,0.1)" : "none",
            }}
          >
            {/* Shimmer on active */}
            {isActive && (
              <div
                className="absolute inset-0 rounded-[12px]"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(45,212,191,0.06), transparent)",
                  backgroundSize: "200% auto",
                  animation: "shimmer 2s linear infinite",
                }}
              />
            )}

            {/* Icon */}
            <div
              className="relative w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: isActive
                  ? "rgba(45,212,191,0.15)"
                  : isDone
                  ? "rgba(52,211,153,0.12)"
                  : "rgba(255,255,255,0.05)",
              }}
            >
              {isDone ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7L5.5 10.5L12 3.5" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : isActive ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#2DD4BF" strokeWidth="3" />
                  <path className="opacity-80" fill="#2DD4BF" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <span className="text-xs font-mono font-bold" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {idx + 1}
                </span>
              )}
            </div>

            {/* Text */}
            <div className="relative flex flex-col min-w-0">
              <span
                className="text-sm font-semibold"
                style={{
                  color: isActive ? "#2DD4BF" : isDone ? "#34D399" : "rgba(255,255,255,0.25)",
                }}
              >
                {stage.label}
              </span>
              {isActive && (
                <span className="text-xs mt-0.5 animate-pulse" style={{ color: "rgba(45,212,191,0.6)" }}>
                  {stage.description}
                </span>
              )}
            </div>
          </div>
        );
      })}

      <p className="text-sm font-mono animate-pulse" style={{ color: "rgba(255,255,255,0.3)" }}>
        {displayMsg}
      </p>
    </div>
  );
}
