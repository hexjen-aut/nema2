import Link from "next/link";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import MagneticButton from "@/components/MagneticButton";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function PersonnaliserIndexPage() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from("products")
    .select(
      `id, name, base_price, categories ( name ), product_images ( url, position )`
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

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
            <Link href="/collections" className="nav-link hover:text-clay">
              Collections
            </Link>
            <Link href="/personnaliser" className="nav-link text-clay">
              Personnaliser
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
          <p className="mb-3 font-display italic text-flame">Personnaliser</p>
          <h1 className="font-display text-4xl md:text-5xl">
            Choisissez un modèle, composez-le à votre image.
          </h1>
          <p className="mt-4 max-w-lg text-ink/70">
            Sélectionnez une pièce ci-dessous pour démarrer directement le
            configurateur : taille, couleurs, options, aperçu IA.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(products || []).map((p: any, i: number) => {
            const image = [...(p.product_images || [])].sort(
              (a: any, b: any) => a.position - b.position
            )[0]?.url;

            return (
              <Reveal key={p.id} delay={i * 80}>
                <Link href={`/personnaliser/${p.id}`}>
                  <TiltCard className="group overflow-hidden rounded-2xl border border-ink/10 bg-card hover:border-clay hover:shadow-xl">
                    <div className="aspect-square overflow-hidden bg-linen">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-ink/40">
                          Pas d'aperçu
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-ink/40">{p.categories?.name}</p>
                      <p className="font-display text-xl">{p.name}</p>
                      <p className="mt-1 text-sm text-ink/60">
                        À partir de {Number(p.base_price).toFixed(0)} DH
                      </p>
                      <span className="mt-4 inline-block rounded-full bg-clay px-5 py-2 text-xs text-card group-hover:bg-ink transition-colors">
                        Personnaliser
                      </span>
                    </div>
                  </TiltCard>
                </Link>
              </Reveal>
            );
          })}

          {(products || []).length === 0 && (
            <p className="col-span-full rounded-2xl border border-ink/10 bg-card p-10 text-center text-sm text-ink/40">
              Aucun modèle disponible pour le moment. Ajoutez-en un depuis
              l'espace admin.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
