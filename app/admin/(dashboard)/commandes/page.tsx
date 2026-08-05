import { createClient } from "@/lib/supabase/server";
import { updateOrderStatus } from "./actions";
import { STATUSES } from "./statuses";

const STATUS_LABELS: Record<string, string> = {
  nouvelle: "Nouvelle",
  en_cours: "En cours",
  fabrication: "Fabrication",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};

export default async function CommandesPage() {
  const supabase = createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `id, order_number, total_amount, deposit_amount, deposit_paid, balance_paid,
       status, comments, created_at,
       profiles ( full_name, phone, avatar_url ),
       addresses ( address, city, country ),
       order_items (
         quantity, unit_price,
         products ( name ),
         customizations (
           selected_option_ids,
           product_sizes ( name ),
           primary_color:primary_color_id ( name ),
           secondary_color:secondary_color_id ( name ),
           generated_images ( image_url, is_validated )
         )
       )`
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl">Commandes</h1>

      <div className="mt-6 space-y-4">
        {(orders || []).map((o: any) => {
          const item = o.order_items?.[0];
          const custom = item?.customizations;
          const image =
            custom?.generated_images?.find((g: any) => g.is_validated)?.image_url ||
            custom?.generated_images?.[0]?.image_url;

          return (
            <div
              key={o.id}
              className="grid gap-4 rounded-2xl border border-ink/10 bg-card p-5 md:grid-cols-[120px_1fr_auto]"
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-linen">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="Aperçu IA" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-ink/40">
                    Pas d'aperçu
                  </div>
                )}
              </div>

              <div className="text-sm">
                <p className="font-display text-lg">
                  Commande #{o.order_number} — {item?.products?.name || "—"}
                </p>
                <p className="mt-1 text-ink/60">
                  {o.profiles?.full_name || "Client"} · {o.profiles?.phone || "—"}
                </p>
                <p className="text-ink/60">
                  {o.addresses?.address}, {o.addresses?.city} {o.addresses?.country}
                </p>
                <p className="mt-2 text-ink/70">
                  Taille : {custom?.product_sizes?.name || "—"} · Couleur :{" "}
                  {custom?.primary_color?.name || "—"}
                  {custom?.secondary_color?.name
                    ? ` / ${custom.secondary_color.name}`
                    : ""}
                </p>
                {o.comments && (
                  <p className="mt-2 text-ink/50 italic">"{o.comments}"</p>
                )}
              </div>

              <div className="flex flex-col items-end justify-between gap-3">
                <div className="text-right text-sm">
                  <p className="font-display text-lg">
                    {Number(o.total_amount).toFixed(0)} DH
                  </p>
                  <p className="text-ink/50">
                    {o.deposit_paid ? "Acompte payé" : "Acompte en attente"}
                    {" · "}
                    {o.balance_paid ? "Solde payé" : "Solde en attente"}
                  </p>
                </div>
                <form
                  action={updateOrderStatus.bind(null, o.id)}
                  className="flex items-center gap-2"
                >
                  <select
                    name="status"
                    defaultValue={o.status}
                    className="rounded-lg border border-ink/15 bg-linen px-2 py-1 text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-full bg-clay px-3 py-1 text-xs text-card hover:bg-ink transition-colors"
                  >
                    Mettre à jour
                  </button>
                </form>
              </div>
            </div>
          );
        })}

        {(orders || []).length === 0 && (
          <p className="rounded-2xl border border-ink/10 bg-card p-6 text-center text-sm text-ink/40">
            Aucune commande pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
