import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

const testimonials = [
  {
    quote:
      "J'ai pu voir mon sac avant même qu'il soit commencé. Le résultat final était identique.",
    name: "Aïcha",
    city: "Libreville",
  },
  {
    quote: "Le bonnet est arrivé exactement comme je l'avais imaginé, couleurs et tout.",
    name: "Salma",
    city: "Casablanca",
  },
  {
    quote: "Un vrai travail d'artisan, avec un suivi de commande très clair.",
    name: "Nadia",
    city: "Rabat",
  },
];

function Stars() {
  return (
    <div aria-hidden="true" className="flex gap-0.5 text-orange">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export default function Avis() {
  return (
    <section id="avis" className="relative z-10 mx-auto max-w-wrap px-6 py-20 md:py-28">
      <Reveal>
        <h2 className="font-display text-4xl md:text-5xl">Créé par vous. Adopté par eux.</h2>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 100}>
            <TiltCard className="rounded-2xl border border-noir/10 bg-card p-6">
              <Stars />
              <p className="mt-4 font-display italic text-noir/80">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose text-xs text-noir/50">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm">{t.name}</p>
                  <p className="text-xs text-noir/50">{t.city}</p>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
