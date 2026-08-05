import { createClient } from "@/lib/supabase/server";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default async function AdminHomePage() {
  const supabase = createClient();

  const [{ data: todayOrders }, { data: toFabricate }, { count: totalOrders }] =
    await Promise.all([
      supabase.from("orders").select("id, total_amount").gte("created_at", startOfToday()),
      supabase
        .from("orders")
        .select("id, order_number, status")
        .in("status", ["nouvelle", "en_cours", "fabrication"]),
      supabase.from("orders").select("id", { count: "exact", head: true }),
    ]);

  const { data: itemCounts } = await supabase
    .from("order_items")
    .select("product_id, quantity, products(name)");

  const topProductsMap = new Map<string, { name: string; qty: number }>();
  for (const item of itemCounts || []) {
    const name = (item as any).products?.name || "Produit supprimé";
    const key = item.product_id || name;
    const existing = topProductsMap.get(key);
    topProductsMap.set(key, {
      name,
      qty: (existing?.qty || 0) + (item.quantity || 0),
    });
  }
  const topProducts = Array.from(topProductsMap.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const todayRevenue = (todayOrders || []).reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0
  );

  return (
    <div>
      <h1 className="font-display text-2xl">Tableau de bord</h1>
      <p className="mt-1 text-sm text-ink/60">Aujourd'hui</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-card p-5">
          <p className="text-xs text-ink/50">Commandes aujourd'hui</p>
          <p className="mt-1 font-display text-3xl">{todayOrders?.length || 0}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-card p-5">
          <p className="text-xs text-ink/50">Chiffre d'affaires du jour</p>
          <p className="mt-1 font-display text-3xl">{todayRevenue.toFixed(0)} DH</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-card p-5">
          <p className="text-xs text-ink/50">Total commandes</p>
          <p className="mt-1 font-display text-3xl">{totalOrders ?? 0}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-ink/10 bg-card p-5">
          <p className="font-display text-lg">Commandes à fabriquer</p>
          {(toFabricate || []).length === 0 ? (
            <p className="mt-2 text-sm text-ink/50">Aucune commande en attente.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {(toFabricate || []).map((o) => (
                <li key={o.id} className="flex justify-between">
                  <span>Commande #{o.order_number}</span>
                  <span className="text-ink/60">{o.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-ink/10 bg-card p-5">
          <p className="font-display text-lg">Produits populaires</p>
          {topProducts.length === 0 ? (
            <p className="mt-2 text-sm text-ink/50">Pas encore de données.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {topProducts.map((p) => (
                <li key={p.name} className="flex justify-between">
                  <span>{p.name}</span>
                  <span className="text-ink/60">{p.qty} vendus</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
