import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";
import AdminSidebar from "@/components/admin/AdminSidebar";
import OnboardingGuide from "@/components/admin/OnboardingGuide";

const navItems = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/fils", label: "Fils" },
  { href: "/admin/prix", label: "Prix" },
  { href: "/admin/couleurs", label: "Couleurs" },
  { href: "/admin/options", label: "Options" },
  { href: "/admin/contenu", label: "Contenu Home" },
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
          <Logo size="sm" />
          <p className="mt-1 text-xs text-ink/50">Espace admin</p>
        </div>
        <AdminSidebar navItems={navItems} />
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <p className="text-sm text-ink/60">
            Connecté : {profile?.full_name || user.email}
          </p>
          <div className="flex items-center gap-4">
            <OnboardingGuide />
            <form action="/admin/logout" method="post">
              <button className="text-sm text-ink/60 hover:text-clay" type="submit">
                Déconnexion
              </button>
            </form>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
