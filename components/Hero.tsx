import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

// Hero plein cadre : la photo (éditable en admin) occupe tout l'espace,
// le texte de marque est posé dessus avec un voile dégradé pour la lisibilité.
export default function Hero({ imageUrl }: { imageUrl?: string | null }) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[78vh] w-full md:min-h-[88vh]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Une création NEMA"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 animate-float bg-rose"
            style={{
              backgroundImage:
                "repeating-radial-gradient(circle at 22% 24%, #A9683A22 0, #A9683A22 2px, transparent 2px, transparent 28px), repeating-radial-gradient(circle at 68% 72%, #2B181014 0, #2B181014 2px, transparent 2px, transparent 34px)",
            }}
          />
        )}

        {/* Voile dégradé pour la lisibilité du texte, du bas vers le haut */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(43,24,16,0.82) 0%, rgba(43,24,16,0.35) 42%, rgba(43,24,16,0.05) 68%, transparent 100%)",
          }}
        />

        <div className="relative z-10 flex h-full min-h-[78vh] items-end md:min-h-[88vh]">
          <div className="mx-auto w-full max-w-wrap px-6 pb-14 pt-32 md:pb-20">
            <Reveal>
              <p className="text-xs tracking-label text-champagne">
                NEMA — CRÉATIONS PERSONNALISABLES
              </p>
              <h1 className="mt-5 max-w-2xl font-display text-5xl leading-[1.08] text-ivoire md:text-7xl">
                Votre style,
                <br />
                votre signature.
              </h1>
              <p className="mt-6 max-w-md text-ivoire/80">
                Des créations pensées pour vous permettre d'exprimer ce qui
                vous rend unique — composées pièce par pièce, avec vous.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <MagneticButton
                  href="/personnaliser"
                  className="rounded-full bg-orange px-7 py-3.5 text-sm text-ivoire hover:bg-ivoire hover:text-noir transition-colors"
                >
                  Créer ma pièce
                </MagneticButton>
                <MagneticButton
                  href="#univers"
                  className="rounded-full border border-ivoire/70 px-7 py-3.5 text-sm text-ivoire hover:bg-ivoire hover:text-noir transition-colors"
                >
                  Découvrir NEMA
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </div>

        {!imageUrl && (
          <div className="absolute bottom-6 right-6 z-10 rounded-2xl bg-ivoire/90 px-5 py-4">
            <p className="text-sm text-noir/60">
              Photo à ajouter depuis l'admin (Contenu Home → Hero)
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
