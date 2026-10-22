import { createFileRoute, Link } from "@tanstack/react-router";
import { Inbox, MessageCircle, Eye, Images } from "lucide-react";
import { useSql, type Quote, type Project } from "@/lib/data";
import { StatusBadge, TYPE_LABEL } from "@/components/admin/shared";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const n = (k: string, sql: string) => useSql<{ n: number }>(k, sql).data?.[0]?.n ?? 0;
  const quotes = n("c-q", "SELECT COUNT(*) n FROM quotes");
  const wa = n("c-wa", "SELECT COUNT(*) n FROM whatsapp_clicks WHERE created_at >= datetime('now','localtime','-7 days')");
  const visits7 = n("c-v", "SELECT COUNT(*) n FROM visits WHERE created_at >= datetime('now','localtime','-7 days')");
  const projects = n("c-p", "SELECT COUNT(*) n FROM projects");
  const days = useSql<{ d: string; n: number }>("visits-days", "SELECT date(created_at) d, COUNT(*) n FROM visits WHERE created_at >= datetime('now','localtime','-7 days') GROUP BY d ORDER BY d").data ?? [];
  const byType = useSql<{ project_type: string; n: number }>("by-type", "SELECT project_type, COUNT(*) n FROM quotes GROUP BY project_type ORDER BY n DESC").data ?? [];
  const last = useSql<Quote>("last-q", "SELECT * FROM quotes ORDER BY id DESC LIMIT 5").data ?? [];
  const recent = useSql<Project>("recent-p", "SELECT * FROM projects ORDER BY created_at DESC LIMIT 4").data ?? [];
  const max = Math.max(1, ...days.map((d) => d.n));

  const cards = [
    { l: "Demandes de devis", v: quotes, i: Inbox, c: "bg-primary text-primary-foreground" },
    { l: "Clics WhatsApp (7 j)", v: wa, i: MessageCircle, c: "bg-whatsapp text-success-foreground" },
    { l: "Visites (7 j)", v: visits7, i: Eye, c: "bg-secondary text-secondary-foreground" },
    { l: "Projets publiés", v: projects, i: Images, c: "bg-accent text-accent-foreground" },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold text-secondary">Tableau de bord</h1><p className="text-sm text-muted-foreground">Vue d'ensemble de votre site et de vos activités</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.l} className="flex items-center gap-4 rounded-xl bg-card p-5 shadow-card">
            <span className={`grid h-12 w-12 place-items-center rounded-lg ${c.c}`}><c.i className="h-6 w-6" /></span>
            <div><p className="text-sm text-muted-foreground">{c.l}</p><p className="font-display text-2xl font-extrabold">{c.v}</p></div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-xl bg-card p-5 shadow-card xl:col-span-2">
          <h2 className="font-bold">Évolution des visites (7 derniers jours)</h2>
          <div className="mt-6 flex h-48 items-end gap-3">
            {days.length === 0 && <p className="text-sm text-muted-foreground">Pas encore de visites.</p>}
            {days.map((d) => (
              <div key={d.d} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold">{d.n}</span>
                <div className="w-full rounded-t bg-chart-1" style={{ height: `${(d.n / max) * 150}px` }} />
                <span className="text-xs text-muted-foreground">{d.d.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-card">
          <h2 className="font-bold">Répartition des demandes</h2>
          <ul className="mt-4 space-y-3">
            {byType.length === 0 && <li className="text-sm text-muted-foreground">Aucune demande.</li>}
            {byType.map((b) => (
              <li key={b.project_type}>
                <div className="flex justify-between text-sm"><span>{TYPE_LABEL[b.project_type] ?? b.project_type}</span><span className="font-semibold">{b.n}</span></div>
                <div className="mt-1 h-2 rounded bg-muted"><div className="h-2 rounded bg-gradient-primary" style={{ width: `${(b.n / quotes) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-xl bg-card p-5 shadow-card xl:col-span-2">
          <div className="flex justify-between"><h2 className="font-bold">Réalisations récentes</h2><Link to="/admin/realisations" className="text-sm text-accent">Voir tout →</Link></div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {recent.map((p) => <div key={p.id}><img src={p.image} alt="" className="aspect-[4/3] w-full rounded-md object-cover" /><p className="mt-2 text-sm font-semibold">{p.title_fr}</p></div>)}
          </div>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex justify-between"><h2 className="font-bold">Dernières demandes</h2><Link to="/admin/devis" className="text-sm text-accent">Voir tout →</Link></div>
          <ul className="mt-4 divide-y">
            {last.length === 0 && <li className="text-sm text-muted-foreground">Aucune demande pour l'instant.</li>}
            {last.map((q) => (
              <li key={q.id} className="flex items-center justify-between gap-2 py-3">
                <div><p className="text-sm font-semibold">{q.name}</p><p className="text-xs text-muted-foreground">{TYPE_LABEL[q.project_type]} · {q.created_at}</p></div>
                <StatusBadge s={q.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
