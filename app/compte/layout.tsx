import Link from "next/link";
import Logo from "@/components/Logo";

export default function CompteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linen text-ink">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-wrap items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href="/"
            className="text-sm text-ink/60 hover:text-clay transition-colors"
          >
            ← Retour à la boutique
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
