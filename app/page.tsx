import Link from "next/link";
import ChainDivider from "@/components/ChainDivider";
import CursorGlow from "@/components/CursorGlow";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import MagneticButton from "@/components/MagneticButton";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";

const collections = [
  { name: "Sacs", desc: "Modèles Skyline, Peachy, Soleya, Atelier — à composer." },
  { name: "Bonnets", desc: "Chaud, ajusté à la tête, couleurs et pompons au choix." },
  { name: "Ensembles", desc: "Top, short, bikini — pièces coordonnées sur mesure." },
  { name: "Accessoires", desc: "Petites pièces pour compléter une tenue ou un sac." },
];

const steps = [
  { label: "Modèle", detail: "Choisissez la silhouette qui vous parle." },
  { label: "Taille", detail: "Le prix s'ajuste automatiquement." },
  { label: "Couleurs", detail: "Principale et secondaire, à votre goût." },
  { label: "Options", detail: "Fleurs, perles, broderie, doublure..." },
  { label: "Aperçu IA", detail: "Votre pièce, visible avant fabrication." },
];

const testimonials = [
  {
    quote:
      "J'ai pu voir mon sac avant même qu'il soit commencé. Le résultat final était identique.",
    name: "Aïcha, Libreville",
  },
  {
    quote: "Le bonnet est arrivé exactement comme je l'avais imaginé, couleurs et tout.",
    name: "Salma, Casablanca",
  },
  {
    quote: "Un vrai travail d'artisan, avec un suivi de commande très clair.",
    name: "Nadia, Rabat",
  },
];

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, base_price, categories(name), product_images(url, position)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const accountHref = user ? "/compte/mon-compte" : "/compte/connexion";

  return (
    <main className="relative min-h-screen overflow-hidden bg-linen text-ink">
      <CursorGlow />

      <header className="relative z-10 border-b border-ink/10">
        <div className="mx-auto flex max-w-wrap items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden gap-8 text-sm md:flex">
            <a href="#collections" className="nav-link hover:text-clay">Collections</a>
            <a href="#produits" className="nav-link hover:text-clay">Nos créations</a>
            <a href="#personnaliser" className="nav-link hover:text-clay">Personnaliser</a>
            <a href="#histoire" className="nav-link hover:text-clay">Notre histoire</a>
            <a href="#avis" className="nav-link hover:text-clay">Avis</a>
          </nav>
          <MagneticButton
            href={accountHref}
            className="rounded-full border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-linen transition-colors"
          >
            Mon compte
          </MagneticButton>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-wrap gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className="mb-4 font-display italic text-flame">Un sac, une âme</p>
          <h1 className="font-display text-5xl leading-[1.05] md:text-6xl">
            Chaque création raconte une histoire. Créez la vôtre.
          </h1>
          <p className="mt-6 max-w-md text-ink/70">
            Sacs, bonnets et ensembles en crochet, façonnés à la main. Choisissez un modèle, composez vos couleurs, et
            voyez votre pièce avant qu'elle prenne vie.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <MagneticButton
              href="#produits"
              className="rounded-full bg-clay px-6 py-3 text-sm text-card hover:bg-ink transition-colors"
            >
              Découvrir la collection
            </MagneticButton>
            <MagneticButton
              href="#personnaliser"
              className="rounded-full border border-ink px-6 py-3 text-sm hover:bg-ink hover:text-linen transition-colors"
            >
              Personnaliser mon produit
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-card">
            <div
              className="absolute inset-0 animate-float"
              style={{
                backgroundImage:
                  "repeating-radial-gradient(circle at 20% 20%, #A85D3B22 0, #A85D3B22 2px, transparent 2px, transparent 26px), repeating-radial-gradient(circle at 60% 70%, #5F6B4A22 0, #5F6B4A22 2px, transparent 2px, transparent 30px)",
              }}
            />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-linen/90 px-5 py-4">
              <p className="font-display text-lg">Modèle Skyline</p>
              <p className="text-sm text-ink/60">
                Aperçu produit — à remplacer par une photo réelle
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="relative z-10 mx-auto max-w-wrap px-6">
        <ChainDivider />
      </div>

      <section id="collections" className="relative z-10 mx-auto max-w-wrap px-6 py-20">
        <Reveal>
          <h2 className="font-display text-3xl">Collections</h2>
          <p className="mt-2 max-w-lg text-ink/70">
            Quatre familles de pièces, chacune personnalisable de bout en bout.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c, i) => (
            <Reveal key={c.name} delay={i * 100} direction={i % 2 === 0 ? "left" : "right"}>
              <TiltCard className="group rounded-2xl border border-ink/10 bg-card p-6 hover:border-clay hover:shadow-xl">
                <div className="mb-4 aspect-square rounded-xl bg-linen transition-transform duration-300 group-hover:scale-[1.03]" />
                <p className="font-display text-xl">{c.name}</p>
                <p className="mt-1 text-sm text-ink/60">{c.desc}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-wrap px-6">
        <ChainDivider color="#5F6B4A" />
      </div>

      {/* Nos créations — produits réels tirés de la base */}
      <section id="produits" className="relative z-10 mx-auto max-w-wrap px-6 py-20">
        <Reveal>
          <h2 className="font-display text-3xl">Nos créations</h2>
          <p className="mt-2 max-w-lg text-ink/70">
            Nos modèles disponibles à la personnalisation, dès aujourd'hui.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(products || []).map((p: any, i: number) => {
            const image = [...(p.product_images || [])].sort(
              (a: any, b: any) => a.position - b.position
            )[0]?.url;

            return (
              <Reveal key={p.id} delay={i * 80} direction="scale">
                <TiltCard className="group overflow-hidden rounded-2xl border border-ink/10 bg-card hover:border-clay hover:shadow-xl">
                  <div className="aspect-square overflow-hidden bg-linen">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-ink/40">
                        Pas de photo
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-ink/50">{p.categories?.name || "Nema"}</p>
                    <p className="font-display text-xl">{p.name}</p>
                    <p className="mt-1 text-sm text-ink/60">
                      À partir de {Number(p.base_price).toFixed(0)} DH
                    </p>
                    <Link
                      href={`/personnaliser/${p.id}`}
                      className="mt-4 inline-block rounded-full bg-clay px-5 py-2 text-sm text-card hover:bg-ink transition-colors"
                    >
                      Personnaliser
                    </Link>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}

          {(products || []).length === 0 && (
            <p className="col-span-full rounded-2xl border border-ink/10 bg-card p-8 text-center text-sm text-ink/40">
              Aucun produit disponible pour le moment.
            </p>
          )}
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-wrap px-6">
        <ChainDivider />
      </div>

      <section id="personnaliser" className="relative z-10 bg-card py-20">
        <div className="mx-auto max-w-wrap px-6">
          <Reveal>
            <h2 className="font-display text-3xl">Le configurateur</h2>
            <p className="mt-2 max-w-lg text-ink/70">
              Le cœur du site : une pièce composée par vous, visible avant sa
              fabrication.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-ink/10 sm:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="h-full bg-linen p-5 transition-colors duration-300 hover:bg-clay/10">
                  <p className="font-display text-lg">{s.label}</p>
                  <p className="mt-1 text-sm text-ink/60">{s.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <MagneticButton
            href="#produits"
            className="mt-8 inline-block rounded-full bg-clay px-6 py-3 text-sm text-card hover:bg-ink transition-colors"
          >
            Commencer ma personnalisation
          </MagneticButton>
        </div>
      </section>

      <section id="histoire" className="relative z-10 mx-auto max-w-wrap px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl">Pourquoi Nema</h2>
            <p className="mt-4 text-ink/70">
              Nema n'est pas une boutique de plus. C'est un atelier où chaque
              cliente conçoit sa propre pièce avant sa fabrication —
              modèle, couleurs, options — puis suit sa commande du crochet à
              la livraison.
            </p>
          </Reveal>
          <div className="space-y-6">
            {[
              { title: "Sur mesure", color: "text-clay", detail: "Taille, couleurs et options choisies pièce par pièce." },
              { title: "Aperçu avant fabrication", color: "text-moss", detail: "Vous validez le rendu avant que le crochet ne commence." },
              { title: "Suivi transparent", color: "text-clay", detail: "Reçue, en fabrication, finitions, expédiée — à chaque étape." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <p className={`font-display text-lg ${item.color}`}>{item.title}</p>
                <p className="text-sm text-ink/60">{item.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-wrap px-6">
        <ChainDivider />
      </div>

      <section id="avis" className="relative z-10 mx-auto max-w-wrap px-6 py-20">
        <Reveal>
          <h2 className="font-display text-3xl">Avis clients</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <TiltCard className="rounded-2xl bg-card p-6 hover:shadow-xl">
                <p className="font-display italic text-ink/80">"{t.quote}"</p>
                <p className="mt-4 text-sm text-ink/50">{t.name}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-ink/10 bg-card">
        <div className="mx-auto max-w-wrap px-6 py-12 text-sm text-ink/60">
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div>
              <Logo className="scale-90" />
              <p className="mt-2 max-w-xs">Un sac, une âme.</p>
            </div>
            <div className="flex gap-10">
              <div>
                <p className="mb-2 text-ink">Boutique</p>
                <p>Collections</p>
                <p>Personnaliser</p>
                <p>Nouveautés</p>
              </div>
              <div>
                <p className="mb-2 text-ink">Nema</p>
                <p>Notre histoire</p>
                <p>Avis clients</p>
                <p>Contact</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
