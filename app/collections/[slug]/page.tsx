import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import MagneticButton from "@/components/MagneticButton";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function CollectionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();

  const { data: category } = await supabase
    .from("categories")
    .select(
      `id, name, slug, description, image_url,
       products (
         id, name, base_price, is_active,
         product_images ( url, position )
       )`
    )
    .eq("slug", params.slug)
    .single();

  if (!category) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const accountHref = user ? "/compte/mon-compte" : "/compte/connexion";

  const products = (category.products || [])
    .filter((p: any) => p.is_active)
    .map((p: any) => ({
      ...p,
      image: [...(p.product_images || [])].sort((a: any, b: any) => a.position - b.position)[0]
        ?.url,
    }));

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

      <section className="mx-auto max-w-wrap px-6 py-12">
        <Link
          href="/collections"
          className="text-sm text-ink/50 hover:text-clay transition-colors"
        >
          ← Toutes les collections
        </Link>

        <Reveal>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">{category.name}</h1>
          {category.description && (
            <p className="mt-3 max-w-lg text-ink/70">{category.description}</p>
          )}
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p: any, i: number) => (
            <Reveal key={p.id} delay={i * 80}>
              <TiltCard className="group overflow-hidden rounded-2xl border border-ink/10 bg-card hover:border-clay hover:shadow-xl">
                <div className="aspect-square overflow-hidden bg-linen">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
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
                  <p className="font-display text-xl">{p.name}</p>
                  <p className="mt-1 text-sm text-ink/60">
                    À partir de {Number(p.base_price).toFixed(0)} DH
                  </p>
                  <Link
                    href={`/personnaliser/${p.id}`}
                    className="mt-4 inline-block rounded-full bg-clay px-5 py-2 text-xs text-card hover:bg-ink transition-colors"
                  >
                    Personnaliser
                  </Link>
                </div>
              </TiltCard>
            </Reveal>
          ))}

          {products.length === 0 && (
            <p className="col-span-full rounded-2xl border border-ink/10 bg-card p-10 text-center text-sm text-ink/40">
              Aucun modèle disponible dans cette collection pour le moment.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
