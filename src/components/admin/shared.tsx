import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
type Scalar = string | number | null;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminRows, useCrudMutate, fileToImage, slugify, type QuoteStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

export const TYPE_LABEL: Record<string, string> = {
  maison: "Maison individuelle", fondation: "Fondations", "rendu-3d": "Plans / Rendu 3D", chantier: "Suivi de chantier",
  permis: "Permis de construire", etude: "Étude et devis", autre: "Autre",
};
export const STATUS: Record<QuoteStatus, { l: string; c: string }> = {
  new: { l: "Nouvelle", c: "bg-success/15 text-success" },
  in_progress: { l: "En cours", c: "bg-accent/15 text-accent" },
  done: { l: "Traitée", c: "bg-muted text-muted-foreground" },
  archived: { l: "Archivée", c: "bg-muted text-muted-foreground" },
};
export function StatusBadge({ s }: { s: QuoteStatus }) {
  return <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS[s]?.c)}>{STATUS[s]?.l}</span>;
}

export type Field = {
  name: string; label: string;
  type?: "text" | "textarea" | "number" | "select" | "image" | "checkbox";
  options?: { v: string; l: string }[]; full?: boolean; required?: boolean; hint?: string;
};

type AnyRow = Record<string, Scalar> & { id: number };

export function CrudPage({ title, table, fields, columns, slugFrom }: {
  title: string; table: string; orderBy: string; fields: Field[];
  columns: { label: string; render: (r: AnyRow) => React.ReactNode }[]; slugFrom?: string;
}) {
  const rows = useAdminRows<AnyRow>(table).data ?? [];
  const { save: saveRow, del: delRow } = useCrudMutate(table);
  const [edit, setEdit] = useState<Partial<AnyRow> | null>(null);

  async function save() {
    if (!edit) return;
    for (const f of fields) if (f.required && !edit[f.name]) return toast.error(`« ${f.label} » est obligatoire`);
    const data: Record<string, Scalar> = {};
    fields.forEach((f) => (data[f.name] = (edit[f.name] ?? (f.type === "checkbox" ? 0 : null)) as Scalar));
    if (slugFrom) data.slug = (edit.slug as string) || slugify(String(edit[slugFrom] ?? "")) + (edit.id ? "" : "-" + Date.now().toString(36));
    try {
      await saveRow(data, edit.id);
      toast.success("Enregistré");
      setEdit(null);
    } catch (e) {
      toast.error("Erreur : " + (e as Error).message);
    }
  }
  async function del(id: number) {
    if (!confirm("Supprimer définitivement cet élément ?")) return;
    await delRow(id);
    toast.success("Supprimé");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-secondary">{title}</h1>
        <Button variant="cta" onClick={() => setEdit({})}><Plus /> Ajouter</Button>
      </div>
      <div className="space-y-3 lg:hidden">
        {rows.map((r) => (
          <article key={r.id} className="space-y-3 rounded-xl bg-card p-4 shadow-card">
            {columns.map((c) => (
              <div key={c.label} className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground">{c.label}</p>
                <div className="break-words text-sm">{c.render(r)}</div>
              </div>
            ))}
            <div className="flex justify-end gap-2 border-t pt-2">
              <Button size="icon" variant="ghost" onClick={() => setEdit(r)} aria-label="Modifier"><Pencil /></Button>
              <Button size="icon" variant="ghost" onClick={() => del(r.id)} aria-label="Supprimer" className="text-destructive"><Trash2 /></Button>
            </div>
          </article>
        ))}
        {rows.length === 0 && <p className="rounded-xl bg-card p-6 text-center text-sm text-muted-foreground shadow-card">Aucun élément.</p>}
      </div>
      <div className="hidden overflow-x-auto rounded-xl bg-card shadow-card lg:block">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-muted-foreground">
            <tr>{columns.map((c) => <th key={c.label} className="p-3 font-semibold">{c.label}</th>)}<th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-muted/50">
                {columns.map((c) => <td key={c.label} className="p-3">{c.render(r)}</td>)}
                <td className="whitespace-nowrap p-3 text-right">
                  <Button size="icon" variant="ghost" onClick={() => setEdit(r)} aria-label="Modifier"><Pencil /></Button>
                  <Button size="icon" variant="ghost" onClick={() => del(r.id)} aria-label="Supprimer" className="text-destructive"><Trash2 /></Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td className="p-6 text-center text-muted-foreground" colSpan={columns.length + 1}>Aucun élément.</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader><DialogTitle>{edit?.id ? "Modifier" : "Ajouter"}</DialogTitle></DialogHeader>
          {edit && (
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => <FieldInput key={f.name} f={f} value={edit[f.name]} onChange={(v) => setEdit({ ...edit, [f.name]: v })} />)}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEdit(null)}>Annuler</Button>
            <Button variant="cta" onClick={save}>Enregistrer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FieldInput({ f, value, onChange }: { f: Field; value: Scalar | undefined; onChange: (v: Scalar) => void }) {
  const full = f.full || f.type === "textarea" || f.type === "image";
  const v = value == null ? "" : String(value);
  return (
    <div className={cn(full && "sm:col-span-2")}>
      {f.type !== "checkbox" && <Label>{f.label}{f.required && " *"}</Label>}
      {f.type === "textarea" ? <Textarea rows={4} value={v} onChange={(e) => onChange(e.target.value)} />
        : f.type === "select" ? (
          <select value={v} onChange={(e) => onChange(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
            <option value="">—</option>{f.options?.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>)
        : f.type === "checkbox" ? (
          <label className="flex items-center gap-2 pt-6 text-sm"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked ? 1 : 0)} className="accent-primary" />{f.label}</label>)
        : f.type === "image" ? (
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {v && <img src={v} alt="" className="h-20 w-28 rounded object-cover" />}
            <Input type="file" accept="image/*" onChange={async (e) => { const file = e.target.files?.[0]; if (file) onChange(await fileToImage(file)); }} />
          </div>)
        : <Input type={f.type === "number" ? "number" : "text"} value={v} onChange={(e) => onChange(f.type === "number" ? Number(e.target.value) : e.target.value)} />}
      {f.hint && <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>}
    </div>
  );
}
