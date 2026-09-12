import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import HeroCarousel from "@/components/HeroCarousel";

// Fin motif décoratif "branches" en lignes fines, posé derrière le texte —
// écho discret du crochet/de la nature, dans le ton cuivre du logo.
function LineArtAccent() {
  return (
    <svg
      viewBox="0 0 420 560"
      aria-hidden="true"
      className="pointer-events-none absolute -left-16 -top-10 h-[140%] w-auto opacity-[0.28]"
    >
      <g fill="none" stroke="#F3E7D5" strokeWidth="1.3" strokeLinecap="round">
        <path d="M20 540 C60 420 30 300 90 220 C130 168 110 90 150 20" />
        <path d="M90 220 C140 210 170 170 220 160" />
        <path d="M60 340 C110 335 140 300 190 288" />
        <path d="M40 460 C90 452 120 420 170 410" />
        <path d="M150 20 C170 55 200 60 220 95" />
      </g>
    </svg>
  );
}

// Hero en plein cadre horizontal : une seule photo pleine largeur (carrousel
// jusqu'à 4 visuels, toujours éditable en admin), texte de marque posé
// dessus avec un voile dégradé pour la lisibilité.
export default function Hero({ images }: { images: (string | null | undefined)[] }) {
  return (
    <section className="relative min-h-[62vh] w-full overflow-hidden md:min-h-[75vh]">
      <HeroCarousel images={images} />

      <div className="absolute inset-0 bg-gradient-to-r from-noir/80 via-noir/35 to-noir/5" />

      <div className="relative z-10 flex h-full min-h-[62vh] items-center overflow-hidden px-6 py-16 md:min-h-[75vh] md:px-14 lg:px-20">
        <LineArtAccent />
        <Reveal className="relative z-10">
          <p className="text-xs tracking-label text-ivoire/80">
            MAISON DE CRÉATIONS PERSONNALISABLES
          </p>
          <h1 className="mt-5 max-w-md font-display text-5xl leading-[1.1] text-ivoire md:text-6xl">
            Votre style,
            <br />
            <em className="italic">votre signature.</em>
          </h1>
          <p className="mt-6 max-w-sm text-ivoire/80">
            Des créations pensées pour vous, composées avec soin et
            personnalisées selon votre univers.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <MagneticButton
              href="/personnaliser"
              className="rounded-full bg-ivoire px-7 py-3.5 text-sm text-noir hover:bg-orange hover:text-ivoire transition-colors"
            >
              Créer ma pièce →
            </MagneticButton>
            <MagneticButton
              href="#univers"
              className="rounded-full border border-ivoire/60 px-7 py-3.5 text-sm text-ivoire hover:bg-ivoire hover:text-noir transition-colors"
            >
              Découvrir NEMA
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
