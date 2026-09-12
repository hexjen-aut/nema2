import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette NEMA — cuivre / bronze / beige (identité 2026)
        ivoire: "#FBF6EF",
        rose: "#F1E4D6",
        orange: "#A9683A",
        noir: "#2B1810",
        champagne: "#D7C6B5",

        // Alias vers les anciens tokens, le temps de migrer chaque page.
        // À supprimer une fois admin/compte/configurateur repris.
        linen: "#FBF6EF", // -> ivoire
        card: "#FFFFFF",
        ink: "#2B1810", // -> noir
        clay: "#A9683A", // -> orange
        gold: "#D7C6B5", // -> champagne
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
