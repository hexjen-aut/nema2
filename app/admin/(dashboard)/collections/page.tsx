import Link from "next/link";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import MagneticButton from "@/components/MagneticButton";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function CollectionsPage() {
  const supabase = createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description, image_url, products(id, is_active)")
    .order("position", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const accountHref = user ? "/compte/mon-compte" : "/compte/connexion";

  return (
    <main className="min-h-screen bg-linen text-ink">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-wrap items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="hidden gap-8 text-sm md:flex">
            <Link href="/collections" className="nav-link text-clay">
              Collections
            </Link>
            <Link href="/#personnaliser" className="nav-link hover:text-clay">
              Personnaliser
            </Link>
            <Link href="/#histoire" className="nav-link hover:text-clay">
              Notre histoire
            </Link>
          </nav>
          <MagneticButton
            href={accountHref}
            className="rounded-full border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-linen transition-colors"
          >
            Mon compte
          </MagneticButton>
        </div>
      </header>

      <section className="mx-auto max-w-wrap px-6 py-16">
        <Reveal>
          <p className="mb-3 font-display italic text-flame">Nos collections</p>
          <h1 className="font-display text-4xl md:text-5xl">
            Choisissez une famille de pièces à personnaliser.
          </h1>
          <p className="mt-4 max-w-lg text-ink/70">
            Chaque collection regroupe des modèles que vous pouvez composer pièce
            par pièce : taille, couleurs, options.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(categories || []).map((c: any, i: number) => {
            const activeCount = (c.products || []).filter((p: any) => p.is_active).length;
            return (
              <Reveal key={c.id} delay={i * 80}>
                <Link href={`/collections/${c.slug}`}>
                  <TiltCard className="group overflow-hidden rounded-2xl border border-ink/10 bg-card hover:border-clay hover:shadow-xl">
                    <div className="aspect-[4/3] overflow-hidden bg-linen">
                      {c.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.image_url}
                          alt={c.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-ink/40">
                          Aperçu à venir
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="font-display text-xl">{c.name}</p>
                      {c.description && (
                        <p className="mt-1 text-sm text-ink/60">{c.description}</p>
                      )}
                      <p className="mt-3 text-xs text-ink/40">
                        {activeCount > 0
                          ? `${activeCount} modèle${activeCount > 1 ? "s" : ""}`
                          : "Bientôt disponible"}
                      </p>
                    </div>
                  </TiltCard>
                </Link>
              </Reveal>
            );
          })}

          {(categories || []).length === 0 && (
            <p className="col-span-full rounded-2xl border border-ink/10 bg-card p-10 text-center text-sm text-ink/40">
              Aucune collection pour le moment. Ajoutez-en une depuis l'espace admin.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}