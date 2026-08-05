import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        linen: "#EDE4D3",
        card: "#F7F1E4",
        ink: "#2B2318",
        clay: "#A85D3B",
        gold: "#C99A44",
        moss: "#5F6B4A",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-work-sans)", "sans-serif"],
      },
      maxWidth: {
        wrap: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
