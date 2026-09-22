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
        green: {
          DEFAULT: "#2EC97A",
          light: "#E8FAF1",
          mid: "#A8ECC8",
          dark: "#1DA85F",
        },
        blue: {
          DEFAULT: "#5B67F0",
          light: "#ECEEFF",
          mid: "#C5C8F8",
        },
        yellow: {
          DEFAULT: "#F5A623",
          light: "#FEF5E7",
        },
        dark: "#0F1117",
        surface: "#FAFBFC",
        border: "#E8EAED",
        muted: "#9CA3AF",
      },
      fontFamily: {
        sora: ["var(--font-sora)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        soft: "0 2px 12px rgba(0,0,0,0.06)",
        card: "0 4px 24px rgba(0,0,0,0.08)",
        lifted: "0 12px 48px rgba(0,0,0,0.12)",
        glow: "0 4px 24px rgba(46,201,122,0.30)",
      },
      keyframes: {
        floatA: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floatB: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(8px)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse2: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.85)" },
        },
        typewriter: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        blink: {
          "0%,100%": { borderColor: "transparent" },
          "50%": { borderColor: "#2EC97A" },
        },
      },
      animation: {
        floatA: "floatA 4s ease-in-out infinite",
        floatB: "floatB 4.5s ease-in-out infinite",
        fadeUp: "fadeUp 0.6s ease both",
        shimmer: "shimmer 2.5s linear infinite",
        pulse2: "pulse2 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
