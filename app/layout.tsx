import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NEMA — Votre style, votre signature.",
  description:
    "Des créations personnalisables — sacs, bonnets, ensembles et accessoires en crochet — pensées pour vous permettre d'exprimer ce qui vous rend unique.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${cormorant.variable} ${manrope.variable} font-body bg-ivoire text-noir`}>
        {children}
      </body>
    </html>
  );
}
