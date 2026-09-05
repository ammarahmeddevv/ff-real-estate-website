import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        ivory: "var(--ivory)",
        paper: "var(--paper)",
        gold: "var(--gold)",
        "gold-deep": "var(--gold-deep)",
        "gray-500": "var(--gray-500)",
        "gray-200": "var(--gray-200)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: { content: "1240px" },
    },
  },
  plugins: [],
};

export default config;
