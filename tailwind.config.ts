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
      // Default any bare `border` to transparent instead of Tailwind's built-in
      // gray-200 (#e5e7eb, not one of our tokens). Elements that want a visible
      // hairline set an explicit token colour (`border-gray-200`, `border-gold`).
      borderColor: {
        DEFAULT: "transparent",
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
