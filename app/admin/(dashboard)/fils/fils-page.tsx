import { createClient } from "@/lib/supabase/server";
import {
  addMaterial,
  toggleMaterialAvailability,
  deleteMaterial,
  addMaterialColor,
  updateMaterialColorStock,
  deleteMaterialColor,
  linkProductMaterial,
  unlinkProductMaterial,
} from "./actions";

const STOCK_LABELS: Record<string, string> = {
  available: "Disponible",
  low_stock: "Stock limité",
  unavailable: "Indisponible",
};

export default async function FilsPage() {
  const supabase = createClient();

  const [{ data: materials }, { data: products }, { data: productMaterials }] =
    await Promise.all([
      supabase
        .from("materials")
        .select("id, name, slug, price_delta, description, texture_image_url, is_available, material_colors(id, name, hex, swatch_image_url, stock_status)")
        .order("name"),
      supabase.from("products").select("id, name").order("name"),
      supabase.from("product_materials").select("product_id, material_id, is_default, products(name)"),
    ]);

  return (
    <div>
      <h1 className="font-display text-2xl">Gestion des fils</h1>
      <p className="mt-1 text-sm text-ink/60">
        Types de fil (acrylique, coton, fil T-shirt coton...), leurs couleurs, et les
        produits qui les proposent.
      </p>

      {/* Ajouter un fil */}
      <form
        action={addMaterial}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-ink/10 bg-card p-5 text-sm"
      >
        <div>
          <label className="block text-xs text-ink/50">Nom du fil</label>
          <input
            name="name"
            placeholder="Ex : Coton"
            required
            className="mt-1 rounded-lg border border-ink/15 bg-linen px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs text-ink/50">Supplément (DH)</label>
          <input
            name="price_delta"
            type="number"
            step="0.01"
            defaultValue={0}
            className="mt-1 w-28 rounded-lg border border-ink/15 bg-linen px-3 py-2"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-ink/50">Description</label>
          <input
            name="description"
            placeholder="Fil premium, plus doux..."
            className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-ink/50">
            URL photo texture (référence IA)
          </label>
          <input
            name="texture_image_url"
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-clay px-4 py-2 text-card hover:bg-ink transition-colors"
        >
          Ajouter le fil
        </button>
      </form>

      {/* Liste des fils */}
      <div className="mt-8 space-y-6">
        {(materials || []).map((m: any) => {
          const linkedProducts = (productMaterials || []).filter(
            (pm: any) => pm.material_id === m.id
          );
          const linkedProductIds = new Set(linkedProducts.map((pm: any) => pm.product_id));
          const unlinkedProducts = (products || []).filter(
            (p) => !linkedProductIds.has(p.id)
          );

          return (
            <div key={m.id} className="rounded-2xl border border-ink/10 bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {m.texture_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.texture_image_url}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-display text-lg">{m.name}</p>
                    <p className="text-xs text-ink/50">
                      {m.price_delta > 0
                        ? `+${Number(m.price_delta).toFixed(0)} DH`
                        : "Inclus dans le prix de base"}
                      {m.description ? ` · ${m.description}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <form action={toggleMaterialAvailability.bind(null, m.id, !m.is_available)}>
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-1 text-xs ${
                        m.is_available ? "bg-moss/15 text-moss" : "bg-ink/10 text-ink/50"
                      }`}
                    >
                      {m.is_available ? "Dispo" : "Masqué"}
                    </button>
                  </form>
                  <form action={deleteMaterial.bind(null, m.id)}>
                    <button
                      type="submit"
                      className="text-xs text-ink/40 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </form>
                </div>
              </div>

              {/* Couleurs de ce fil */}
              <div className="mt-4 border-t border-ink/10 pt-4">
                <p className="text-sm text-ink/70">Couleurs</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {(m.material_colors || []).map((c: any) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-2 rounded-xl border border-ink/10 bg-linen p-2 pr-3"
                    >
                      <span
                        className="h-7 w-7 overflow-hidden rounded-full border border-ink/10"
                        style={{ backgroundColor: c.hex || "#eee" }}
                      >
                        {c.swatch_image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={c.swatch_image_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </span>
                      <div className="text-xs">
                        <p>{c.name}</p>
                        <form action={updateMaterialColorStock.bind(null, c.id)}>
                          <select
                            name="stock_status"
                            defaultValue={c.stock_status}
                            onChange={(e) => e.currentTarget.form?.requestSubmit()}
                            className="mt-0.5 rounded border border-ink/10 bg-card px-1 py-0.5 text-[10px] text-ink/60"
                          >
                            {Object.entries(STOCK_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </form>
                      </div>
                      <form action={deleteMaterialColor.bind(null, c.id)}>
                        <button
                          type="submit"
                          className="text-[10px] text-ink/30 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </form>
                    </div>
                  ))}
                  {(m.material_colors || []).length === 0 && (
                    <p className="text-xs text-ink/40">Aucune couleur pour ce fil.</p>
                  )}
                </div>

                <form
                  action={addMaterialColor.bind(null, m.id)}
                  className="mt-3 flex flex-wrap items-end gap-2 text-xs"
                >
                  <input
                    name="name"
                    placeholder="Nom (ex: Vert forêt)"
                    required
                    className="rounded-lg border border-ink/15 bg-linen px-2 py-1.5"
                  />
                  <input
                    name="hex"
                    placeholder="#RRGGBB"
                    className="w-24 rounded-lg border border-ink/15 bg-linen px-2 py-1.5"
                  />
                  <input
                    name="swatch_image_url"
                    placeholder="URL photo du fil (réf. IA)"
                    className="w-48 rounded-lg border border-ink/15 bg-linen px-2 py-1.5"
                  />
                  <select
                    name="stock_status"
                    defaultValue="available"
                    className="rounded-lg border border-ink/15 bg-linen px-2 py-1.5"
                  >
                    {Object.entries(STOCK_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-full border border-ink/20 px-3 py-1.5 hover:bg-linen"
                  >
                    Ajouter la couleur
                  </button>
                </form>
              </div>

              {/* Produits qui proposent ce fil */}
              <div className="mt-4 border-t border-ink/10 pt-4">
                <p className="text-sm text-ink/70">Proposé sur ces produits</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {linkedProducts.map((pm: any) => (
                    <div
                      key={pm.product_id}
                      className="flex items-center gap-2 rounded-full bg-linen px-3 py-1.5 text-xs"
                    >
                      <span>
                        {pm.products?.name}
                        {pm.is_default ? " · par défaut" : ""}
                      </span>
                      <form
                        action={unlinkProductMaterial.bind(null, pm.product_id, m.id)}
                      >
                        <button
                          type="submit"
                          className="text-ink/30 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </form>
                    </div>
                  ))}
                  {linkedProducts.length === 0 && (
                    <p className="text-xs text-ink/40">Aucun produit associé.</p>
                  )}
                </div>

                {unlinkedProducts.length > 0 && (
                  <form
                    action={linkProductMaterial}
                    className="mt-3 flex flex-wrap items-center gap-2 text-xs"
                  >
                    <input type="hidden" name="material_id" value={m.id} />
                    <select
                      name="product_id"
                      required
                      className="rounded-lg border border-ink/15 bg-linen px-2 py-1.5"
                    >
                      <option value="">Associer un produit...</option>
                      {unlinkedProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center gap-1 text-ink/60">
                      <input type="checkbox" name="is_default" /> Par défaut
                    </label>
                    <button
                      type="submit"
                      className="rounded-full border border-ink/20 px-3 py-1.5 hover:bg-linen"
                    >
                      Associer
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}

        {(materials || []).length === 0 && (
          <p className="rounded-2xl border border-ink/10 bg-card p-6 text-center text-sm text-ink/40">
            Aucun fil configuré pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
