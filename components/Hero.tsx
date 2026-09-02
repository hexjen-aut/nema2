import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-wrap gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <Reveal>
          <p className="text-xs tracking-label text-orange">
            NEMA — CRÉATIONS PERSONNALISABLES
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[1.08] md:text-6xl">
            Votre style,
            <br />
            votre signature.
          </h1>
          <p className="mt-6 max-w-md text-noir/70">
            Des créations pensées pour vous permettre d'exprimer ce qui vous
            rend unique — composées pièce par pièce, avec vous.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <MagneticButton
              href="/personnaliser"
              className="rounded-full bg-orange px-7 py-3.5 text-sm text-ivoire hover:bg-noir transition-colors"
            >
              Créer ma pièce
            </MagneticButton>
            <MagneticButton
              href="#univers"
              className="rounded-full border border-noir px-7 py-3.5 text-sm hover:bg-noir hover:text-ivoire transition-colors"
            >
              Découvrir NEMA
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-rose">
            {/*
              Image éditoriale à venir : une personne portant une création NEMA.
              Ajoutée depuis l'admin (section "Contenu Home" à créer) — en
              attendant, placeholder texturé cohérent avec l'identité.
            */}
            <div
              className="absolute inset-0 animate-float"
              style={{
                backgroundImage:
                  "repeating-radial-gradient(circle at 22% 24%, #F5822022 0, #F5822022 2px, transparent 2px, transparent 28px), repeating-radial-gradient(circle at 68% 72%, #17141414 0, #17141414 2px, transparent 2px, transparent 34px)",
              }}
            />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-ivoire/90 px-5 py-4">
              <p className="font-display text-lg">Une création NEMA</p>
              <p className="text-sm text-noir/60">
                Photo à ajouter depuis l'espace admin
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
