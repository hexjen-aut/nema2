"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function InscriptionPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
        },
      });

      if (signUpError) {
        setError(traduireErreur(signUpError.message));
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Impossible de créer le compte, réessayez.");
        setLoading(false);
        return;
      }

      // Le profil est créé côté DB par le trigger on_auth_user_created_nema
      // (évite l'échec RLS quand il n'y a pas encore de session, ex. confirmation email active).

      // Si la confirmation email est activée, il n'y aura pas de session immédiate.
      if (data.session) {
        router.push("/");
        router.refresh();
      } else {
        router.push("/compte/connexion?message=verifiez_email");
      }
    } catch (err) {
      console.error("[INSCRIPTION] exception:", err);
      setError("Une erreur inattendue est survenue.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-ink/10 bg-card p-8"
        >
          <p className="font-display text-2xl text-ink">Créer un compte</p>
          <p className="mt-1 text-sm text-ink/60">
            Suivez vos commandes et personnalisez vos créations.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-ink/70">Nom complet</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
              />
            </div>
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
              <label className="text-sm text-ink/70">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+212 ..."
                className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
              />
            </div>
            <div>
              <label className="text-sm text-ink/70">Mot de passe</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
              />
              <p className="mt-1 text-xs text-ink/40">6 caractères minimum</p>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-clay px-6 py-3 text-sm text-card hover:bg-ink transition-colors disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>

          <p className="mt-4 text-center text-sm text-ink/60">
            Déjà un compte ?{" "}
            <Link href="/compte/connexion" className="text-clay hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function traduireErreur(message: string): string {
  if (message.includes("already registered") || message.includes("already exists")) {
    return "Un compte existe déjà avec cet email.";
  }
  if (message.includes("Password should be")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }
  if (message.includes("valid email")) {
    return "Adresse email invalide.";
  }
  return `Erreur : ${message}`;
}
