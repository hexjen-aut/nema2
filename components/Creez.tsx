import Reveal from "@/components/Reveal";

const stages = [
  { key: "produit_vierge", label: "Produit vierge", note: "Le modèle avant personnalisation" },
  { key: "personnalisation", label: "Personnalisation", note: "Couleurs et détails composés" },
  { key: "creation_finale", label: "Création finale", note: "Votre pièce, prête à être fabriquée" },
] as const;

type Images = Partial<Record<(typeof stages)[number]["key"], string | null>>;

export default function Creez({ images = {} }: { images?: Images }) {
  return (
    <section id="creez" className="relative z-10 bg-rose/60 py-20 md:py-28">
      <div className="mx-auto max-w-wrap px-6">
        <Reveal>
          <p className="text-xs tracking-label text-orange">
            VOTRE CRÉATION COMMENCE ICI
          </p>
          <h2 className="mt-5 max-w-xl font-display text-4xl leading-[1.15] md:text-5xl">
            Vous l'imaginez.
            <br />
            NEMA lui donne vie.
          </h2>
          <p className="mt-6 max-w-md text-noir/70">
            Choisissez une pièce, composez ses couleurs et ajoutez les
            détails qui feront d'elle votre création.
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {stages.map((stage, i) => {
            const imageUrl = images[stage.key];
            return (
              <div key={stage.key} className="contents">
                <Reveal delay={i * 120}>
                  <div className="text-center">
                    <div className="aspect-square overflow-hidden rounded-2xl bg-ivoire">
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt={stage.label} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center text-xs text-noir/35">
                          Photo à ajouter depuis l'admin
                        </div>
                      )}
                    </div>
                    <p className="mt-4 font-display text-lg">{stage.label}</p>
                    <p className="text-xs text-noir/50">{stage.note}</p>
                  </div>
                </Reveal>
                {i < stages.length - 1 && (
                  <span aria-hidden="true" className="hidden text-2xl text-orange md:block">
                    →
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
