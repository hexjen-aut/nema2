"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "/#collections", label: "Collections" },
  { href: "/#personnaliser", label: "Créer" },
  { href: "/#histoire", label: "Notre histoire" },
  { href: "/#inspiration", label: "Inspiration" },
];

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12.5 12.5 16.5 16.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="6" r="3.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 16c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 15.3 3.3 9.7c-1.6-1.6-1.6-4.1 0-5.6 1.5-1.5 3.9-1.5 5.4 0L9 4.4l.3-.3c1.5-1.5 3.9-1.5 5.4 0 1.6 1.5 1.6 4 0 5.6L9 15.3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBag() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4.5 6h9l.7 9.5h-10.4L4.5 6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6.5 6V4.8a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export default function Navbar({ accountHref }: { accountHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-noir/10 bg-ivoire/90 backdrop-blur transition-[padding] duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-wrap items-center justify-between px-6">
        <Link href="/" aria-label="Accueil NEMA">
          <Logo className={`transition-transform duration-300 ${scrolled ? "scale-90" : ""}`} />
        </Link>

        <nav className="hidden gap-9 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="nav-link text-noir/80 hover:text-noir">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-4 text-noir/70 sm:flex">
            <button type="button" aria-label="Rechercher" className="hover:text-orange transition-colors">
              <IconSearch />
            </button>
            <Link href={accountHref} aria-label="Mon compte" className="hover:text-orange transition-colors">
              <IconUser />
            </Link>
            <Link href="/compte/favoris" aria-label="Favoris" className="hover:text-orange transition-colors">
              <IconHeart />
            </Link>
            <Link href="/compte/mes-commandes" aria-label="Mes commandes" className="hover:text-orange transition-colors">
              <IconBag />
            </Link>
          </div>

          <Link
            href="/personnaliser"
            className="hidden rounded-full bg-orange px-5 py-2.5 text-sm text-ivoire transition-colors hover:bg-noir lg:inline-block"
          >
            Créer ma pièce
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px w-5 bg-noir transition-transform ${mobileOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-5 bg-noir transition-transform ${mobileOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-noir/10 bg-ivoire px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-4 text-base">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-noir/80"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 flex items-center gap-6 border-t border-noir/10 pt-6 text-sm text-noir/70">
            <Link href={accountHref} onClick={() => setMobileOpen(false)}>
              Mon compte
            </Link>
            <Link href="/compte/favoris" onClick={() => setMobileOpen(false)}>
              Favoris
            </Link>
          </div>
          <Link
            href="/personnaliser"
            onClick={() => setMobileOpen(false)}
            className="mt-6 block rounded-full bg-orange px-5 py-3 text-center text-sm text-ivoire"
          >
            Créer ma pièce
          </Link>
        </div>
      )}
    </header>
  );
}
