import { createClient } from "@/lib/supabase/server";
import { addColor, toggleColorAvailability, deleteColor } from "./actions";

export default async function CouleursPage() {
  const supabase = createClient();

  const [{ data: colors }, { data: products }] = await Promise.all([
    supabase
      .from("product_colors")
      .select("id, name, hex, is_seasonal, is_available, products(name)")
      .order("name"),
    supabase.from("products").select("id, name").order("name"),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl">Gestion des couleurs</h1>

      <form
        action={addColor}
        className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-card p-5 text-sm"
      >
        <input
          name="name"
          placeholder="Nom (ex: Beige)"
          required
          className="rounded-lg border border-ink/15 bg-linen px-3 py-2"
        />
        <input
          name="hex"
          placeholder="#RRGGBB"
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
        <label className="flex items-center gap-2 text-ink/60">
          <input type="checkbox" name="is_seasonal" /> Saisonnière
        </label>
        <button
          type="submit"
          className="rounded-full bg-clay px-4 py-2 text-card hover:bg-ink transition-colors"
        >
          Ajouter
        </button>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {(colors || []).map((c: any) => (
          <div
            key={c.id}
            className="flex items-center gap-3 rounded-xl border border-ink/10 bg-card p-4"
          >
            <span
              className="h-8 w-8 shrink-0 rounded-full border border-ink/10"
              style={{ backgroundColor: c.hex || "#eee" }}
            />
            <div className="flex-1 text-sm">
              <p>{c.name}</p>
              <p className="text-xs text-ink/50">
                {c.products?.name || "Tous les modèles"}
                {c.is_seasonal ? " · saisonnière" : ""}
              </p>
            </div>
            <form action={toggleColorAvailability.bind(null, c.id, !c.is_available)}>
              <button
                type="submit"
                className={`rounded-full px-2 py-1 text-xs ${
                  c.is_available ? "bg-moss/15 text-moss" : "bg-ink/10 text-ink/50"
                }`}
              >
                {c.is_available ? "Dispo" : "Masquée"}
              </button>
            </form>
            <form action={deleteColor.bind(null, c.id)}>
              <button type="submit" className="text-xs text-ink/40 hover:text-red-700">
                ✕
              </button>
            </form>
          </div>
        ))}
        {(colors || []).length === 0 && (
          <p className="col-span-full rounded-2xl border border-ink/10 bg-card p-6 text-center text-sm text-ink/40">
            Aucune couleur pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
