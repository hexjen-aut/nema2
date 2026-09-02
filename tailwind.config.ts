import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette NEMA
        ivoire: "#FFFDF9",
        rose: "#F9E7E5",
        orange: "#F58220",
        noir: "#171414",
        champagne: "#D8C3B0",

        // Alias vers les anciens tokens, le temps de migrer chaque page.
        // À supprimer une fois admin/compte/configurateur repris.
        linen: "#FFFDF9", // -> ivoire
        card: "#FFFFFF",
        ink: "#171414", // -> noir
        clay: "#F58220", // -> orange
        gold: "#D8C3B0", // -> champagne
        moss: "#5F6B4A", // conservé tel quel (statuts "disponible" en admin)
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
      },
      maxWidth: {
        wrap: "1240px",
      },
      letterSpacing: {
        label: "0.14em",
      },
    },
  },
  plugins: [],
};

export default config;
