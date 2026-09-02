import Reveal from "@/components/Reveal";

const values = [
  { title: "Liberté", detail: "Vous choisissez." },
  { title: "Créativité", detail: "Vous imaginez." },
  { title: "Individualité", detail: "Vous affirmez votre identité." },
];

export default function Philosophie() {
  return (
    <section className="relative z-10 bg-rose/60 py-20 md:py-28">
      <div className="mx-auto max-w-wrap px-6">
        <Reveal>
          <h2 className="max-w-2xl font-display text-4xl leading-[1.2] md:text-5xl">
            Pourquoi porter quelque chose qui ressemble à tout le monde ?
          </h2>
          <p className="mt-6 max-w-md text-noir/70">
            Votre style évolue. Votre personnalité aussi. Vos créations
            devraient pouvoir évoluer avec vous.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <p className="font-display text-2xl">{v.title}</p>
              <p className="mt-2 text-sm text-noir/60">{v.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
