import type { ReactNode } from "react";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export default function LegalLayout({
  accountHref,
  eyebrow,
  title,
  updated,
  children,
}: {
  accountHref: string;
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-nema-motif text-noir">
      <CursorGlow />
      <Navbar accountHref={accountHref} />

      <section className="relative z-10 mx-auto max-w-wrap px-6 py-20 md:py-28">
        <Reveal>
          <p className="text-xs tracking-label text-orange">{eyebrow}</p>
          <h1 className="mt-5 font-display text-4xl md:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-noir/50">Dernière mise à jour : {updated}</p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 max-w-2xl rounded-2xl border border-noir/10 bg-card p-8 text-sm leading-relaxed text-noir/80">
            <div className="space-y-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-noir [&_h2]:mb-2 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
              {children}
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
