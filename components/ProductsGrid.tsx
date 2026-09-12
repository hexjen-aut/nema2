"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import { stitchPattern } from "@/lib/placeholder-pattern";

type Product = {
  id: string;
  name: string;
  base_price: number;
  category_id: string | null;
  category_name: string | null;
  image: string | null;
};

type Category = {
  id: string;
  name: string;
};

export default function ProductsGrid({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | "tout">("tout");

  const filtered = useMemo(() => {
    if (activeCategory === "tout") return products;
    return products.filter((p) => p.category_id === activeCategory);
  }, [products, activeCategory]);

  return (
    <section className="relative z-10 mx-auto max-w-wrap px-6 py-20 md:py-28">
      <Reveal>
        <p className="text-xs tracking-label text-orange">NEMA</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Catalogue</h2>
        <p className="mt-3 max-w-md text-noir/70">
          Découvrez les pièces disponibles et imaginez-les à votre manière.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("tout")}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              activeCategory === "tout"
                ? "border-noir bg-noir text-ivoire"
                : "border-noir/15 text-noir/70 hover:border-noir"
            }`}
          >
            Tout
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                activeCategory === c.id
                  ? "border-noir bg-noir text-ivoire"
                  : "border-noir/15 text-noir/70 hover:border-noir"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={i * 70}>
            <TiltCard className="group">
              <div className="aspect-square overflow-hidden rounded-2xl bg-rose">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div
                    className="flex h-full items-center justify-center text-xs text-noir/40"
                    style={stitchPattern("#2B1810")}
                  >
                    Photo à ajouter depuis l'admin
                  </div>
                )}
              </div>
              <div className="pt-4">
                {p.category_name && (
                  <p className="text-xs tracking-label text-orange">{p.category_name}</p>
                )}
                <p className="mt-1 font-display text-xl">{p.name}</p>
                <p className="mt-1 text-sm text-noir/60">
                  À partir de {Number(p.base_price).toFixed(0)} DH
                </p>
                <Link
                  href={`/personnaliser/${p.id}`}
                  className="mt-3 inline-block text-sm text-orange hover:text-noir transition-colors"
                >
                  Personnaliser →
                </Link>
              </div>
            </TiltCard>
          </Reveal>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full rounded-2xl border border-noir/10 bg-card p-10 text-center text-sm text-noir/40">
            Aucune création disponible dans cette catégorie pour le moment.
          </p>
        )}
      </div>
    </section>
  );
}
