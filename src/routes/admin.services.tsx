import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/shared";
import { ICONS } from "@/components/site/ServiceIcon";

export const Route = createFileRoute("/admin/services")({ component: Page });

function Page() {
  return (
    <CrudPage
      title="Services" table="services" orderBy="ord" slugFrom="title_fr"
      columns={[
        { label: "Ordre", render: (r) => r.ord as number },
        { label: "Titre", render: (r) => <b>{String(r.title_fr)}</b> },
        { label: "Statut", render: (r) => (r.active ? "Actif" : "Masqué") },
      ]}
      fields={[
        { name: "title_fr", label: "Titre (FR)", required: true },
        { name: "title_mg", label: "Titre (MG)" },
        { name: "summary_fr", label: "Résumé (FR)" },
        { name: "summary_mg", label: "Résumé (MG)" },
        { name: "description_fr", label: "Description (FR)", type: "textarea" },
        { name: "description_mg", label: "Description (MG)", type: "textarea" },
        { name: "steps_fr", label: "Étapes (FR) – une par ligne", type: "textarea" },
        { name: "steps_mg", label: "Étapes (MG) – une par ligne", type: "textarea" },
        { name: "deliverables_fr", label: "Livrables (FR) – un par ligne", type: "textarea" },
        { name: "deliverables_mg", label: "Livrables (MG) – un par ligne", type: "textarea" },
        { name: "icon", label: "Icône", type: "select", options: Object.keys(ICONS).map((k) => ({ v: k, l: k })) },
        { name: "ord", label: "Ordre d'affichage", type: "number" },
        { name: "active", label: "Visible sur le site", type: "checkbox" },
      ]}
    />
  );
}
