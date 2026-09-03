import Reveal from "@/components/Reveal";

const looks = [
  { key: "situation_look_1", number: "Look 01", name: "Minimal" },
  { key: "situation_look_2", number: "Look 02", name: "Bold" },
  { key: "situation_look_3", number: "Look 03", name: "Casual" },
  { key: "situation_look_4", number: "Look 04", name: "Signature" },
] as const;

type Images = Partial<Record<(typeof looks)[number]["key"], string | null>>;

export default function Situation({ images = {} }: { images?: Images }) {
  return (
    <section className="relative z-10 mx-auto max-w-wrap px-6 py-20 md:py-28">
      <Reveal>
        <h2 className="font-display text-4xl md:text-5xl">NEMA, à votre façon.</h2>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {looks.map((look, i) => {
          const imageUrl = images[look.key];
          return (
            <Reveal key={look.key} delay={i * 90}>
              <div>
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-champagne/30">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt={look.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-xs text-noir/40">
                      Photo à ajouter depuis l'admin
                    </div>
                  )}
                </div>
                <p className="mt-3 text-xs text-noir/50">{look.number}</p>
                <p className="font-display text-lg">{look.name}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
