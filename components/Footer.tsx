import Link from "next/link";
import Logo from "@/components/Logo";

const columns = [
  {
    title: "SHOP",
    links: [
      { label: "Collections", href: "/#collections" },
      { label: "Nouveautés", href: "#" },
      { label: "Best-sellers", href: "#" },
      { label: "Toutes les créations", href: "/collections" },
    ],
  },
  {
    title: "CRÉER",
    links: [
      { label: "Personnaliser", href: "/personnaliser" },
      { label: "Configurateur", href: "/personnaliser" },
      { label: "Comment ça marche", href: "/#comment-ca-marche" },
      { label: "Suivre ma commande", href: "/compte/mes-commandes" },
    ],
  },
  {
    title: "NEMA",
    links: [
      { label: "Notre histoire", href: "/#histoire" },
      { label: "Notre philosophie", href: "/#philosophie" },
      { label: "Inspiration", href: "/#inspiration" },
      { label: "Avis clients", href: "/#avis" },
    ],
  },
  {
    title: "AIDE",
    links: [
      { label: "Contact", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Livraison", href: "#" },
      { label: "Retours", href: "#" },
      { label: "Conditions", href: "#" },
      { label: "Confidentialité", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-noir/10 bg-card">
      <div className="mx-auto max-w-wrap px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 font-display text-lg">Votre style, votre signature.</p>
            <p className="mt-2 max-w-xs text-sm text-noir/60">
              Des créations pensées pour exprimer ce qui vous rend unique.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs tracking-label text-noir/40">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-noir/70">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-orange transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-noir/10 pt-8 text-sm text-noir/50 sm:flex-row">
          <p>© NEMA — Votre style, votre signature.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-orange transition-colors">Instagram</a>
            <a href="#" className="hover:text-orange transition-colors">TikTok</a>
            <a href="#" className="hover:text-orange transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
