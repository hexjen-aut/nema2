import Reveal from "@/components/Reveal";
import { stitchPattern } from "@/lib/placeholder-pattern";

const values = [
  { title: "Liberté", detail: "Vous choisissez." },
  { title: "Créativité", detail: "Vous imaginez." },
  { title: "Individualité", detail: "Vous affirmez votre identité." },
];

// Section "Notre philosophie" : texte + visuel côte à côte, image éditable
// depuis l'admin (Contenu Home → Notre philosophie).
export default function Philosophie({ imageUrl }: { imageUrl?: string | null }) {
  return (
    <section id="philosophie" className="relative z-10 bg-rose/60 py-20 md:py-28">
      <div className="mx-auto grid max-w-wrap gap-12 px-6 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className="text-xs tracking-label text-orange">NOTRE PHILOSOPHIE</p>
          <h2 className="mt-4 max-w-lg font-display text-4xl leading-[1.2] md:text-5xl">
            Pourquoi porter quelque chose qui ressemble à tout le monde ?
          </h2>
          <p className="mt-6 max-w-md text-noir/70">
            Votre style évolue. Votre personnalité aussi. Vos créations
            devraient pouvoir évoluer avec vous.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <p className="font-display text-2xl">{v.title}</p>
                <p className="mt-2 text-sm text-noir/60">{v.detail}</p>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-champagne/40">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Philosophie NEMA"
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full items-center justify-center text-xs text-noir/40"
                style={stitchPattern("#2B1810")}
              >
                Photo à ajouter depuis l'admin (Contenu Home → Notre philosophie)
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
