import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Download, Upload, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings, useMutateSql } from "@/lib/data";
import { exportDb, importDb, resetDb } from "@/lib/db";

export const Route = createFileRoute("/admin/parametres")({ component: Page });

const GROUPS: { tab: string; fields: { k: string; l: string; area?: boolean }[] }[] = [
  { tab: "Entreprise", fields: [
    { k: "company_name", l: "Nom commercial" }, { k: "phone1", l: "Téléphone 1" }, { k: "phone2", l: "Téléphone 2" },
    { k: "whatsapp", l: "Numéro WhatsApp (format 261…)" }, { k: "email", l: "E-mail" }, { k: "address", l: "Adresse" },
    { k: "hours_fr", l: "Horaires (FR)" }, { k: "hours_mg", l: "Horaires (MG)" }, { k: "facebook", l: "Lien Facebook" },
    { k: "stat_projects", l: "Nombre de projets réalisés (accueil)" } ] },
  { tab: "Textes", fields: [ { k: "about_fr", l: "Notre histoire (FR)", area: true }, { k: "about_mg", l: "Notre histoire (MG)", area: true } ] },
  { tab: "Légal", fields: [ { k: "stat", l: "STAT" }, { k: "nif", l: "NIF" }, { k: "rcs", l: "RCS" }, { k: "director", l: "Directeur de la publication" } ] },
];

function Page() {
  const s = useSettings();
  const mutate = useMutateSql();
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});
  const [pwd, setPwd] = useState({ a: "", b: "" });
  useEffect(() => { if (Object.keys(s).length && !Object.keys(form).length) setForm(s); }, [s, form]);

  async function save() {
    for (const g of GROUPS) for (const f of g.fields)
      await mutate("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", [f.k, form[f.k] ?? ""]);
    toast.success("Modifications enregistrées");
  }
  async function changePwd() {
    if (pwd.a.length < 8) return toast.error("8 caractères minimum");
    if (pwd.a !== pwd.b) return toast.error("Les mots de passe ne correspondent pas");
    await mutate("UPDATE settings SET value=? WHERE key='admin_password'", [pwd.a]);
    setPwd({ a: "", b: "" });
    toast.success("Mot de passe modifié");
  }
  async function backup() {
    const bytes = await exportDb();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([bytes.slice().buffer], { type: "application/x-sqlite3" }));
    a.download = `astech-sauvegarde-${new Date().toISOString().slice(0, 10)}.sqlite`;
    a.click();
  }
  async function restore(file?: File) {
    if (!file || !confirm("Remplacer toutes les données actuelles par cette sauvegarde ?")) return;
    try { await importDb(new Uint8Array(await file.arrayBuffer())); await qc.invalidateQueries(); setForm({}); toast.success("Sauvegarde restaurée"); }
    catch { toast.error("Fichier invalide"); }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-extrabold text-secondary">Paramètres</h1>
      <Tabs defaultValue="Entreprise">
        <TabsList>{GROUPS.map((g) => <TabsTrigger key={g.tab} value={g.tab}>{g.tab}</TabsTrigger>)}<TabsTrigger value="sec">Sécurité</TabsTrigger><TabsTrigger value="db">Sauvegarde</TabsTrigger></TabsList>
        {GROUPS.map((g) => (
          <TabsContent key={g.tab} value={g.tab} className="rounded-xl bg-card p-6 shadow-card">
            <div className="grid gap-4 sm:grid-cols-2">
              {g.fields.map((f) => (
                <div key={f.k} className={f.area ? "sm:col-span-2" : ""}>
                  <Label>{f.l}</Label>
                  {f.area ? <Textarea rows={6} value={form[f.k] ?? ""} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
                    : <Input value={form[f.k] ?? ""} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />}
                </div>
              ))}
            </div>
            <Button variant="cta" className="mt-6" onClick={save}>Enregistrer les modifications</Button>
          </TabsContent>
        ))}
        <TabsContent value="sec" className="space-y-4 rounded-xl bg-card p-6 shadow-card">
          <h2 className="font-bold">Changer le mot de passe du back-office</h2>
          <div><Label>Nouveau mot de passe</Label><Input type="password" value={pwd.a} onChange={(e) => setPwd({ ...pwd, a: e.target.value })} /></div>
          <div><Label>Confirmer</Label><Input type="password" value={pwd.b} onChange={(e) => setPwd({ ...pwd, b: e.target.value })} /></div>
          <Button variant="cta" onClick={changePwd}>Modifier</Button>
        </TabsContent>
        <TabsContent value="db" className="space-y-4 rounded-xl bg-card p-6 shadow-card">
          <p className="text-sm text-muted-foreground">Toutes les données sont stockées dans une base SQLite sur ce PC. Téléchargez régulièrement une sauvegarde (.sqlite) sur une clé USB.</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="cta" onClick={backup}><Download /> Télécharger la sauvegarde</Button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"><Upload className="h-4 w-4" /> Restaurer<input type="file" accept=".sqlite,.db" className="hidden" onChange={(e) => restore(e.target.files?.[0])} /></label>
            <Button variant="destructive" onClick={async () => { if (confirm("Effacer toutes les données et revenir au contenu d'exemple ?")) { await resetDb(); await qc.invalidateQueries(); setForm({}); toast.success("Base réinitialisée"); } }}><RotateCcw /> Réinitialiser</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
