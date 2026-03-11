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
        background: "#070711",
        surface: "#0e0e1c",
        border: "#1a1a30",
        accent: {
          cyan: "#6ee7f7",
          violet: "#a78bfa",
          pink: "#f472b6",
          green: "#34d399",
          red: "#ef4444",
          orange: "#f97316",
          yellow: "#eab308",
        },
        "text-primary": "#e2e8f0",
        "text-muted": "#64748b",
      },
      fontFamily: {
        mono: ["var(--font-dm-mono)", "monospace"],
        body: ["var(--font-lora)", "serif"],
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
