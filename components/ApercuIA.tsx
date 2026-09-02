import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function ApercuIA() {
  return (
    <section className="relative z-10 mx-auto max-w-wrap px-6 py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <Reveal>
          <h2 className="font-display text-4xl leading-[1.15] md:text-5xl">
            Voyez-la avant qu'elle existe.
          </h2>
          <p className="mt-6 max-w-md text-noir/70">
            Votre création est visualisée avant sa fabrication pour vous
            permettre de découvrir son rendu et de valider votre idée.
          </p>
          <Link
            href="/personnaliser"
            className="mt-8 inline-block rounded-full border border-noir px-7 py-3.5 text-sm hover:bg-noir hover:text-ivoire transition-colors"
          >
            Essayer le configurateur
          </Link>
        </Reveal>

        <Reveal delay={150}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-full max-w-sm">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-champagne/30">
                <div className="flex h-full items-center justify-center text-xs text-noir/40">
                  Configuration en cours
                </div>
              </div>
              <p className="mt-2 text-xs tracking-label text-noir/50">AVANT — Configuration.</p>
            </div>

            <span aria-hidden="true" className="text-xl text-orange">↓</span>

            <div className="w-full max-w-sm">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-rose">
                <div className="flex h-full items-center justify-center text-xs text-noir/40">
                  Aperçu généré à venir
                </div>
              </div>
              <p className="mt-2 text-xs tracking-label text-noir/50">APRÈS — Rendu final.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
