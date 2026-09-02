import ChainDivider from "@/components/ChainDivider";
import CursorGlow from "@/components/CursorGlow";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import MagneticButton from "@/components/MagneticButton";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Univers from "@/components/Univers";
import Collections from "@/components/Collections";
import ProductsGrid from "@/components/ProductsGrid";
import { createClient } from "@/lib/supabase/server";

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

  const accountHref = user ? "/compte/mon-compte" : "/compte/connexion";

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description, image_url")
    .order("position", { ascending: true });

  const { data: rawProducts } = await supabase
    .from("products")
    .select(
      "id, name, base_price, is_active, category_id, categories(name), product_images(url, position)"
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const products = (rawProducts || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    base_price: p.base_price,
    category_id: p.category_id,
    category_name: p.categories?.name || null,
    image:
      [...(p.product_images || [])].sort((a: any, b: any) => a.position - b.position)[0]
        ?.url || null,
  }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-ivoire text-noir">
      <CursorGlow />

      <Navbar accountHref={accountHref} />

      <Hero />

      <Univers />

      <div className="relative z-10 mx-auto max-w-wrap px-6">
        <ChainDivider color="#F58220" />
      </div>

      <Collections categories={categories || []} />

      <ProductsGrid products={products} categories={categories || []} />

      <div className="relative z-10 mx-auto max-w-wrap px-6">
        <ChainDivider color="#5F6B4A" />
      </div>

      <section id="personnaliser" className="relative z-10 bg-card py-20">
        <div className="mx-auto max-w-wrap px-6">
          <Reveal>
            <h2 className="font-display text-3xl">Le configurateur</h2>
            <p className="mt-2 max-w-lg text-noir/70">
              Le cœur du site : une pièce composée par vous, visible avant sa
              fabrication.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-noir/10 sm:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="h-full bg-ivoire p-5 transition-colors duration-300 hover:bg-orange/10">
                  <p className="font-display text-lg">{s.label}</p>
                  <p className="mt-1 text-sm text-noir/60">{s.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <MagneticButton
            href="#collections"
            className="mt-8 inline-block rounded-full bg-orange px-6 py-3 text-sm text-ivoire hover:bg-noir transition-colors"
          >
            Commencer ma personnalisation
          </MagneticButton>
        </div>
      </section>

      <section id="histoire" className="relative z-10 mx-auto max-w-wrap px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl">Pourquoi NEMA</h2>
            <p className="mt-4 text-noir/70">
              NEMA n'est pas une boutique de plus. C'est un atelier où chaque
              cliente conçoit sa propre pièce avant sa fabrication —
              modèle, couleurs, options — puis suit sa commande du crochet à
              la livraison.
            </p>
          </Reveal>
          <div className="space-y-6">
            {[
              { title: "Sur mesure", color: "text-orange", detail: "Taille, couleurs et options choisies pièce par pièce." },
              { title: "Aperçu avant fabrication", color: "text-moss", detail: "Vous validez le rendu avant que le crochet ne commence." },
              { title: "Suivi transparent", color: "text-orange", detail: "Reçue, en fabrication, finitions, expédiée — à chaque étape." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <p className={`font-display text-lg ${item.color}`}>{item.title}</p>
                <p className="text-sm text-noir/60">{item.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-wrap px-6">
        <ChainDivider color="#F58220" />
      </div>

      <section id="avis" className="relative z-10 mx-auto max-w-wrap px-6 py-20">
        <Reveal>
          <h2 className="font-display text-3xl">Avis clients</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <TiltCard className="rounded-2xl bg-card p-6 hover:shadow-xl">
                <p className="font-display italic text-noir/80">"{t.quote}"</p>
                <p className="mt-4 text-sm text-noir/50">{t.name}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-noir/10 bg-card">
        <div className="mx-auto max-w-wrap px-6 py-12 text-sm text-noir/60">
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div>
              <p className="font-display text-lg">NEMA</p>
              <p className="mt-2 max-w-xs">Votre style, votre signature.</p>
            </div>
            <div className="flex gap-10">
              <div>
                <p className="mb-2 text-noir">Boutique</p>
                <p>Collections</p>
                <p>Personnaliser</p>
                <p>Nouveautés</p>
              </div>
              <div>
                <p className="mb-2 text-noir">NEMA</p>
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
