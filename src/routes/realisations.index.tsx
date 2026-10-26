import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import chantier from "@/assets/chantier.jpg";
import { SiteLayout, PageBanner, CtaBanner } from "@/components/site/SiteLayout";
import { ProjectCard, SectionHead } from "@/components/site/Cards";
import { useI18n, type DictKey } from "@/lib/i18n";
import { useProjects, CATEGORIES } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/realisations/")({
  head: () => ({
    meta: [
      { title: "Nos réalisations – ASTECH Madagascar" },
      { name: "description", content: "Maisons individuelles, fondations, rendus 3D et chantiers en cours réalisés par ASTECH." },
      { property: "og:title", content: "Nos réalisations – ASTECH" },
      { property: "og:description", content: "Galerie de projets de construction à Madagascar." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const [cat, setCat] = useState<string>("all");
  const q = useProjects();
  const list = q.data?.filter((p) => cat === "all" || p.category === cat) ?? [];
  return (
    <SiteLayout>
      <PageBanner title={t("ourProjects")} crumb={t("projects")} image={hero} />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHead title={t("ourProjects")} sub={t("projectsSub")} />
        <div className="mb-8 flex flex-wrap gap-2">
          {["all", ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
              className={cn("rounded-md border px-4 py-2 text-sm font-semibold", cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary")}>
              {c === "all" ? t("all") : t(`cat_${c}` as DictKey)}
            </button>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProjectCard key={p.id} p={p} />)}</div>
      </section>
      <CtaBanner image={chantier} />
    </SiteLayout>
  );
}
