"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info] = useState<string | null>(
    searchParams.get("message") === "verifiez_email"
      ? "Compte créé ! Vérifiez votre email pour confirmer votre inscription."
      : null
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Email ou mot de passe incorrect.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("[CONNEXION] exception:", err);
      setError("Une erreur inattendue est survenue.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-2xl border border-ink/10 bg-card p-8"
      >
        <p className="font-display text-2xl text-ink">Mon compte</p>
        <p className="mt-1 text-sm text-ink/60">Connectez-vous pour suivre vos commandes.</p>

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

        {info && <p className="mt-4 text-sm text-moss">{info}</p>}
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-clay px-6 py-3 text-sm text-card hover:bg-ink transition-colors disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="mt-4 text-center text-sm text-ink/60">
          Pas encore de compte ?{" "}
          <Link href="/compte/inscription" className="text-clay hover:underline">
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
      <Suspense fallback={null}>
        <ConnexionForm />
      </Suspense>
    </div>
  );
}
