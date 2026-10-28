import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBanner, CtaBanner } from "@/components/site/SiteLayout";
import { SectionHead } from "@/components/site/Cards";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { useI18n } from "@/lib/i18n";
import { useGallery } from "@/lib/data";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie photos et vidéos – ASTECH Madagascar" },
      {
        name: "description",
        content: "Photos et vidéos des chantiers, réalisations et travaux d'ASTECH à Madagascar.",
      },
      { property: "og:title", content: "Galerie – ASTECH" },
      {
        property: "og:description",
        content: "Découvrez en images et en vidéos les chantiers et réalisations d'ASTECH.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const q = useGallery();
  return (
    <SiteLayout>
      <PageBanner title={t("ourGallery")} crumb={t("gallery")} />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHead title={t("ourGallery")} sub={t("gallerySub")} />
        <GalleryGrid items={q.data ?? []} columns={3} />
      </section>
      <CtaBanner />
    </SiteLayout>
  );
}
