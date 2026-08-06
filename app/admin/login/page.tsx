"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "not_admin"
      ? "Ce compte n'a pas les droits admin."
      : null
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("[LOGIN] handleSubmit déclenché");
    setLoading(true);
    setError(null);

    try {
      console.log("[LOGIN] NEXT_PUBLIC_SUPABASE_URL =", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log(
        "[LOGIN] NEXT_PUBLIC_SUPABASE_ANON_KEY présent =",
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      );

      const supabase = createClient();
      console.log("[LOGIN] client Supabase créé, envoi de la requête...");

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      console.log("[LOGIN] réponse reçue", { data, error });

      if (error) {
        console.error("[LOGIN] erreur Supabase:", error.message);
        setError(`Identifiants incorrects (${error.message}).`);
        setLoading(false);
        return;
      }

      console.log("[LOGIN] connexion réussie, redirection vers /admin");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("[LOGIN] exception attrapée:", err);
      setError(`Erreur inattendue: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl border border-ink/10 bg-card p-8"
    >
      <p className="font-display text-2xl text-ink">Nema — Admin</p>
      <p className="mt-1 text-sm text-ink/60">Connectez-vous pour gérer la boutique.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-ink/70">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-clay px-6 py-3 text-sm text-card hover:bg-ink transition-colors disabled:opacity-50"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linen px-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
