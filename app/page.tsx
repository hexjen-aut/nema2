import ChainDivider from "@/components/ChainDivider";
import CursorGlow from "@/components/CursorGlow";
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
import Situation from "@/components/Situation";
import Inspiration from "@/components/Inspiration";
import Avis from "@/components/Avis";
import Garanties from "@/components/Garanties";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

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

  const { data: settingsRows } = await supabase.from("settings").select("key, value");
  const content = new Map<string, string>(
    (settingsRows || []).map((r: any) => [r.key, r.value?.image_url || null])
  );

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

      <Hero imageUrl={content.get("hero")} />

      <Univers />

      <div className="relative z-10 mx-auto max-w-wrap px-6">
        <ChainDivider color="#F58220" />
      </div>

      <Collections categories={categories || []} />

      <ProductsGrid products={products} categories={categories || []} />

      <Creez
        images={{
          produit_vierge: content.get("creez_produit_vierge"),
          personnalisation: content.get("creez_personnalisation"),
          creation_finale: content.get("creez_creation_finale"),
        }}
      />

      <div className="relative z-10 mx-auto max-w-wrap px-6">
        <ChainDivider color="#5F6B4A" />
      </div>

      <Atelier />

      <ApercuIA avantUrl={content.get("apercu_avant")} apresUrl={content.get("apercu_apres")} />

      <CommentCaMarche />

      <Histoire imageUrl={content.get("histoire")} />

      <Philosophie />

      <Situation
        images={{
          situation_look_1: content.get("situation_look_1"),
          situation_look_2: content.get("situation_look_2"),
          situation_look_3: content.get("situation_look_3"),
          situation_look_4: content.get("situation_look_4"),
        }}
      />

      <Inspiration />

      <div className="relative z-10 mx-auto max-w-wrap px-6">
        <ChainDivider color="#F58220" />
      </div>

      <Avis />

      <Garanties />

      <CTAFinal />

      <Footer />
    </main>
  );
}
