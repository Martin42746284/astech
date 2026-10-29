import { useRef, useState } from "react";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
type Scalar = string | number | null;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminRows, useCrudMutate, fileToImage, slugify, type QuoteStatus } from "@/lib/data";
import {
  capturePoster,
  compressVideo,
  formatBytes,
  formatDuration,
  probeVideo,
  VIDEO_MAX_DURATION,
} from "@/lib/media";
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
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "image" | "video" | "checkbox";
  options?: { v: string; l: string }[];
  full?: boolean;
  hidden?: boolean;
  required?: boolean | ((row: Partial<Record<string, Scalar>>) => boolean);
  hint?: string;
};

type AnyRow = Record<string, Scalar> & { id: number };

export function CrudPage({
  title,
  table,
  fields,
  columns,
  slugFrom,
  onAddMultiplePhotos,
  hideAddButton,
}: {
  title: string; table: string; orderBy: string; fields: Field[];
  columns: { label: string; render: (r: AnyRow) => React.ReactNode }[];
  slugFrom?: string;
  onAddMultiplePhotos?: (files: File[]) => Promise<number>;
  hideAddButton?: boolean;
}) {
  const rows = useAdminRows<AnyRow>(table).data ?? [];
  const { save: saveRow, del: delRow } = useCrudMutate(table);
  const [edit, setEdit] = useState<Partial<AnyRow> | null>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const photosInput = useRef<HTMLInputElement>(null);

  async function addMultiplePhotos(files: FileList | null) {
    if (!files?.length || !onAddMultiplePhotos) return;
    const selected = Array.from(files);
    setUploadingPhotos(true);
    try {
      const count = await onAddMultiplePhotos(selected);
      toast.success(`${count} photo${count > 1 ? "s" : ""} ajoutée${count > 1 ? "s" : ""}`);
    } catch (e) {
      toast.error("Erreur d'import : " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setUploadingPhotos(false);
      if (photosInput.current) photosInput.current.value = "";
    }
  }

  async function save() {
    if (!edit) return;
    for (const f of fields) {
      const req = typeof f.required === "function" ? f.required(edit) : f.required;
      if (req && !edit[f.name]) return toast.error(`« ${f.label} » est obligatoire`);
    }
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
  async function confirmDelete(id: number) {
    try {
      await delRow(id);
      toast.success("Suppression effectuée", {
        description: "L’élément a été supprimé avec succès.",
      });
    } catch (e) {
      toast.error("Suppression impossible", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  }

  function del(id: number) {
    toast.warning("Confirmer la suppression", {
      description: "Cette action est définitive.",
      action: {
        label: "Supprimer",
        onClick: () => void confirmDelete(id),
      },
      cancel: {
        label: "Annuler",
        onClick: () => undefined,
      },
      duration: 10_000,
    });
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-secondary">{title}</h1>
        <div className="flex flex-wrap gap-2">
          {onAddMultiplePhotos && (
            <>
              <input
                ref={photosInput}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => void addMultiplePhotos(e.target.files)}
              />
              <Button
                variant="outline"
                disabled={uploadingPhotos}
                onClick={() => photosInput.current?.click()}
              >
                {uploadingPhotos ? "Import en cours…" : "Importer plusieurs photos"}
              </Button>
            </>
          )}
          {!hideAddButton && (
            <Button variant="cta" onClick={() => setEdit({})}><Plus /> Ajouter</Button>
          )}
        </div>
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
              {fields
                .filter((f) => !f.hidden)
                .map((f) => (
                  <FieldInput
                    key={f.name}
                    f={f}
                    value={edit[f.name]}
                    row={edit}
                    onChange={(v) =>
                      setEdit((current) => (current ? { ...current, [f.name]: v } : current))
                    }
                    onPatch={(patch) =>
                      setEdit((current) => (current ? { ...current, ...patch } : current))
                    }
                  />
                ))}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEdit(null)}>Annuler</Button>
            <Button variant="cta" onClick={save}>Enregistrer</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={uploadingPhotos} onOpenChange={() => undefined}>
        <DialogContent
          showCloseButton={false}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          className="max-w-sm text-center"
        >
          <DialogHeader className="items-center gap-3">
            <Loader2 aria-hidden="true" className="h-9 w-9 animate-spin text-primary" />
            <DialogTitle>Importation en cours</DialogTitle>
            <DialogDescription>
              Veuillez patienter. Les autres actions sont temporairement désactivées.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FieldInput({
  f,
  value,
  row,
  onChange,
  onPatch,
}: {
  f: Field;
  value: Scalar | undefined;
  row?: Partial<Record<string, Scalar>>;
  onChange: (v: Scalar) => void;
  onPatch?: ((patch: Record<string, Scalar>) => void) | undefined;
}) {
  const full = f.full || f.type === "textarea" || f.type === "image" || f.type === "video";
  const required = typeof f.required === "function" ? f.required(row ?? {}) : f.required;
  const v = value == null ? "" : String(value);
  return (
    <div className={cn(full && "sm:col-span-2")}>
      {f.type !== "checkbox" && (
        <Label>
          {f.label}
          {required && " *"}
        </Label>
      )}
      {f.type === "textarea" ? (
        <Textarea rows={4} value={v} onChange={(e) => onChange(e.target.value)} />
      ) : f.type === "select" ? (
        <select
          value={v}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="">—</option>
          {f.options?.map((o) => (
            <option key={o.v} value={o.v}>
              {o.l}
            </option>
          ))}
        </select>
      ) : f.type === "checkbox" ? (
        <label className="flex items-center gap-2 pt-6 text-sm">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked ? 1 : 0)}
            className="accent-primary"
          />
          {f.label}
        </label>
      ) : f.type === "image" ? (
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {v && <img src={v} alt="" className="h-20 w-28 rounded object-cover" />}
          <Input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                onChange(await fileToImage(file));
                onPatch?.({ type: "photo", video: null });
              }
            }}
          />
        </div>
      ) : f.type === "video" ? (
        <VideoInput value={v} onChange={onChange} onPatch={onPatch} />
      ) : (
        <Input
          type={f.type === "number" ? "number" : "text"}
          value={v}
          onChange={(e) => onChange(f.type === "number" ? Number(e.target.value) : e.target.value)}
        />
      )}
      {f.hint && <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>}
    </div>
  );
}

/** Champ « vidéo » : compresse en MP4 (30 s max, ~2 Mo) et capture une vignette. */
function VideoInput({
  value,
  onChange,
  onPatch,
}: {
  value: string;
  onChange: (v: Scalar) => void;
  onPatch?: ((patch: Record<string, Scalar>) => void) | undefined;
}) {
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [label, setLabel] = useState("");
  const [info, setInfo] = useState<string | null>(null);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permet de re-sélectionner le même fichier
    if (!file) return;
    if (!file.type.startsWith("video/"))
      return toast.error("Le fichier sélectionné n'est pas une vidéo.");
    setBusy(true);
    setPct(0);
    setInfo(null);
    setLabel("Lecture de la vidéo…");
    try {
      const meta = await probeVideo(file);
      if (meta.duration > VIDEO_MAX_DURATION) {
        setLabel(`Durée ${formatDuration(meta.duration)} → tronquée à ${VIDEO_MAX_DURATION} s…`);
      }
      setLabel("Chargement du moteur de compression…");
      const r = await compressVideo(file, (ratio) => setPct(Math.round(ratio * 100)));
      setLabel("Capture de la vignette…");
      const poster = await capturePoster(file);
      onChange(r.dataUrl);
      onPatch?.({ image: poster, type: "video" });
      setInfo(
        `${formatBytes(r.originalBytes)} → ${formatBytes(r.bytes)} · MP4 · ${formatDuration(r.duration)}`,
      );
      toast.success("Vidéo compressée");
    } catch (err) {
      toast.error("Compression impossible : " + (err as Error).message);
    } finally {
      setBusy(false);
      setLabel("");
      setPct(0);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <video src={value} controls preload="metadata" className="max-h-40 w-full rounded border" />
      )}
      <Input type="file" accept="video/*" onChange={pick} disabled={busy} />
      {busy && (
        <div className="flex flex-col gap-1">
          <div className="h-2 w-full overflow-hidden rounded bg-muted">
            <div
              className="h-full rounded bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {label}
            {pct > 0 && pct < 100 ? ` — ${pct} %` : ""}
          </p>
        </div>
      )}
      {info && <p className="text-xs font-semibold text-success">✓ {info}</p>}
      <p className="text-xs text-muted-foreground">
        MP4 compressé automatiquement : {VIDEO_MAX_DURATION} s maximum, ~2 Mo après compression. La
        vignette est capturée automatiquement.
      </p>
    </div>
  );
}
