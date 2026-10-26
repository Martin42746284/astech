import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Trash2, Eye, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSql, useMutateSql, telLink, type Quote, type QuoteStatus } from "@/lib/data";
import { STATUS, StatusBadge, TYPE_LABEL } from "@/components/admin/shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/devis")({ component: Page });

function Page() {
  const rows = useSql<Quote>("quotes", "SELECT * FROM quotes ORDER BY id DESC").data ?? [];
  const mutate = useMutateSql();
  const [filter, setFilter] = useState<QuoteStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<Quote | null>(null);
  const list = rows.filter((r) => (filter === "all" || r.status === filter) && `${r.name} ${r.phone} ${r.location ?? ""}`.toLowerCase().includes(search.toLowerCase()));

  function exportCsv() {
    const cols = ["id", "created_at", "status", "name", "phone", "email", "project_type", "location", "budget", "surface", "message", "notes"] as const;
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = "\uFEFF" + [cols.join(";"), ...list.map((r) => cols.map((c) => esc(r[c])).join(";"))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `demandes-devis-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  async function setStatus(id: number, s: QuoteStatus) {
    await mutate("UPDATE quotes SET status=? WHERE id=?", [s, id]);
    if (open?.id === id) setOpen({ ...open, status: s });
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-secondary">Demandes de devis</h1>
        <Button variant="outline" onClick={exportCsv}><Download /> Export CSV</Button>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["all", "new", "in_progress", "done", "archived"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={cn("rounded-md border px-3 py-1.5 text-sm font-semibold", filter === s ? "border-primary bg-primary text-primary-foreground" : "bg-card")}>
            {s === "all" ? "Toutes" : STATUS[s].l}
          </button>
        ))}
        <div className="relative w-full sm:ml-auto sm:w-auto"><Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="w-full pl-8 sm:w-56" placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      </div>
      <div className="space-y-3 lg:hidden">
        {list.map((r) => (
          <article key={r.id} className="space-y-3 rounded-xl bg-card p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words font-semibold">{r.name}</p>
                <a href={telLink(r.phone)} className="text-sm text-accent">{r.phone}</a>
              </div>
              <select aria-label={`Statut de ${r.name}`} value={r.status} onChange={(e) => setStatus(r.id, e.target.value as QuoteStatus)} className="max-w-32 rounded border bg-transparent px-2 py-1 text-xs">
                {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap justify-between gap-2 border-t pt-3 text-sm">
              <span className="text-muted-foreground">{TYPE_LABEL[r.project_type]}</span>
              <span className="text-muted-foreground">{r.created_at}</span>
            </div>
            <div className="flex justify-end gap-2">
              <Button size="icon" variant="ghost" onClick={() => setOpen(r)} aria-label="Voir"><Eye /></Button>
              <Button size="icon" variant="ghost" className="text-destructive" aria-label="Supprimer"
                onClick={async () => { if (confirm("Supprimer cette demande (droit à l'effacement) ?")) { await mutate("DELETE FROM quotes WHERE id=?", [r.id]); toast.success("Supprimée"); } }}><Trash2 /></Button>
            </div>
          </article>
        ))}
        {list.length === 0 && <p className="rounded-xl bg-card p-6 text-center text-sm text-muted-foreground shadow-card">Aucune demande.</p>}
      </div>
      <div className="hidden overflow-x-auto rounded-xl bg-card shadow-card lg:block">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-muted-foreground"><tr>{["Client", "Téléphone", "Type de projet", "Date", "Statut", ""].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y">
            {list.map((r) => (
              <tr key={r.id} className="hover:bg-muted/50">
                <td className="p-3 font-semibold">{r.name}</td>
                <td className="p-3"><a href={telLink(r.phone)} className="text-accent">{r.phone}</a></td>
                <td className="p-3">{TYPE_LABEL[r.project_type]}</td>
                <td className="p-3 text-muted-foreground">{r.created_at}</td>
                <td className="p-3">
                  <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value as QuoteStatus)} className="rounded border bg-transparent px-2 py-1 text-xs">
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
                  </select>
                </td>
                <td className="whitespace-nowrap p-3 text-right">
                  <Button size="icon" variant="ghost" onClick={() => setOpen(r)} aria-label="Voir"><Eye /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" aria-label="Supprimer"
                    onClick={async () => { if (confirm("Supprimer cette demande (droit à l'effacement) ?")) { await mutate("DELETE FROM quotes WHERE id=?", [r.id]); toast.success("Supprimée"); } }}><Trash2 /></Button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Aucune demande.</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {open && (<>
            <DialogHeader><DialogTitle className="flex items-center gap-3">{open.name} <StatusBadge s={open.status} /></DialogTitle></DialogHeader>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[["Téléphone", open.phone], ["E-mail", open.email], ["Type", TYPE_LABEL[open.project_type]], ["Localisation", open.location], ["Budget", open.budget], ["Surface", open.surface], ["Reçue le", open.created_at]].map(([k, v]) => (
                <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v || "—"}</dd></div>
              ))}
            </dl>
            <div><p className="text-sm text-muted-foreground">Message</p><p className="whitespace-pre-line rounded bg-muted p-3 text-sm">{open.message}</p></div>
            {open.attachment && (
              <div><p className="text-sm text-muted-foreground">Pièce jointe</p>
                {open.attachment.startsWith("data:image") ? <img src={open.attachment} alt="" className="max-h-64 rounded" /> : null}
                <a href={open.attachment} download={open.attachment_name ?? "piece-jointe"} className="text-sm text-accent underline">Télécharger {open.attachment_name}</a>
              </div>
            )}
            <NotesEditor q={open} onSave={async (n) => { await mutate("UPDATE quotes SET notes=? WHERE id=?", [n, open.id]); toast.success("Notes enregistrées"); }} />
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS).map(([k, v]) => <Button key={k} size="sm" variant={open.status === k ? "cta" : "outline"} onClick={() => setStatus(open.id, k as QuoteStatus)}>{v.l}</Button>)}
            </div>
          </>)}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NotesEditor({ q, onSave }: { q: Quote; onSave: (n: string) => void }) {
  const [n, setN] = useState(q.notes ?? "");
  return (
    <div>
      <p className="text-sm text-muted-foreground">Notes internes</p>
      <Textarea value={n} onChange={(e) => setN(e.target.value)} rows={3} />
      <Button size="sm" variant="secondary" className="mt-2" onClick={() => onSave(n)}>Enregistrer les notes</Button>
    </div>
  );
}
