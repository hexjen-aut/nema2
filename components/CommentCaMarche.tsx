import Reveal from "@/components/Reveal";

const steps = [
  { number: "01", title: "Imaginez", detail: "Vous choisissez votre modèle." },
  { number: "02", title: "Personnalisez", detail: "Vous sélectionnez couleurs et détails." },
  { number: "03", title: "Visualisez", detail: "Vous découvrez votre création." },
  { number: "04", title: "Validez", detail: "Vous confirmez votre commande." },
  { number: "05", title: "Nous créons", detail: "Votre pièce est fabriquée." },
  { number: "06", title: "Recevez", detail: "Elle arrive jusqu'à vous." },
];

export default function CommentCaMarche() {
  return (
    <section id="comment-ca-marche" className="relative z-10 bg-card py-20 md:py-28">
      <div className="mx-auto max-w-wrap px-6">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl">De votre idée à votre pièce.</h2>
        </Reveal>

        <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.number} delay={i * 80}>
              <div className="flex gap-4">
                <span className="font-display text-2xl text-orange">{s.number}</span>
                <div>
                  <p className="font-display text-lg">{s.title}</p>
                  <p className="mt-1 text-sm text-noir/60">{s.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
