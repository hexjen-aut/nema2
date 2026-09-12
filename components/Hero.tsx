import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import HeroCarousel from "@/components/HeroCarousel";
import Logo from "@/components/Logo";

// Hero en plein cadre horizontal : une seule photo pleine largeur (carrousel
// jusqu'à 4 visuels, toujours éditable en admin), marque NEMA centrée
// dessus avec un voile pour la lisibilité.
export default function Hero({ images }: { images: (string | null | undefined)[] }) {
  return (
    <section className="relative min-h-[62vh] w-full overflow-hidden md:min-h-[75vh]">
      <HeroCarousel images={images} />

      <div className="absolute inset-0 bg-noir/45" />

      <div className="relative z-10 flex h-full min-h-[62vh] flex-col items-center justify-center px-6 py-16 text-center md:min-h-[75vh]">
        <Reveal className="flex flex-col items-center">
          <Logo size="xl" tone="ivoire" />
          <p className="mt-5 font-display text-xl italic text-ivoire/90 md:text-2xl">
            Votre style, votre signature.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
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
