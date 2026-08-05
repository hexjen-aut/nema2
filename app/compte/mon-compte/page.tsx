import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateProfile, signOutClient } from "./actions";

export default async function MonComptePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/compte/connexion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, city, country, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-wrap px-6 py-12">
      <h1 className="font-display text-3xl">Mon compte</h1>
      <p className="mt-1 text-sm text-ink/60">{user.email}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_260px]">
        <form
          action={updateProfile}
          className="space-y-4 rounded-2xl border border-ink/10 bg-card p-6"
        >
          <p className="font-display text-lg">Informations personnelles</p>

          <div>
            <label className="text-sm text-ink/70">Nom complet</label>
            <input
              name="full_name"
              defaultValue={profile?.full_name || ""}
              className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
            />
          </div>

          <div>
            <label className="text-sm text-ink/70">Téléphone</label>
            <input
              name="phone"
              defaultValue={profile?.phone || ""}
              placeholder="+212 ..."
              className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-ink/70">Ville</label>
              <input
                name="city"
                defaultValue={profile?.city || ""}
                className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
              />
            </div>
            <div>
              <label className="text-sm text-ink/70">Pays</label>
              <input
                name="country"
                defaultValue={profile?.country || ""}
                className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-full bg-clay px-6 py-2.5 text-sm text-card hover:bg-ink transition-colors"
          >
            Enregistrer
          </button>
        </form>

        <div className="space-y-3">
          <Link
            href="/compte/mes-commandes"
            className="block rounded-2xl border border-ink/10 bg-card p-5 hover:border-clay transition-colors"
          >
            <p className="font-display text-lg">Mes commandes</p>
            <p className="mt-1 text-sm text-ink/60">Suivre mes créations en cours</p>
          </Link>
          <Link
            href="/compte/favoris"
            className="block rounded-2xl border border-ink/10 bg-card p-5 hover:border-clay transition-colors"
          >
            <p className="font-display text-lg">Favoris</p>
            <p className="mt-1 text-sm text-ink/60">Mes modèles enregistrés</p>
          </Link>
          <form action={signOutClient}>
            <button
              type="submit"
              className="w-full rounded-2xl border border-ink/10 bg-card p-5 text-left text-sm text-ink/60 hover:text-clay hover:border-clay transition-colors"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
