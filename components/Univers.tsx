import Reveal from "@/components/Reveal";

const pillars = [
  { title: "Identité", detail: "Exprimez ce qui vous rend unique." },
  { title: "Création", detail: "Imaginez chaque détail." },
  { title: "Signature", detail: "Portez quelque chose qui vous ressemble." },
];

export default function Univers() {
  return (
    <section id="univers" className="relative z-10 mx-auto max-w-wrap px-6 py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-xs tracking-label text-orange">
            BIENVENUE DANS L'UNIVERS NEMA
          </p>
          <h2 className="mt-5 font-display text-4xl leading-[1.15] md:text-5xl">
            Plus qu'une pièce.
            <br />
            Une expression de vous.
          </h2>
          <p className="mt-6 text-noir/70">
            NEMA imagine des créations personnalisables qui permettent à
            chacun de composer des pièces à son image.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 grid max-w-2xl gap-10 sm:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <div className="text-center">
              <p className="font-display text-2xl">{p.title}</p>
              <p className="mt-2 text-sm text-noir/60">{p.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
