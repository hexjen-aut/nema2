import { createClient } from "@/lib/supabase/server";
import { addSize, updateSizeDelta, deleteSize } from "./actions";

export default async function PrixPage() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, base_price, product_sizes(id, name, price_delta, position)")
    .order("name");

  return (
    <div>
      <h1 className="font-display text-2xl">Gestion des prix</h1>
      <p className="mt-1 text-sm text-ink/60">
        Prix de base + suppléments par taille, pour chaque modèle.
      </p>

      <div className="mt-6 space-y-4">
        {(products || []).map((p: any) => (
          <div key={p.id} className="rounded-2xl border border-ink/10 bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">{p.name}</p>
              <p className="text-sm text-ink/60">
                Prix de base : {Number(p.base_price).toFixed(0)} DH
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {(p.product_sizes || []).map((s: any) => (
                <div key={s.id} className="flex items-center gap-3 text-sm">
                  <span className="w-24">{s.name}</span>
                  <form
                    action={updateSizeDelta.bind(null, s.id)}
                    className="flex items-center gap-2"
                  >
                    <input
                      name="price_delta"
                      type="number"
                      step="0.01"
                      defaultValue={s.price_delta}
                      className="w-24 rounded-lg border border-ink/15 bg-linen px-2 py-1"
                    />
                    <span className="text-ink/50">DH supplément</span>
                    <button
                      type="submit"
                      className="rounded-full bg-clay px-3 py-1 text-xs text-card hover:bg-ink transition-colors"
                    >
                      Enregistrer
                    </button>
                  </form>
                  <span className="ml-2 text-ink/50">
                    = {(Number(p.base_price) + Number(s.price_delta)).toFixed(0)} DH
                  </span>
                  <form action={deleteSize.bind(null, s.id)} className="ml-auto">
                    <button type="submit" className="text-xs text-ink/40 hover:text-red-700">
                      Supprimer
                    </button>
                  </form>
                </div>
              ))}
            </div>

            <form
              action={addSize.bind(null, p.id)}
              className="mt-4 flex items-center gap-2 border-t border-ink/10 pt-4 text-sm"
            >
              <input
                name="name"
                placeholder="Nom (ex: Petit, Grand, XL)"
                required
                className="rounded-lg border border-ink/15 bg-linen px-2 py-1"
              />
              <input
                name="price_delta"
                type="number"
                step="0.01"
                placeholder="Supplément DH"
                defaultValue={0}
                className="w-32 rounded-lg border border-ink/15 bg-linen px-2 py-1"
              />
              <button
                type="submit"
                className="rounded-full border border-ink/20 px-3 py-1 text-xs hover:bg-linen"
              >
                Ajouter une taille
              </button>
            </form>
          </div>
        ))}

        {(products || []).length === 0 && (
          <p className="rounded-2xl border border-ink/10 bg-card p-6 text-center text-sm text-ink/40">
            Ajoute d'abord des produits dans l'onglet Produits.
          </p>
        )}
      </div>
    </div>
  );
}
