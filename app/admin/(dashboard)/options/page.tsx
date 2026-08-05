import { createClient } from "@/lib/supabase/server";
import { addOption, toggleOptionAvailability, deleteOption } from "./actions";

export default async function OptionsPage() {
  const supabase = createClient();

  const [{ data: options }, { data: products }] = await Promise.all([
    supabase
      .from("product_options")
      .select("id, name, price, is_available, products(name)")
      .order("name"),
    supabase.from("products").select("id, name").order("name"),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl">Gestion des options</h1>
      <p className="mt-1 text-sm text-ink/60">
        Fleurs, perles, doublure, broderie, initiales...
      </p>

      <form
        action={addOption}
        className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-card p-5 text-sm"
      >
        <input
          name="name"
          placeholder="Nom de l'option"
          required
          className="rounded-lg border border-ink/15 bg-linen px-3 py-2"
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Prix (DH)"
          className="w-32 rounded-lg border border-ink/15 bg-linen px-3 py-2"
        />
        <select
          name="product_id"
          className="rounded-lg border border-ink/15 bg-linen px-3 py-2"
        >
          <option value="">Tous les modèles</option>
          {(products || []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-clay px-4 py-2 text-card hover:bg-ink transition-colors"
        >
          Ajouter
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-ink/50">
              <th className="px-4 py-3">Option</th>
              <th className="px-4 py-3">Modèle</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(options || []).map((o: any) => (
              <tr key={o.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3">{o.name}</td>
                <td className="px-4 py-3 text-ink/60">{o.products?.name || "Tous"}</td>
                <td className="px-4 py-3">{Number(o.price).toFixed(0)} DH</td>
                <td className="px-4 py-3">
                  <form action={toggleOptionAvailability.bind(null, o.id, !o.is_available)}>
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-1 text-xs ${
                        o.is_available ? "bg-moss/15 text-moss" : "bg-ink/10 text-ink/50"
                      }`}
                    >
                      {o.is_available ? "Dispo" : "Masquée"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteOption.bind(null, o.id)}>
                    <button type="submit" className="text-xs text-ink/40 hover:text-red-700">
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(options || []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink/40">
                  Aucune option pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
