import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/shared";

export const Route = createFileRoute("/admin/temoignages")({ component: Page });

function Page() {
  return (
    <CrudPage
      title="Témoignages" table="testimonials" orderBy="id DESC"
      columns={[
        { label: "Nom", render: (r) => <b>{String(r.name)}</b> },
        { label: "Témoignage", render: (r) => <span className="line-clamp-1">{String(r.text_fr)}</span> },
        { label: "Note", render: (r) => "★".repeat(Number(r.rating)) },
        { label: "Visible", render: (r) => (r.active ? "Oui" : "Non") },
      ]}
      fields={[
        { name: "name", label: "Nom", required: true },
        { name: "role", label: "Qualité / ville" },
        { name: "text_fr", label: "Texte (FR)", type: "textarea", required: true },
        { name: "text_mg", label: "Texte (MG)", type: "textarea" },
        { name: "rating", label: "Note (1 à 5)", type: "number" },
        { name: "active", label: "Visible sur le site", type: "checkbox" },
      ]}
    />
  );
}
