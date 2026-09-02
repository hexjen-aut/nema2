import Link from "next/link";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

// Phrases éditoriales pour les catégories connues. À défaut, on retombe sur
// la description saisie en admin, puis sur une phrase générique.
const EDITORIAL_PHRASES: Record<string, string> = {
  sacs: "Portez votre signature.",
  bonnets: "Votre style jusque dans les détails.",
  ensembles: "Composez votre propre harmonie.",
  accessoires: "Les détails qui vous ressemblent.",
};

function phraseFor(category: Category) {
  const key = category.name.trim().toLowerCase();
  return EDITORIAL_PHRASES[key] || category.description || "À composer avec vous.";
}

export default function Collections({ categories }: { categories: Category[] }) {
  return (
    <section id="collections" className="relative z-10 mx-auto max-w-wrap px-6 py-20 md:py-28">
      <Reveal>
        <h2 className="font-display text-4xl md:text-5xl">Explorez votre univers.</h2>
        <p className="mt-3 max-w-md text-noir/70">
          Des pièces différentes. Une même philosophie : vous laisser créer
          votre style.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c, i) => (
          <Reveal key={c.id} delay={i * 100}>
            <TiltCard className="group overflow-hidden rounded-2xl border border-noir/10 bg-card hover:border-orange">
              <div className="aspect-[4/5] overflow-hidden bg-rose">
                {c.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.image_url}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-noir/40">
                    Photo à ajouter depuis l'admin
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="font-display text-xl">{c.name}</p>
                <p className="mt-1 text-sm text-noir/60">{phraseFor(c)}</p>
                <Link
                  href={`/collections/${c.slug}`}
                  className="mt-4 inline-block text-sm text-orange hover:text-noir transition-colors"
                >
                  Explorer →
                </Link>
              </div>
            </TiltCard>
          </Reveal>
        ))}

        {categories.length === 0 && (
          <p className="col-span-full rounded-2xl border border-noir/10 bg-card p-10 text-center text-sm text-noir/40">
            Aucune catégorie pour le moment — ajoutez-en depuis l'admin.
          </p>
        )}
      </div>
    </section>
  );
}
