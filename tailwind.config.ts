import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#060E1A",
        surface: "rgba(255,255,255,0.04)",
        "ocean-900": "#060E1A",
        "ocean-800": "#0A1628",
        "ocean-700": "#0F2040",
        teal: {
          DEFAULT: "#2DD4BF",
          400: "#2DD4BF",
          500: "#14B8A6",
        },
        cyan: {
          DEFAULT: "#22D3EE",
          300: "#67E8F9",
          400: "#22D3EE",
        },
        // Verdict palette
        verdict: {
          trustworthy: "#34D399",
          misleading:  "#FBBF24",
          false:       "#F87171",
          unverified:  "#94A3B8",
        },
        "text-primary": "#F0F9FF",
        "text-muted":   "#64748B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      backgroundImage: {
        "ocean-gradient":  "linear-gradient(135deg, #2DD4BF 0%, #22D3EE 45%, #60A5FA 100%)",
        "ocean-gradient-full": "linear-gradient(135deg, #0A1628 0%, #060E1A 50%, #0A1628 100%)",
        "shimmer-gradient": "linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.15) 50%, transparent 100%)",
      },
      borderRadius: {
        "2.5xl": "20px",
        "3xl":   "24px",
        "4xl":   "32px",
      },
      animation: {
        "shimmer":    "shimmer 3s linear infinite",
        "ocean":      "ocean-shift 8s ease infinite",
        "float":      "float-slow 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "fade-up":    "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":    "fade-in 0.4s ease both",
        "scale-in":   "scale-in 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "spin-slow":  "spin-slow 12s linear infinite",
        "glow":       "glow-pulse 3s ease-in-out infinite",
      },
      keyframes: {
        "shimmer":     { "0%": { backgroundPosition: "-200% center" }, "100%": { backgroundPosition: "200% center" } },
        "ocean-shift": { "0%, 100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        "float-slow":  { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
        "fade-up":     { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "fade-in":     { from: { opacity: "0" }, to: { opacity: "1" } },
        "scale-in":    { from: { opacity: "0", transform: "scale(0.92)" }, to: { opacity: "1", transform: "scale(1)" } },
        "spin-slow":   { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        "glow-pulse":  { "0%, 100%": { opacity: "0.5" }, "50%": { opacity: "1" } },
      },
      padding: {
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top":    "env(safe-area-inset-top)",
      },
      boxShadow: {
        "teal-glow":  "0 0 30px rgba(45,212,191,0.3)",
        "teal-glow-lg": "0 0 60px rgba(45,212,191,0.2)",
        "glass":      "0 8px 32px rgba(0,0,0,0.4)",
        "glass-lg":   "0 20px 60px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
