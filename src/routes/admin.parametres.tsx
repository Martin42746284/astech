import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminMutations, useSettings } from "@/lib/data";

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
  const mutations = useAdminMutations();
  const [form, setForm] = useState<Record<string, string>>({});
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  useEffect(() => { if (Object.keys(s).length && !Object.keys(form).length) setForm(s); }, [s, form]);

  async function save() {
    try {
      const entries = Object.fromEntries(GROUPS.flatMap((g) => g.fields.map((f) => [f.k, form[f.k] ?? ""])));
      await mutations.saveSettings(entries);
      toast.success("Modifications enregistrées");
    } catch (error) {
      toast.error(`Impossible d'enregistrer les paramètres : ${(error as Error).message}`);
    }
  }
  async function changePwd() {
    if (pwd.next.length < 8) return toast.error("Le nouveau mot de passe doit contenir au moins 8 caractères.");
    if (pwd.next !== pwd.confirm) return toast.error("Les nouveaux mots de passe ne correspondent pas.");
    try {
      const result = await mutations.changePassword(pwd.current, pwd.next);
      if (!result.ok) {
        toast.error(result.reason === "wrong_current" ? "Le mot de passe actuel est incorrect." : "Le nouveau mot de passe doit contenir au moins 8 caractères.");
        return;
      }
      setPwd({ current: "", next: "", confirm: "" });
      toast.success("Mot de passe modifié");
    } catch (error) {
      toast.error(`Impossible de modifier le mot de passe : ${(error as Error).message}`);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-extrabold text-secondary">Paramètres</h1>
      <Tabs defaultValue="Entreprise">
        <TabsList className="max-w-full justify-start overflow-x-auto">{GROUPS.map((g) => <TabsTrigger key={g.tab} value={g.tab}>{g.tab}</TabsTrigger>)}<TabsTrigger value="sec">Sécurité</TabsTrigger><TabsTrigger value="db">Sauvegardes</TabsTrigger></TabsList>
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
          <div><Label>Mot de passe actuel</Label><Input type="password" autoComplete="current-password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} /></div>
          <div><Label>Nouveau mot de passe</Label><Input type="password" autoComplete="new-password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} /></div>
          <div><Label>Confirmer le nouveau mot de passe</Label><Input type="password" autoComplete="new-password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} /></div>
          <Button variant="cta" onClick={changePwd}>Modifier</Button>
        </TabsContent>
        <TabsContent value="db" className="space-y-4 rounded-xl bg-card p-6 shadow-card">
          <h2 className="font-bold">Sauvegarder la base Neon</h2>
          <p className="text-sm text-muted-foreground">Les données du site sont stockées dans Neon, et non dans le navigateur. Les sauvegardes et restaurations complètes se gèrent depuis la console Neon selon le plan et la politique de rétention de votre projet.</p>
          <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
            <li>Ouvrir la console Neon et sélectionner le projet ASTECH et sa branche de production.</li>
            <li>Créer une branche de sauvegarde ou utiliser l’outil de restauration / export SQL proposé par Neon.</li>
            <li>Avant de restaurer, vérifier le projet et la branche ciblés : une restauration peut remplacer des données de production.</li>
          </ol>
          <a href="https://console.neon.tech/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-accent underline">
            Ouvrir la console Neon <ExternalLink className="h-4 w-4" />
          </a>
          <p className="text-xs text-muted-foreground">L’export CSV de la liste des demandes de devis est disponible dans la rubrique Demandes de devis ; il ne remplace pas une sauvegarde complète.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
