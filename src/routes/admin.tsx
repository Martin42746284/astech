import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { LayoutDashboard, Wrench, Images, Frame, Inbox, HelpCircle, MessageSquareQuote, Settings, LogOut, ExternalLink, Menu, X } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboardStats } from "@/lib/data";
import { adminLogin, adminLogout, adminStatus } from "@/lib/data.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Back-office – ASTECH" },
      { name: "description", content: "Espace d'administration du site ASTECH." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Back-office ASTECH" },
      { property: "og:description", content: "Administration du contenu." },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", l: "Tableau de bord", i: LayoutDashboard, exact: true },
  { to: "/admin/services", l: "Services", i: Wrench },
  { to: "/admin/realisations", l: "Réalisations", i: Images },
  { to: "/admin/galerie", l: "Galerie", i: Frame },
  { to: "/admin/devis", l: "Demandes de devis", i: Inbox },
  { to: "/admin/faq", l: "FAQ", i: HelpCircle },
  { to: "/admin/temoignages", l: "Témoignages", i: MessageSquareQuote },
  { to: "/admin/parametres", l: "Paramètres", i: Settings },
] as const;

function AdminLayout() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [menu, setMenu] = useState(false);
  const stats = useDashboardStats(ok === true);
  const newCount = stats.data?.newQuotes ?? 0;
  useEffect(() => { adminStatus().then((r) => setOk(r.admin)).catch(() => setOk(false)); }, []);

  if (ok === null) return null;
  if (!ok) return <Login onOk={() => setOk(true)} />;

  return (
    <div className="flex min-h-screen bg-muted">
      {menu && <button className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMenu(false)} aria-label="Fermer le menu" />}
      <aside id="admin-navigation" className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-y-auto bg-sidebar p-4 text-sidebar-foreground transition-transform lg:static lg:translate-x-0", menu ? "translate-x-0" : "-translate-x-full")}>
        <Link to="/admin" className="mb-8 px-2"><Logo /></Link>
        <nav className="flex-1 space-y-1">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setMenu(false)} activeOptions={{ exact: "exact" in n }}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent data-[status=active]:bg-sidebar-primary data-[status=active]:text-sidebar-primary-foreground">
              <n.i className="h-4 w-4" />{n.l}
              {n.to === "/admin/devis" && newCount > 0 && <span className="ml-auto rounded-full bg-destructive px-2 text-xs text-destructive-foreground">{newCount}</span>}
            </Link>
          ))}
        </nav>
        <a href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-sm opacity-80 hover:opacity-100"><ExternalLink className="h-4 w-4" />Voir le site</a>
        <button onClick={async () => { await adminLogout().catch(() => {}); setOk(false); }} className="flex items-center gap-2 px-3 py-2 text-sm opacity-80 hover:opacity-100"><LogOut className="h-4 w-4" />Se déconnecter</button>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex h-14 items-center gap-3 border-b bg-card px-4 lg:hidden">
          <button className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md" onClick={() => setMenu(!menu)} aria-label={menu ? "Fermer le menu" : "Menu"} aria-expanded={menu} aria-controls="admin-navigation">
            {menu ? <X /> : <Menu />}
          </button><span className="font-bold">ASTECH Admin</span>
        </header>
        <main className="min-w-0 p-3 sm:p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}

function Login({ onOk }: { onOk: () => void }) {
  const [err, setErr] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const pwd = String(new FormData(e.currentTarget).get("pwd"));
    const res = await adminLogin({ data: { password: pwd } }).catch(() => ({ ok: false as const }));
    if (res.ok) onOk(); else setErr(true);
  }
  return (
    <div className="grid min-h-screen place-items-center bg-secondary px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl bg-card p-8 shadow-card">
        <Logo light={false} />
        <h1 className="mt-6 text-xl font-bold">Accès back-office</h1>
        <p className="text-sm text-muted-foreground">Saisissez le mot de passe administrateur.</p>
        <Input name="pwd" type="password" autoFocus className="mt-4" aria-label="Mot de passe" />
        {err && <p className="mt-2 text-sm text-destructive">Mot de passe incorrect.</p>}
        <Button type="submit" variant="cta" className="mt-4 w-full">Se connecter</Button>
      </form>
    </div>
  );
}
