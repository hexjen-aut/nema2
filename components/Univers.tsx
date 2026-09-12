import Reveal from "@/components/Reveal";

const pillars = [
  { title: "Identité", detail: "Exprimez ce qui vous rend unique." },
  { title: "Création", detail: "Imaginez chaque détail." },
  { title: "Signature", detail: "Portez quelque chose qui vous ressemble." },
];

function FlowerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <g stroke="#A9683A" strokeWidth="1.2">
        <path d="M16 4c2.5 3 2.5 7 0 12-2.5-5-2.5-9 0-12Z" />
        <path d="M16 28c2.5-3 2.5-7 0-12-2.5 5-2.5 9 0 12Z" />
        <path d="M4 16c3-2.5 7-2.5 12 0-5 2.5-9 2.5-12 0Z" />
        <path d="M28 16c-3-2.5-7-2.5-12 0 5 2.5 9 2.5 12 0Z" />
      </g>
      <circle cx="16" cy="16" r="2.4" fill="#A9683A" />
    </svg>
  );
}

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
            <span className="italic">Une expression de vous.</span>
          </h2>
          <p className="mt-6 text-noir/70">
            NEMA imagine des créations personnalisables qui permettent à
            chacun de composer des pièces à son image.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 flex max-w-3xl items-center gap-6">
        <div className="h-px flex-1 bg-noir/15" />
        <FlowerOrnament className="h-6 w-6 shrink-0" />
        <div className="h-px flex-1 bg-noir/15" />
      </div>

      <div className="mx-auto mt-14 grid max-w-2xl gap-10 sm:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <div className="text-center">
              <p className="font-display text-2xl italic">{p.title}</p>
              <p className="mt-2 text-sm text-noir/60">{p.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
