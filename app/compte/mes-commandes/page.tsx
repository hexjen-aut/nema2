import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABELS: Record<string, string> = {
  nouvelle: "Nouvelle",
  en_cours: "En cours",
  fabrication: "Fabrication",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};

const STATUS_STEPS = ["nouvelle", "en_cours", "fabrication", "expediee", "livree"];

export default async function MesCommandesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/compte/connexion");

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `id, order_number, total_amount, deposit_paid, balance_paid, status, created_at,
       order_items (
         quantity,
         products ( name ),
         customizations (
           product_sizes ( name ),
           primary_color:primary_color_id ( name ),
           generated_images ( image_url, is_validated )
         )
       )`
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-wrap px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Mes commandes</h1>
          <p className="mt-1 text-sm text-ink/60">Suivez l'avancement de vos créations.</p>
        </div>
        <Link
          href="/personnaliser"
          className="rounded-full bg-clay px-6 py-2.5 text-sm text-card hover:bg-ink transition-colors"
        >
          Personnaliser une nouvelle pièce
        </Link>
      </div>

      <div className="mt-8 space-y-5">
        {(orders || []).map((o: any) => {
          const item = o.order_items?.[0];
          const custom = item?.customizations;
          const image =
            custom?.generated_images?.find((g: any) => g.is_validated)?.image_url ||
            custom?.generated_images?.[0]?.image_url;
          const currentStepIndex = STATUS_STEPS.indexOf(o.status);
          const isCancelled = o.status === "annulee";

          return (
            <div
              key={o.id}
              className="rounded-2xl border border-ink/10 bg-card p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-linen sm:w-28">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt="Aperçu" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-ink/40">
                      Pas d'aperçu
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-display text-lg">
                      Commande #{o.order_number} — {item?.products?.name || "—"}
                    </p>
                    <p className="font-display text-lg">
                      {Number(o.total_amount).toFixed(0)} DH
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">
                    Taille : {custom?.product_sizes?.name || "—"} · Couleur :{" "}
                    {custom?.primary_color?.name || "—"}
                  </p>
                  <p className="text-sm text-ink/50">
                    {o.deposit_paid ? "Acompte payé" : "Acompte en attente"}
                    {" · "}
                    {o.balance_paid ? "Solde payé" : "Solde en attente"}
                  </p>
                </div>
              </div>

              {isCancelled ? (
                <p className="mt-4 text-sm text-red-700">Commande annulée</p>
              ) : (
                <div className="mt-5 flex items-center gap-1">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="flex flex-1 items-center gap-1">
                      <div
                        className={`h-1.5 flex-1 rounded-full ${
                          i <= currentStepIndex ? "bg-clay" : "bg-ink/10"
                        }`}
                      />
                      {i < STATUS_STEPS.length - 1 && null}
                    </div>
                  ))}
                </div>
              )}
              {!isCancelled && (
                <p className="mt-2 text-right text-xs text-ink/50">
                  {STATUS_LABELS[o.status] || o.status}
                </p>
              )}
            </div>
          );
        })}

        {(orders || []).length === 0 && (
          <div className="rounded-2xl border border-ink/10 bg-card p-8 text-center">
            <p className="text-sm text-ink/50">Vous n'avez pas encore de commande.</p>
            <Link
              href="/personnaliser"
              className="mt-4 inline-block rounded-full bg-clay px-6 py-2.5 text-sm text-card hover:bg-ink transition-colors"
            >
              Personnaliser une pièce
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
