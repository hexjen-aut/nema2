import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function CTAFinal() {
  return (
    <section className="relative z-10 bg-noir py-24 text-center text-ivoire md:py-32">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <h2 className="font-display text-4xl leading-[1.2] md:text-5xl">
            Et vous, quelle sera votre signature ?
          </h2>
          <p className="mt-5 text-ivoire/60">
            Imaginez votre pièce. Choisissez chaque détail. Donnez-lui votre
            style.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/personnaliser"
              className="rounded-full bg-orange px-7 py-3.5 text-sm text-ivoire hover:bg-ivoire hover:text-noir transition-colors"
            >
              Créer ma pièce
            </Link>
            <Link
              href="/#collections"
              className="rounded-full border border-ivoire/30 px-7 py-3.5 text-sm hover:border-ivoire transition-colors"
            >
              Explorer les collections
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
