import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/prix", label: "Prix" },
  { href: "/admin/couleurs", label: "Couleurs" },
  { href: "/admin/options", label: "Options" },
  { href: "/admin/clients", label: "Clients" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/admin/login?error=not_admin");

  return (
    <div className="min-h-screen bg-linen text-ink md:flex">
      <aside className="border-b border-ink/10 bg-card md:w-56 md:shrink-0 md:border-b-0 md:border-r">
        <div className="px-6 py-5">
          <p className="font-display text-xl">Nema</p>
          <p className="text-xs text-ink/50">Espace admin</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 text-sm md:flex-col md:overflow-visible md:pb-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-linen"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <p className="text-sm text-ink/60">
            Connecté : {profile?.full_name || user.email}
          </p>
          <form action="/admin/logout" method="post">
            <button className="text-sm text-ink/60 hover:text-clay" type="submit">
              Déconnexion
            </button>
          </form>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
