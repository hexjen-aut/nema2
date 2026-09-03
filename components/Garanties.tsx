import Reveal from "@/components/Reveal";

function IconAdjust() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M4 6h14M4 11h14M4 16h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="9" cy="6" r="1.8" fill="#FFFDF9" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="15" cy="11" r="1.8" fill="#FFFDF9" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="16" r="1.8" fill="#FFFDF9" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M2 11c1.8-4 5.4-6.5 9-6.5S18.2 7 20 11c-1.8 4-5.4 6.5-9 6.5S3.8 15 2 11Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="11" cy="11" r="2.6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconThread() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M6.5 8c2 1.5 2 5.5 4.5 5.5s2.5-4 4.5-5.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M11 20s6.5-6.2 6.5-11A6.5 6.5 0 1 0 4.5 9c0 4.8 6.5 11 6.5 11Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

const items = [
  { icon: IconAdjust, title: "Personnalisation", detail: "Votre pièce est composée selon vos choix." },
  { icon: IconEye, title: "Aperçu", detail: "Vous visualisez votre création avant fabrication." },
  { icon: IconThread, title: "Fabrication", detail: "Votre pièce est préparée après validation." },
  { icon: IconPin, title: "Suivi", detail: "Vous pouvez suivre l'évolution de votre commande." },
];

export default function Garanties() {
  return (
    <section className="relative z-10 bg-card py-20">
      <div className="mx-auto max-w-wrap px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={i * 80}>
                <div className="text-noir/80">
                  <Icon />
                  <p className="mt-3 font-display text-lg text-noir">{item.title}</p>
                  <p className="mt-1 text-sm text-noir/60">{item.detail}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
