import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/shared";

export const Route = createFileRoute("/admin/realisations")({ component: Page });

const CAT = [
  { v: "maison", l: "Maison individuelle" }, { v: "fondation", l: "Fondations" },
  { v: "rendu-3d", l: "Rendu 3D" }, { v: "chantier", l: "Chantier en cours" },
];

function Page() {
  return (
    <CrudPage
      title="Réalisations" table="projects" orderBy="created_at DESC" slugFrom="title_fr"
      columns={[
        { label: "Image", render: (r) => <img src={String(r.image)} alt="" className="h-12 w-16 rounded object-cover" /> },
        { label: "Titre", render: (r) => <b>{String(r.title_fr)}</b> },
        { label: "Catégorie", render: (r) => CAT.find((c) => c.v === r.category)?.l },
        { label: "Lieu", render: (r) => String(r.location ?? "") },
        { label: "À la une", render: (r) => (r.featured ? "Oui" : "—") },
      ]}
      fields={[
        { name: "title_fr", label: "Titre (FR)", required: true },
        { name: "title_mg", label: "Titre (MG)" },
        { name: "category", label: "Catégorie", type: "select", options: CAT, required: true },
        { name: "location", label: "Lieu" },
        { name: "year", label: "Année", type: "number" },
        { name: "featured", label: "Afficher sur l'accueil", type: "checkbox" },
        { name: "description_fr", label: "Description (FR)", type: "textarea" },
        { name: "description_mg", label: "Description (MG)", type: "textarea" },
        { name: "image", label: "Photo", type: "image", required: true, hint: "Redimensionnée et optimisée automatiquement." },
      ]}
    />
  );
}
