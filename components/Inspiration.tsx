import Reveal from "@/components/Reveal";

// Grille UGC : en attendant de vraies photos partagées par les clientes,
// on affiche des emplacements réservés cohérents avec l'identité.
const placeholders = Array.from({ length: 8 });

export default function Inspiration() {
  return (
    <section id="inspiration" className="relative z-10 bg-card py-20 md:py-28">
      <div className="mx-auto max-w-wrap px-6">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl">Ce que vous créez nous inspire.</h2>
          <p className="mt-3 max-w-md text-noir/70">
            Vos créations, vos couleurs, vos détails — partagés par la
            communauté NEMA.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {placeholders.map((_, i) => (
            <Reveal key={i} delay={(i % 4) * 80}>
              <div className="aspect-square overflow-hidden rounded-xl bg-rose/60">
                <div className="flex h-full items-center justify-center px-2 text-center text-[11px] text-noir/40">
                  #MyNEMA
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#"
              className="rounded-full bg-orange px-7 py-3.5 text-sm text-ivoire hover:bg-noir transition-colors"
            >
              Partager ma création
            </a>
            <a
              href="#"
              className="rounded-full border border-noir px-7 py-3.5 text-sm hover:bg-noir hover:text-ivoire transition-colors"
            >
              Voir la communauté
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
