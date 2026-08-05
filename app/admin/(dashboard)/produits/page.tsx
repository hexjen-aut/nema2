import { createClient } from "@/lib/supabase/server";
import { createProduct, toggleProductActive, deleteProduct } from "./actions";

export default async function ProduitsPage() {
  const supabase = createClient();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, base_price, fabrication_days, is_active, categories(name)")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("id, name").order("name"),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl">Produits</h1>

      <form
        action={createProduct}
        className="mt-6 grid gap-3 rounded-2xl border border-ink/10 bg-card p-5 sm:grid-cols-2 md:grid-cols-5"
      >
        <input
          name="name"
          placeholder="Nom du modèle"
          required
          className="rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm"
        />
        <select
          name="category_id"
          className="rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm"
        >
          <option value="">Catégorie</option>
          {(categories || []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          name="base_price"
          type="number"
          step="0.01"
          placeholder="Prix de base (DH)"
          required
          className="rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm"
        />
        <input
          name="fabrication_days"
          type="number"
          placeholder="Délai (jours)"
          defaultValue={10}
          className="rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-clay px-4 py-2 text-sm text-card hover:bg-ink transition-colors"
        >
          Ajouter
        </button>
        <textarea
          name="description"
          placeholder="Description (optionnel)"
          className="col-span-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm"
          rows={2}
        />
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-ink/50">
              <th className="px-4 py-3">Modèle</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix base</th>
              <th className="px-4 py-3">Délai</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((p: any) => (
              <tr key={p.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 text-ink/60">{p.categories?.name || "—"}</td>
                <td className="px-4 py-3">{Number(p.base_price).toFixed(0)} DH</td>
                <td className="px-4 py-3 text-ink/60">{p.fabrication_days} j</td>
                <td className="px-4 py-3">
                  <form
                    action={toggleProductActive.bind(null, p.id, !p.is_active)}
                  >
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-1 text-xs ${
                        p.is_active
                          ? "bg-moss/15 text-moss"
                          : "bg-ink/10 text-ink/50"
                      }`}
                    >
                      {p.is_active ? "Actif" : "Masqué"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteProduct.bind(null, p.id)}>
                    <button
                      type="submit"
                      className="text-xs text-ink/40 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(products || []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink/40">
                  Aucun produit pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
