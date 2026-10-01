import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-creato)", "system-ui", "sans-serif"],
        sans:    ["var(--font-creato)", "system-ui", "sans-serif"],
      },
      colors: {
        green:  { DEFAULT: "#2EC97A", light: "rgba(46,201,122,0.12)", mid: "rgba(46,201,122,0.25)" },
        blue:   { DEFAULT: "#5B67F0", light: "rgba(91,103,240,0.12)", mid: "rgba(91,103,240,0.25)" },
        yellow: { DEFAULT: "#F5A623", light: "rgba(245,166,35,0.12)", mid: "rgba(245,166,35,0.25)" },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(90deg, #5B67F0 0%, #2EC97A 100%)",
        "gradient-brand-135": "linear-gradient(135deg, #5B67F0 0%, #2EC97A 100%)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(.22, 1, .36, 1)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
    },
  },
  plugins: [],
};
export default config;
