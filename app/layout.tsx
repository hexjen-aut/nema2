import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import ScrollYarnProgress from "@/components/ScrollYarnProgress";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nema — Un sac, une âme",
  description:
    "Sacs, bonnets et ensembles en crochet façonnés à la main, personnalisés pièce par pièce.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${workSans.variable} font-body`}>
        <ScrollYarnProgress />
        {children}
      </body>
    </html>
  );
}
