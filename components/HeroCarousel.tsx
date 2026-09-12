"use client";

import { useEffect, useState } from "react";

const PLACEHOLDER_BG =
  "repeating-radial-gradient(circle at 22% 24%, #A9683A22 0, #A9683A22 2px, transparent 2px, transparent 28px), repeating-radial-gradient(circle at 68% 72%, #2B181014 0, #2B181014 2px, transparent 2px, transparent 34px)";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function HeroCarousel({ images }: { images: (string | null | undefined)[] }) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const hasAnyImage = images.some(Boolean);

  useEffect(() => {
    if (!hasAnyImage) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 6000);
    return () => clearInterval(id);
  }, [hasAnyImage, total]);

  function go(delta: number) {
    setIndex((i) => (i + delta + total) % total);
  }

  return (
    <div className="relative min-h-[50vh] overflow-hidden md:min-h-0">
      {images.map((url, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Une création NEMA" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full animate-float bg-rose" style={{ backgroundImage: PLACEHOLDER_BG }} />
          )}
        </div>
      ))}

      {!hasAnyImage && (
        <div className="absolute bottom-6 right-6 z-10 rounded-2xl bg-card/90 px-5 py-4">
          <p className="text-sm text-noir/60">
            Photos à ajouter depuis l'admin (Contenu Home → Hero)
          </p>
        </div>
      )}

      {total > 1 && (
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-3 rounded-full bg-noir/40 px-4 py-2 text-ivoire backdrop-blur-sm">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Photo précédente"
            className="text-sm transition-opacity hover:opacity-70"
          >
            ←
          </button>
          <span className="font-display text-sm tracking-label">
            {pad(index + 1)}/{pad(total)}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Photo suivante"
            className="text-sm transition-opacity hover:opacity-70"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
