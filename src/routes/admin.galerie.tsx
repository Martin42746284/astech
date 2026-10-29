import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/shared";
import { fileToImage, useCrudMutate } from "@/lib/data";

export const Route = createFileRoute("/admin/galerie")({ component: Page });

function Page() {
  const { save } = useCrudMutate("gallery");

  async function addMultiplePhotos(files: File[]) {
    let added = 0;
    for (const file of files) {
      try {
        const image = await fileToImage(file);
        await save({ image, type: "photo" });
        added += 1;
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        throw new Error(
          added
            ? `${added} photo(s) ajoutée(s) avant l'échec sur « ${file.name} » : ${detail}`
            : `Échec sur « ${file.name} » : ${detail}`,
        );
      }
    }
    return added;
  }

  return (
    <CrudPage
      title="Galerie"
      table="gallery"
      orderBy="ord, id"
      onAddMultiplePhotos={addMultiplePhotos}
      hideAddButton
      columns={[
        {
          label: "Média",
          render: (r) => (
            <img src={String(r.image)} alt="" className="h-12 w-16 rounded object-cover" />
          ),
        },
        {
          label: "Type",
          render: (r) => (String(r.type ?? "") === "video" ? "Vidéo" : "Photo"),
        },
      ]}
      fields={[
        {
          name: "type",
          label: "Type",
          hidden: true,
        },
        {
          name: "image",
          label: "Photo",
          type: "image",
          required: true,
          hint: "Choisissez une photo.",
        },
      ]}
    />
  );
}
