"use client";

import { useEffect, useRef, useState } from "react";

interface ScoreRingProps {
  value: number; // 0–100
  label: string;
  color: string;
}

export default function ScoreRing({ value, label, color }: ScoreRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const animRef = useRef<number | null>(null);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const clampedTarget = Math.min(100, Math.max(0, Math.round(value)));
    const duration = 900;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(clampedTarget * eased));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    }

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          {/* Track */}
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke="#1a1a30"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.04s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-xl font-bold" style={{ color }}>
            {animatedValue}
          </span>
        </div>
      </div>
      <span className="text-[#64748b] font-mono text-xs uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
