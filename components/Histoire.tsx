import Reveal from "@/components/Reveal";

export default function Histoire() {
  return (
    <section id="histoire" className="relative z-10 mx-auto max-w-wrap px-6 py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <Reveal>
          <div className="aspect-[4/5] overflow-hidden rounded-[28px] bg-champagne/30">
            <div className="flex h-full items-center justify-center px-6 text-center text-xs text-noir/40">
              Photo à ajouter depuis l'admin — atelier, création ou portrait
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <h2 className="font-display text-4xl leading-[1.15] md:text-5xl">
            Tout commence par une idée.
          </h2>
          <p className="mt-6 text-noir/70">
            NEMA est née d'une envie simple : permettre à chacun de créer
            quelque chose qui lui ressemble vraiment.
          </p>
          <p className="mt-4 text-noir/70">
            Les créations toutes faites, produites en série, ne racontent
            rien de la personne qui les porte. NEMA existe pour changer ça —
            en remettant la personnalisation, et le soin porté à chaque
            pièce, au centre de l'expérience.
          </p>
          <p className="mt-4 text-noir/70">
            Chaque création est façonnée à la main, au crochet, pièce par
            pièce. C'est ce travail artisanal qui permet à chaque détail —
            une couleur, une forme, une finition — de vous appartenir
            vraiment.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
