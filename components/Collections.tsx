import Link from "next/link";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import { stitchPattern } from "@/lib/placeholder-pattern";

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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-label text-orange">NOS COLLECTIONS</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Explorez votre univers.</h2>
            <p className="mt-3 max-w-md text-noir/70">
              Des pièces différentes. Une même philosophie : vous laisser créer
              votre style.
            </p>
          </div>
          <Link
            href="/collections"
            className="text-sm text-orange hover:text-noir transition-colors"
          >
            Voir toutes les collections →
          </Link>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c, i) => (
          <Reveal key={c.id} delay={i * 100}>
            <TiltCard className="group overflow-hidden rounded-2xl border border-noir/10 bg-card hover:border-orange">
              <div className="relative aspect-[4/5] overflow-hidden bg-rose">
                {c.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.image_url}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div
                    className="flex h-full items-center justify-center text-xs text-noir/40"
                    style={stitchPattern("#2B1810")}
                  >
                    Photo à ajouter depuis l'admin
                  </div>
                )}
                <Link
                  href={`/collections/${c.slug}`}
                  aria-label={`Explorer ${c.name}`}
                  className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivoire text-noir transition-colors group-hover:bg-orange group-hover:text-ivoire"
                >
                  →
                </Link>
              </div>
              <div className="p-5">
                <p className="font-display text-xl italic">{c.name}</p>
                <p className="mt-1 text-sm text-noir/60">{phraseFor(c)}</p>
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
