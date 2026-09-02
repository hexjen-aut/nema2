import Link from "next/link";
import Reveal from "@/components/Reveal";

const steps = [
  { number: "01", verb: "Choisissez", detail: "Le modèle." },
  { number: "02", verb: "Composez", detail: "Les couleurs." },
  { number: "03", verb: "Personnalisez", detail: "Les détails." },
  { number: "04", verb: "Visualisez", detail: "Votre création." },
  { number: "05", verb: "Validez", detail: "Votre pièce." },
];

export default function Atelier() {
  return (
    <section id="personnaliser" className="relative z-10 bg-noir py-20 text-ivoire md:py-28">
      <div className="mx-auto max-w-wrap px-6">
        <Reveal>
          <p className="text-xs tracking-label text-orange">L'ATELIER NEMA</p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl">Créez votre pièce.</h2>
          <p className="mt-4 max-w-md text-ivoire/60">Chaque détail vous appartient.</p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ivoire/10 sm:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal key={s.number} delay={i * 90}>
              <div className="h-full bg-ivoire/[0.04] p-6 transition-colors duration-300 hover:bg-orange/10">
                <p className="text-xs text-orange">{s.number}</p>
                <p className="mt-3 font-display text-xl">{s.verb}</p>
                <p className="mt-1 text-sm text-ivoire/50">{s.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Link
          href="/personnaliser"
          className="mt-10 inline-block rounded-full bg-orange px-7 py-3.5 text-sm text-ivoire hover:bg-ivoire hover:text-noir transition-colors"
        >
          Commencer ma personnalisation
        </Link>
      </div>
    </section>
  );
}
