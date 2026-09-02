"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

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
        <h2 className="font-display text-4xl md:text-5xl">Les créations NEMA</h2>
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

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={i * 70}>
            <TiltCard className="group overflow-hidden rounded-2xl border border-noir/10 bg-card hover:border-orange">
              <div className="aspect-square overflow-hidden bg-rose">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-noir/40">
                    Photo à ajouter depuis l'admin
                  </div>
                )}
              </div>
              <div className="p-5">
                {p.category_name && (
                  <p className="text-xs tracking-label text-orange">{p.category_name}</p>
                )}
                <p className="mt-1 font-display text-xl">{p.name}</p>
                <p className="mt-1 text-sm text-noir/60">
                  À partir de {Number(p.base_price).toFixed(0)} DH
                </p>
                <Link
                  href={`/personnaliser/${p.id}`}
                  className="mt-4 inline-block rounded-full bg-orange px-5 py-2 text-xs text-ivoire hover:bg-noir transition-colors"
                >
                  Personnaliser
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
