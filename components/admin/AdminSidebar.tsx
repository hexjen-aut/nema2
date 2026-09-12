"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar({
  navItems,
}: {
  navItems: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 text-sm md:flex-col md:overflow-visible md:pb-6">
      {navItems.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-lg px-3 py-2 transition-colors ${
              active ? "bg-orange text-ivoire" : "text-noir/70 hover:bg-ivoire hover:text-noir"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
