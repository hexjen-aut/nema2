import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { removeFavorite } from "./actions";

export default async function FavorisPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/compte/connexion");

  const { data: favorites } = await supabase
    .from("favorites")
    .select(
      `product_id, created_at,
       products ( id, name, base_price, is_active, categories ( name ), product_images ( url ) )`
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-wrap px-6 py-12">
      <h1 className="font-display text-3xl">Favoris</h1>
      <p className="mt-1 text-sm text-ink/60">Vos modèles enregistrés pour plus tard.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(favorites || []).map((f: any) => {
          const p = f.products;
          if (!p) return null;
          const image = p.product_images?.[0]?.url;

          return (
            <div
              key={f.product_id}
              className="group rounded-2xl border border-ink/10 bg-card p-5 transition-colors hover:border-clay"
            >
              <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-linen">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-ink/40">
                    Pas d'aperçu
                  </div>
                )}
                {!p.is_active && (
                  <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2 py-1 text-xs text-linen">
                    Indisponible
                  </span>
                )}
              </div>

              <p className="font-display text-lg">{p.name}</p>
              <p className="text-sm text-ink/50">{p.categories?.name}</p>
              <p className="mt-1 text-sm text-ink/70">
                {Number(p.base_price).toFixed(0)} DH
              </p>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/personnaliser/${p.id}`}
                  className="flex-1 rounded-full bg-clay px-4 py-2 text-center text-xs text-card hover:bg-ink transition-colors"
                >
                  Personnaliser
                </Link>
                <form action={removeFavorite.bind(null, f.product_id)}>
                  <button
                    type="submit"
                    className="rounded-full border border-ink/15 px-3 py-2 text-xs text-ink/50 hover:border-clay hover:text-clay transition-colors"
                  >
                    Retirer
                  </button>
                </form>
              </div>
            </div>
          );
        })}

        {(favorites || []).length === 0 && (
          <div className="col-span-full rounded-2xl border border-ink/10 bg-card p-8 text-center">
            <p className="text-sm text-ink/50">Aucun favori pour le moment.</p>
            <Link
              href="/#collections"
              className="mt-4 inline-block rounded-full bg-clay px-6 py-2.5 text-sm text-card hover:bg-ink transition-colors"
            >
              Découvrir les collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
