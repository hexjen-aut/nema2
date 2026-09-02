import ChainDivider from "@/components/ChainDivider";
import CursorGlow from "@/components/CursorGlow";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Univers from "@/components/Univers";
import Collections from "@/components/Collections";
import ProductsGrid from "@/components/ProductsGrid";
import Creez from "@/components/Creez";
import Atelier from "@/components/Atelier";
import ApercuIA from "@/components/ApercuIA";
import CommentCaMarche from "@/components/CommentCaMarche";
import Histoire from "@/components/Histoire";
import Philosophie from "@/components/Philosophie";
import { createClient } from "@/lib/supabase/server";

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

      <Creez />

      <div className="relative z-10 mx-auto max-w-wrap px-6">
        <ChainDivider color="#5F6B4A" />
      </div>

      <Atelier />

      <ApercuIA />

      <CommentCaMarche />

      <Histoire />

      <Philosophie />

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
