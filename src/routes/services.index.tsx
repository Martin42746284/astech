import { createFileRoute } from "@tanstack/react-router";
import chantier from "@/assets/chantier.jpg";
import rendu3d from "@/assets/rendu3d.jpg";
import { SiteLayout, PageBanner, CtaBanner } from "@/components/site/SiteLayout";
import { ServiceCard, SectionHead } from "@/components/site/Cards";
import { useI18n } from "@/lib/i18n";
import { useServices } from "@/lib/data";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Nos services – ASTECH Madagascar" },
      { name: "description", content: "Études et devis, plans 3D, permis de construire, suivi de chantier, fondations, matériaux et rénovation." },
      { property: "og:title", content: "Nos services – ASTECH" },
      { property: "og:description", content: "8 services pour tous vos projets de construction à Madagascar." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const q = useServices();
  return (
    <SiteLayout>
      <PageBanner title={t("ourServices")} crumb={t("services")} image={rendu3d} />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHead title={t("servicesSub")} sub={t("servicesIntro")} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{q.data?.map((s) => <ServiceCard key={s.id} s={s} />)}</div>
      </section>
      <CtaBanner image={chantier} />
    </SiteLayout>
  );
}
