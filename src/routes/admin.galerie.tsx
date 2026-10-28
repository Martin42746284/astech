import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/shared";

export const Route = createFileRoute("/admin/galerie")({ component: Page });

function Page() {
  return (
    <CrudPage
      title="Galerie"
      table="gallery"
      orderBy="ord, id"
      columns={[
        {
          label: "Média",
          render: (r) => (
            <img src={String(r.image)} alt="" className="h-12 w-16 rounded object-cover" />
          ),
        },
        { label: "Titre", render: (r) => <b>{String(r.title_fr)}</b> },
        {
          label: "Type",
          render: (r) => (String(r.type ?? "") === "video" ? "Vidéo" : "Photo"),
        },
        { label: "Catégorie", render: (r) => String(r.category ?? "") || "—" },
        { label: "Ordre", render: (r) => String(r.ord ?? 0) },
        { label: "Visible", render: (r) => (r.active ? "Oui" : "Non") },
      ]}
      fields={[
        { name: "title_fr", label: "Titre (FR)", required: true },
        { name: "title_mg", label: "Titre (MG)" },
        {
          name: "category",
          label: "Catégorie",
          hint: "Facultatif — sert à classer les médias (ex. Chantier, Livraison, Équipe).",
        },
        {
          name: "type",
          label: "Type",
          type: "select",
          options: [
            { v: "photo", l: "Photo" },
            { v: "video", l: "Vidéo" },
          ],
          hint: "Photo = image fixe ; Vidéo = clip compressé en MP4 (30 s max).",
        },
        {
          name: "image",
          label: "Photo",
          type: "image",
          required: true,
          hint: "Optimisée automatiquement. Pour une vidéo, c'est la vignette (capturée automatiquement, remplaçable).",
        },
        {
          name: "video",
          label: "Vidéo",
          type: "video",
          required: (row) => String(row.type ?? "") === "video",
        },
        { name: "ord", label: "Ordre d'affichage", type: "number" },
        { name: "active", label: "Visible sur le site", type: "checkbox" },
      ]}
    />
  );
}
