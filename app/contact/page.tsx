import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";
import { sendContactForm } from "./actions";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: { sent?: string; error?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const accountHref = user ? "/compte/mon-compte" : "/compte/connexion";

  return (
    <main className="relative min-h-screen overflow-hidden bg-nema-motif text-noir">
      <CursorGlow />
      <Navbar accountHref={accountHref} />

      <section className="relative z-10 mx-auto max-w-wrap px-6 py-20 md:py-28">
        <Reveal>
          <p className="text-xs tracking-label text-orange">NOUS CONTACTER</p>
          <h1 className="mt-5 font-display text-4xl md:text-5xl">Une question ? Écrivez-nous.</h1>
          <p className="mt-4 max-w-md text-noir/70">
            Nous répondons généralement sous 24 à 48h.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <form
            action={sendContactForm}
            className="mt-10 max-w-lg space-y-4 rounded-2xl border border-noir/10 bg-card p-8"
          >
            <div>
              <label className="text-sm text-noir/70">Nom</label>
              <input
                type="text"
                name="name"
                required
                className="mt-1 w-full rounded-lg border border-noir/15 bg-ivoire px-3 py-2 text-sm outline-none focus:border-orange"
              />
            </div>
            <div>
              <label className="text-sm text-noir/70">Email</label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 w-full rounded-lg border border-noir/15 bg-ivoire px-3 py-2 text-sm outline-none focus:border-orange"
              />
            </div>
            <div>
              <label className="text-sm text-noir/70">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                className="mt-1 w-full rounded-lg border border-noir/15 bg-ivoire px-3 py-2 text-sm outline-none focus:border-orange"
              />
            </div>

            {searchParams.sent && (
              <p className="text-sm text-moss">Votre message a bien été envoyé. Merci !</p>
            )}
            {searchParams.error && (
              <p className="text-sm text-red-700">
                Une erreur est survenue, réessayez ou écrivez-nous directement par email.
              </p>
            )}

            <button
              type="submit"
              className="rounded-full bg-orange px-7 py-3 text-sm text-ivoire transition-colors hover:bg-noir"
            >
              Envoyer
            </button>
          </form>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
