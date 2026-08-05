import { createClient } from "@/lib/supabase/server";

export default async function ClientsPage() {
  const supabase = createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, phone, city, country, avatar_url, created_at")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  const { data: orders } = await supabase.from("orders").select("user_id, total_amount");

  const statsByUser = new Map<string, { count: number; total: number }>();
  for (const o of orders || []) {
    if (!o.user_id) continue;
    const existing = statsByUser.get(o.user_id) || { count: 0, total: 0 };
    statsByUser.set(o.user_id, {
      count: existing.count + 1,
      total: existing.total + Number(o.total_amount || 0),
    });
  }

  return (
    <div>
      <h1 className="font-display text-2xl">Clients</h1>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-ink/50">
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Commandes</th>
              <th className="px-4 py-3">Total dépensé</th>
            </tr>
          </thead>
          <tbody>
            {(profiles || []).map((p) => {
              const stats = statsByUser.get(p.id) || { count: 0, total: 0 };
              return (
                <tr key={p.id} className="border-b border-ink/5 last:border-0">
                  <td className="flex items-center gap-3 px-4 py-3">
                    {p.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.avatar_url}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linen text-xs">
                        {(p.full_name || "?").charAt(0).toUpperCase()}
                      </span>
                    )}
                    {p.full_name || "Sans nom"}
                  </td>
                  <td className="px-4 py-3 text-ink/60">{p.phone || "—"}</td>
                  <td className="px-4 py-3 text-ink/60">
                    {p.city ? `${p.city}, ${p.country}` : "—"}
                  </td>
                  <td className="px-4 py-3">{stats.count}</td>
                  <td className="px-4 py-3">{stats.total.toFixed(0)} DH</td>
                </tr>
              );
            })}
            {(profiles || []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink/40">
                  Aucun client inscrit pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
